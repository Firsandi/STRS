#!/usr/bin/env python3
"""
Service Registry Server (Port 8761)
Konsep: Mirip Netflix Eureka Server / Consul
Fungsi:
- Menerima pendaftaran (registration) dari microservices yang baru aktif.
- Menerima heartbeat berkala untuk memastikan service masih sehat (Health Check).
- Menyediakan endpoint discovery bagi API Gateway untuk mengetahui alamat service secara dinamis.
- Dashboard visual sederhana di browser (http://localhost:8761).
"""

import time
from datetime import datetime
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Registry Storage:
# {
#   "DOKTER-SERVICE": {
#       "instances": {
#           "dokter-1": {"url": "http://localhost:8101", "last_heartbeat": 1720000000, "status": "UP"}
#       },
#       "round_robin_idx": 0
#   }
# }
REGISTRY = {}
HEARTBEAT_TIMEOUT_SEC = 30  # Hapus / tandai DOWN jika lebih dari 30 detik tanpa heartbeat

def clean_expired_instances():
    """Menghapus atau menandai instance yang tidak mengirim heartbeat."""
    now = time.time()
    for service_name, data in list(REGISTRY.items()):
        for inst_id, inst in list(data["instances"].items()):
            if now - inst["last_heartbeat"] > HEARTBEAT_TIMEOUT_SEC:
                inst["status"] = "DOWN (TIMEOUT)"

@app.route("/", methods=["GET"])
def dashboard():
    """Halaman Dashboard Web Visual untuk melihat service yang terdaftar."""
    clean_expired_instances()
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Hospital Service Registry (Discovery Dashboard)</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #1e293b; padding: 30px; }
            .container { max-width: 900px; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            h1 { color: #0284c7; margin-top: 0; }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; }
            .badge-up { background: #dcfce7; color: #166534; }
            .badge-down { background: #fee2e2; color: #991b1b; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f1f5f9; color: #475569; }
            .refresh-btn { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
            .refresh-btn:hover { background: #0369a1; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏥 Hospital Service Registry Dashboard</h1>
            <p>Port: <strong>8761</strong> | Konsep: <strong>Netflix Eureka / Consul Registry</strong></p>
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Dashboard</button>
            <table>
                <thead>
                    <tr>
                        <th>Service Name</th>
                        <th>Instance ID</th>
                        <th>Alamat Fisik (URL)</th>
                        <th>Heartbeat Terakhir</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {% for s_name, data in services.items() %}
                        {% for inst_id, inst in data.instances.items() %}
                        <tr>
                            <td><strong>{{ s_name }}</strong></td>
                            <td>{{ inst_id }}</td>
                            <td><code>{{ inst.url }}</code></td>
                            <td>{{ inst.last_seen }}</td>
                            <td>
                                <span class="badge {{ 'badge-up' if 'UP' in inst.status else 'badge-down' }}">
                                    {{ inst.status }}
                                </span>
                            </td>
                        </tr>
                        {% endfor %}
                    {% else %}
                        <tr>
                            <td colspan="5" style="text-align: center; color: #94a3b8; padding: 30px;">
                                Belum ada service yang mendaftar ke Registry.
                            </td>
                        </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
    </body>
    </html>
    """
    # Siapkan data untuk render
    rendered_services = {}
    now = time.time()
    for s_name, data in REGISTRY.items():
        rendered_services[s_name] = {"instances": {}}
        for inst_id, inst in data["instances"].items():
            diff = int(now - inst["last_heartbeat"])
            rendered_services[s_name]["instances"][inst_id] = {
                "url": inst["url"],
                "last_seen": f"{diff} detik lalu",
                "status": inst["status"]
            }
            
    return render_template_string(html_template, services=rendered_services)

@app.route("/eureka/apps", methods=["GET"])
@app.route("/services", methods=["GET"])
def get_all_services():
    """Mengembalikan seluruh daftar service yang aktif."""
    clean_expired_instances()
    return jsonify({
        "status": "SUCCESS",
        "total_services": len(REGISTRY),
        "registry": REGISTRY
    })

@app.route("/services/<service_name>", methods=["GET"])
def lookup_service(service_name):
    """
    Discovery Endpoint: Gateway menanyakan alamat service.
    Mendukung Load Balancing Round-Robin jika ada lebih dari 1 instance.
    """
    clean_expired_instances()
    s_key = service_name.upper()
    if s_key not in REGISTRY or not REGISTRY[s_key]["instances"]:
        return jsonify({
            "error": "Service Not Found",
            "message": f"Layanan '{service_name}' belum terdaftar di Registry"
        }), 404

    instances = [inst for inst in REGISTRY[s_key]["instances"].values() if inst["status"] == "UP"]
    if not instances:
        return jsonify({
            "error": "Service Unavailable",
            "message": f"Layanan '{service_name}' terdaftar namun seluruh instance sedang DOWN"
        }), 503

    # Load balancing sederhana (Round Robin)
    idx = REGISTRY[s_key]["round_robin_idx"] % len(instances)
    chosen_instance = instances[idx]
    REGISTRY[s_key]["round_robin_idx"] += 1

    return jsonify({
        "service_name": s_key,
        "selected_instance": chosen_instance,
        "active_instances_count": len(instances)
    })

@app.route("/register", methods=["POST"])
def register_service():
    """Dipanggil oleh microservice saat baru start (Bootstrapping)."""
    data = request.json or {}
    service_name = data.get("service_name", "").upper()
    instance_id = data.get("instance_id")
    url = data.get("url")

    if not service_name or not instance_id or not url:
        return jsonify({"error": "Payload tidak lengkap (butuh service_name, instance_id, url)"}), 400

    if service_name not in REGISTRY:
        REGISTRY[service_name] = {"instances": {}, "round_robin_idx": 0}

    REGISTRY[service_name]["instances"][instance_id] = {
        "url": url,
        "last_heartbeat": time.time(),
        "status": "UP"
    }

    print(f"\n[REGISTRY SERVER :8761] ✅ Service TERDAFTAR: {service_name} ({instance_id}) -> {url}")
    return jsonify({
        "status": "REGISTERED",
        "service_name": service_name,
        "instance_id": instance_id,
        "url": url
    }), 201

@app.route("/heartbeat", methods=["POST"])
def heartbeat():
    """Dipanggil berkala oleh microservice untuk lapor status sehat."""
    data = request.json or {}
    service_name = data.get("service_name", "").upper()
    instance_id = data.get("instance_id")

    if service_name in REGISTRY and instance_id in REGISTRY[service_name]["instances"]:
        REGISTRY[service_name]["instances"][instance_id]["last_heartbeat"] = time.time()
        REGISTRY[service_name]["instances"][instance_id]["status"] = "UP"
        return jsonify({"status": "HEARTBEAT_ACK"}), 200

    return jsonify({"error": "Instance belum terdaftar, silakan register ulang"}), 404

if __name__ == "__main__":
    print("=" * 65)
    print(" 🏥 SERVICE REGISTRY SERVER BERJALAN DI PORT 8761")
    print(" Dashboard Visual: http://localhost:8761")
    print(" Endpoint Discovery: http://localhost:8761/services/<SERVICE-NAME>")
    print("=" * 65)
    app.run(host="0.0.0.0", port=8761, debug=False)
