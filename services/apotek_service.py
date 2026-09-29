#!/usr/bin/env python3
"""
Apotek / Farmasi Service - Port 8102
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
Peran:
- REST API Server (port 8102) untuk divisi Farmasi & Inventaris Obat
- RabbitMQ Subscriber: Menangkap event 'PrescriptionIssued' secara real-time via antrean sementara
"""

import json
import threading
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import get_connection, EXCHANGE_NAME, Fore, Style

app = Flask(__name__)
CORS(app)

# In-memory storage Apotek
ANTREAN_APOTEK = {}
STOK_OBAT = {
    "Amlodipine 10mg": 500,
    "Bisoprolol 5mg": 300,
    "Aspilets 80mg": 450,
    "Paracetamol 500mg": 1000,
    "Amoxicillin 500mg": 600
}

def proses_resep_masuk(data):
    """Logika pemrosesan resep di farmasi (potong stok dan buat antrean racikan)."""
    rx_id = data.get("prescription_id")
    pasien = data.get("patient_name")
    rm_id = data.get("patient_id")
    medicines = data.get("medicines", [])

    print(f"\n{Fore.GREEN}[APOTEK FARMASI] Menerima Resep Baru: {Fore.YELLOW}{rx_id}{Fore.GREEN} | Pasien: {pasien} ({rm_id}){Style.RESET_ALL}")
    
    # Potong stok obat
    rincian_racik = []
    for item in medicines:
        nama = item.get("name")
        qty = item.get("qty", 1)
        stok_awal = STOK_OBAT.get(nama, 100)
        stok_akhir = max(0, stok_awal - qty)
        STOK_OBAT[nama] = stok_akhir
        rincian_racik.append({
            "name": nama,
            "qty": qty,
            "stok_tersisa": stok_akhir
        })
        print(f"  -> [STOK] Ambil {nama} ({qty} butir) - Sisa stok: {stok_akhir}")

    ANTREAN_APOTEK[rx_id] = {
        "prescription_id": rx_id,
        "patient_id": rm_id,
        "patient_name": pasien,
        "status": "Siap Diambil Pasien",
        "medicines": rincian_racik,
        "processed_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    print(f"  -> {Fore.GREEN}[STATUS] Obat selesai disiapkan & etiket tercetak.{Style.RESET_ALL}")

def rabbitmq_listener():
    """Worker background untuk mendengarkan pesan dari RabbitMQ Fanout Exchange."""
    try:
        connection, channel = get_connection()
        result = channel.queue_declare(queue="", exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange=EXCHANGE_NAME, queue=queue_name)
        print(f"{Fore.GREEN}[ApotekService] Worker RabbitMQ aktif pada antrean {queue_name}{Style.RESET_ALL}")

        def callback(ch, method, properties, body):
            try:
                data = json.loads(body.decode())
                proses_resep_masuk(data)
            except Exception as e:
                print(f"{Fore.RED}[ApotekService] Gagal parse pesan: {e}{Style.RESET_ALL}")

        channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
        channel.start_consuming()
    except Exception as e:
        print(f"{Fore.YELLOW}[ApotekService] RabbitMQ listener terhenti / offline: {e}{Style.RESET_ALL}")

@app.route("/api/apotek/health", methods=["GET"])
def health():
    return jsonify({
        "service": "Apotek / Farmasi Service",
        "port": 8102,
        "status": "UP",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/apotek/antrean", methods=["GET"])
def get_antrean():
    return jsonify({
        "status": "success",
        "total_antrean": len(ANTREAN_APOTEK),
        "data": list(ANTREAN_APOTEK.values())
    })

@app.route("/api/apotek/stok", methods=["GET"])
def get_stok():
    return jsonify({
        "status": "success",
        "data": STOK_OBAT
    })

@app.route("/api/apotek/resep/<rx_id>", methods=["GET"])
def get_resep(rx_id):
    resep = ANTREAN_APOTEK.get(rx_id)
    if not resep:
        return jsonify({"status": "error", "message": f"Resep {rx_id} belum ada di farmasi"}), 404
    return jsonify({"status": "success", "data": resep})

@app.route("/api/apotek/sync", methods=["POST"])
def manual_sync():
    """Endpoint REST darurat jika RabbitMQ offline dan ingin menyinkronkan data resep secara langsung."""
    data = request.get_json() or {}
    proses_resep_masuk(data)
    return jsonify({"status": "success", "message": "Resep diproses manual di farmasi"}), 200

if __name__ == "__main__":
    # Jalankan RabbitMQ subscriber di background thread
    t = threading.Thread(target=rabbitmq_listener, daemon=True)
    t.start()
    
    print(f"{Fore.GREEN}=== Memulai Apotek Service pada port 8102 ==={Style.RESET_ALL}")
    app.run(host="0.0.0.0", port=8102, debug=False)
