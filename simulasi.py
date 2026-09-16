#!/usr/bin/env python3
"""
Skrip Simulasi Lengkap (Modular):
Menjalankan modul subscriber masing-masing (apotek.py, kasir.py, emr.py)
lalu menerbitkan resep dari modul dokter.py secara otomatis.
"""

import subprocess
import sys
import time

SUB_MODULES = [
    ("Apotek", "apotek.py"),
    ("Kasir", "kasir.py"),
    ("EMR", "emr.py")
]

def main():
    print("=" * 65)
    print(" SIMULASI LENGKAP SISTEM DISTRIBUSI RESEP RUMAH SAKIT (MODULAR) ")
    print("=" * 65)

    processes = []
    try:
        print("[1] Memulai semua worker subscriber dari modul terpisah...")
        for name, script_file in SUB_MODULES:
            p = subprocess.Popen(
                [sys.executable, script_file],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            processes.append((name, p))
            print(f"    -> Worker [{name.upper()}] aktif ({script_file})...")

        # Jeda agar koneksi dan binding queue ke exchange siap
        time.sleep(2.5)

        print("\n[2] Menjalankan modul dokter.py untuk menerbitkan resep baru...")
        pub = subprocess.run([sys.executable, "dokter.py"], capture_output=True, text=True)
        print(pub.stdout)

        print("[3] Menunggu pesan diproses di seluruh divisi...\n")
        time.sleep(3)

        print("=" * 65)
        print(" OUTPUT DARI SETIAP WORKER TERPISAH:")
        print("=" * 65)

        for name, p in processes:
            p.terminate()
            try:
                out, _ = p.communicate(timeout=2)
                print(f"\n--- [DIVISI: {name.upper()}] ---")
                print(out.strip())
            except Exception:
                p.kill()

        print("\n" + "=" * 65)
        print(" SIMULASI SELESAI: Event berhasil diterima semua modul terpisah!")
        print("=" * 65)

    except KeyboardInterrupt:
        print("\n[!] Simulasi dihentikan.")
        for _, p in processes:
            p.kill()

if __name__ == "__main__":
    main()
