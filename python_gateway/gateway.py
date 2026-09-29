#!/usr/bin/env python3
"""
Python API Gateway (Port 8000)
Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ
Fungsi:
- Bertindak sebagai Single Entry Point (Receptionist) seperti konsep Slide 4 & 5 PPT.
- Reverse Proxy / Routing transparan ke Microservices:
    * /api/dokter/** -> http://localhost:8101
    * /api/apotek/** -> http://localhost:8102
    * /api/kasir/**  -> http://localhost:8103
    * /api/emr/**    -> http://localhost:8104
"""

import requests
from flask import Flask, request, Response, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Tabel Routing Gateway (Sesuai Konfigurasi application.yml Spring Cloud Gateway)
ROUTES = {
    "/api/dokter": "http://localhost:8101",
    "/api/apotek": "http://localhost:8102",
    "/api/kasir": "http://localhost:8103",
    "/api/emr": "http://localhost:8104"
}

@app.route("/", methods=["GET"])
def gateway_info():
    return jsonify({
        "gateway": "Hospital API Gateway (Single Entry Point)",
        "port": 8000,
        "status": "ONLINE",
        "description": "Gerbang masuk tunggal untuk seluruh microservice rumah sakit",
        "registered_routes": ROUTES
    })

@app.route("/api/<service>/<path:subpath>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
@app.route("/api/<service>", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def proxy(service, subpath=""):
    prefix = f"/api/{service}"
    target_base = ROUTES.get(prefix)

    if not target_base:
        return jsonify({
            "error": "Bad Gateway / Route Not Found",
            "message": f"Service '{service}' tidak terdaftar di API Gateway",
            "available_services": list(ROUTES.keys())
        }), 404

    target_url = f"{target_base}/api/{service}/{subpath}" if subpath else f"{target_base}/api/{service}"
    
    # Forward query parameters jika ada
    if request.query_string:
        target_url = f"{target_url}?{request.query_string.decode('utf-8')}"

    print(f"\n[API GATEWAY :8000] Meneruskan {request.method} {request.path} -> {target_url}")

    try:
        # Forward request ke target microservice
        resp = requests.request(
            method=request.method,
            url=target_url,
            headers={key: value for (key, value) in request.headers if key != 'Host'},
            data=request.get_data(),
            cookies=request.cookies,
            allow_redirects=False,
            timeout=5
        )

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items() if name.lower() not in excluded_headers]

        return Response(resp.content, resp.status_code, headers)

    except requests.exceptions.ConnectionError:
        return jsonify({
            "error": "Service Unavailable",
            "message": f"Target microservice {prefix} di {target_base} sedang offline / tidak aktif!",
            "gateway_status": "API Gateway aktif, namun backend service belum berjalan."
        }), 503
    except Exception as e:
        return jsonify({
            "error": "Gateway Error",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    print("="*65)
    print(" [GATEWAY] Memulai Python API Gateway pada http://localhost:8000")
    print(" Single Entry Point aktif meneruskan:")
    for path, target in ROUTES.items():
        print(f"   -> {path}/**  =>  {target}")
    print("="*65)
    app.run(host="0.0.0.0", port=8000, debug=False)
