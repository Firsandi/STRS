#!/usr/bin/env python3
"""
Studi Kasus 3: Distribusi Resep Obat Rumah Sakit Berbasis Pub/Sub (RabbitMQ Fanout)
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ 2026

Prasyarat library:
    pip install pika colorama
"""

import sys
import json
import time
import random
import pika
from datetime import datetime

# Inisialisasi colorama jika tersedia
try:
    from colorama import init, Fore, Style
    init(autoreset=True)
except ImportError:
    class DummyColor:
        def __getattr__(self, name):
            return ""
    Fore = DummyColor()
    Style = DummyColor()

# ==========================================
# KONFIGURASI BROKER (Sesuai Slide Praktikum)
# ==========================================
RABBIT_HOST = "rabbit.fasilkomapp.id"
RABBIT_PORT = 5672
RABBIT_USER = "admin"
RABBIT_PASS = "PasswordRabbitMQAman123"
EXCHANGE_NAME = "hospital_prescriptions"

def get_connection():
    """Membuka koneksi TCP dan channel ke server RabbitMQ."""
    credentials = pika.PlainCredentials(RABBIT_USER, RABBIT_PASS)
    parameters = pika.ConnectionParameters(
        host=RABBIT_HOST,
        port=RABBIT_PORT,
        credentials=credentials,
        connection_attempts=3,
        retry_delay=2
    )
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    
    # KUNCI: Exchange bertipe FANOUT untuk siaran 1:N ke semua divisi
    channel.exchange_declare(
        exchange=EXCHANGE_NAME,
        exchange_type="fanout",
        durable=True
    )
    return connection, channel

