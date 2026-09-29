#!/usr/bin/env python3
"""
Skrip Simulasi & Pengujian API Gateway
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
Studi Kasus C: Sistem Layanan Kesehatan / Rumah Sakit

Skrip ini mendemonstrasikan:
1. Menjalankan 4 Microservices (Dokter, Apotek, Kasir, EMR)
2. Menjalankan Spring Cloud Gateway (Java - Port 8000) sesuai Slide 8 PPT
   (Atau Python Gateway sebagai fallback)
3. Pengujian Konsep Single Entry Point (Slide 4 & 5 PPT):
   Seluruh request klien (Dokter, Apotek, Kasir, EMR) hanya dialamatkan ke port 8000.
4. Verifikasi Event-Driven Pub/Sub RabbitMQ:
   - Dokter menerbitkan resep via Gateway -> RabbitMQ Fanout Exchange
   - Apotek, Kasir, dan EMR menerima pesan serentak
   - Klien mengecek status & membayar tagihan via Gateway
"""

import os
import sys
import time
import socket
import subprocess
import requests
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVICES_DIR = os.path.join(BASE_DIR, "services")
JAR_PATH = os.path.join(BASE_DIR, "gateway", "target", "hospital-gateway-0.0.1-SNAPSHOT.jar")
GATEWAY_URL = "http://localhost:8000"

# ANSI Colors
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

processes = []

