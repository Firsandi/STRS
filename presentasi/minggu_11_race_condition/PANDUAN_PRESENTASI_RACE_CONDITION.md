# 📘 Panduan Lengkap Presentasi: Konsistensi Data & Race Condition
**Mata Kuliah: Sistem Terdistribusi — Fakultas Ilmu Komputer, Universitas Jember**  
**Kelompok 2:**
1. **Ridho Rizky Prasetyo** (NIM 242410102055)
2. **Firsandi Andraw F.** (NIM 242410102056)
3. **Ahmad Rafif Nandra U.** (NIM 242410102018)

---

## 🎯 Standar Baku Dek Slide & Palet Warna
Presentasi ini disusun secara ketat mengacu pada **Standar Baku Presentasi Kelompok 2**:
* **Palet:** *Clean Porcelain* (`#F8FAFC`), Card Pure White (`#FFFFFF`), Border Hairline (`#E2E8F0`), Primary Royal Cobalt (`#1E40AF`), Text Slate Dark (`#0F172A`).
* **Hierarki Wajib Tiap Slide:** Eyebrow / Kicker Badge kapital bold, Judul utama ringkas, Subjudul 1 kalimat framing masalah, dan Speaker Notes lengkap.
* **Format:** Tersedia dalam OpenXML native (.pptx), format asli FigCraft (.figcraft), format Figma (.fig), dokumen cetak (.pdf), serta dek web interaktif (bolt-slides).

---

## ⏱️ Pembagian Peran Presenter (Total 11 Slide ±15 Menit)
* **Babak 1: Arsitektur & Anatomi Masalah (Slide 1 – 4)** ➔ Dibawakan oleh **Ridho Rizky Prasetyo**.
* **Babak 2: Bedah 3 Pilar Solusi Teknis (Slide 5 – 8)** ➔ Dibawakan oleh **Firsandi Andraw F.**.
* **Babak 3: Hasil Eksperimen, Skalabilitas Masa Depan & Kesimpulan (Slide 9 – 11)** ➔ Dibawakan oleh **Ahmad Rafif Nandra U.**.

---

## 🖥️ Naskah Presentasi Kata-per-Kata per Slide

---

### Slide 1: Cover & Judul Utama
* **Pembicara:** Ridho Rizky Prasetyo
* **Kicker:** `SISTEM TERDISTRIBUSI • FASILKOM UNEJ`
* **Judul:** `Konsistensi Data & Race Condition`
* **Subjudul:** `Studi Kasus: Multi-Instance Layanan Apotek dengan PostgreSQL Terpusat`
* **Tagline:** Analisis Komparasi: Naive, Atomic Operation, Database Transaction, dan Optimistic Locking.
* **Teknologi:** Laravel (PHP 8.3) • PostgreSQL 16 • Concurrency Engine Simulator
* **Visual:** 3 SERVICE → 1 DATABASE (Service :8001, :8002, :8003 ➔ PostgreSQL stok = 1).

> **Naskah Ridho:**  
> *"Selamat pagi Bapak/Ibu dosen dan rekan-rekan sekalian.  
> Kami dari Kelompok 2 akan mempresentasikan topik penting dalam arsitektur sistem terdistribusi modern, yaitu: **Konsistensi Data dan Penanganan Race Condition**.  
>  
> Studi kasus nyata yang kami angkat adalah perebutan stok obat kritis pada layanan Farmasi/Apotek Rumah Sakit yang dijalankan secara multi-instance dengan Laravel dan PostgreSQL.  
>  
> Di sistem nyata, obat darurat seperti Amoxicillin sirup sering kali tersisa hanya 1 botol terakhir, sementara ada 3 kasir berbeda yang memproses resep pada detik yang sama. Melalui presentasi ini, kita akan membedah mengapa arsitektur multi-instance bisa menyebabkan data tidak konsisten, bagaimana fenomena overselling terjadi, dan tiga pendekatan solusi teruji di level database. Mari kita masuk ke arsitektur dasarnya."*

---

