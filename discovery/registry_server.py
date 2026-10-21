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
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Service Registry Dashboard | Netflix Eureka Style</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            :root {
                --bg: #090d16;
                --surface: #111726;
                --surface-hover: #172033;
                --border: #1e293b;
                --text: #f1f5f9;
                --text-muted: #94a3b8;
                --primary: #38bdf8;
                --emerald: #10b981;
                --rose: #f43f5e;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
                font-family: 'Plus Jakarta Sans', sans-serif;
                background-color: var(--bg);
                color: var(--text);
                min-height: 100vh;
                padding: 40px 24px;
                display: flex;
                justify-content: center;
            }
            .layout {
                width: 100%;
                max-width: 1100px;
            }
            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 28px;
                padding-bottom: 20px;
                border-bottom: 1px solid var(--border);
            }
            .title-area h1 {
                font-size: 22px;
                font-weight: 700;
                color: #ffffff;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .title-area p {
                font-size: 13px;
                color: var(--text-muted);
                margin-top: 4px;
            }
            .live-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                font-weight: 600;
                color: var(--emerald);
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.25);
                padding: 6px 14px;
                border-radius: 9999px;
            }
            .pulse-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--emerald);
                box-shadow: 0 0 10px var(--emerald);
                animation: pulse 1.5s infinite;
            }
            @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(0.85); }
                100% { opacity: 1; transform: scale(1); }
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
                margin-bottom: 28px;
            }
            .stat-card {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 16px 20px;
            }
            .stat-label {
                font-size: 12px;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: 600;
            }
            .stat-value {
                font-size: 24px;
                font-weight: 700;
                color: #ffffff;
                margin-top: 6px;
                font-family: 'JetBrains Mono', monospace;
            }
            .table-container {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 14px;
                overflow: hidden;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                text-align: left;
            }
            th {
                background: rgba(15, 23, 42, 0.6);
                padding: 14px 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                color: var(--text-muted);
                border-bottom: 1px solid var(--border);
            }
            td {
                padding: 16px 20px;
                font-size: 13px;
                border-bottom: 1px solid rgba(30, 41, 59, 0.6);
            }
            tr:last-child td { border-bottom: none; }
            tr:hover td { background: var(--surface-hover); }
            .service-title {
                font-weight: 600;
                color: #ffffff;
            }
            .code-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                background: rgba(15, 23, 42, 0.8);
                color: #93c5fd;
                padding: 4px 8px;
                border-radius: 6px;
                border: 1px solid rgba(59, 130, 246, 0.2);
            }
            .badge-status {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            .badge-up {
                background: rgba(16, 185, 129, 0.15);
                color: #34d399;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            .badge-down {
                background: rgba(244, 63, 94, 0.15);
                color: #fb7185;
                border: 1px solid rgba(244, 63, 94, 0.3);
            }
            .heartbeat-text {
                font-family: 'JetBrains Mono', monospace;
                color: var(--text-muted);
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="layout">
            <header>
                <div class="title-area">
                    <h1>🏥 Service Registry (Eureka Dashboard)</h1>
                    <p>Sistem Terdistribusi — Netflix Eureka / Consul Service Registry Engine</p>
                </div>
                <div class="live-indicator">
                    <span class="pulse-dot"></span>
                    <span>LIVE AUTO-REFRESH</span>
                </div>
            </header>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Registry Port</div>
                    <div class="stat-value" style="color: var(--primary);">:8761</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Services</div>
                    <div class="stat-value" id="stat-services">4</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Active Instances</div>
                    <div class="stat-value" id="stat-instances" style="color: var(--emerald);">5</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Gateway Port</div>
                    <div class="stat-value">:8000</div>
                </div>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Service Name</th>
                            <th>Instance ID</th>
                            <th>Physical Endpoint (URL)</th>
                            <th>Last Heartbeat</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="registry-body">
                        <!-- Konten diisi otomatis oleh JavaScript secara live -->
                    </tbody>
                </table>
            </div>
        </div>

        <script>
            async function fetchRegistry() {
                try {
                    const res = await fetch('/services');
                    const data = await res.json();
                    const registry = data.registry || {};
                    
                    const tbody = document.getElementById('registry-body');
                    let rowsHtml = '';
                    let serviceCount = 0;
                    let instanceCount = 0;

                    for (const [sName, sData] of Object.entries(registry)) {
                        serviceCount++;
                        const instances = sData.instances || {};
                        for (const [instId, inst] of Object.entries(instances)) {
                            instanceCount++;
                            const isUp = inst.status && inst.status.startsWith('UP');
                            const diffSec = Math.max(0, Math.floor((Date.now() / 1000) - inst.last_heartbeat));

                            rowsHtml += `
                                <tr>
                                    <td><span class="service-title">${sName}</span></td>
                                    <td><span class="code-badge">${instId}</span></td>
                                    <td><span class="code-badge" style="color: #67e8f9;">${inst.url}</span></td>
                                    <td><span class="heartbeat-text">${diffSec}s yang lalu</span></td>
                                    <td>
                                        <span class="badge-status ${isUp ? 'badge-up' : 'badge-down'}">
                                            ● ${inst.status}
                                        </span>
                                    </td>
                                </tr>
                            `;
                        }
                    }

                    if (instanceCount === 0) {
                        rowsHtml = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--text-muted);">Belum ada microservice yang terdaftar ke Registry.</td></tr>`;
                    }

                    tbody.innerHTML = rowsHtml;
                    document.getElementById('stat-services').innerText = serviceCount;
                    document.getElementById('stat-instances').innerText = instanceCount;
                } catch (e) {
                    console.error("Gagal refresh registry:", e);
                }
            }

            // Jalankan segera dan ulangi otomatis setiap 2 detik
            fetchRegistry();
            setInterval(fetchRegistry, 2000);
        </script>
    </body>
    </html>
    """
    return render_template_string(html_template)

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
