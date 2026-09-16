#!/usr/bin/env python3
"""
Modul Subscriber: EMR (Electronic Medical Record / Rekam Medis)
Tugas: Menerima event resep dan mengarsipkan riwayat pengobatan pasien ke database.
"""

import json
from config import get_connection, EXCHANGE_NAME, Fore, Style

ROLE = "emr"
QUEUE_NAME = f"queue_rs_{ROLE}"

def run_emr():
    try:
        connection, channel = get_connection()
    except Exception as e:
        print(f"{Fore.RED}[!] Gagal terhubung ke RabbitMQ: {e}{Style.RESET_ALL}")
        return

    # Deklarasi antrean khusus divisi EMR
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    
    # BIND antrean ke Exchange Fanout
    channel.queue_bind(exchange=EXCHANGE_NAME, queue=QUEUE_NAME)

    print("\n" + "="*60)
    print(f" [*] Layanan [{Fore.CYAN}{Style.BRIGHT}REKAM MEDIS / EMR{Style.RESET_ALL}] Terhubung ke RabbitMQ")
    print(f" [*] Antrean: {Fore.YELLOW}{QUEUE_NAME}{Style.RESET_ALL} terikat ke Exchange '{Fore.CYAN}{EXCHANGE_NAME}{Style.RESET_ALL}'")
    print(f" [*] Menunggu event resep masuk... (Tekan CTRL+C untuk berhenti)")
    print("="*60 + "\n")

    def callback(ch, method, properties, body):
        data = json.loads(body.decode())
        rx_id = data.get("prescription_id")
        rm_id = data.get("patient_id")
        
        print(f"\n{Fore.LIGHTBLUE_EX}[!] Resep Diterima: {Fore.YELLOW}{rx_id}{Fore.LIGHTBLUE_EX} | Waktu: {data.get('timestamp')}{Style.RESET_ALL}")
        print(f"    {Fore.CYAN}[REKAM MEDIS/EMR] Mengarsipkan rekam medis elektronik {rm_id}:{Style.RESET_ALL}")
        print(f"      - Dokter         : {data.get('doctor')}")
        print(f"      - Obat Diberikan : {len(data.get('medicines', []))} item")
        print(f"    {Fore.CYAN}[STATUS] Riwayat tersimpan permanen di database EMR pasien.{Style.RESET_ALL}")

    channel.basic_consume(
        queue=QUEUE_NAME,
        on_message_callback=callback,
        auto_ack=True
    )

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print(f"\n[-] Layanan [EMR] dimatikan.")
        connection.close()

if __name__ == "__main__":
    run_emr()