### Slide 2: 1 • Arsitektur Sistem
* **Pembicara:** Ridho Rizky Prasetyo
* **Kicker:** `1 • ARSITEKTUR SISTEM`
* **Judul:** `ARSITEKTUR SISTEM`
* **Subjudul:** `Model Skalabilitas: Multi Order Service & Single Database`
* **Konten 3 Kolom:**
  1. *Multi-Client Concurrency:* Kasir IGD, Kasir Rawat Inap, Kasir Poli Anak.
  2. *Multi Service Instances:* Order Service port 8001, 8002, dan 8003.
  3. *Single Shared Database:* PostgreSQL 16 (tabel `obats` dan `pesanan_obats`).

> **Naskah Ridho:**  
> *"Mari kita telaah arsitektur sistem pada slide kedua ini.  
> Untuk menjamin ketersediaan tinggi (*High Availability*) dan skalabilitas layanan di rumah sakit, sistem apotek tidak dijalankan secara monolitik tunggal, melainkan di-scale out menjadi 3 instance mandiri yang berjalan di port 8001, 8002, dan 8003.  
>  
> Di sisi klien, kita memiliki 3 kasir berbeda: Kasir IGD, Kasir Rawat Inap, dan Kasir Poli Anak. Ketiganya mengirimkan request tebus resep secara simultan di milidetik yang sama.  
>  
> Ketiga service ini bermuara pada satu database engine PostgreSQL terpusat yang menyimpan tabel `obats` untuk kuantitas stok dan tabel `pesanan_obats`.  
> Pertanyaan mendasarnya: Jika basis datanya terpusat dan hanya ada satu, mengapa inkonsistensi data tetap bisa terjadi? Jawabannya ada pada slide 3."*

---

### Slide 3: 2 • Pola Masalah - Solusi
* **Pembicara:** Ridho Rizky Prasetyo
* **Kicker:** `2 • POLA MASALAH - SOLUSI`
* **Judul:** `POLA MASALAH - SOLUSI`
* **Subjudul:** `Mengapa Data Tidak Konsisten Meski Database Hanya Satu?`
* **Konten:**
  * **Masalah Nyata:** Kasus obat Amoxicillin Sirup tersisa 1 botol terakhir. 3 kasir menekan tombol bersamaan. Race condition terjadi: 1 botol fisik menghasilkan 3 transaksi sukses (oversell). Pasien tidak mendapatkan obat di lemari farmasi.
  * **Arah Solusi:** Memindahkan validasi dari RAM aplikasi PHP ke level SQL engine PostgreSQL melalui 3 pilar: Atomic Operation, Database Transaction, dan Optimistic Locking.

> **Naskah Ridho:**  
> *"Inilah inti paradoks konkurensi:  
> Ketika stok obat kritis hanya tersisa 1 botol, dan 3 kasir menekan tombol konfirmasi di waktu bersamaan, ketiga service membaca data dari database dan sama-sama melihat stok = 1.  
>  
> Akibatnya, ketiga service menganggap stok mencukupi dan mengonfirmasi 3 pesanan berhasil! Padahal fisik obat di lemari farmasi hanya ada 1 botol. Secara medis, ini berbahaya karena pasien yang resepnya disetujui mendapati obat fisiknya kosong.  
>  
> Akar masalahnya adalah **aplikasi mempercayai data lokal di memori RAM yang sudah usang** (*stale read*).  
> Solusinya bukan menambah server, melainkan **memindahkan hak validasi stok dari memori aplikasi PHP ke mesin PostgreSQL**. Kami merumuskan 3 pendekatan teruji: Operasi Atomic, Database Transaction, dan Optimistic Locking."*

---

