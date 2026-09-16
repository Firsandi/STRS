# Distribusi Resep Rumah Sakit Berbasis Pub/Sub (RabbitMQ Fanout)
**Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ 2026**

Implementasi arsitektur **Event-Driven Publish/Subscribe (Pub/Sub)** modular menggunakan Exchange bertipe **Fanout** pada RabbitMQ.

---

## 📁 Struktur Proyek (Modular Architecture)

Proyek ini terbagi menjadi modul-modul independen yang bersih (*decoupled*):

```text
├── config.py         # Konfigurasi RabbitMQ terpusat & helper get_connection()
├── dokter.py         # Publisher: Mengirim event PrescriptionIssued
├── apotek.py         # Subscriber: Divisi Farmasi / Penyiapan obat & stok
├── kasir.py          # Subscriber: Divisi Billing / Perhitungan invoice
├── emr.py            # Subscriber: Divisi Rekam Medis Elektronik (EMR)
├── rs_pubsub.py      # Entrypoint CLI fleksibel (bisa panggil role manapun)
├── simulasi.py       # Runner otomatis untuk menguji seluruh modul sekaligus
├── requirements.txt  # Dependensi (pika, colorama)
└── README.md
```

---

## 🚀 Cara Menjalankan

### Cara 1: Menjalankan Per Modul Langsung di Terminal Terpisah
Buka terminal terpisah untuk tiap layanan:

1. **Terminal 1 (Apotek):**
   ```bash
   python3 apotek.py
   ```
2. **Terminal 2 (Kasir):**
   ```bash
   python3 kasir.py
   ```
3. **Terminal 3 (EMR):**
   ```bash
   python3 emr.py
   ```
4. **Terminal 4 (Dokter - Publisher):**
   ```bash
   python3 dokter.py
   ```

*(Catatan: Perintah lama `python3 rs_pubsub.py <role>` tetap bisa digunakan: `dokter`, `apotek`, `kasir`, `emr`).*

---

### Cara 2: Simulasi Lengkap Otomatis (Semua Modul Sekaligus)
Untuk mendemonstrasikan bahwa ketiga divisi menerima pesan secara bersamaan:
```bash
python3 simulasi.py
```
Skrip ini akan mengeksekusi `apotek.py`, `kasir.py`, dan `emr.py` di latar belakang, memicu `dokter.py`, lalu menangkap output dari tiap divisi.