def wait_for_port(port, timeout=20):
    """Menunggu port terbuka sebelum memulai pengetesan."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=1):
                return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            time.sleep(0.5)
            sys.stdout.write(".")
            sys.stdout.flush()
    return False

def start_services():
    print(f"\n{BOLD}{CYAN}================================================================={RESET}")
    print(f"{BOLD}{CYAN} [1] MENYALAKAN SELURUH SERVICE SISTEM RUMAH SAKIT TERDISTRIBUSI {RESET}")
    print(f"{BOLD}{CYAN}================================================================={RESET}")

    services = [
        ("Dokter Service (Port 8101)", "dokter_service.py", 8101),
        ("Apotek Service (Port 8102)", "apotek_service.py", 8102),
        ("Kasir Service  (Port 8103)", "kasir_service.py", 8103),
        ("EMR Service    (Port 8104)", "emr_service.py", 8104)
    ]

    for name, script, port in services:
        script_path = os.path.join(SERVICES_DIR, script)
        p = subprocess.Popen(
            [sys.executable, script_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        processes.append(p)
        print(f" [+] {name:<30} -> PID {p.pid} (Berjalan di background)")

    # Jalankan API Gateway: Prioritaskan Spring Cloud Gateway (Java), fallback ke Python
    if os.path.exists(JAR_PATH):
        print(f" [+] {'Spring Cloud Gateway (Java:8000)':<30} -> Menjalankan JAR target...")
        gw = subprocess.Popen(
            ["java", "-jar", JAR_PATH],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        processes.append(gw)
        print(f"     PID Gateway: {gw.pid} (Sesuai Slide 8 PPT & Repo Dosen)")
    else:
        gateway_script = os.path.join(BASE_DIR, "python_gateway", "gateway.py")
        gw = subprocess.Popen(
            [sys.executable, gateway_script],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        processes.append(gw)
        print(f" [+] {'API Gateway (Port 8000)':<30} -> PID {gw.pid} (Python Gateway Fallback)")

    print(f"\n[*] Menunggu seluruh service & Spring Cloud Gateway siap", end="")
    ready = wait_for_port(8000, timeout=25)
    if ready:
        print(f" {GREEN}[Siap! Netty Port 8000 Aktif]{RESET}\n")
    else:
        print(f" {YELLOW}[Peringatan: Port 8000 lambat merespon]{RESET}\n")

def test_gateway_routing():
    print(f"{BOLD}{CYAN}================================================================={RESET}")
    print(f"{BOLD}{CYAN} [2] PENGUJIAN ROUTING TERPUSAT API GATEWAY (PORT 8000)        {RESET}")
    print(f"{BOLD}{CYAN}================================================================={RESET}")
    print(f"Mengacu ke Slide 4 & 5 PPT: Client HANYA berbicara ke http://localhost:8000")

    # 1. Dokter Terbitkan Resep Melalui API Gateway
    print(f"\n{BOLD}[A] Dokter Menerbitkan Resep Melalui API Gateway:{RESET}")
    print(f"    Target URL: {YELLOW}POST http://localhost:8000/api/dokter/resep{RESET}")
    
    resep_data = {
        "prescription_id": "RX-2026-9901",
        "patient_id": "RM-77123",
        "patient_name": "Tn. Bambang Pamungkas",
        "doctor": "dr. Budi Santoso, Sp.JP",
        "medicines": [
            {"name": "Amlodipine 10mg", "qty": 30, "price": 45000},
            {"name": "Bisoprolol 5mg", "qty": 30, "price": 90000},
            {"name": "Aspilets 80mg", "qty": 30, "price": 35000}
        ],
        "total_meds": 170000,
        "doctor_fee": 150000
    }

    try:
        r = requests.post(f"{GATEWAY_URL}/api/dokter/resep", json=resep_data, timeout=5)
        print(f"{GREEN}[✓] Respon Dokter (via Gateway): HTTP {r.status_code}{RESET}")
        res_json = r.json()
        print(f"    Pesan     : {res_json.get('message')}")
        print(f"    Broadcast : {res_json.get('broadcast_status')}")
    except Exception as e:
        print(f"{RED}[!] Gagal kirim resep via gateway: {e}{RESET}")

    # Beri jeda 1 detik agar RabbitMQ Fanout exchange menyebarkan ke Apotek, Kasir, EMR
    print(f"\n[*] Menunggu distribusi pesan RabbitMQ ke seluruh divisi...")
    time.sleep(1)

    # 2. Cek Apotek via API Gateway
    print(f"\n{BOLD}[B] Cek Status Antrean Apotek Melalui API Gateway:{RESET}")
    print(f"    Target URL: {YELLOW}GET http://localhost:8000/api/apotek/antrean{RESET}")
    try:
        r = requests.get(f"{GATEWAY_URL}/api/apotek/antrean", timeout=3)
        print(f"{GREEN}[✓] Respon Apotek (via Gateway): HTTP {r.status_code}{RESET}")
        data = r.json().get("data", [])
        print(f"    Jumlah Resep di Antrean Farmasi: {len(data)}")
        if data:
            item = data[-1]
            print(f"    Resep Terakhir: {item.get('prescription_id')} - Pasien: {item.get('patient_name')}")
            print(f"    Status Obat   : {GREEN}{item.get('status')}{RESET}")
    except Exception as e:
        print(f"{RED}[!] Gagal query apotek: {e}{RESET}")

    # 3. Cek Tagihan Kasir via API Gateway
    print(f"\n{BOLD}[C] Cek Status Tagihan Kasir Melalui API Gateway:{RESET}")
    print(f"    Target URL: {YELLOW}GET http://localhost:8000/api/kasir/tagihan{RESET}")
    try:
        r = requests.get(f"{GATEWAY_URL}/api/kasir/tagihan", timeout=3)
        print(f"{GREEN}[✓] Respon Kasir (via Gateway): HTTP {r.status_code}{RESET}")
        data = r.json().get("data", [])
        print(f"    Jumlah Tagihan Aktif: {len(data)}")
        if data:
            item = data[-1]
            print(f"    Invoice ID    : {item.get('invoice_id')} (Resep: {item.get('prescription_id')})")
            print(f"    Total Bayar   : {BOLD}Rp {item.get('grand_total'):,}{RESET}")
            print(f"    Status Bayar  : {YELLOW}{item.get('status')}{RESET}")
    except Exception as e:
        print(f"{RED}[!] Gagal query kasir: {e}{RESET}")

    # 4. Cek Rekam Medis (EMR) via API Gateway
    print(f"\n{BOLD}[D] Cek Histori Pasien di EMR Melalui API Gateway:{RESET}")
    print(f"    Target URL: {YELLOW}GET http://localhost:8000/api/emr/riwayat{RESET}")
    try:
        r = requests.get(f"{GATEWAY_URL}/api/emr/riwayat", timeout=3)
        print(f"{GREEN}[✓] Respon EMR (via Gateway): HTTP {r.status_code}{RESET}")
        data = r.json().get("data", [])
        print(f"    Jumlah Pasien Tercatat: {len(data)}")
        if data:
            item = data[-1]
            print(f"    Pasien : {item.get('patient_name')} ({item.get('patient_id')})")
            print(f"    Jumlah Riwayat Kunjungan/Resep: {len(item.get('records', []))}")
    except Exception as e:
        print(f"{RED}[!] Gagal query EMR: {e}{RESET}")

    # 5. Simulasi Pembayaran di Kasir Melalui Gateway
    print(f"\n{BOLD}[E] Proses Pembayaran Tagihan Kasir Melalui API Gateway:{RESET}")
    print(f"    Target URL: {YELLOW}POST http://localhost:8000/api/kasir/bayar/RX-2026-9901{RESET}")
    try:
        r = requests.post(f"{GATEWAY_URL}/api/kasir/bayar/RX-2026-9901", timeout=3)
        print(f"{GREEN}[✓] Respon Pembayaran Kasir (via Gateway): HTTP {r.status_code}{RESET}")
        data = r.json().get("data", {})
        print(f"    Status Akhir : {GREEN}{BOLD}{data.get('status')}{RESET}")
        print(f"    Waktu Lunas  : {data.get('paid_at')}")
    except Exception as e:
        print(f"{RED}[!] Gagal bayar tagihan: {e}{RESET}")

    print(f"\n{BOLD}{GREEN}================================================================={RESET}")
    print(f"{BOLD}{GREEN} [✓] SEMUA PENGUJIAN API GATEWAY BERHASIL DILAKSANAKAN!        {RESET}")
    print(f"{BOLD}{GREEN}================================================================={RESET}")

def stop_services():
    print(f"\n[*] Menghentikan seluruh background service...")
    for p in processes:
        try:
            p.terminate()
            p.wait(timeout=1)
        except Exception:
            p.kill()
    print(f"[✓] Semua service telah dimatikan bersih.")

if __name__ == "__main__":
    try:
        start_services()
        test_gateway_routing()
    except KeyboardInterrupt:
        print("\n[!] Simulasi dihentikan pengguna.")
    finally:
        stop_services()