### Slide 4: 3 • Masa Lalu (The Naive Era)
* **Pembicara:** Ridho Rizky Prasetyo
* **Kicker:** `3 • MASA LALU (THE NAIVE ERA)`
* **Judul:** `MASA LALU (THE NAIVE ERA)`
* **Subjudul:** `Kegagalan Pola 'Read-Modify-Write' Saat Layanan Di-Scale`
* **Konten:** Tabel step-by-step eksekusi 6 langkah:
  * Langkah 1-3: Ketiga service membaca stok = 1 (Valid Stale Read).
  * Langkah 4: Service #1 hitung di RAM 1 - 1 = 0 ➔ Simpan stok = 0.
  * Langkah 5 & 6: Service #2 & #3 menimpa stok = 0 ➔ Order #2 & #3 Sukses (Oversell!).

> **Naskah Ridho:**  
> *"Slide ini memperlihatkan secara gamblang bagaimana pola klasik *Read-Modify-Write* mengalami kegagalan fatal.  
> Perhatikan urutan baris pada tabel:  
> Pada langkah 1, 2, dan 3, Service #1, #2, dan #3 secara paralel membaca database dan semuanya mendapatkan nilai stok = 1. Semua pembacaan ini valid pada saat dibaca.  
>  
> Pada langkah 4, Service #1 menghitung di memori RAM `1 - 1 = 0`, lalu mengupdate database menjadi 0. Transaksi #1 sukses.  
> Namun perhatikan langkah 5 dan 6! Service #2 dan #3 tidak mengetahui bahwa database sudah berubah. Mereka tetap menggunakan data lama di memorinya, menghitung `1 - 1 = 0`, dan menimpa database menjadi 0.  
>  
> Hasil akhirnya: 3 pesanan disetujui untuk stok 1 botol. Inilah alasan mengapa pola naif dilarang keras di sistem produksi. Selanjutnya, rekan saya Firsandi akan memaparkan Rule of Three sebagai solusi atas masalah ini."*

---

### Slide 5: 4 • Rule of Three
* **Pembicara:** Firsandi Andraw F.
* **Kicker:** `4 • RULE OF THREE`
* **Judul:** `RULE OF THREE`
* **Subjudul:** `Tiga Pilar Menjaga Konsistensi Data Sistem Terdistribusi`
* **Konten 3 Pilar:**
  * **Pilar 1: Atomic Operation:** Eksekusi tunggal di SQL (`UPDATE obats SET stok = stok - 1 WHERE id = 1 AND stok >= 1;`).
  * **Pilar 2: Database Transaction:** Pessimistic locking ACID (`BEGIN; SELECT ... FOR UPDATE; COMMIT;`).
  * **Pilar 3: Optimistic Locking:** Version tracking (`UPDATE obats SET stok = 0, versi = 6 WHERE id = 1 AND versi = 5;`).

> **Naskah Firsandi:**  
> *"Terima kasih Ridho. Rekan-rekan sekalian, untuk menyelesaikan anomali konkurensi tadi, standar industri mengenal konsep **Rule of Three: Tiga Pilar Penjaga Konsistensi Data**.  
>  
> **Pilar pertama adalah Operasi Atomic.** Kita menyerahkan seluruh kalkulasi matematika langsung ke mesin SQL PostgreSQL dalam satu instruksi tunggal tanpa menaruh data di variabel PHP.  
>  
> **Pilar kedua adalah Database Transaction dengan Pessimistic Locking.** Kita memanfaatkan garansi ACID dengan klausa `SELECT FOR UPDATE`, yang secara fisik mengunci baris data di level tabel sehingga proses lain wajib mengantre.  
>  
> **Pilar ketiga adalah Optimistic Locking.** Tidak ada proses yang dikunci. Setiap update memvalidasi kolom versi data. Jika nomor versi sudah berubah, operasi otomatis ditolak.  
> Mari kita bedah implementasi mendalam dari masing-masing pilar ini."*

---

### Slide 6: 5 • Masa Sekarang: Solusi 1 (Atomic Operation)
* **Pembicara:** Firsandi Andraw F.
* **Kicker:** `5 • MASA SEKARANG: SOLUSI 1`
* **Judul:** `MASA SEKARANG: SOLUSI 1`
* **Subjudul:** `Operasi Atomic: Mengandalkan Conditional Update di SQL`
* **Konten:**
  * **Mekanisme Kerja:** `UPDATE obats SET stok = stok - :qty WHERE id = :id AND stok >= :qty;`. Return affected rows 1 = sukses, 0 = stok tidak cukup (HTTP 400). Keunggulan sangat cepat dan non-blocking.
  * **Pertanyaan Kritis:** Bagaimana jika stok terpotong tetapi pesanan gagal disimpan? (Kelemahan transaksi parsial jika terjadi crash di tengah jalan).

