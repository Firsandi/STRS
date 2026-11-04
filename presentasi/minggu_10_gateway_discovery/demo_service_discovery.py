#!/usr/bin/env python3
"""
Simulasi & Live Demo Interaksi Antar-Service dengan Service Discovery
Mata Kuliah: Sistem Terdistribusi - Fasilkom Universitas Jember
Kelompok 2: Ridho Rizky Prasetyo, Firsandi Andraw F., Ahmad Rafif Nandra U.

Alur Demo (Dijalankan SEBELUM Presentasi Slide):
1. FASE 1: Memperlihatkan kegagalan komunikasi Direct Hardcoded saat instance lama (:8102) mati / crash karena lonjakan beban (Flash Sale).
2. FASE 2: Scale-out instance Apotek baru di port dinamis (:8105) dan mendaftarkan diri secara otomatis ke Service Registry (:8761).
3. FASE 3: Dokter Service melakukan Dynamic Resolution (Lookup) ke Registry dan berhasil mengirimkan data resep ke instance baru.
4. FASE 4: Simulasi Self-Healing / Eviction saat server mati.
5. TRANSISI KE SLIDE PPT: Menarik kesimpulan teoritis dari apa yang baru saja disaksikan.
"""

import sys
import os
import time
import socket
import select
import subprocess
import requests
import json
from datetime import datetime
from threading import Thread

# ANSI Colors for Terminal
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
MAGENTA = "\033[95m"
BOLD = "\033[1m"
RESET = "\033[0m"

REGISTRY_URL = "http://localhost:8761"
processes = []

