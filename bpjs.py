#!/usr/bin/env python3
"""
Modul Subscriber: BPJS & Asuransi Kesehatan
Tugas: Menerima event resep, memvalidasi formularium nasional (Fornas), dan menyetujui klaim secara otomatis.
"""

import json
from config import get_connection, EXCHANGE_NAME, Fore, Style

ROLE = "bpjs"
QUEUE_NAME = f"queue_rs_{ROLE}"

def run_bpjs():
    try:
        connection, channel = get_connection()
    except Exception as e:
        print(f"{Fore.RED}[!] Gagal terhubung ke RabbitMQ: {e}{Style.RESET_ALL}")
        return

    # Deklarasi antrean khusus divisi BPJS
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    
    # BIND antrean ke Exchange Fanout
    channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME)

    print("\n" + "="*60)
    print(f" [*] Layanan [{Fore.MAGENTA}{Style.BRIGHT}BPJS & ASURANSI{Style.RESET_ALL}] Terhubung ke RabbitMQ")
    print(f" [*] Antrean: {Fore.YELLOW}{QUEUE_NAME}{Style.RESET_ALL} terikat ke Exchange '{Fore.CYAN}{EXCHANGE_NAME}{Style.RESET_ALL}'")
    print(f" [*] Menunggu event resep masuk... (Tekan CTRL+C untuk berhenti)")
    print("="*60 + "\n")

    def callback(ch, method, properties, body):
        data = json.loads(body.decode())
        rx_id = data.get("prescription_id")
        rm_id = data.get("patient_id")
        
        print(f"\n{Fore.LIGHTBLUE_EX}[!] Resep Diterima: {Fore.YELLOW}{rx_id}{Fore.LIGHTBLUE_EX} | Waktu: {data.get('timestamp')}{Style.RESET_ALL}")
        print(f"    {Fore.MAGENTA}[BPJS & ASURANSI - SUBSCRIBER BARU] Validasi penjaminan:{Style.RESET_ALL}")
        print(f"      - Verifikasi eligibility pasien {rm_id}...")
        print(f"      - Seluruh obat terdaftar dalam Formularium Nasional (Fornas).")
        print(f"    {Fore.MAGENTA}[STATUS] Klaim otomatis disetujui (Coverage 100%).{Style.RESET_ALL}")

    channel.basic_consume(
        queue=QUEUE_NAME,
        on_message_callback=callback,
        auto_ack=True
    )

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print(f"\n[-] Layanan [BPJS] dimatikan.")
        connection.close()

if __name__ == "__main__":
    run_bpjs()