> **Naskah Firsandi:**  
> *"Pada Solusi 1: Operasi Atomic, kita memanfaatkan klausa kondisional SQL:  
> `UPDATE obats SET stok = stok - :qty WHERE id = :id AND stok >= :qty`.  
>  
> Mesin PostgreSQL mengeksekusi query ini secara atomik. Jika stok mencukupi, database mengembalikan *affected rows* bernilai 1, dan kita lanjut membuat pesanan. Jika stok sudah habis, query mengembalikan *affected rows* 0, dan aplikasi langsung membatalkan pesanan dengan HTTP 400.  
> Pendekatan ini sangat cepat karena tidak membutuhkan transaksi panjang.  
>  
> Namun, ada pertanyaan kritis:  
> *'Bagaimana jika pemotongan stok berhasil, tetapi server tiba-tiba crash atau koneksi database putus sebelum pesanan berhasil disimpan?'*  
> Akibatnya stok obat di database berkurang permanen tanpa ada bukti resep! Inilah kelemahan operasi atomic mandiri yang membawa kita ke Solusi 2."*

---

### Slide 7: 6 • Masa Sekarang: Solusi 2 (Database Transaction)
* **Pembicara:** Firsandi Andraw F.
* **Kicker:** `6 • MASA SEKARANG: SOLUSI 2`
* **Judul:** `MASA SEKARANG: SOLUSI 2`
* **Subjudul:** `Database Transaction (ACID): Menjamin 'All or Nothing'`
* **Konten:**
  * **Prinsip Transaksi:** Jaminan All or Nothing dengan Rollback.
  * **Alur Business Logic:** `BEGIN TRANSACTION` ➔ `SELECT FOR UPDATE` ➔ Kurangi stok ➔ Simpan pesanan ➔ `COMMIT` (atau `ROLLBACK` jika gagal).
  * **Keunggulan Integritas:** Kedua operasi berada dalam 1 kesatuan atomik ACID.
  * **Konsekuensi Performa:** Blocking / lock wait, potensi bottleneck pada konkurensi tinggi.

> **Naskah Firsandi:**  
> *"Solusi 2 adalah standar emas integritas data enterprise: **Database Transaction dengan Pessimistic Locking**.  
> Kita membungkus seluruh alur dalam blok `BEGIN TRANSACTION` dan `COMMIT`.  
>  
> Kuncinya ada pada baris kedua: `SELECT * FROM obats WHERE id = 1 FOR UPDATE`.  
> Klausa `FOR UPDATE` memerintahkan PostgreSQL untuk meletakkan *Exclusive Row Lock* pada baris obat tersebut. Jika Service #2 atau Service #3 mencoba membaca obat yang sama, PostgreSQL akan memaksa mereka mengantre sampai transaksi pertama selesai.  
>  
> Keunggulannya: Integritas data terjamin mutlak. Jika simpan pesanan gagal, stok kembali utuh via `ROLLBACK`.  
> Namun ada *trade-off* performa: proses lain yang harus menunggu (*blocking*) dapat menurunkan throughput sistem jika volume transaksi sangat masif."*

---

### Slide 8: 7 • Masa Sekarang: Solusi 3 (Optimistic Locking)
* **Pembicara:** Firsandi Andraw F.
* **Kicker:** `7 • MASA SEKARANG: SOLUSI 3`
* **Judul:** `MASA SEKARANG: SOLUSI 3`
* **Subjudul:** `Optimistic Locking: Deteksi Konflik Berbasis Nomor Versi`
* **Konten:**
  * **Konsep Kolom Versi:** Asumsi optimis konflik jarang terjadi. Menambahkan kolom `versi` pada tabel `obats`. Non-blocking read.
  * **Timeline Eksekusi:** Service #1 membaca (stok=1, v=5), Service #2 membaca (stok=1, v=5). Service #1 update ke v=6 (Sukses 1 row). Service #2 update dengan WHERE v=5 (Ditolak 0 row ➔ HTTP 409 Conflict).

