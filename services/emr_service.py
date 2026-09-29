#!/usr/bin/env python3
"""
EMR (Electronic Medical Record / Rekam Medis) Service - Port 8104
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
Peran:
- REST API Server (port 8104) untuk riwayat medis pasien
- RabbitMQ Subscriber: Menangkap event 'PrescriptionIssued' untuk mencatat histori medis pasien secara permanen
"""

import json
import threading
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import get_connection, EXCHANGE_NAME, Fore, Style

app = Flask(__name__)
CORS(app)

# In-memory storage Rekam Medis Pasien
EMR_DATABASE = {}

def proses_emr_masuk(data):
    """Mencatat riwayat resep dan pengobatan ke dalam data rekam medis pasien."""
    rx_id = data.get("prescription_id")
    patient_id = data.get("patient_id")
    patient_name = data.get("patient_name")
    doctor = data.get("doctor")
    medicines = data.get("medicines", [])
    timestamp = data.get("timestamp")

    print(f"\n{Fore.CYAN}[REKAM MEDIS/EMR] Mengarsipkan Resep {rx_id} untuk Pasien {patient_name} ({patient_id}){Style.RESET_ALL}")
    print(f"  -> Dokter Pemeriksa : {doctor}")
    print(f"  -> Jumlah Obat       : {len(medicines)} macam")

    record = {
        "record_id": f"REC-{rx_id}",
        "prescription_id": rx_id,
        "doctor": doctor,
        "medicines": medicines,
        "recorded_at": timestamp or datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    if patient_id not in EMR_DATABASE:
        EMR_DATABASE[patient_id] = {
            "patient_id": patient_id,
            "patient_name": patient_name,
            "records": []
        }
    
    EMR_DATABASE[patient_id]["records"].append(record)
    print(f"  -> {Fore.CYAN}[STATUS] Riwayat medis pasien berhasil diperbarui.{Style.RESET_ALL}")

def rabbitmq_listener():
    """Worker background untuk mendengarkan pesan dari RabbitMQ Fanout Exchange."""
    try:
        connection, channel = get_connection()
        result = channel.queue_declare(queue="", exclusive=True)
        queue_name = result.method.queue
        channel.queue_bind(exchange=EXCHANGE_NAME, queue=queue_name)
        print(f"{Fore.CYAN}[EMRService] Worker RabbitMQ aktif pada antrean {queue_name}{Style.RESET_ALL}")

        def callback(ch, method, properties, body):
            try:
                data = json.loads(body.decode())
                proses_emr_masuk(data)
            except Exception as e:
                print(f"{Fore.RED}[EMRService] Gagal parse pesan: {e}{Style.RESET_ALL}")

        channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
        channel.start_consuming()
    except Exception as e:
        print(f"{Fore.YELLOW}[EMRService] RabbitMQ listener terhenti / offline: {e}{Style.RESET_ALL}")

@app.route("/api/emr/health", methods=["GET"])
def health():
    return jsonify({
        "service": "Rekam Medis (EMR) Service",
        "port": 8104,
        "status": "UP",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/emr/riwayat", methods=["GET"])
def get_all_records():
    return jsonify({
        "status": "success",
        "total_patients": len(EMR_DATABASE),
        "data": list(EMR_DATABASE.values())
    })

@app.route("/api/emr/pasien/<patient_id>", methods=["GET"])
def get_patient_history(patient_id):
    patient_record = EMR_DATABASE.get(patient_id)
    if not patient_record:
        return jsonify({"status": "error", "message": f"Data rekam medis untuk pasien {patient_id} tidak ditemukan"}), 404
    return jsonify({"status": "success", "data": patient_record})

@app.route("/api/emr/sync", methods=["POST"])
def manual_sync():
    data = request.get_json() or {}
    proses_emr_masuk(data)
    return jsonify({"status": "success", "message": "Resep dicatat manual di EMR"}), 200

if __name__ == "__main__":
    t = threading.Thread(target=rabbitmq_listener, daemon=True)
    t.start()
    
    print(f"{Fore.CYAN}=== Memulai EMR Service pada port 8104 ==={Style.RESET_ALL}")
    app.run(host="0.0.0.0", port=8104, debug=False)
