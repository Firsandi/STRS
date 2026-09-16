#!/usr/bin/env python3
"""
Modul Subscriber: Kasir / Billing (Pure Pub/Sub)
Tugas: Menerima event resep secara real-time via antrean sementara (exclusive/temporary).
"""

import json
from config import get_connection, EXCHANGE_NAME, Fore, Style

def run_kasir():
    try:
        connection, channel = get_connection()
    except Exception as e:
        print(f"{Fore.RED}[!] Gagal terhubung ke RabbitMQ: {e}{Style.RESET_ALL}")
        return

    # PURE PUB/SUB: Buat antrean sementara (exclusive & auto-delete)
    # Begitu kasir dimatikan, antrean ini langsung lenyap tanpa menampung pesan basi.
    result = channel.queue_declare(queue="", exclusive=True)
    queue_name = result.method.queue

    # BIND antrean sementara ke Exchange Fanout
    channel.queue_bind(exchange=EXCHANGE_NAME, queue=queue_name)

    print("\n" + "="*60)
    print(f" [*] Layanan [{Fore.YELLOW}{Style.BRIGHT}KASIR BILLING{Style.RESET_ALL}] Terhubung ke RabbitMQ (Pure Pub/Sub)")
    print(f" [*] Antrean Sementara: {Fore.YELLOW}{queue_name}{Style.RESET_ALL}")
    print(f" [*] Terikat ke Exchange: '{Fore.CYAN}{EXCHANGE_NAME}{Style.RESET_ALL}'")
    print(f" [*] Siaga menerima resep real-time... (Tekan CTRL+C untuk berhenti)")
    print("="*60 + "\n")

    def callback(ch, method, properties, body):
        data = json.loads(body.decode())
        rx_id = data.get("prescription_id")
        pasien = data.get("patient_name")
        total_tagihan = data.get("total_meds", 0) + data.get("doctor_fee", 0)

        print(f"\n{Fore.LIGHTBLUE_EX}[!] Resep Diterima: {Fore.YELLOW}{rx_id}{Fore.LIGHTBLUE_EX} | Waktu: {data.get('timestamp')}{Style.RESET_ALL}")
        print(f"    {Fore.YELLOW}[KASIR BILLING] Menyusun draf pembayaran pasien {pasien}:{Style.RESET_ALL}")
        print(f"      - Rincian Obat : Rp {data.get('total_meds', 0):,}")
        print(f"      - Jasa Dokter  : Rp {data.get('doctor_fee', 0):,}")
        print(f"      ---------------------------------------------- +")
        print(f"      {Fore.YELLOW}{Style.BRIGHT}Total Tagihan  : Rp {total_tagihan:,}{Style.RESET_ALL}")
        print(f"    {Fore.YELLOW}[STATUS] Invoice siap ditagihkan di loket pembayaran.{Style.RESET_ALL}")

    channel.basic_consume(
        queue=queue_name,
        on_message_callback=callback,
        auto_ack=True
    )

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print(f"\n[-] Layanan [KASIR] dimatikan.")
        connection.close()

if __name__ == "__main__":
    run_kasir()
