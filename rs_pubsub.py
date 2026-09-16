#!/usr/bin/env python3
"""
Studi Kasus 3: Distribusi Resep Obat Rumah Sakit Berbasis Pub/Sub (RabbitMQ Fanout)
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ 2026

Entrypoint CLI utama yang menghubungkan modul-modul terpisah:
- dokter.py (Publisher)
- apotek.py (Subscriber Farmasi)
- kasir.py  (Subscriber Kasir)
- emr.py    (Subscriber Rekam Medis)
- bpjs.py   (Subscriber BPJS)
"""

import sys
from config import Fore, Style
from dokter import run_dokter
from apotek import run_apotek
from kasir import run_kasir
from emr import run_emr
from bpjs import run_bpjs

ROLES = {
    "dokter": run_dokter,
    "apotek": run_apotek,
    "kasir": run_kasir,
    "emr": run_emr,
    "bpjs": run_bpjs
}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("""
Penggunaan program (Modular CLI):
  python rs_pubsub.py dokter             -> Terbitkan 1 resep (Publisher)
  python rs_pubsub.py apotek             -> Jalankan Worker Farmasi (Subscriber 1)
  python rs_pubsub.py kasir              -> Jalankan Worker Kasir (Subscriber 2)
  python rs_pubsub.py emr                -> Jalankan Worker Rekam Medis (Subscriber 3)
  python rs_pubsub.py bpjs               -> Jalankan Worker BPJS (Subscriber 4)

Atau jalankan file modulnya secara langsung:
  python dokter.py
  python apotek.py
  python kasir.py
  python emr.py
  python bpjs.py
""")
        sys.exit(0)

    role_input = sys.argv[1].lower()
    handler = ROLES.get(role_input)
    if handler:
        handler()
    else:
        print(f"{Fore.RED}[!] Peran '{role_input}' tidak valid! Pilih: dokter | apotek | kasir | emr | bpjs{Style.RESET_ALL}")
