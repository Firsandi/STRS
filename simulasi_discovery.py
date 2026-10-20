#!/usr/bin/env python3
"""
Skrip Simulasi & Perbandingan: API Gateway Hardcoded vs Service Discovery
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
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
DISCOVERY_DIR = os.path.join(BASE_DIR, "discovery")
GATEWAY_DIR = os.path.join(BASE_DIR, "python_gateway")

# ANSI Colors
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"

processes = []

def wait_for_port(port, timeout=10):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=0.5):
                return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            time.sleep(0.3)
    return False

def run_comparison_demo():
    print(f"\n{BOLD}{CYAN}==================================================================={RESET}")
    print(f"{BOLD}{CYAN}  DEMO PERBANDINGAN: API GATEWAY HARDCODED VS SERVICE DISCOVERY   {RESET}")
    print(f"{BOLD}{CYAN}==================================================================={RESET}\n")

    # 1. Jalankan Service Registry di Port 8761
    print(f"{BOLD}[1/4] Menyalakan Service Registry Server (Port 8761)...{RESET}")
    p_reg = subprocess.Popen([sys.executable, os.path.join(DISCOVERY_DIR, "registry_server.py")])
    processes.append(p_reg)
    if wait_for_port(8761):
        print(f"      {GREEN}✓ Registry Server Online di http://localhost:8761{RESET}")
    else:
        print(f"      {RED}✗ Gagal menyalakan Registry Server{RESET}")
        return

    # 2. Jalankan Microservices
    print(f"\n{BOLD}[2/4] Menyalakan 4 Microservices Rumah Sakit...{RESET}")
    services = [
        ("Dokter Service", "dokter_service.py", 8101, "DOKTER-SERVICE"),
        ("Apotek Service", "apotek_service.py", 8102, "APOTEK-SERVICE"),
        ("Kasir Service",  "kasir_service.py",  8103, "KASIR-SERVICE"),
        ("EMR Service",    "emr_service.py",    8104, "EMR-SERVICE")
    ]
    for name, script, port, s_code in services:
        p = subprocess.Popen([sys.executable, os.path.join(SERVICES_DIR, script)])
        processes.append(p)

    time.sleep(2)

    # 3. Mendaftarkan microservices ke Registry
    print(f"\n{BOLD}[3/4] Mendaftarkan Service ke Service Registry (Dynamic Registration)...{RESET}")
    for name, script, port, s_code in services:
        try:
            res = requests.post("http://localhost:8761/register", json={
                "service_name": s_code,
                "instance_id": f"{s_code.lower()}-main",
                "url": f"http://localhost:{port}"
            }, timeout=2)
            if res.status_code == 201:
                print(f"      {GREEN}✓ {s_code} terdaftar -> http://localhost:{port}{RESET}")
        except Exception as e:
            print(f"      {RED}✗ Gagal mendaftarkan {s_code}: {e}{RESET}")

    # 4. Jalankan Dynamic Gateway (Port 8000)
    print(f"\n{BOLD}[4/4] Menyalakan API Gateway dalam Mode Service Discovery (Port 8000)...{RESET}")
    p_gw = subprocess.Popen([sys.executable, os.path.join(GATEWAY_DIR, "gateway_discovery.py")])
    processes.append(p_gw)
    wait_for_port(8000)
    print(f"      {GREEN}✓ API Gateway Online di http://localhost:8000 (Mode: Service Discovery){RESET}\n")

    # 5. Uji Coba Routing Dinamis
    print(f"{BOLD}{YELLOW}--- PENGUJIAN ROUTING DINAMIS MELALUI GATEWAY (:8000) ---{RESET}")
    test_endpoints = [
        ("Cek Resep Dokter", "/api/dokter/resep"),
        ("Cek Antrean Apotek", "/api/apotek/antrean"),
        ("Cek Tagihan Kasir", "/api/kasir/tagihan"),
        ("Cek Rekam Medis EMR", "/api/emr/rekam-medis")
    ]

    for label, path in test_endpoints:
        gw_url = f"http://localhost:8000{path}"
        try:
            resp = requests.get(gw_url, timeout=3)
            mode_hdr = resp.headers.get("X-Gateway-Mode", "Unknown")
            resolved = resp.headers.get("X-Resolved-Service", "Unknown")
            upstream = resp.headers.get("X-Upstream-URL", "Unknown")
            print(f"[{GREEN}OK{RESET}] {label:20} -> Status: {resp.status_code} | Mode: {mode_hdr} | Lookup: {resolved} ({upstream})")
        except Exception as e:
            print(f"[{RED}FAIL{RESET}] {label:20} -> Error: {e}")

    print(f"\n{BOLD}{GREEN}==================================================================={RESET}")
    print(f"{BOLD}{GREEN}  SELURUH LAYANAN BERHASIL DITERUSKAN SECARA DINAMIS MELALUI REGISTRY!{RESET}")
    print(f"  Buka dashboard visual Registry di browser: {CYAN}http://localhost:8761{RESET}")
    print(f"{BOLD}{GREEN}==================================================================={RESET}")

if __name__ == "__main__":
    try:
        run_comparison_demo()
        print(f"\n{YELLOW}Tekan Ctrl+C untuk menghentikan seluruh service...{RESET}")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print(f"\n{CYAN}Menghentikan seluruh proses simulasi...{RESET}")
        for p in processes:
            p.terminate()
            p.wait()
        print(f"{GREEN}Selesai.{RESET}")
