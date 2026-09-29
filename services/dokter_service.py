#!/usr/bin/env python3
"""
Dokter Service (Poli Klinik) - Port 8101
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
Peran:
- REST API Server (port 8101) untuk manajemen resep dokter
- RabbitMQ Publisher: Menerbitkan event 'PrescriptionIssued' ke Fanout Exchange saat resep diselesaikan
"""

import json
import random
import requests
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import pika
from config import get_connection, EXCHANGE_NAME, Fore, Style

app = Flask(__name__)
CORS(app)

# In-memory storage untuk riwayat resep yang diterbitkan dokter
RESEP_DATABASE = {}

def broadcast_resep(payload):
    """Menerbitkan event ke RabbitMQ Fanout Exchange, dengan fallback direct sync jika broker offline."""
    success = False
    status_msg = ""
    
    # 1. Coba kirim via RabbitMQ Pub/Sub
    try:
        connection, channel = get_connection()
        body_json = json.dumps(payload, indent=2)
        channel.basic_publish(
            exchange=EXCHANGE_NAME,
            routing_key="",
            body=body_json,
            properties=pika.BasicProperties(
                content_type="application/json",
                delivery_mode=2
            )
        )
        connection.close()
        print(f"{Fore.GREEN}[DokterService] Event 'PrescriptionIssued' berhasil dipublikasikan ke RabbitMQ ({EXCHANGE_NAME}){Style.RESET_ALL}")
        success = True
        status_msg = "Dipublikasikan via RabbitMQ Fanout Exchange"
    except Exception as e:
        print(f"{Fore.YELLOW}[DokterService][INFO] RabbitMQ tidak aktif ({e}). Menjalankan fallback direct-event.{Style.RESET_ALL}")
        status_msg = "Broker RabbitMQ offline; Disiarkan via fallback direct-sync"

    # 2. Selalu pastikan divisi Apotek, Kasir, dan EMR menerima event (baik lewat queue atau direct API fallback)
    for service_name, port in [("Apotek", 8102), ("Kasir", 8103), ("EMR", 8104)]:
        try:
            requests.post(f"http://localhost:{port}/api/{service_name.lower()}/sync", json=payload, timeout=0.5)
        except Exception:
            pass

    return success, status_msg

@app.route("/api/dokter/health", methods=["GET"])
def health():
    return jsonify({
        "service": "Dokter Service (Poli Klinik)",
        "port": 8101,
        "status": "UP",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/dokter/resep", methods=["GET"])
def get_all_resep():
    return jsonify({
        "status": "success",
        "total": len(RESEP_DATABASE),
        "data": list(RESEP_DATABASE.values())
    })

@app.route("/api/dokter/resep/<rx_id>", methods=["GET"])
def get_resep_detail(rx_id):
    resep = RESEP_DATABASE.get(rx_id)
    if not resep:
        return jsonify({"status": "error", "message": f"Resep {rx_id} tidak ditemukan"}), 404
    return jsonify({"status": "success", "data": resep})

@app.route("/api/dokter/resep", methods=["POST"])
def create_resep():
    data = request.get_json() or {}
    
    rx_id = data.get("prescription_id") or f"RX-2026-{random.randint(1000, 9999)}"
    patient_id = data.get("patient_id") or f"RM-{random.randint(10000, 99999)}"
    patient_name = data.get("patient_name") or "Tn. Bambang Pamungkas"
    doctor_name = data.get("doctor") or "dr. Budi Santoso, Sp.JP"
    
    medicines = data.get("medicines") or [
        {"name": "Amlodipine 10mg", "qty": 30, "price": 45000},
        {"name": "Bisoprolol 5mg", "qty": 30, "price": 90000},
        {"name": "Aspilets 80mg", "qty": 30, "price": 35000}
    ]
    
    total_meds = data.get("total_meds", sum(item.get("price", 0) for item in medicines))
    doctor_fee = data.get("doctor_fee", 150000)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    resep_payload = {
        "event": "PrescriptionIssued",
        "prescription_id": rx_id,
        "patient_id": patient_id,
        "patient_name": patient_name,
        "doctor": doctor_name,
        "timestamp": timestamp,
        "medicines": medicines,
        "total_meds": total_meds,
        "doctor_fee": doctor_fee
    }

    RESEP_DATABASE[rx_id] = resep_payload
    
    _, msg = broadcast_resep(resep_payload)

    print(f"\n{Fore.CYAN}{Style.BRIGHT}[+] Resep Baru Diterbitkan via DokterService (Port 8101):{Style.RESET_ALL}")
    print(f"    No Resep : {Fore.YELLOW}{rx_id}{Style.RESET_ALL}")
    print(f"    Pasien   : {patient_name} ({patient_id})")
    print(f"    Status   : {msg}")

    return jsonify({
        "status": "success",
        "message": "Resep berhasil dibuat dan disiarkan ke seluruh divisi rumah sakit",
        "broadcast_status": msg,
        "data": resep_payload
    }), 201

if __name__ == "__main__":
    print(f"{Fore.CYAN}=== Memulai Dokter Service pada port 8101 ==={Style.RESET_ALL}")
    app.run(host="0.0.0.0", port=8101, debug=False)
