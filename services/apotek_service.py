#!/usr/bin/env python3
"""
Apotek / Farmasi Service - Port Multi-Instance (:8102, :8112, :8122)
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
Implementasi Server HTTP Multi-Threaded Native (Tanpa Ketergantungan Eksternal)

Fitur Utama:
1. REST API Server dengan endpoints database terpusat (/api/apotek/db/*)
2. Dukungan 4 Mode Konsistensi:
   - 'naif'       : Celah TOCTOU via read -> delay -> write di memori RAM
   - 'atomic'     : Single conditional update di level SQL (UPDATE ... WHERE stok >= qty)
   - 'transaction': Transaksi ACID dengan Exclusive Lock (BEGIN IMMEDIATE)
   - 'optimistic' : Version tracking tanpa locking (UPDATE ... WHERE versi = v)
3. Thread-safe SQLite WAL Mode terpusat di data/apotek.db
"""

import sys
import os
import json
import time
import sqlite3
import urllib.parse
from datetime import datetime
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

# Import DB helper
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from services.db import get_db, init_db

# Pastikan database terinisialisasi
init_db()

CURRENT_PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8102

class ApotekHTTPHandler(BaseHTTPRequestHandler):
    # Nonaktifkan log bising default untuk performa benchmark tinggi
    def log_message(self, format, *args):
        pass

    def _send_json(self, status_code, data):
        body = json.dumps(data, indent=2).encode('utf-8')
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # 1. Health Check
        if path == "/api/apotek/health":
            self._send_json(200, {
                "service": "Apotek / Farmasi Service",
                "port": CURRENT_PORT,
                "handled_by": f"apotek-{CURRENT_PORT}",
                "status": "UP",
                "database": "data/apotek.db (SQLite WAL Mode)",
                "timestamp": datetime.now().isoformat()
            })
            return

        # 2. Cek Stok & Statistik Database
        elif path == "/api/apotek/db/stok":
            nama_obat = query.get("obat", ["Paracetamol 500mg"])[0]
            conn = get_db()
            cursor = conn.cursor()
            
            cursor.execute("SELECT id, nama, stok, versi, updated_at FROM obat WHERE nama = ?", (nama_obat,))
            row = cursor.fetchone()
            
            if not row:
                self._send_json(404, {"status": "error", "message": f"Obat '{nama_obat}' tidak ditemukan"})
                return
                
            cursor.execute("""
                SELECT id, obat_id, nama_obat, qty, pembeli, mode, instance_port, status, created_at
                FROM pesanan
                WHERE nama_obat = ?
                ORDER BY id ASC
            """, (nama_obat,))
            pesanan_rows = cursor.fetchall()
            pesanan_list = [dict(p) for p in pesanan_rows]
            
            self._send_json(200, {
                "status": "success",
                "handled_by": f"apotek-{CURRENT_PORT}",
                "instance_port": CURRENT_PORT,
                "obat": {
                    "id": row["id"],
                    "nama": row["nama"],
                    "stok": row["stok"],
                    "versi": row["versi"],
                    "updated_at": str(row["updated_at"])
                },
                "total_pesanan": len(pesanan_list),
                "pesanan": pesanan_list
            })
            return

        else:
            self._send_json(404, {"status": "error", "message": f"Endpoint GET {path} tidak ditemukan"})

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # Baca Body JSON
        content_length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(content_length) if content_length > 0 else b"{}"
        try:
            data = json.loads(raw_body.decode('utf-8'))
        except Exception:
            data = {}

        # =====================================================================
        # 1. RESET DATABASE (/api/apotek/db/reset)
        # =====================================================================
        if path == "/api/apotek/db/reset":
            nama_obat = data.get("obat", "Paracetamol 500mg")
            stok_baru = int(data.get("stok", 1))
            versi_baru = int(data.get("versi", 5))
            
            conn = get_db()
            cursor = conn.cursor()
            
            # Hapus riwayat pesanan obat
            cursor.execute("DELETE FROM pesanan WHERE nama_obat = ?", (nama_obat,))
            
            # Reset atau tambahkan obat
            cursor.execute("SELECT id FROM obat WHERE nama = ?", (nama_obat,))
            exists = cursor.fetchone()
            if exists:
                cursor.execute("""
                    UPDATE obat
                    SET stok = ?, versi = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE nama = ?
                """, (stok_baru, versi_baru, nama_obat))
            else:
                cursor.execute("""
                    INSERT INTO obat (nama, stok, versi)
                    VALUES (?, ?, ?)
                """, (nama_obat, stok_baru, versi_baru))
                
            conn.commit()
            
            self._send_json(200, {
                "status": "success",
                "handled_by": f"apotek-{CURRENT_PORT}",
                "instance_port": CURRENT_PORT,
                "message": f"Database obat '{nama_obat}' berhasil direset",
                "obat": nama_obat,
                "stok": stok_baru,
                "versi": versi_baru
            })
            return

        # =====================================================================
        # 2. PEMESANAN OBAT DENGAN 4 STRATEGI (/api/apotek/db/pesan)
        # =====================================================================
        elif path == "/api/apotek/db/pesan":
            nama_obat = data.get("obat", "Paracetamol 500mg")
            qty = int(data.get("qty", 1))
            pembeli = data.get("pembeli", f"Kasir-{CURRENT_PORT}")
            mode = data.get("mode", "naif").lower()
            delay = float(data.get("delay", 0.3))
            retry = int(data.get("retry", 0))

            conn = get_db()
            cursor = conn.cursor()

            # -------------------------------------------------------------
            # STRATEGI 1: NAIF (BACA -> JEDA DI RAM -> TULIS MENIMPA STOK)
            # -------------------------------------------------------------
            if mode == "naif":
                cursor.execute("SELECT id, nama, stok FROM obat WHERE nama = ?", (nama_obat,))
                row = cursor.fetchone()
                
                if not row:
                    self._send_json(404, {"status": "error", "message": f"Obat '{nama_obat}' tidak ditemukan"})
                    return
                    
                stok_awal = row["stok"]
                obat_id = row["id"]
                
                if stok_awal < qty:
                    self._send_json(400, {
                        "status": "error",
                        "mode": "naif",
                        "handled_by": f"apotek-{CURRENT_PORT}",
                        "pembeli": pembeli,
                        "error": "STOK_TIDAK_CUKUP",
                        "message": f"Stok tidak mencukupi (tersedia: {stok_awal}, diminta: {qty})"
                    })
                    return
                    
                # Jeda eksekusi (celah konkurensi TOCTOU)
                if delay > 0:
                    time.sleep(delay)
                    
                # Tulis stok di database dari hasil kalkulasi RAM lokal
                stok_baru = max(0, stok_awal - qty)
                cursor.execute("UPDATE obat SET stok = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (stok_baru, obat_id))
                
                # Simpan pesanan
                cursor.execute("""
                    INSERT INTO pesanan (obat_id, nama_obat, qty, pembeli, mode, instance_port, status)
                    VALUES (?, ?, ?, ?, 'naif', ?, 'BERHASIL')
                """, (obat_id, nama_obat, qty, pembeli, CURRENT_PORT))
                conn.commit()
                
                self._send_json(200, {
                    "status": "success",
                    "mode": "naif",
                    "handled_by": f"apotek-{CURRENT_PORT}",
                    "pembeli": pembeli,
                    "obat": nama_obat,
                    "qty": qty,
                    "stok_setelah_hitung_ram": stok_baru,
                    "message": "Pesanan berhasil diproses (Mode Naif)"
                })
                return

            # -------------------------------------------------------------
            # STRATEGI 2: ATOMIC OPERATION (CONDITIONAL UPDATE SQL TUNGGAL)
            # -------------------------------------------------------------
            elif mode == "atomic":
                cursor.execute("""
                    UPDATE obat
                    SET stok = stok - ?, updated_at = CURRENT_TIMESTAMP
                    WHERE nama = ? AND stok >= ?
                """, (qty, nama_obat, qty))
                
                if cursor.rowcount == 1:
                    # Sukses: 1 baris terpengaruh
                    cursor.execute("SELECT id, stok FROM obat WHERE nama = ?", (nama_obat,))
                    row = cursor.fetchone()
                    obat_id = row["id"]
                    stok_terkini = row["stok"]
                    
                    cursor.execute("""
                        INSERT INTO pesanan (obat_id, nama_obat, qty, pembeli, mode, instance_port, status)
                        VALUES (?, ?, ?, ?, 'atomic', ?, 'BERHASIL')
                    """, (obat_id, nama_obat, qty, pembeli, CURRENT_PORT))
                    conn.commit()
                    
                    self._send_json(200, {
                        "status": "success",
                        "mode": "atomic",
                        "handled_by": f"apotek-{CURRENT_PORT}",
                        "pembeli": pembeli,
                        "obat": nama_obat,
                        "qty": qty,
                        "stok_tersisa": stok_terkini,
                        "message": "Pesanan berhasil diproses (Operasi Atomic SQL)"
                    })
                    return
                else:
                    # Gagal: 0 baris terpengaruh
                    conn.rollback()
                    self._send_json(400, {
                        "status": "error",
                        "mode": "atomic",
                        "handled_by": f"apotek-{CURRENT_PORT}",
                        "pembeli": pembeli,
                        "error": "STOK_TIDAK_CUKUP",
                        "message": "Gagal: Stok obat tidak mencukupi (0 baris terpengaruh di SQL)"
                    })
                    return

            # -------------------------------------------------------------
            # STRATEGI 3: DATABASE TRANSACTION (EXCLUSIVE LOCK & ACID)
            # -------------------------------------------------------------
            elif mode == "transaction":
                try:
                    conn.execute("BEGIN IMMEDIATE")
                    cursor.execute("SELECT id, nama, stok FROM obat WHERE nama = ?", (nama_obat,))
                    row = cursor.fetchone()
                    
                    if not row or row["stok"] < qty:
                        conn.rollback()
                        self._send_json(400, {
                            "status": "error",
                            "mode": "transaction",
                            "handled_by": f"apotek-{CURRENT_PORT}",
                            "pembeli": pembeli,
                            "error": "STOK_HABIS",
                            "message": "Pesanan ditolak: Stok obat habis dalam transaksi"
                        })
                        return
                        
                    obat_id = row["id"]
                    if delay > 0:
                        time.sleep(delay)
                        
                    cursor.execute("""
                        UPDATE obat
                        SET stok = stok - ?, updated_at = CURRENT_TIMESTAMP
                        WHERE id = ? AND stok >= ?
                    """, (qty, obat_id, qty))
                    
                    if cursor.rowcount == 0:
                        conn.rollback()
                        self._send_json(400, {
                            "status": "error",
                            "mode": "transaction",
                            "handled_by": f"apotek-{CURRENT_PORT}",
                            "pembeli": pembeli,
                            "error": "LOCK_UPDATE_FAILED",
                            "message": "Gagal memotong stok dalam transaksi"
                        })
                        return
                        
                    cursor.execute("""
                        INSERT INTO pesanan (obat_id, nama_obat, qty, pembeli, mode, instance_port, status)
                        VALUES (?, ?, ?, ?, 'transaction', ?, 'BERHASIL')
                    """, (obat_id, nama_obat, qty, pembeli, CURRENT_PORT))
                    
                    conn.commit()
                    self._send_json(200, {
                        "status": "success",
                        "mode": "transaction",
                        "handled_by": f"apotek-{CURRENT_PORT}",
                        "pembeli": pembeli,
                        "obat": nama_obat,
                        "qty": qty,
                        "message": "Pesanan berhasil diproses dalam Transaksi ACID"
                    })
                    return
                except Exception as e:
                    conn.rollback()
                    self._send_json(500, {
                        "status": "error",
                        "mode": "transaction",
                        "handled_by": f"apotek-{CURRENT_PORT}",
                        "pembeli": pembeli,
                        "error": "TRANSACTION_ROLLBACK",
                        "message": f"Transaksi dibatalkan (Rollback): {str(e)}"
                    })
                    return

            # -------------------------------------------------------------
            # STRATEGI 4: OPTIMISTIC LOCKING (VERSION NUMBER CHECKING)
            # -------------------------------------------------------------
            elif mode == "optimistic":
                max_attempts = max(1, retry + 1)
                for attempt in range(max_attempts):
                    cursor.execute("SELECT id, nama, stok, versi FROM obat WHERE nama = ?", (nama_obat,))
                    row = cursor.fetchone()
                    
                    if not row or row["stok"] < qty:
                        self._send_json(400, {
                            "status": "error",
                            "mode": "optimistic",
                            "handled_by": f"apotek-{CURRENT_PORT}",
                            "pembeli": pembeli,
                            "error": "STOK_TIDAK_CUKUP",
                            "message": "Stok obat tidak mencukupi"
                        })
                        return
                        
                    obat_id = row["id"]
                    current_versi = row["versi"]
                    
                    if delay > 0:
                        time.sleep(delay)
                        
                    cursor.execute("""
                        UPDATE obat
                        SET stok = stok - ?, versi = versi + 1, updated_at = CURRENT_TIMESTAMP
                        WHERE id = ? AND versi = ? AND stok >= ?
                    """, (qty, obat_id, current_versi, qty))
                    
                    if cursor.rowcount == 1:
                        # Versi cocok! Sukses
                        cursor.execute("""
                            INSERT INTO pesanan (obat_id, nama_obat, qty, pembeli, mode, instance_port, status)
                            VALUES (?, ?, ?, ?, 'optimistic', ?, 'BERHASIL')
                        """, (obat_id, nama_obat, qty, pembeli, CURRENT_PORT))
                        conn.commit()
                        
                        self._send_json(200, {
                            "status": "success",
                            "mode": "optimistic",
                            "handled_by": f"apotek-{CURRENT_PORT}",
                            "pembeli": pembeli,
                            "obat": nama_obat,
                            "qty": qty,
                            "versi_terpakai": current_versi,
                            "versi_baru": current_versi + 1,
                            "message": "Pesanan berhasil diproses (Optimistic Locking)"
                        })
                        return
                    else:
                        # Versi bentrok
                        conn.rollback()
                        if attempt < retry:
                            time.sleep(0.05 * (2 ** attempt))
                            continue
                        else:
                            self._send_json(409, {
                                "status": "error",
                                "mode": "optimistic",
                                "handled_by": f"apotek-{CURRENT_PORT}",
                                "pembeli": pembeli,
                                "error": "VERSION_CONFLICT",
                                "versi_dibaca": current_versi,
                                "message": f"Ditolak: Versi data ({current_versi}) kadaluarsa. Telah diubah oleh transaksi lain."
                            })
                            return

            else:
                self._send_json(400, {
                    "status": "error",
                    "message": f"Mode '{mode}' tidak dikenal. Pilihan: naif, atomic, transaction, optimistic"
                })
                return

        # =====================================================================
        # 3. PENERIMAAN RESEP / SYNC DOKTER (/api/apotek/sync atau /api/apotek/resep)
        # =====================================================================
        elif path in ("/api/apotek/sync", "/api/apotek/resep"):
            id_resep = data.get("id_resep", "RSP-001")
            pasien = data.get("pasien", "Pasien Anonim")
            dokter = data.get("dokter", "dr. Firsandi")
            obat_list = data.get("obat", "Paracetamol 500mg")
            
            print(f"[Apotek-{CURRENT_PORT}] 📩 RESEP DITERIMA: {id_resep} | Pasien: {pasien} | Dokter: {dokter}")
            self._send_json(200, {
                "status": "success",
                "handled_by": f"apotek-{CURRENT_PORT}",
                "instance_port": CURRENT_PORT,
                "message": f"Resep '{id_resep}' untuk pasien '{pasien}' berhasil diterima unit Apotek port {CURRENT_PORT}",
                "data_diterima": data
            })
            return

        else:
            self._send_json(404, {"status": "error", "message": f"Endpoint POST {path} tidak ditemukan"})

def auto_register_discovery():
    try:
        try:
            from services.client_helper import register_to_discovery
        except ImportError:
            from client_helper import register_to_discovery
        register_to_discovery(
            service_name="APOTEK-SERVICE",
            instance_id=f"apotek-{CURRENT_PORT}",
            service_url=f"http://localhost:{CURRENT_PORT}",
            heartbeat_interval=10
        )
    except Exception as e:
        pass

def run_server():
    server = ThreadingHTTPServer(("0.0.0.0", CURRENT_PORT), ApotekHTTPHandler)
    print(f"[Apotek-{CURRENT_PORT}] Server aktif di http://127.0.0.1:{CURRENT_PORT}")
    auto_register_discovery()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print(f"\n[Apotek-{CURRENT_PORT}] Mematikan server...")
        server.server_close()

if __name__ == "__main__":
    run_server()
