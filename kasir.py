#!/usr/bin/env python3
"""
Modul Subscriber: Kasir / Billing
Tugas: Menerima event resep, menghitung biaya obat & jasa dokter, serta mencetak tagihan.
"""

import json
from config import get_connection, EXCHANGE_NAME, Fore, Style

ROLE = "kasir"
QUEUE_NAME = f"queue_rs_{ROLE}"

def run_kasir():
    try:
        connection, channel = get_connection()
    except Exception as e:
        print(f"{Fore.RED}[!] Gagal terhubung ke RabbitMQ: {e}{Style.RESET_ALL}")
        return

    # Deklarasi antrean khusus divisi Kasir
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    
    # BIND antrean ke Exchange Fanout
    channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME)

    print("\n" + "="*60)
    print(f" [*] Layanan [{Fore.YELLOW}{Style.BRIGHT}KASIR BILLING{Style.RESET_ALL}] Terhubung ke RabbitMQ")
    print(f" [*] Antrean: {Fore.YELLOW}{QUEUE_NAME}{Style.RESET_ALL} terikat ke Exchange '{Fore.CYAN}{EXCHANGE_NAME}{Style.RESET_ALL}'")
    print(f" [*] Menunggu event resep masuk... (Tekan CTRL+C untuk berhenti)")
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
        queue=QUEUE_NAME,
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