> **Naskah Firsandi:**  
> *"Solusi ketiga adalah **Optimistic Locking**. Filosofi dasarnya: kita berasumsi sebagian besar transaksi tidak bertabrakan, sehingga data tidak perlu dikunci sama sekali. Pembacaan data bersifat bebas dan non-blocking.  
>  
> Mekanismenya menggunakan kolom integer `versi`.  
> Misalkan saat ini stok = 1 dan versi = 5.  
> Service #1 dan Service #2 membaca data yang sama.  
> Ketika Service #1 menyelesaikan transaksi, ia menjalankan `UPDATE obats SET stok = 0, versi = 6 WHERE id = 1 AND versi = 5`. PostgreSQL mengupdate 1 baris, transaksi sukses.  
>  
> Sekarang giliran Service #2 yang ingin menyimpan. Ia menjalankan query yang sama: `WHERE versi = 5`.  
> Namun karena versi di database sudah menjadi 6, kondisi klausa tersebut tidak terpenuhi! PostgreSQL mengembalikan 0 baris terpengaruh. Service #2 langsung mendeteksi adanya tabrakan dan membatalkan pesanan dengan status HTTP 409 Conflict.  
> Selanjutnya, rekan saya Rafif akan memaparkan bukti eksperimen nyata dan tantangan masa depan."*

---

### Slide 9: 8 • Bukti Eksperimen Nyata
* **Pembicara:** Ahmad Rafif Nandra U.
* **Kicker:** `8 • BUKTI EKSPERIMEN NYATA`
* **Judul:** `BUKTI EKSPERIMEN NYATA`
* **Subjudul:** `Hasil Uji Concurrency Paralel 3 Pembeli (Stok Awal = 1)`
* **Konten:** Tabel Komparasi Empiris 4 Skenario:
  1. *Naive:* 3x Berhasil (HTTP 200) ➔ 3 Pesanan Masuk ➔ Oversell fatal.
  2. *Atomic Operation:* 1x 200, 2x 400 Gagal ➔ 1 Pesanan Masuk ➔ Konsisten (SQL Conditional).
  3. *DB Transaction:* 1x 200, 2x 400 Gagal ➔ 1 Pesanan Masuk ➔ Konsisten (ACID Rollback).
  4. *Optimistic Locking:* 1x 200, 2x 409 Ditolak ➔ 1 Pesanan Masuk ➔ Konsisten (Version Check).

> **Naskah Rafif:**  
> *"Terima kasih Firsandi. Rekan-rekan sekalian, teori tidak akan lengkap tanpa validasi empiris.  
> Kami telah membangun Concurrency Benchmarking Simulator yang mengirimkan 3 request transaksi serempak di milidetik yang sama ke port 8001, 8002, dan 8003.  
>  
> Perhatikan tabel hasil eksperimen nyata ini:  
> Pada skenario Naive tanpa lock, ketiga request menghasilkan HTTP 200 OK. Terjadi **kebocoran stok fatal**: 3 pesanan tercipta untuk 1 botol obat!  
>  
> Sebaliknya, pada ketiga solusi yang kami tawarkan:  
> * **Atomic Operation:** 1 request berhasil (200), dan 2 request lainnya langsung digagalkan (400) oleh conditional update SQL.  
> * **Database Transaction:** 1 request berhasil (200), dan 2 request lainnya digagalkan secara bersih melalui mekanisme ACID.  
> * **Optimistic Locking:** 1 request berhasil (200), dan 2 request lainnya ditolak dengan HTTP 409 Conflict karena nomor versi berubah.  
>  
> Pada ketiga solusi, **stok akhir akurat dan konsisten 100%**: tepat 1 pesanan yang disetujui, dan stok fisik di lemari farmasi terlindungi seutuhnya."*

