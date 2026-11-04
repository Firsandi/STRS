#!/usr/bin/env bash
# ==============================================================================
# Script Demonstrasi Praktikum: Race Condition & Data Consistency (Minggu 11)
# Kelompok 2 - Fasilkom UNEJ
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "=========================================================================="
echo "  DEMONSTRASI RACE CONDITION & DATA CONSISTENCY (KELOMPOK 2)"
echo "  Multi-Instance Apotek (:8102, :8112, :8122) + Database SQLite/PostgreSQL"
echo "=========================================================================="
echo "Pilihan Demonstrasi:"
echo "1) Jalankan Benchmark Simulasi Otomatis (3 Pembeli, Stok Awal 1)"
echo "2) Jalankan Simulasi Kustom (Bisa atur jumlah pembeli, delay, dan stok)"
echo "3) Buka 3 Instance Apotek di Terminal Terpisah (Untuk Demo Manual)"
echo "4) Cek Data Terakhir di Database (sqlite3 data/apotek.db)"
echo "=========================================================================="
read -p "Pilih menu (1/2/3/4) [Default: 1]: " pilihan

pilihan=${pilihan:-1}

case $pilihan in
    1)
        echo -e "\n[*] Menjalankan simulasi benchmark standar..."
        python3 "$PROJECT_DIR/simulasi_race_condition.py"
        ;;
    2)
        read -p "Masukkan jumlah pembeli serentak [3]: " buyers
        read -p "Masukkan stok awal obat [1]: " stok
        read -p "Masukkan jeda delay dalam detik [0.3]: " delay
        buyers=${buyers:-3}
        stok=${stok:-1}
        delay=${delay:-0.3}
        python3 "$PROJECT_DIR/simulasi_race_condition.py" --buyers "$buyers" --stok "$stok" --delay "$delay"
        ;;
    3)
        echo -e "\n[*] Membuka terminal untuk 3 Instance Apotek..."
        if command -v gnome-terminal >/dev/null 2>&1; then
            gnome-terminal --title="Apotek Instance 1 (:8102)" -- bash -c "cd '$PROJECT_DIR' && python3 services/apotek_service.py 8102; exec bash"
            sleep 0.3
            gnome-terminal --tab --title="Apotek Instance 2 (:8112)" -- bash -c "cd '$PROJECT_DIR' && python3 services/apotek_service.py 8112; exec bash"
            sleep 0.3
            gnome-terminal --tab --title="Apotek Instance 3 (:8122)" -- bash -c "cd '$PROJECT_DIR' && python3 services/apotek_service.py 8122; exec bash"
            echo "3 Terminal instance berhasil dibuka!"
        else
            echo "Jalankan perintah ini di 3 tab terminal berbeda:"
            echo "1. python3 services/apotek_service.py 8102"
            echo "2. python3 services/apotek_service.py 8112"
            echo "3. python3 services/apotek_service.py 8122"
        fi
        ;;
    4)
        echo -e "\n[*] Menampilkan isi tabel obat & pesanan dari data/apotek.db:\n"
        sqlite3 "$PROJECT_DIR/data/apotek.db" ".headers on" ".mode column" "SELECT * FROM obat;"
        echo ""
        sqlite3 "$PROJECT_DIR/data/apotek.db" ".headers on" ".mode column" "SELECT id, nama_obat, qty, pembeli, mode, instance_port, status, created_at FROM pesanan;"
        ;;
    *)
        echo "Pilihan tidak valid."
        ;;
esac