# ==========================================
# 1. PERAN PUBLISHER: DOKTER (POLI KLINIK)
# ==========================================
def run_publisher():
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
    
    # Kirim ke exchange fanout (routing_key dikosongkan)
    channel.basic_publish(
        exchange=EXCHANGE_NAME,
        routing_key="",
        body=body_json,
        properties=pika.BasicProperties(
            delivery_mode=pika.DeliveryMode.Persistent, # Pesan awet di storage
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

# ==========================================
# 2. PERAN SUBSCRIBER: DIVISI RUMAH SAKIT
# ==========================================
def run_subscriber(role):
    role = role.lower()
    valid_roles = ["apotek", "kasir", "emr", "bpjs"]
    
    if role not in valid_roles:
        print(f"{Fore.RED}[!] Peran '{role}' tidak valid! Pilih: apotek | kasir | emr | bpjs{Style.RESET_ALL}")
        return

    try:
        connection, channel = get_connection()
    except Exception as e:
        print(f"{Fore.RED}[!] Gagal terhubung ke RabbitMQ: {e}{Style.RESET_ALL}")
        return

    # Setiap role memiliki queue unik masing-masing
    queue_name = f"queue_rs_{role}"
    channel.queue_declare(queue=queue_name, durable=True)
    
    # BIND antrean divisi ke Exchange Fanout
    channel.queue_bind(exchange=EXCHANGE_NAME, queue=queue_name)
    
    role_colors = {
        "apotek": Fore.GREEN,
        "kasir": Fore.YELLOW,
        "emr": Fore.CYAN,
        "bpjs": Fore.MAGENTA
    }
    color = role_colors.get(role, Fore.WHITE)

    print("\n" + "="*60)
    print(f" [*] Layanan [{color}{Style.BRIGHT}{role.upper()}{Style.RESET_ALL}] Terhubung ke RabbitMQ")
    print(f" [*] Antrean: {Fore.YELLOW}{queue_name}{Style.RESET_ALL} terikat ke Exchange '{Fore.CYAN}{EXCHANGE_NAME}{Style.RESET_ALL}'")
    print(f" [*] Menunggu event resep masuk... (Tekan CTRL+C untuk berhenti)")
    print("="*60 + "\n")

    def callback(ch, method, properties, body):
        data = json.loads(body.decode())
        rx_id = data.get("prescription_id")
        pasien = data.get("patient_name")
        rm_id = data.get("patient_id")
        
        print(f"\n{Fore.LIGHTBLUE_EX}[!] Resep Diterima: {Fore.YELLOW}{rx_id}{Fore.LIGHTBLUE_EX} | Waktu: {data.get('timestamp')}{Style.RESET_ALL}")
        
        if role == "apotek":
            print(f"    {Fore.GREEN}[APOTEK FARMASI] Menyiapkan obat untuk {pasien} ({rm_id}):{Style.RESET_ALL}")
            for item in data.get("medicines", []):
                print(f"      -> Ambil {Fore.WHITE}{item['name']}{Fore.GREEN} ({item['qty']} butir) [Stok Dikurangi]")
            print(f"    {Fore.GREEN}[STATUS] Tiket racikan dicetak di printer farmasi.{Style.RESET_ALL}")
            
        elif role == "kasir":
            total_tagihan = data.get("total_meds", 0) + data.get("doctor_fee", 0)
            print(f"    {Fore.YELLOW}[KASIR BILLING] Menyusun draf pembayaran pasien {pasien}:{Style.RESET_ALL}")
            print(f"      - Rincian Obat : Rp {data.get('total_meds', 0):,}")
            print(f"      - Jasa Dokter  : Rp {data.get('doctor_fee', 0):,}")
            print(f"      ---------------------------------------------- +")
            print(f"      {Fore.YELLOW}{Style.BRIGHT}Total Tagihan  : Rp {total_tagihan:,}{Style.RESET_ALL}")
            print(f"    {Fore.YELLOW}[STATUS] Invoice siap ditagihkan di loket pembayaran.{Style.RESET_ALL}")
            
        elif role == "emr":
            print(f"    {Fore.CYAN}[REKAM MEDIS/EMR] Mengarsipkan rekam medis elektronik {rm_id}:{Style.RESET_ALL}")
            print(f"      - Dokter    : {data.get('doctor')}")
            print(f"      - Obat Diberikan : {len(data.get('medicines', []))} item")
            print(f"    {Fore.CYAN}[STATUS] Riwayat tersimpan permanen di database EMR pasien.{Style.RESET_ALL}")
            
        elif role == "bpjs":
            print(f"    {Fore.MAGENTA}[BPJS & ASURANSI - SUBSCRIBER BARU] Validasi penjaminan:{Style.RESET_ALL}")
            print(f"      - Verifikasi eligibility pasien {rm_id}...")
            print(f"      - Seluruh obat terdaftar dalam Formularium Nasional (Fornas).")
            print(f"    {Fore.MAGENTA}[STATUS] Klaim otomatis disetujui (Coverage 100%).{Style.RESET_ALL}")

    # auto_ack=True karena dalam skenario broadcast pub-sub fokus pada distribusi event
    channel.basic_consume(
        queue=queue_name,
        on_message_callback=callback,
        auto_ack=True
    )

    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        print(f"\n[-] Layanan [{role.upper()}] dimatikan.")
        connection.close()

# ==========================================
# MAIN ENTRY POINT
# ==========================================
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("""
Penggunaan program:
  python rs_pubsub.py dokter             -> Terbitkan 1 resep (Publisher)
  python rs_pubsub.py apotek             -> Jalankan Worker Farmasi (Subscriber 1)
  python rs_pubsub.py kasir              -> Jalankan Worker Kasir (Subscriber 2)
  python rs_pubsub.py emr                -> Jalankan Worker Rekam Medis (Subscriber 3)
  python rs_pubsub.py bpjs               -> Jalankan Worker BPJS (Demo Decoupling)
""")
        sys.exit(0)

    peran = sys.argv[1].lower()
    if peran == "dokter":
        run_publisher()
    else:
        run_subscriber(peran)
