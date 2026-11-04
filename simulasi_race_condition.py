#!/usr/bin/env python3
"""
Simulasi Pengujian Concurrency: Race Condition & Data Consistency
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ 2026
Mendukung:
- Mode Direct (default): request disebar ke port 8102, 8112, 8122
- Mode Gateway: request dikirim ke http://localhost:8000/api/apotek/db/*
- Argumen: --buyers, --stok, --delay, --gateway
- Barrier synchronization: memastikan semua thread mengeksekusi request secara serentak
"""

import argparse
import os
import sys
import time
import requests
import threading
import subprocess
import atexit
from concurrent.futures import ThreadPoolExecutor

# Inisialisasi styling terminal
try:
    from colorama import init, Fore, Style
    init(autoreset=True)
except ImportError:
    class DummyColor:
        def __getattr__(self, name):
            return ""
    Fore = DummyColor()
    Style = DummyColor()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
SERVICE_SCRIPT = os.path.join(BASE_DIR, "services", "apotek_service.py")
INSTANCES = [
    {"name": "apotek-8102", "port": 8102, "url": "http://127.0.0.1:8102"},
    {"name": "apotek-8112", "port": 8112, "url": "http://127.0.0.1:8112"},
    {"name": "apotek-8122", "port": 8122, "url": "http://127.0.0.1:8122"}
]
GATEWAY_URL = "http://127.0.0.1:8000"

spawned_processes = []

def cleanup_subprocesses():
    """Hentikan seluruh instance yang dinyalakan otomatis oleh script simulasi."""
    for p in spawned_processes:
        try:
            p.terminate()
            p.wait(timeout=2)
        except Exception:
            try:
                p.kill()
            except Exception:
                pass

atexit.register(cleanup_subprocesses)

def is_instance_online(url):
    """Cek apakah instance apotek aktif dan merespons health check."""
    try:
        r = requests.get(f"{url}/api/apotek/health", timeout=1.0)
        return r.status_code == 200
    except Exception:
        return False

