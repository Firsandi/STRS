# 🏥 Sistem Terdistribusi — Kelompok 2 (Fasilkom UNEJ)
**Mata Kuliah: Sistem Terdistribusi • Semester Genap 2025/2026**  
**Dosen Pengampu: M. Zarkasi, S.Kom., M.Kom.**

---

### 👥 Anggota Tim Penyusun
* **Ridho Rizky Prasetyo** (`242410102055`)
* **Firsandi Andraw F.** (`242410102056`)
* **Ahmad Rafif Nandra U.** (`242410102018`)

---

## 🗂️ Navigasi Struktur Direktori Proyek

Workspace ini telah direorganisasi secara terstruktur per topik dan fungsi:

```text
coba/
├── 📁 presentasi/                                     # 🌟 PUSAT SELURUH DEK & MATERI PRESENTASI
│   ├── 📁 minggu_11_race_condition/                  # Materi Aktif: Race Condition Apotek
│   │   ├── Presentasi_Minggu11_RaceCondition_Kelompok2.pptx
│   │   ├── Presentasi_Minggu11_RaceCondition.pptx
│   │   ├── Presentasi_Minggu11_RaceCondition.figcraft
│   │   ├── Presentasi_Minggu11_RaceCondition.fig
│   │   ├── Presentasi_Minggu11_RaceCondition.pdf
│   │   ├── 📁 slides_png/                            # Galeri 11 gambar slide resolusi tinggi
│   │   └── PANDUAN_PRESENTASI_RACE_CONDITION.md      # Naskah kata-per-kata per presenter
│   │
│   ├── 📁 minggu_10_gateway_discovery/               # Arsip Presentasi Gateway & Discovery
│   │   ├── Presentasi_API_Gateway_dan_Service_Discovery.pptx
│   │   ├── Presentasi_API_Gateway_RumahSakit.pptx
│   │   ├── Presentasi_Load_Balancing_Kelompok2.pptx
│   │   ├── Presentasi_Service_Discovery_Kelompok2.pptx
│   │   ├── PANDUAN_PRESENTASI_LOAD_BALANCING.md
│   │   ├── PANDUAN_PRESENTASI_SERVICE_DISCOVERY.md
│   │   └── 📁 slides-gateway-discovery/
│   │
│   └── 📁 standar_baku/                              # Pedoman Permanen Desain Presentasi
│       └── STANDAR_BAKU_PRESENTASI_KELOMPOK2.md      # Standar Baku Clean Porcelain
│
├── 📁 services/                                       # Microservices Backend Aktif (Minggu 11)
│   ├── apotek_service.py                             # REST API Multi-Instance (:8102, :8112, :8122)
│   └── db.py                                         # Helper SQLite WAL Mode terpusat
│
├── 📁 data/                                           # Basis Data Terpusat
│   └── apotek.db                                     # Database SQLite (tabel: obat & pesanan)
│
├── 🚀 simulasi_race_condition.py                     # Runner Uji Konkurensi Paralel (Slide 9 & 11)
├── 🚀 start_race_condition_demo.sh                   # Menu Peluncur Presentasi & Demonstrasi
│
├── 🌐 bolt-slides/                                   # Aplikasi Web Slide Interaktif React
│
├── 🗄️ arsip_tugas_lama/                              # Kode Backend Tugas Minggu Lalu
│   ├── 📁 01_pubsub_rabbitmq/                        # (dokter.py, kasir.py, emr.py, apotek lama, dll)
│   └── 📁 02_gateway_dan_discovery/                  # (gateway/ Java, python_gateway/, discovery/)
│
└── 🧰 tools_generator_slides/                        # Compiler Builder Slide Otomatis
    ├── build_figcraft_slides.py                      # FigCraft native builder
    ├── generate_race_condition_pptx.js               # PPTX OpenXML generator
    ├── figcraft_commands.json
    └── 📁 ppt-master-repo/
```

---

## 🏆 Modul Aktif: Minggu 11 — Race Condition & Data Consistency

