#!/usr/bin/env python3
"""
Python API Gateway dengan SERVICE DISCOVERY (Port 8000)
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ

PERBEDAAN UTAMA DENGAN VERSI HARDCODE:
1. Versi Hardcoded (gateway.py):
   - Alamat service ditulis permanen: 'http://localhost:8101'
   - Jika port berubah atau server pindah, file gateway harus diedit & restart.
   
2. Versi Service Discovery (gateway_discovery.py ini):
   - Gateway HANYA tahu nama logis service ('DOKTER-SERVICE', 'APOTEK-SERVICE')
   - Alamat fisik (IP & Port) dicari secara dinamis ke Service Registry (:8761)
   - Otomatis mendukung Load Balancing dan Deteksi Server Mati (Self-healing).
"""

import requests
from flask import Flask, request, Response, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

REGISTRY_URL = "http://localhost:8761"

# Mapping Prefix URL ke Nama Logis Service (Bukan IP / Port fisik!)
SERVICE_MAPPING = {
    "/api/dokter": "DOKTER-SERVICE",
    "/api/apotek": "APOTEK-SERVICE",
    "/api/kasir": "KASIR-SERVICE",
    "/api/emr": "EMR-SERVICE"
}

def resolve_service_url(service_name):
    """
    Fungsi Discovery: Bertanya ke Registry Server (:8761)
    untuk mendapatkan URL instance yang sedang aktif.
    """
    try:
        resp = requests.get(f"{REGISTRY_URL}/services/{service_name}", timeout=2)
        if resp.status_code == 200:
            data = resp.json()
            return data["selected_instance"]["url"]
        return None
    except Exception as e:
        print(f"[GATEWAY ERROR] Gagal menghubungi Registry Server: {e}")
        return None

@app.route("/", methods=["GET"])
def gateway_info():
    return jsonify({
        "gateway": "Hospital API Gateway (DYNAMIC SERVICE DISCOVERY MODE)",
        "port": 8000,
        "mode": "SERVICE_DISCOVERY",
        "registry_url": REGISTRY_URL,
        "service_mappings": SERVICE_MAPPING,
        "note": "Alamat fisik IP & Port tidak di-hardcode, melainkan di-lookup dari Registry Server"
    })

@app.route("/api/<service>/<path:subpath>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
@app.route("/api/<service>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def proxy(service, subpath=""):
    prefix = f"/api/{service}"
    logical_service_name = SERVICE_MAPPING.get(prefix)

    if not logical_service_name:
        return jsonify({
            "error": "Route Not Configured",
            "message": f"Prefix '{prefix}' tidak terdaftar di konfigurasi Gateway"
        }), 404

    # 1. TAHAP DISCOVERY: Tanya Registry di mana lokasi service berada saat ini
    target_base = resolve_service_url(logical_service_name)

    if not target_base:
        return jsonify({
            "error": "Service Discovery Failed",
            "message": f"Service '{logical_service_name}' tidak ditemukan di Registry atau seluruh instance DOWN!",
            "registry_checked": f"{REGISTRY_URL}/services/{logical_service_name}"
        }), 503

    target_url = f"{target_base}/api/{service}/{subpath}" if subpath else f"{target_base}/api/{service}"
    
    if request.query_string:
        target_url = f"{target_url}?{request.query_string.decode('utf-8')}"

    print(f"\n[DYNAMIC GATEWAY :8000] 🔍 Discovery '{logical_service_name}' -> {target_base}")
    print(f"[DYNAMIC GATEWAY :8000] ⏩ Forwarding {request.method} {request.path} -> {target_url}")

    try:
        headers = {k: v for k, v in request.headers if k.lower() != 'host'}
        body = request.get_data()

        resp = requests.request(
            method=request.method,
            url=target_url,
            headers=headers,
            data=body,
            cookies=request.cookies,
            allow_redirects=False,
            timeout=10
        )

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        response_headers = [
            (name, value) for (name, value) in resp.raw.headers.items()
            if name.lower() not in excluded_headers
        ]

        # Tambahkan header penanda bahwa request melewati dynamic discovery
        response_headers.append(('X-Gateway-Mode', 'Dynamic-Service-Discovery'))
        response_headers.append(('X-Resolved-Service', logical_service_name))
        response_headers.append(('X-Upstream-URL', target_base))

        return Response(resp.content, resp.status_code, response_headers)

    except requests.exceptions.RequestException as e:
        print(f"[DYNAMIC GATEWAY ERROR] Gagal menghubungi {target_url}: {e}")
        return jsonify({
            "error": "Bad Gateway / Service Error",
            "target_url": target_url,
            "details": str(e)
        }), 502

if __name__ == "__main__":
    print("=" * 65)
    print(" 🚪 API GATEWAY (SERVICE DISCOVERY MODE) AKTIF DI PORT 8000")
    print(f" Terhubung ke Service Registry: {REGISTRY_URL}")
    print("=" * 65)
    app.run(host="0.0.0.0", port=8000, debug=False)
