#!/usr/bin/env python3
"""
Modul Publisher: Dokter (Poli Klinik)
Tugas: Menerbitkan event 'PrescriptionIssued' ke exchange Fanout RabbitMQ.
"""

import json
import random
import pika
from datetime import datetime
from config import get_connection, EXCHANGE_NAME, Fore, Style

def run_dokter():
    print("\n" + "="*60)
    print(f"{Fore.CYAN}{Style.BRIGHT} [DOKTER] Sistem Informasi Poli Spesialis Jantung{Style.RESET_ALL}")
    print("="*60)
    
    try:
        connection, channel = get_connection()
    except Exception as e:
        print(f"{Fore.RED}[!] Gagal terhubung ke RabbitMQ: {e}{Style.RESET_ALL}")
        return

    rx_id = f"RX-2026-{random.randint(1000, 9999)}"
    patient_id = f"RM-{random.randint(10000, 99999)}"
    
    # Payload JSON mandiri (Event-Driven Data)
    resep_payload = {
        "event": "PrescriptionIssued",
        "prescription_id": rx_id,
        "patient_id": patient_id,
        "patient_name": "Tn. Bambang Pamungkas",
        "doctor": "dr. Budi Santoso, Sp.JP",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "medicines": [
            {"name": "Amlodipine 10mg", "qty": 30, "price": 45000},
            {"name": "Bisoprolol 5mg", "qty": 30, "price": 90000},
            {"name": "Aspilets 80mg", "qty": 30, "price": 35000}
        ],
        "total_meds": 170000,
        "doctor_fee": 150000
    }
    
    body_json = json.dumps(resep_payload, indent=2)
    
    # Kirim ke exchange fanout (Pure Pub/Sub siaran real-time)
    channel.basic_publish(
        exchange=EXCHANGE_NAME,
        routing_key="",
        body=body_json,
        properties=pika.BasicProperties(
            content_type="application/json"
        )
    )
    
    print(f"{Fore.GREEN}[+] Event 'PrescriptionIssued' berhasil dipublikasikan!{Style.RESET_ALL}")
    print(f"    No Resep : {Fore.YELLOW}{rx_id}{Style.RESET_ALL}")
    print(f"    Pasien   : {patient_id} - Tn. Bambang Pamungkas")
    print(f"    Dokter   : dr. Budi Santoso, Sp.JP")
    print(f"    Obat     : 3 Macam Obat (Total Rp {resep_payload['total_meds']:,})")
    print(f"{Fore.LIGHTBLACK_EX}[-] Non-blocking call: Komputer dokter langsung siap melayani pasien berikutnya.{Style.RESET_ALL}")
    print("="*60 + "\n")
    
    connection.close()

if __name__ == "__main__":
    run_dokter()