### 1. Deskripsi Studi Kasus
Studi kasus perebutan kuantitas stok obat kritis (**Paracetamol 500mg** atau **Amoxicillin Sirup**) yang tersisa tepat 1 botol terakhir, di mana 3 kasir rumah sakit (Kasir IGD, Rawat Inap, dan Poli Anak) mengakses 3 instance service apotek mandiri (port 8102, 8112, 8122) yang terhubung ke satu basis data bersama.

### 2. Empat Strategi yang Diuji
1. **Pola Naif (*Read-Modify-Write*):** Membuka celah *Time-Of-Check to Time-Of-Use* (TOCTOU). Mengakibatkan 3 pesanan disetujui untuk 1 botol stok fisik (**overselling fatal**).
2. **Operasi Atomic (SQL Conditional):** Eksekusi kondisional langsung di database `UPDATE obat SET stok = stok - ? WHERE nama = ? AND stok >= ?`. Sangat cepat dan non-blocking.
3. **Database Transaction (ACID / Pessimistic Locking):** Menggunakan transaksi eksklusif `BEGIN IMMEDIATE` yang meletakkan *Exclusive Write Lock* hingga `COMMIT` atau `ROLLBACK`.
4. **Optimistic Locking (Version Tracking):** Melacak nomor versi data `WHERE versi = ?`. Tanpa mengunci pembaca, dan otomatis menolak transaksi bentrok dengan status `HTTP 409 Conflict`.

### 3. Cara Menjalankan Simulasi (Slide 9 PPT)
```bash
# 1. Mode Standar: Uji otomatis 3 instance paralel (:8102, :8112, :8122)
python3 simulasi_race_condition.py

# 2. Opsi Kustom (Atur jumlah pembeli, stok awal, dan jeda delay)
python3 simulasi_race_condition.py --buyers 5 --stok 2 --delay 0.4

# 3. Menggunakan Menu Peluncur Interaktif:
./start_race_condition_demo.sh
```

### 4. Endpoint REST API Terpusat (`/api/apotek/db/*`) — Slide 10 PPT
* `GET  /api/apotek/db/stok?obat=Paracetamol 500mg` : Menampilkan statistik stok dan riwayat pesanan.
* `POST /api/apotek/db/reset` : Mereset stok obat ke nilai awal dan membersihkan log pesanan.
* `POST /api/apotek/db/pesan` : Memproses pemesanan dengan parameter `mode: "naif" | "atomic" | "transaction" | "optimistic"`.

---

## 📊 Hasil Pengujian Empiris (Slide 11 PPT)

| Skenario Uji | Service Instances | Respon Pembeli | Pesanan Masuk | Stok Akhir | Status Konsistensi |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1. Naif (Tanpa Lock)** | Port 8102, 8112, 8122 | 3x Berhasil (HTTP 200) | **3 Pesanan** | 0 (Bocor) | **TIDAK KONSISTEN (OVERSELL)** |
| **2. Atomic Operation** | Port 8102, 8112, 8122 | 1x 200, 2x 400 Gagal | **1 Pesanan** | 0 (Akurat) | **KONSISTEN (SQL Conditional)** |
| **3. DB Transaction** | Port 8102, 8112, 8122 | 1x 200, 2x 400 Gagal | **1 Pesanan** | 0 (Akurat) | **KONSISTEN (ACID Rollback)** |
| **4. Optimistic Locking** | Port 8102, 8112, 8122 | 1x 200, 2x 409 Ditolak | **1 Pesanan** | 0 (Versi=6) | **KONSISTEN (Version Check)** |

---

## 📌 Arsip Tugas Minggu Sebelumnya
* **Minggu 10:** API Gateway berbasis Single Entry Point (port 8000) dan Service Discovery Registry (port 8761) ➔ Tersimpan di folder `arsip_tugas_lama/02_gateway_dan_discovery/` serta slide presentasinya di `presentasi/minggu_10_gateway_discovery/`.
* **Minggu 8–9:** Event-Driven Architecture dengan RabbitMQ Fanout Exchange (Dokter, Apotek, Kasir, EMR) ➔ Tersimpan di folder `arsip_tugas_lama/01_pubsub_rabbitmq/`.
