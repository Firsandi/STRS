# Studi Kasus 3: Distribusi Resep Obat Rumah Sakit Berbasis Pub/Sub (RabbitMQ Fanout)
**Mata Kuliah: Sistem Terdistribusi - Fasilkom UNEJ 2026**

Implementasi sistem distribusi event resep obat secara *real-time* dan *asynchronous* menggunakan arsitektur **Publish/Subscribe (Pub/Sub)** dengan Exchange bertipe **Fanout** pada RabbitMQ.

---

## 🛠️ Konfigurasi Server RabbitMQ (Sesuai Praktikum)
| Parameter | Nilai |
| :--- | :--- |
| **URL Dashboard Management** | [http://rabbit.fasilkomapp.id/#/](http://rabbit.fasilkomapp.id/#/) |
| **Host / Domain** | `rabbit.fasilkomapp.id` |
| **Service Port (AMQP)** | `5672` |
| **Username** | `admin` |
| **Password** | `PasswordRabbitMQAman123` |
| **Exchange Name** | `hospital_prescriptions` (*Fanout, Durable*) |

---

## 📦 Dependensi Library
Dependensi sudah terpasang:
```bash
pip install pika colorama
```
atau menggunakan file `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

## 🚀 Cara Menjalankan

### Opsi 1: Multi-Terminal (Sesuai Skenario Demo Praktikum)
Buka beberapa tab/jendela terminal di folder ini:

1. **Terminal 1 (Farmasi / Apotek):**
   ```bash
   python3 rs_pubsub.py apotek
   ```
2. **Terminal 2 (Kasir / Billing):**
   ```bash
   python3 rs_pubsub.py kasir
   ```
3. **Terminal 3 (Rekam Medis / EMR):**
   ```bash
   python3 rs_pubsub.py emr
   ```
4. **Terminal 4 (BPJS & Asuransi - Demonstrasi Decoupling):**
   ```bash
   python3 rs_pubsub.py bpjs
   ```
5. **Terminal 5 (Dokter Poli - Publisher):**
   ```bash
   python3 rs_pubsub.py dokter
   ```
   *Setiap kali dokter menerbitkan resep, seluruh 4 subscriber di terminal lainnya akan secara bersamaan menerima event resep tersebut tanpa blocking.*

---

### Opsi 2: Simulasi Lengkap Otomatis (1 Perintah)
Untuk menguji dan mendemonstrasikan seluruh alur sekaligus:
```bash
python3 simulasi.py
```
Skrip ini akan secara otomatis:
1. Menjalankan 4 background subscriber (Apotek, Kasir, EMR, BPJS).
2. Memublikasikan 1 data resep baru dari Dokter.
3. Menampilkan respons dan pemrosesan dari tiap divisi.
4. Menutup koneksi dengan rapi.
