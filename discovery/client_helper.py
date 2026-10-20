#!/usr/bin/env python3
"""
Helper Service Discovery Client
Digunakan oleh Microservices (Dokter, Apotek, Kasir, EMR)
untuk mendaftarkan diri secara otomatis ke Service Registry (:8761)
dan mengirim heartbeat berkala di latar belakang (background thread).
"""

import time
import threading
import requests

REGISTRY_URL = "http://localhost:8761"

def register_to_discovery(service_name, instance_id, service_url, heartbeat_interval=10):
    """
    1. Mengirim pendaftaran awal ke Registry Server.
    2. Menjalankan thread background untuk mengirim heartbeat setiap 10 detik.
    """
    def _run_heartbeat():
        while True:
            time.sleep(heartbeat_interval)
            try:
                requests.post(
                    f"{REGISTRY_URL}/heartbeat",
                    json={"service_name": service_name, "instance_id": instance_id},
                    timeout=2
                )
            except Exception:
                pass  # Diam jika server registry sementara tidak terjangkau

    try:
        res = requests.post(
            f"{REGISTRY_URL}/register",
            json={
                "service_name": service_name,
                "instance_id": instance_id,
                "url": service_url
            },
            timeout=3
        )
        if res.status_code == 201:
            print(f"[DISCOVERY CLIENT] 📡 Berhasil mendaftarkan {service_name} ({instance_id}) ke Registry {REGISTRY_URL}")
            # Mulai daemon heartbeat thread
            t = threading.Thread(target=_run_heartbeat, daemon=True)
            t.start()
            return True
        else:
            print(f"[DISCOVERY CLIENT] Gagal mendaftar: {res.text}")
            return False
    except Exception as e:
        print(f"[DISCOVERY CLIENT] Tidak dapat terhubung ke Registry Server ({REGISTRY_URL}): {e}")
        return False
