#!/usr/bin/env python3
"""
Skrip Simulasi Lengkap: Menjalankan semua subscriber (Apotek, Kasir, EMR, BPJS)
lalu menerbitkan resep dari Dokter (Publisher) secara otomatis.
"""

import subprocess
import sys
import time
import signal

ROLES = ["apotek", "kasir", "emr", "bpjs"]

def main():
    print("=" * 65)
    print(" SIMULASI LENGKAP SISTEM DISTRIBUSI RESEP RUMAH SAKIT (FANOUT) ")
    print("=" * 65)

    processes = []
    try:
        print("[1] Memulai semua worker subscriber...")
        for role in ROLES:
            p = subprocess.Popen(
                [sys.executable, "rs_pubsub.py", role],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            processes.append((role, p))
            print(f"    -> Layanan [{role.upper()}] berjalan...")

        # Beri jeda sejenak agar semua antrean terdaftar & bind ke exchange
        time.sleep(2.5)

        print("\n[2] Dokter menerbitkan resep obat baru...")
        pub = subprocess.run([sys.executable, "rs_pubsub.py", "dokter"], capture_output=True, text=True)
        print(pub.stdout)

        # Beri jeda agar subscriber selesai menerima dan memproses pesan
        print("[3] Menunggu pesan didistribusikan ke seluruh divisi...\n")
        time.sleep(3)

        print("=" * 65)
        print(" OUTPUT DARI SEMUA DIVISI (SUBSCRIBERS):")
        print("=" * 65)

        for role, p in processes:
            p.terminate()
            try:
                out, _ = p.communicate(timeout=2)
                print(f"\n--- [DIVISI: {role.upper()}] ---")
                print(out.strip())
            except Exception as e:
                p.kill()

        print("\n" + "=" * 65)
        print(" SIMULASI SELESAI: Pesan berhasil disiarkan (1:N) ke semua divisi!")
        print("=" * 65)

    except KeyboardInterrupt:
        print("\n[!] Simulasi dihentikan.")
        for _, p in processes:
            p.kill()

if __name__ == "__main__":
    main()