---

### Slide 10: 9 • Masa Depan (Next-Gen Distributed Systems)
* **Pembicara:** Ahmad Rafif Nandra U.
* **Kicker:** `9 • MASA DEPAN`
* **Judul:** `MASA DEPAN (NEXT-GEN DISTRIBUTED SYSTEMS)`
* **Subjudul:** `Tantangan Konkurensi Skala Lanjut (Database-per-Service)`
* **Konten 3 Kolom:**
  1. *Distributed Locks (Redis - Redlock):* Kunci lintas cluster in-memory ketika database dipecah.
  2. *Saga Pattern & Event-Driven:* Orkestrasi asinkron dengan Kafka/RabbitMQ dan compensating transactions.
  3. *Eventual Consistency & CQRS:* Pemisahan jalur baca dan tulis agar throughput mencapai puluhan ribu RPS.

> **Naskah Rafif:**  
> *"Lalu bagaimana jika sistem apotek kita berkembang ke skala hyper-scale dengan arsitektur Database-per-Service?  
> Ketika setiap microservice memiliki basis data fisiknya sendiri, transaksi database lokal PostgreSQL tidak lagi dapat menjangkau service lain.  
>  
> Untuk menjawab tantangan tersebut, kita menerapkan 3 arsitektur masa depan:  
> Pertama, **Distributed Locks menggunakan Redis dengan algoritma Redlock**, yang bertindak sebagai distributed lock manager di level in-memory lintas klaster.  
> Kedua, **Saga Pattern dengan Event Broker** (Apache Kafka atau RabbitMQ), di mana transaksi panjang dipecah menjadi event-event asinkron dengan mekanisme *compensating transactions* jika terjadi pembatalan.  
> Ketiga, **Eventual Consistency dan CQRS** (*Command Query Responsibility Segregation*), memisahkan server pembacaan katalog obat dengan server pemrosesan checkout agar aplikasi mampu menangani puluhan ribu transaksi per detik."*

---

### Slide 11: 10 • Kesimpulan & Q&A
* **Pembicara:** Ahmad Rafif Nandra U.
* **Kicker:** `10 • KESIMPULAN`
* **Judul:** `KESIMPULAN`
* **Subjudul:** `Panduan Pemilihan Strategi Konsistensi Data`
* **Konten:**
  * Rekomendasi 1: Pilih Operasi Atomic jika operasi hanya 1 tabel tunggal & butuh performa tercepat tanpa blocking.
  * Rekomendasi 2: Pilih DB Transaction jika melibatkan multi-tabel (stok + pesanan + audit) yang wajib All or Nothing.
  * Rekomendasi 3: Pilih Optimistic Locking jika beban read jauh lebih tinggi dari write & latensi user panjang.
  * Demo Link: `github.com/.../apotek-race-condition-pg`
  * Q&A Session.

> **Naskah Rafif:**  
> *"Sebagai kesimpulan dari presentasi kami hari ini, tidak ada satu solusi perak (*silver bullet*) untuk semua masalah; setiap arsitektur memiliki *trade-off*:  
> 1. **Pilih Operasi Atomic** jika pembaruan hanya terjadi pada satu tabel tunggal dan prioritas utama adalah kecepatan eksekusi tanpa overhead kunci.  
> 2. **Pilih Database Transaction** jika transaksi melibatkan banyak tabel yang wajib sukses bersamaan (*All or Nothing*) dalam satu basis data relational.  
> 3. **Pilih Optimistic Locking** untuk sistem yang didominasi oleh pembacaan (*read-heavy*), di mana pengguna mengisi formulir dalam durasi panjang dan tingkat tabrakan rendah.  
>  
> Seluruh kode implementasi Laravel, database schema PostgreSQL, serta simulator benchmarking dapat diakses pada repositori GitHub kami.  
> Sekian presentasi dari Kelompok 2. Kami membuka sesi tanya jawab bagi Bapak dosen dan rekan-rekan sekalian. Terima kasih."*
