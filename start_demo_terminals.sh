#!/usr/bin/env bash
# ==============================================================================
# Script Otomatis Membuka Jendela Terminal Terpisah / Tab untuk Setiap Service
# Memudahkan presentasi langsung di depan Dosen (Pak Zarkasi)
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Membuka multi-tab terminal untuk masing-masing service..."

if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal \
      --tab --title="1. REGISTRY (:8761)" -- bash -c "cd '$PROJECT_DIR' && python3 discovery/registry_server.py; exec bash" \
      --tab --title="2. DOKTER (:8101)"   -- bash -c "cd '$PROJECT_DIR' && sleep 1 && python3 services/dokter_service.py; exec bash" \
      --tab --title="3. APOTEK (:8102)"   -- bash -c "cd '$PROJECT_DIR' && sleep 1 && python3 services/apotek_service.py; exec bash" \
      --tab --title="4. KASIR (:8103)"    -- bash -c "cd '$PROJECT_DIR' && sleep 1 && python3 services/kasir_service.py; exec bash" \
      --tab --title="5. EMR (:8104)"      -- bash -c "cd '$PROJECT_DIR' && sleep 1 && python3 services/emr_service.py; exec bash" \
      --tab --title="6. GATEWAY (:8000)"  -- bash -c "cd '$PROJECT_DIR' && sleep 2 && python3 python_gateway/gateway_discovery.py; exec bash" \
      --tab --title="7. CLIENT / CURL"    -- bash -c "cd '$PROJECT_DIR' && echo 'Gunakan tab ini untuk trigger request demo!'; exec bash"
    echo "Terminal tab berhasil diluncurkan!"
else
    echo "Gnome terminal tidak ditemukan. Silakan jalankan secara manual menggunakan daftar perintah berikut:"
    echo "1. python3 discovery/registry_server.py"
    echo "2. python3 services/dokter_service.py"
    echo "3. python3 services/apotek_service.py"
    echo "4. python3 services/kasir_service.py"
    echo "5. python3 services/emr_service.py"
    echo "6. python3 python_gateway/gateway_discovery.py"
fi