def ensure_instances_running():
    """Memastikan 3 instance apotek aktif. Jika belum jalan, jalankan di background."""
    print(f"\n{Fore.CYAN}[*] Memeriksa status 3 Instance Apotek (:8102, :8112, :8122)...{Style.RESET_ALL}")
    
    for inst in INSTANCES:
        url = inst["url"]
        port = inst["port"]
        if is_instance_online(url):
            print(f"  -> {Fore.GREEN}[ONLINE]{Style.RESET_ALL} {inst['name']} siap di {url}")
        else:
            print(f"  -> {Fore.YELLOW}[STARTING]{Style.RESET_ALL} Menyalakan {inst['name']} di port {port}...")
            p = subprocess.Popen(
                [sys.executable, SERVICE_SCRIPT, str(port)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            spawned_processes.append(p)
            
            # Tunggu hingga siap
            ready = False
            for _ in range(15):
                time.sleep(0.4)
                if is_instance_online(url):
                    ready = True
                    break
            if ready:
                print(f"     {Fore.GREEN}[READY]{Style.RESET_ALL} {inst['name']} aktif di port {port}.")
            else:
                print(f"     {Fore.RED}[TIMEOUT]{Style.RESET_ALL} Gagal menyalakan {inst['name']} di port {port}.")

def reset_database(target_url, nama_obat, stok_awal, versi_awal=5):
    """Memanggil endpoint /api/apotek/db/reset untuk mengosongkan pesanan dan menyetel stok awal."""
    try:
        payload = {"obat": nama_obat, "stok": stok_awal, "versi": versi_awal}
        r = requests.post(f"{target_url}/api/apotek/db/reset", json=payload, timeout=5.0)
        return r.status_code == 200
    except Exception as e:
        print(f"{Fore.RED}[!] Gagal reset database via {target_url}: {e}{Style.RESET_ALL}")
        return False

def get_database_status(target_url, nama_obat):
    """Mengambil status stok dan jumlah pesanan yang tersimpan di basis data."""
    try:
        r = requests.get(f"{target_url}/api/apotek/db/stok?obat={nama_obat}", timeout=5.0)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"{Fore.RED}[!] Gagal mengambil status DB: {e}{Style.RESET_ALL}")
    return None

def run_concurrent_test(mode_name, buyers_count, initial_stock, delay_time, retry_count, use_gateway, nama_obat):
    """
    Menjalankan simulasi konkurensi dengan threading.Barrier
    sehingga seluruh pembeli menembak request tepat pada saat bersamaan.
    """
    primary_url = GATEWAY_URL if use_gateway else INSTANCES[0]["url"]
    
    # 1. Reset Database
    reset_database(primary_url, nama_obat, initial_stock, versi_awal=5)
    time.sleep(0.2)
    
    # Siapkan Barrier sinkronisasi
    barrier = threading.Barrier(buyers_count)
    results = []
    lock = threading.Lock()
    
    def buyer_worker(buyer_id):
        # Tentukan target URL
        if use_gateway:
            target_url = f"{GATEWAY_URL}/api/apotek/db/pesan"
            instance_label = "Gateway:8000"
        else:
            inst = INSTANCES[buyer_id % len(INSTANCES)]
            target_url = f"{inst['url']}/api/apotek/db/pesan"
            instance_label = inst['name']
            
        pembeli_name = f"Pembeli-{buyer_id + 1} ({instance_label})"
        payload = {
            "obat": nama_obat,
            "qty": 1,
            "pembeli": pembeli_name,
            "mode": mode_name,
            "delay": delay_time,
            "retry": retry_count
        }
        
        # TUNGGU di barrier agar semua thread melepaskan request serempak di milidetik yang sama
        try:
            barrier.wait(timeout=10.0)
        except Exception:
            pass
            
        start_t = time.time()
        try:
            res = requests.post(target_url, json=payload, timeout=15.0)
            dur = (time.time() - start_t) * 1000
            with lock:
                results.append({
                    "buyer_id": buyer_id + 1,
                    "pembeli": pembeli_name,
                    "status_code": res.status_code,
                    "data": res.json() if res.headers.get("content-type", "").startswith("application/json") else res.text,
                    "duration_ms": dur
                })
        except Exception as e:
            with lock:
                results.append({
                    "buyer_id": buyer_id + 1,
                    "pembeli": pembeli_name,
                    "status_code": 0,
                    "error": str(e),
                    "duration_ms": 0
                })

    # Eksekusi thread pembeli secara paralel
    threads = []
    for i in range(buyers_count):
        t = threading.Thread(target=buyer_worker, args=(i,))
        threads.append(t)
        t.start()
        
    for t in threads:
        t.join()
        
    # Ambil status akhir basis data
    time.sleep(0.3)
    db_state = get_database_status(primary_url, nama_obat)
    
    stok_akhir = db_state["obat"]["stok"] if db_state else -1
    versi_akhir = db_state["obat"]["versi"] if db_state else -1
    pesanan_tercatat = db_state["total_pesanan"] if db_state else 0
    
    sukses_count = sum(1 for r in results if r["status_code"] == 200)
    gagal_count = len(results) - sukses_count
    
    # Evaluasi status konsistensi
    if mode_name == "naif":
        if pesanan_tercatat > initial_stock:
            status_konsisten = f"{Fore.RED}TIDAK KONSISTEN (OVERSELL){Style.RESET_ALL}"
            is_consistent = False
        else:
            status_konsisten = f"{Fore.GREEN}KONSISTEN{Style.RESET_ALL}"
            is_consistent = True
    else:
        if pesanan_tercatat <= initial_stock and stok_akhir >= 0:
            status_konsisten = f"{Fore.GREEN}KONSISTEN{Style.RESET_ALL}"
            is_consistent = True
        else:
            status_konsisten = f"{Fore.RED}TIDAK KONSISTEN{Style.RESET_ALL}"
            is_consistent = False

    return {
        "mode": mode_name,
        "results": results,
        "sukses_count": sukses_count,
        "gagal_count": gagal_count,
        "pesanan_tercatat": pesanan_tercatat,
        "stok_akhir": stok_akhir,
        "versi_akhir": versi_akhir,
        "status_konsisten": status_konsisten,
        "is_consistent": is_consistent
    }

def main():
    parser = argparse.ArgumentParser(
        description="Simulasi Pengujian Race Condition & Konsistensi Data Multi-Instance Apotek"
    )
    parser.add_argument("--buyers", type=int, default=3, help="Jumlah pembeli paralel serentak (default: 3)")
    parser.add_argument("--stok", type=int, default=1, help="Kuantitas stok awal obat di basis data (default: 1)")
    parser.add_argument("--delay", type=float, default=0.3, help="Jeda waktu celah konkurensi dalam detik (default: 0.3)")
    parser.add_argument("--gateway", action="store_true", help="Gunakan routing API Gateway :8000 alih-alih direct port")
    parser.add_argument("--obat", type=str, default="Paracetamol 500mg", help="Nama obat yang diuji (default: Paracetamol 500mg)")
    parser.add_argument("--no-spawn", action="store_true", help="Jangan otomatis jalankan instance (gunakan jika dijalankan manual)")
    
    args = parser.parse_args()
    
    print("\n" + "="*80)
    print(f"{Fore.CYAN}{Style.BRIGHT}  BENCHMARK SIMULASI KONKURENSI: RACE CONDITION & DATA CONSISTENCY{Style.RESET_ALL}")
    print(f"  Mata Kuliah: Sistem Terdistribusi — Kelompok 2 Fasilkom UNEJ")
    print("="*80)
    print(f"[*] Parameter Pengujian:")
    print(f"    • Obat Diuji       : {Fore.YELLOW}{args.obat}{Style.RESET_ALL}")
    print(f"    • Stok Awal        : {Fore.YELLOW}{args.stok} unit{Style.RESET_ALL}")
    print(f"    • Pembeli Serentak : {Fore.YELLOW}{args.buyers} pembeli paralel{Style.RESET_ALL}")
    print(f"    • Celah Jeda (Delay): {Fore.YELLOW}{args.delay} detik{Style.RESET_ALL}")
    print(f"    • Target Routing   : {Fore.YELLOW}{'API Gateway (Port 8000)' if args.gateway else 'Direct Instances (:8102, :8112, :8122)'}{Style.RESET_ALL}")
    print(f"    • Basis Data       : {Fore.YELLOW}data/apotek.db (SQLite WAL Mode){Style.RESET_ALL}")
    print("="*80)
    
    if not args.no_spawn and not args.gateway:
        ensure_instances_running()
        
    modes = [
        ("naif", "Naif (Tanpa Lock)", 0),
        ("atomic", "Atomic Operation", 0),
        ("transaction", "Database Transaction (ACID)", 0),
        ("optimistic", "Optimistic Locking (retry=0)", 0)
    ]
    
    summary_table = []
    
    for mode_id, mode_label, retry_val in modes:
        print(f"\n{Fore.BLUE}{Style.BRIGHT}>>> Menguji Skenario: [{mode_label}]...{Style.RESET_ALL}")
        data_res = run_concurrent_test(
            mode_name=mode_id,
            buyers_count=args.buyers,
            initial_stock=args.stok,
            delay_time=args.delay,
            retry_count=retry_val,
            use_gateway=args.gateway,
            nama_obat=args.obat
        )
        
        # Detail per request
        for r in data_res["results"]:
            code = r["status_code"]
            color = Fore.GREEN if code == 200 else (Fore.RED if code in [400, 409, 500] else Fore.YELLOW)
            msg = r.get("data", {}).get("message", "") if isinstance(r.get("data"), dict) else str(r.get("error", ""))
            print(f"    {color}[HTTP {code}]{Style.RESET_ALL} {r['pembeli']} ➔ {msg} ({r['duration_ms']:.1f}ms)")
            
        print(f"    ➔ Hasil di Database: Stok Tersisa = {Fore.YELLOW}{data_res['stok_akhir']}{Style.RESET_ALL} | Pesanan Tercatat = {Fore.YELLOW}{data_res['pesanan_tercatat']}{Style.RESET_ALL}")
        print(f"    ➔ Status Evaluasi : {data_res['status_konsisten']}")
        
        summary_table.append({
            "label": mode_label,
            "sukses": f"{data_res['sukses_count']}x Berhasil (200)",
            "pesanan": f"{data_res['pesanan_tercatat']} Pesanan",
            "stok": f"{data_res['stok_akhir']}" + (f" (V={data_res['versi_akhir']})" if mode_id == "optimistic" else ""),
            "status": "TIDAK KONSISTEN (OVERSELL)" if not data_res["is_consistent"] else "KONSISTEN"
        })
        time.sleep(0.5)

    # Cetak Tabel Rekapitulasi Akhir
    print("\n" + "="*95)
    print(f"{Fore.GREEN}{Style.BRIGHT}TABEL REKAPITULASI HASIL SIMULASI (SESUAI PPT SLIDE 11){Style.RESET_ALL}")
    print("="*95)
    print(f"{'Strategi':<28} | {'Respon Pembeli':<22} | {'Pesanan Masuk':<15} | {'Stok Akhir':<10} | {'Status Konsistensi'}")
    print("-"*95)
    
    for row in summary_table:
        stat_color = Fore.RED if "OVERSELL" in row["status"] or "TIDAK" in row["status"] else Fore.GREEN
        print(f"{row['label']:<28} | {row['sukses']:<22} | {row['pesanan']:<15} | {row['stok']:<10} | {stat_color}{row['status']}{Style.RESET_ALL}")
        
    print("="*95)
    print(f"{Fore.CYAN}[i] Seluruh riwayat transaksi tersimpan di: data/apotek.db (Tabel: obat, pesanan){Style.RESET_ALL}")
    print(f"{Fore.CYAN}[i] Verifikasi mandiri: sqlite3 data/apotek.db 'SELECT * FROM pesanan;' {Style.RESET_ALL}\n")

if __name__ == "__main__":
    main()