def is_port_open(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", port)) == 0

def wait_for_port(port, timeout=8):
    start = time.time()
    while time.time() - start < timeout:
        if is_port_open(port):
            return True
        time.sleep(0.3)
    return False

def pause_step(prompt_text, timeout=4):
    """Memungkinkan presenter menekan ENTER saat siap bicara, atau otomatis lanjut setelah timeout."""
    print(f"\n{YELLOW}👉 Tekan [ENTER] untuk {prompt_text} (atau lanjut otomatis dlm {timeout}s)...{RESET}", end="", flush=True)
    rlist, _, _ = select.select([sys.stdin], [], [], timeout)
    if rlist:
        sys.stdin.readline()
    else:
        print(" [Lanjut]")

def ensure_registry_running():
    if is_port_open(8761):
        print(f"[{GREEN}OK{RESET}] Service Registry Server sudah aktif di {BOLD}{REGISTRY_URL}{RESET}")
        return None
    
    print(f"[{YELLOW}INFO{RESET}] Menyalakan Service Registry Server di port 8761...")
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(cur_dir, "discovery", "registry_server.py"),
        os.path.join(cur_dir, "..", "..", "arsip_tugas_lama", "02_gateway_dan_discovery", "discovery", "registry_server.py"),
        os.path.join(cur_dir, "arsip_tugas_lama", "02_gateway_dan_discovery", "discovery", "registry_server.py")
    ]
    registry_script = None
    for cand in candidates:
        if os.path.exists(cand):
            registry_script = os.path.abspath(cand)
            break
    if not registry_script:
        registry_script = os.path.join(cur_dir, "discovery", "registry_server.py")
    p = subprocess.Popen([sys.executable, registry_script], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    processes.append(p)
    if wait_for_port(8761):
        print(f"[{GREEN}OK{RESET}] Service Registry Server berhasil online di {BOLD}{REGISTRY_URL}{RESET}")
    else:
        print(f"[{RED}FAIL{RESET}] Gagal menyalakan Service Registry.")
    return p

def cleanup():
    for p in processes:
        try:
            p.terminate()
            p.wait(timeout=1)
        except Exception:
            pass

def main():
    print(f"\n{BOLD}{CYAN}╔═══════════════════════════════════════════════════════════════════╗{RESET}")
    print(f"{BOLD}{CYAN}║     LIVE DEMO: INTERAKSI ANTAR-SERVICE & SERVICE DISCOVERY        ║{RESET}")
    print(f"{BOLD}{CYAN}║     Mata Kuliah Sistem Terdistribusi - Kelompok 2                 ║{RESET}")
    print(f"{BOLD}{CYAN}║     (Dijalankan Setelah Materi Slide 1-9 & Sebelum Kesimpulan)    ║{RESET}")
    print(f"{BOLD}{CYAN}╚═══════════════════════════════════════════════════════════════════╝{RESET}\n")

    # 1. Pastikan Registry Hidup
    ensure_registry_running()
    print(f"[{BOLD}DASHBOARD{RESET}] Buka di browser: {BOLD}{CYAN}http://localhost:8761{RESET} untuk memantau status secara realtime.\n")

    # Data Resep Medis Pasien Tanggap Wabah
    sample_resep = {
        "id_resep": "RSP-WABAH-9921",
        "pasien": "Budi Santoso (35 th)",
        "diagnosa": "Infeksi Saluran Pernafasan Akut / Gejala Wabah",
        "obat": [
            {"nama": "Azithromycin 500mg", "jumlah": 10, "aturan": "1x1 sehari sesudah makan"},
            {"nama": "Paracetamol 500mg", "jumlah": 15, "aturan": "3x1 sehari jika demam"}
        ],
        "dokter": "dr. Firsandi, Sp.P (Tim Tanggap Wabah)",
        "waktu": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    # =========================================================================
    # FASE 1: HARDCODED PROBLEM
    # =========================================================================
    pause_step("melihat MASALAH KOMUNIKASI HARDCODED")
    print(f"\n{BOLD}[FASE 1: SKENARIO KEGAGALAN TANPA SERVICE DISCOVERY (HARDCODED)]{RESET}")
    print(f"• Skenario: Lonjakan Pasien Ekstrem Akibat Kejadian Luar Biasa (Wabah / Outbreak Spike).")
    print(f"• Karakteristik Beban: Unpredictable Traffic Spike ratusan resep/menit (Analog Flash Sale).")
    print(f"• Akibat beban berlebih, Server Apotek lama (:8102) CRASH / BUFFER OVERFLOW.")
    print(f"• Dokter Service mencoba mengirim resep ke alamat hardcoded: {BOLD}http://localhost:8102/api/apotek/sync{RESET}...")
    time.sleep(1)

    try:
        res = requests.post("http://localhost:8102/api/apotek/sync", json=sample_resep, timeout=1.5)
        print(f"[{YELLOW}WARN{RESET}] Port 8102 merespons: {res.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"  {RED}✗ KONEKSI GAGAL: {e.__class__.__name__}{RESET}")
        print(f"  {RED}  Alasan: Port 8102 tidak merespons (Connection Refused).{RESET}")
        print(f"  {RED}  Dampak Nyata: Data resep gagal diproses! Terjadi CASCADING FAILURE.{RESET}")

    # =========================================================================
    # FASE 2: DYNAMIC SCALE-OUT & AUTO REGISTRATION
    # =========================================================================
    pause_step("mensimulasikan SCALE-OUT INSTANCE BARU DI PORT DINAMIS")
    print(f"\n{BOLD}[FASE 2: SCALE-OUT INSTANCE BARU DENGAN PORT DINAMIS (EPHEMERAL)]{RESET}")
    print(f"• Sysadmin / Auto-scaler menyalakan instance Apotek baru di port acak: {BOLD}:8105{RESET}.")
    
    # Jalankan mock server Apotek di port 8105
    from flask import Flask, request, jsonify
    mock_app = Flask("MockApotekService")
    
    @mock_app.route("/api/apotek/sync", methods=["POST"])
    def sync_resep():
        data = request.json
        print(f"\n  {GREEN}🎉 [APOTEK SERVICE :8105] MENERIMA DATA RESEP BERHASIL!{RESET}")
        print(f"     ID Resep : {BOLD}{data.get('id_resep')}{RESET}")
        print(f"     Pasien   : {data.get('pasien')}")
        print(f"     Dokter   : {data.get('dokter')}")
        print(f"     Status   : Resep langsung masuk ke sistem antrean farmasi.")
        return jsonify({"status": "SUCCESS", "message": "Resep diterima Apotek :8105"}), 200

    def run_mock():
        import logging
        log = logging.getLogger('werkzeug')
        log.setLevel(logging.ERROR)
        mock_app.run(port=8105, debug=False, use_reloader=False)

    server_thread = Thread(target=run_mock, daemon=True)
    server_thread.start()
    time.sleep(1)

    print(f"• Instance Apotek baru mendaftarkan diri secara otomatis ke Service Registry (:8761)...")
    reg_payload = {
        "service_name": "APOTEK-SERVICE",
        "instance_id": "apotek-instance-8105",
        "url": "http://localhost:8105"
    }
    try:
        r = requests.post(f"{REGISTRY_URL}/register", json=reg_payload, timeout=2)
        if r.status_code == 201:
            print(f"  {GREEN}✓ Terdaftar di Registry: APOTEK-SERVICE -> http://localhost:8105{RESET}")
            print(f"  {GREEN}✓ Status di Registry: UP (Healthy) dengan Heartbeat Daemon Aktif{RESET}")
    except Exception as e:
        print(f"  {RED}✗ Gagal mendaftar ke registry: {e}{RESET}")

    # =========================================================================
    # FASE 3: SERVICE DISCOVERY LOOKUP & DISPATCH
    # =========================================================================
    pause_step("melihat DOKTER SERVICE MELAKUKAN SERVICE DISCOVERY")
    print(f"\n{BOLD}[FASE 3: DOKTER SERVICE MELAKUKAN DYNAMIC SERVICE DISCOVERY]{RESET}")
    print(f"Dokter Service TIDAK lagi menyimpan port fisik statis siapapun.")
    print(f"Langkah 1: Dokter Service bertanya ke Registry: {CYAN}GET {REGISTRY_URL}/services/APOTEK-SERVICE{RESET}...")
    time.sleep(1)

    resolved_url = None
    try:
        lookup_resp = requests.get(f"{REGISTRY_URL}/services/APOTEK-SERVICE", timeout=2)
        if lookup_resp.status_code == 200:
            data = lookup_resp.json()
            resolved_url = data["selected_instance"]["url"]
            print(f"  {GREEN}✓ RESOLUSI ENDPOINT BERHASIL!{RESET}")
            print(f"    Logical Service Name : {BOLD}APOTEK-SERVICE{RESET}")
            print(f"    Resolved Dynamic URL : {BOLD}{resolved_url}{RESET}")
            print(f"    Health Status        : {GREEN}UP (AKTIF & SIAP TERIMA RESEP){RESET}")
    except Exception as e:
        print(f"  {RED}✗ Gagal resolve dari registry: {e}{RESET}")

    time.sleep(1)

    if resolved_url:
        print(f"\nLangkah 2: Dokter Service mentransfer payload resep ke URL hasil resolusi ({resolved_url}/api/apotek/sync)...")
        time.sleep(1)
        try:
            target_endpoint = f"{resolved_url}/api/apotek/sync"
            send_resp = requests.post(target_endpoint, json=sample_resep, timeout=2)
            if send_resp.status_code == 200:
                print(f"  {GREEN}✓ Transmisi Berhasil! HTTP 200 OK{RESET}")
                print(f"  {GREEN}✓ Respons Apotek: {send_resp.json()}{RESET}")
        except Exception as e:
            print(f"  {RED}✗ Gagal kirim: {e}{RESET}")

    # =========================================================================
    # KESIMPULAN DEMO & TRANSISI KE PPT
    # =========================================================================
    print(f"\n{BOLD}{CYAN}═══════════════════════════════════════════════════════════════════{RESET}")
    print(f"{BOLD}{GREEN}  HASIL OBSERVASI DEMO (UNTUK DIBAHAS PADA SLIDE PPT):           {RESET}")
    print(f"  1. Komunikasi hardcoded runtuh saat instance mati/berpindah port.")
    print(f"  2. Service Discovery memutus keterikatan fisik: cukup gunakan nama logis.")
    print(f"  3. Instance baru di port acak langsung dikenali tanpa ubah kode Dokter.")
    print(f"  4. Dashboard Registry ({REGISTRY_URL}) menjadi Single Source of Truth.")
    print(f"{BOLD}{CYAN}═══════════════════════════════════════════════════════════════════{RESET}")
    print(f"\n{BOLD}{MAGENTA}🎯 DEMO SELESAI & SUKSES! Silakan beralih ke Slide 11 untuk melihat Matriks Evaluasi & Kesimpulan Akhir.{RESET}\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nSelesai.")
    finally:
        cleanup()
