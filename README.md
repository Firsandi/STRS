# Distribusi Resep Rumah Sakit Berbasis Pub/Sub (RabbitMQ Fanout)
**Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ 2026**

Implementasi arsitektur **Event-Driven Publish/Subscribe (Pub/Sub)** modular menggunakan Exchange bertipe **Fanout** pada RabbitMQ.

---

## 📁 Struktur Proyek (Modular Architecture)

Proyek ini telah dipecah menjadi modul-modul independen yang bersih (*decoupled*):

```text
├── config.py         # Konfigurasi RabbitMQ terpusat & helper get_connection()
├── dokter.py         # Publisher: Mengirim event PrescriptionIssued
├── apotek.py         # Subscriber: Divisi Farmasi / Penyiapan obat & stok
├── kasir.py          # Subscriber: Divisi Billing / Perhitungan invoice
├── emr.py            # Subscriber: Divisi Rekam Medis Elektronik (EMR)
├── bpjs.py           # Subscriber: Divisi Penjaminan BPJS & Asuransi
├── rs_pubsub.py      # Entrypoint CLI fleksibel (bisa panggil role manapun)
├── simulasi.py       # Runner otomatis untuk menguji seluruh modul sekaligus
├── requirements.txt  # Dependensi (pika, colorama)
└── README.md
```

---

## 🛠️ Konfigurasi Server RabbitMQ
- **URL Dashboard**: [http://rabbit.fasilkomapp.id/#/](http://rabbit.fasilkomapp.id/#/)
- **Host**: `rabbit.fasilkomapp.id`
- **Port AMQP**: `5672`
- **User / Pass**: `admin` / `PasswordRabbitMQAman123`
- **Exchange**: `hospital_prescriptions` (*Type: fanout, durable: True*)

---

## 🚀 Cara Menjalankan

### Cara 1: Menjalankan Per Modul Langsung di Terminal Terpisah
Buka beberapa jendela terminal:

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
4. **Terminal 4 (BPJS):**
   ```bash
   python3 bpjs.py
   ```
5. **Terminal 5 (Dokter - Publisher):**
   ```bash
   python3 dokter.py
   ```

*(Catatan: Perintah lama `python3 rs_pubsub.py <role>` tetap bisa digunakan karena otomatis diarahkan ke modul terkait).*

---

### Cara 2: Simulasi Lengkap Otomatis (Semua Modul Sekaligus)
Untuk mendemonstrasikan bahwa kelima modul bekerja secara paralel dan terdistribusi:
```bash
python3 simulasi.py
```
Skrip ini akan mengeksekusi `apotek.py`, `kasir.py`, `emr.py`, dan `bpjs.py` di latar belakang, memicu `dokter.py`, lalu menangkap output dari tiap divisi secara bersamaan.
