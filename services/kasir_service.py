#!/usr/bin/env python3
"""
Kasir / Billing Service - Port 8103
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
Peran:
- REST API Server (port 8103) untuk perhitungan billing & transaksi pembayaran
- RabbitMQ Subscriber: Menangkap event 'PrescriptionIssued' untuk menyusun draft invoice tagihan secara real-time
"""

import json
import threading
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import get_connection, EXCHANGE_NAME, Fore, Style

app = Flask(__name__)
CORS(app)

# In-memory storage Tagihan Kasir
TAGIHAN_DATABASE = {}

def proses_tagihan_masuk(data):
    """Menyusun draft invoice berdasarkan rincian biaya resep dan jasa dokter."""
    rx_id = data.get("prescription_id")
    pasien = data.get("patient_name")
    rm_id = data.get("patient_id")
    total_meds = data.get("total_meds", 0)
    doctor_fee = data.get("doctor_fee", 0)
    total_bayar = total_meds + doctor_fee

    print(f"\n{Fore.YELLOW}[KASIR BILLING] Menerima Resep: {rx_id} | Pasien: {pasien} ({rm_id}){Style.RESET_ALL}")
    print(f"  -> Rincian Obat : Rp {total_meds:,}")
    print(f"  -> Jasa Dokter  : Rp {doctor_fee:,}")
    print(f"  -> {Fore.YELLOW}{Style.BRIGHT}Total Tagihan  : Rp {total_bayar:,}{Style.RESET_ALL}")

    TAGIHAN_DATABASE[rx_id] = {
        "invoice_id": f"INV-{rx_id}",
        "prescription_id": rx_id,
        "patient_id": rm_id,
        "patient_name": pasien,
        "total_meds": total_meds,
        "doctor_fee": doctor_fee,
        "grand_total": total_bayar,
        "status": "Belum Dibayar (Unpaid)",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def rabbitmq_listener():
    """Worker background untuk mendengarkan pesan dari RabbitMQ Fanout Exchange."""
    try:
        connection, channel = get_connection()
        result = channel.queue_declare(queue="", exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange=EXCHANGE_NAME, queue=queue_name)
        print(f"{Fore.YELLOW}[KasirService] Worker RabbitMQ aktif pada antrean {queue_name}{Style.RESET_ALL}")

        def callback(ch, method, properties, body):
            try:
                data = json.loads(body.decode())
                proses_tagihan_masuk(data)
            except Exception as e:
                print(f"{Fore.RED}[KasirService] Gagal parse pesan: {e}{Style.RESET_ALL}")

        channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
        channel.start_consuming()
    except Exception as e:
        print(f"{Fore.YELLOW}[KasirService] RabbitMQ listener terhenti / offline: {e}{Style.RESET_ALL}")

@app.route("/api/kasir/health", methods=["GET"])
def health():
    return jsonify({
        "service": "Kasir / Billing Service",
        "port": 8103,
        "status": "UP",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/kasir/tagihan", methods=["GET"])
def get_all_tagihan():
    return jsonify({
        "status": "success",
        "total_tagihan": len(TAGIHAN_DATABASE),
        "data": list(TAGIHAN_DATABASE.values())
    })

@app.route("/api/kasir/tagihan/<rx_id>", methods=["GET"])
def get_tagihan_detail(rx_id):
    tagihan = TAGIHAN_DATABASE.get(rx_id)
    if not tagihan:
        return jsonify({"status": "error", "message": f"Tagihan untuk resep {rx_id} tidak ditemukan"}), 404
    return jsonify({"status": "success", "data": tagihan})

@app.route("/api/kasir/bayar/<rx_id>", methods=["POST"])
def bayar_tagihan(rx_id):
    tagihan = TAGIHAN_DATABASE.get(rx_id)
    if not tagihan:
        return jsonify({"status": "error", "message": f"Tagihan {rx_id} tidak ditemukan"}), 404
    
    tagihan["status"] = "Lunas (Paid)"
    tagihan["paid_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"{Fore.GREEN}[KASIR BILLING] Tagihan {rx_id} LUNAS dibayarkan sebesar Rp {tagihan['grand_total']:,}!{Style.RESET_ALL}")
    
    return jsonify({
        "status": "success",
        "message": f"Pembayaran tagihan {rx_id} berhasil diselesaikan",
        "data": tagihan
    })

@app.route("/api/kasir/sync", methods=["POST"])
def manual_sync():
    data = request.get_json() or {}
    proses_tagihan_masuk(data)
    return jsonify({"status": "success", "message": "Resep diproses manual di kasir"}), 200

if __name__ == "__main__":
    t = threading.Thread(target=rabbitmq_listener, daemon=True)
    t.start()
    
    print(f"{Fore.YELLOW}=== Memulai Kasir Service pada port 8103 ==={Style.RESET_ALL}")
    app.run(host="0.0.0.0", port=8103, debug=False)
