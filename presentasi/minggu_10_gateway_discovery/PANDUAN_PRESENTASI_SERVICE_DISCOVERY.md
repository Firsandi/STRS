# 📘 Panduan Lengkap Presentasi & Materi: Service Discovery & Interaksi Antar-Service
**Mata Kuliah: Sistem Terdistribusi — Fakultas Ilmu Komputer, Universitas Jember**  
**Dosen Pengampu: M. Zarkasi, S.Kom., M.Kom.**  
**Kelompok 2:**
1. **Ridho Rizky Prasetyo** (242410102055)
2. **Firsandi Andraw F.** (242410102056)
3. **Ahmad Rafif Nandra U.** (242410102018)

---

## 🎯 Struktur Alur Tampil Nanti Malam (Total ±15 Menit)

Alur presentasi dibagi menjadi 3 babak berurutan yang sangat rapi:
1. **Babak 1: Pemaparan Materi Slide (Slide 1 s.d. 10)**: Menjelaskan konsep teori, pengenalan anggota tim di Slide 2, batasan API Gateway minggu lalu vs Interaksi Antar-Service hari ini, studi kasus tanggap darurat wabah, akar masalah hardcoding, arsitektur Service Discovery, siklus hidup, dan alur pengiriman resep.
2. **Babak 2: Live Demo Pembuktian Sistem (Slide 11)**: Beralih ke terminal & browser untuk membuktikan materi yang baru saja dijelaskan secara langsung di depan dosen dan kelas.
3. **Babak 3: Evaluasi & Kesimpulan Pasca-Demo (Slide 12 s.d. 13)**: Menarik kesimpulan berdasarkan materi dan hasil demo tadi, memberikan jembatan materi minggu depan (*Load Balancing*), dan membuka sesi tanya jawab.

---

## 🖥️ BABAK 1: PEMAPARAN MATERI SLIDE (SLIDE 1 s.d. SLIDE 9)
### Estimasi Waktu: ±8 Menit

---

### Slide 1: Cover & Judul Utama
- **Pembicara:** Ridho Rizky Prasetyo
- **Tampilan Slide:** Judul *"Service Discovery: Fondasi Interaksi Dinamis Antar-Microservice"*, Subjudul Tanggap Darurat Wabah.

> **Naskah Ridho:**  
> *"Selamat malam Bapak M. Zarkasi dan rekan-rekan kelas Sistem Terdistribusi.  
> Malam ini kami dari Kelompok 2 mempresentasikan materi lanjutan sistem terdistribusi, yaitu **Service Discovery: Fondasi Interaksi Dinamis Antar-Microservice**. Kami mengangkat studi kasus layanan Rumah Sakit saat krisis wabah penyakit menular, di mana terjadi lonjakan resep pasien secara ekstrem yang memiliki pola komputasi serupa flash sale.  
>  
> Pada sesi pertama ini, kami akan memaparkan konsep materi dan arsitektur sistem terlebih dahulu. Setelah pemaparan materi tuntas, kita akan bersama-sama menguji pembuktiannya melalui live demo sistem, dan diakhiri dengan penarikan kesimpulan. Mari kita mulai."*

---

### Slide 2: Anggota Kelompok 2
- **Pembicara:** Ridho Rizky Prasetyo
- **Tampilan Slide:** 3 Kartu Anggota (Ridho Rizky Prasetyo, Firsandi Andraw F., Ahmad Rafif Nandra U.).

> **Naskah Ridho:**  
> *"Perkenalkan, tim kami terdiri dari 3 orang:  
> 1. Saya sendiri, **Ridho Rizky Prasetyo** (NIM 242410102055),  
> 2. Rekan saya, **Firsandi Andraw F.** (NIM 242410102056), dan  
> 3. Rekan saya, **Ahmad Rafif Nandra U.** (NIM 242410102018).  
>  
> Kami akan membagi pembahasan malam ini mulai dari arsitektur batasan masalah, krisis wabah, solusi Service Discovery, hingga live demo dan evaluasi kesimpulan."*

---

### Slide 3: Kilas Balik & Batasan Masalah (Akses Gateway vs Interaksi Antar-Service)
- **Pembicara:** Ridho Rizky Prasetyo
- **Tampilan Slide:** Kartu Kiri (Akses Klien ke Gateway) vs Kartu Kanan (Interaksi Langsung Antar-Service).

> **Naskah Ridho:**  
> *"Bapak dan rekan-rekan, pada pertemuan minggu lalu kita telah berhasil membuat API Gateway. Klien dari luar, seperti aplikasi web atau mobile dokter, mengakses sistem melalui satu pintu gerbang terpusat di `localhost:8000`.  
>  
> Namun muncul pertanyaan arsitektur mendasar: **Apakah pekerjaan sistem terdistribusi selesai hanya sampai API Gateway? Jawabannya: Belum.**  
> API Gateway hanya mengatur akses dari luar ke dalam pintu gerbang. Namun di dalam backend rumah sakit itu sendiri, terdapat lalu lintas yang jauh lebih sibuk, yaitu **komunikasi langsung antar-microservice**.  
>  
> Ketika dokter poli menyelesaikan resep pasien, Dokter Service harus berbicara langsung dengan tiga service pendukung: Apotek untuk penyiapan stok obat, Kasir untuk tagihan, dan Rekam Medis (EMR) untuk riwayat pasien.  
> Pertanyaan krusialnya: **Bagaimana Dokter Service tahu ke mana data resep harus dikirimkan jika alamat server Apotek berpindah atau port-nya dinamis?** Inilah masalah yang kita selesaikan hari ini menggunakan Service Discovery."*

---

### Slide 4: Skenario Krisis Layanan Kesehatan (Wabah / Outbreak Spike)
- **Pembicara:** Firsandi Andraw F.
- **Tampilan Slide:** 3 Box: 1. Kondisi Normal -> 2. Krisis Wabah (Spike) -> 3. Scale-Out Port Dinamis.

> **Naskah Firsandi:**  
> *"Terima kasih Ridho. Saya akan menjelaskan skenario studi kasus yang kami angkat.  
> Pada hari biasa, satu instance Apotek di port 8102 sudah sangat cukup melayani antrean poli reguler yang terprediksi.  
>  
> Namun, bagaimana jika tiba-tiba terjadi **Kejadian Luar Biasa (Wabah Musiman / Outbreak)**? Ratusan pasien infeksi akut membanjiri IGD dan Poli dalam hitungan menit. Karakteristik lonjakan beban ini persis seperti **Flash Sale** di industri e-commerce: lonjakan transaksi ekstrem yang tidak terduga (*unpredictable traffic spike*)!  
>  
> Akibatnya, server tunggal Apotek di port 8102 mengalami CPU 100%, kehabisan buffer memori, dan crash.  
> Untuk menanggulanginya, rumah sakit melakukan **scale-out darurat**: menyalakan unit Apotek baru di port dinamis acak, misalnya di port **:8105**.  
> Di sinilah tantangannya: Jika Dokter Service masih menggunakan konfigurasi lama, Dokter Service tidak akan pernah tahu keberadaan unit baru di port 8105 tersebut."*

---

### Slide 5: Akar Masalah Arsitektur (Kelemahan Fatal Komunikasi Hardcoded)
- **Pembicara:** Firsandi Andraw F.
- **Tampilan Slide:** Terminal anti-pattern hardcode, 3 kartu merah: Tight Coupling, Zero Scalability, Cascading Failure.

> **Naskah Firsandi:**  
> *"Inilah bukti kelemahan mendasar jika kita masih menanamkan alamat IP atau port fisik di dalam kode aplikasi (*hardcoded*):  
> Di dalam kode Dokter Service, alamat Apotek ditulis kaku: `http://localhost:8102/api/apotek/sync`.  
>  
> Dampak fatalnya ada tiga:  
> 1. **Tight Coupling (Keterikatan Fisik Kaku):** Kode aplikasi terikat mati dengan alamat jaringan server fisik.  
> 2. **Zero Scalability Awareness:** Dokter Service buta terhadap unit Apotek baru yang baru saja dinyalakan di port 8105 saat krisis wabah.  
> 3. **Cascading Failure:** Ketika port 8102 crash, pemanggilan dari dokter menghasilkan `ConnectionRefusedError`. Thread dokter tersumbat (*thread starvation*), resep obat darurat gagal terkirim, dan kegagalan merembet ke sistem kasir serta rekam medis. Seluruh operasional rumah sakit lumpuh."*

---

### Slide 6: Solusi Fundamental (Service Discovery Pattern: Buku Telepon Dinamis)
- **Pembicara:** Ahmad Rafif Nandra U.
- **Tampilan Slide:** 3 Komponen: Service Provider, Service Registry, Service Consumer.

> **Naskah Rafif:**  
> *"Solusi ilmiah untuk mengatasi problem alamat dinamis tersebut adalah **Service Discovery Pattern**.  
> Analogi paling mudahnya adalah **Buku Telepon Kuning Dinamis (Yellow Pages)**.  
>  
> Pola ini memisahkan identitas logis dari alamat fisik jaringan dengan 3 entitas utama:  
> 1. **Service Provider (Apotek/Kasir/EMR):** Saat unit apotek baru di port 8105 menyala, ia langsung melapor ke Registry: 'Halo, saya APOTEK-SERVICE, saat ini saya aktif di http://localhost:8105'.  
> 2. **Service Registry (Eureka / Registry Server :8761):** Menjadi basis data terpusat (*Single Source of Truth*) yang mencatat daftar seluruh service yang aktif dan sehat.  
> 3. **Service Consumer (Dokter Service):** Tidak lagi menyimpan port fisik siapapun. Dokter cukup bertanya: 'Siapa instance aktif untuk nama APOTEK-SERVICE?'. Registry mengembalikan alamat yang valid, barulah data resep dikirimkan."*

---

### Slide 7: Mekanisme Operasional (Empat Siklus Hidup Layanan)
- **Pembicara:** Ahmad Rafif Nandra U.
- **Tampilan Slide:** 4 Siklus: 01 Registration, 02 Heartbeat, 03 Lookup, 04 Eviction.

> **Naskah Rafif:**  
> *"Bagaimana Registry menjamin bahwa katalognya selalu akurat dan tidak ada data resep yang nyasar? Melalui 4 siklus hidup:  
> 1. **Registration (Pendaftaran Awal):** Instance baru mengirimkan HTTP POST mendaftarkan Service ID dan URL fisiknya saat pertama kali menyala.  
> 2. **Heartbeat / Keep-Alive:** Ini adalah denyut nadi. Setiap 10 hingga 30 detik, instance wajib mengirim ping ke Registry. Jika ping masuk, berarti server dan jaringannya sehat.  
> 3. **Lookup / Resolution:** Saat dokter menyelesaikan resep, Dokter Service melakukan query pencarian alamat aktif ke Registry.  
> 4. **Eviction / Self-Healing:** Jika sebuah server mati atau kehabisan memori sehingga berhenti mengirim heartbeat, Registry secara otomatis mencoretnya dari katalog agar resep tidak dikirim ke server rusak."*

---

### Slide 8: Pilihan Arsitektur (Client-Side vs Server-Side Discovery)
- **Pembicara:** Ridho Rizky Prasetyo
- **Tampilan Slide:** Perbandingan Model 1: Client-Side vs Model 2: Server-Side.

> **Naskah Ridho:**  
> *"Dalam teori sistem terdistribusi, ada dua model implementasi Service Discovery:  
>  
> **Model 1: Client-Side Discovery (Pendekatan yang Kita Gunakan & Netflix Eureka):**  
> Service konsumen (Dokter) sendiri yang bertanya langsung ke Registry, lalu melakukan pemanggilan HTTP langsung ke Apotek. Keunggulannya: performanya sangat cepat karena tanpa perantara (*zero additional network hops*).  
>  
> **Model 2: Server-Side Discovery (Seperti Kubernetes CoreDNS / AWS ALB):**  
> Konsumen memanggil router/proxy perantara, lalu router itulah yang bertanya ke registry dan meneruskannya ke target. Keunggulannya: kode klien sangat sederhana dan agnostik bahasa, namun menambah 1 network hop perantara."*

---

### Slide 9: Desain Arsitektur Sistem (Alur Resep Dokter ke Apotek, Kasir, EMR)
- **Pembicara:** Firsandi Andraw F.
- **Tampilan Slide:** Sequence flow 4 langkah pengiriman resep.

> **Naskah Firsandi:**  
> *"Slide ini menggambarkan alur kerja sistem kami:  
> 1. Dokter menginput resep obat darurat pasien wabah `RSP-WABAH-9921` di Poli.  
> 2. Sebelum payload dikirim, Dokter Service melakukan lookup ke Registry di port 8761 menanyakan lokasi `APOTEK-SERVICE`.  
> 3. Registry mengembalikan URL aktif unit darurat di port `:8105`.  
> 4. Dokter Service langsung mentransfer data resep ke port 8105 tersebut dengan status **HTTP 200 OK**, tanpa bergantung pada port statis yang sudah mati."*

---

### Slide 10: Implementasi & Kode Sumber (Spring Cloud Java & Sistem Demo)
- **Pembicara:** Firsandi Andraw F.
- **Tampilan Slide:** Cuplikan Java Spring Cloud (@EnableEurekaServer) di kiri vs Python Daemon Heartbeat di kanan.

> **Naskah Firsandi:**  
> *"Untuk menjaga kesinambungan dengan Spring Cloud Gateway minggu lalu, di sebelah kiri kami sertakan konfigurasi standar Spring Cloud Netflix Eureka di Java menggunakan anotasi `@EnableEurekaServer`.  
> Dan di sebelah kanan adalah implementasi konkret yang menggerakkan sistem kita di file `client_helper.py`, di mana proses registrasi dan pengiriman heartbeat dijalankan otomatis oleh background daemon thread tanpa memblokir thread transaksi medis."*

---

## 🧪 BABAK 2: LIVE DEMO PEMBUKTIAN SISTEM (SLIDE 11)
### Estimasi Waktu: ±4 Menit

### Transisi di Proyektor (Slide 11):
- **Tampilan Slide 11:** Judul *"Live Demo: Pembuktian Teori pada Sistem Nyata"* berisi 3 fase pengujian:
  - Fase 1: Masalah Hardcode saat Server Crash
  - Fase 2: Scale-Out Unit Dinamis :8105
  - Fase 3: Dynamic Lookup & Transmisi Sukses

> **Skrip Ridho (Transisi ke Demo):**  
> *"Bapak M. Zarkasi dan rekan-rekan, seluruh teori dan arsitektur telah selesai kami paparkan. Sekarang, mari kita buktikan secara nyata di sistem melalui **Live Demo** sebelum kita menarik kesimpulan akhir.  
> Saya persilakan rekan saya Firsandi dan Rafif untuk mendemonstrasikan sistem di layar terminal dan browser."*

---

### Langkah Eksekusi Demo di Terminal:
Presenter beralih ke jendela Terminal dan menjalankan:
```bash
python3 simulasi_interaksi_service.py
```
*(Buka browser di proyektor menampilkan: `http://localhost:8761`)*

#### Demo Fase 1: Kegagalan Komunikasi Hardcoded (Presenter: Firsandi)
*(Tekan [ENTER] di terminal untuk Fase 1)*
> **Skrip Firsandi:**  
> *"Mari kita buktikan Fase 1. Skenarionya: Terjadi lonjakan pasien wabah. Server Apotek lama di port 8102 mati karena buffer overflow.  
> Ketika Dokter Service menembak port statis 8102, perhatikan log terminal: **ConnectionRefusedError!** Resep gagal terkirim dan transaksi macet. Ini membuktikan kelemahan fatal hardcoding yang kita bahas di Slide 5 tadi."*

#### Demo Fase 2: Scale-Out Port Dinamis & Auto Registration (Presenter: Firsandi)
*(Tekan [ENTER] di terminal untuk Fase 2)*
> **Skrip Firsandi:**  
> *"Sekarang Fase 2: Rumah sakit mengaktifkan unit Apotek darurat di port dinamis acak **:8105**.  
> Begitu unit menyala, ia langsung mendaftarkan dirinya ke Service Registry (:8761).  
> Perhatikan Dashboard Web Registry di browser sebelah kanan: nama `APOTEK-SERVICE` langsung muncul berstatus **UP** di port 8105 dengan heartbeat aktif!"*

#### Demo Fase 3: Dynamic Lookup & Resep Sukses (Presenter: Rafif)
*(Tekan [ENTER] di terminal untuk Fase 3)*
> **Skrip Rafif:**  
> *"Sekarang Fase 3: Dokter Poli menerbitkan resep darurat wabah `RSP-WABAH-9921`. Dokter Service tidak lagi menembak port buta, melainkan bertanya ke Registry: 'Siapa instance aktif untuk APOTEK-SERVICE?'.  
> Registry mengembalikan URL `http://localhost:8105`.  
> Dokter Service mentransfer payload ke port 8105 tersebut. Hasilnya: **HTTP 200 OK — Resep obat wabah sukses diterima oleh unit farmasi darurat!**"*

---

## 📊 BABAK 3: EVALUASI & KESIMPULAN PASCA-DEMO (SLIDE 12 & SLIDE 13)
### Estimasi Waktu: ±3 Menit

*(Presenter kembali membuka slide proyektor ke **Slide 12**)*

---

### Slide 12: Matriks Evaluasi Pasca-Demo
- **Pembicara:** Ahmad Rafif Nandra U.
- **Tampilan Slide:** Tabel Matriks Komparasi 5 Parameter.

> **Naskah Rafif:**  
> *"Bapak dan rekan-rekan, demo tadi telah berhasil membuktikan secara nyata teori yang kita bahas:  
> 1. **Keterikatan Alamat:** Berubah dari keterikatan fisik kaku menjadi keterikatan logis yang fleksibel (*loose coupling*).  
> 2. **Skalabilitas saat Wabah:** Menjadi sangat elastis, unit baru di port acak langsung dikenali otomatis.  
> 3. **Downtime Deployment:** Berkurang menjadi *zero downtime*.  
> 4. **Penanganan Kegagalan:** Sistem memiliki kemampuan pemulihan mandiri (*self-healing*) dan terhindar dari cascading failure."*

---

### Slide 13: Kesimpulan Akhir & Jembatan ke Materi Minggu Depan
- **Pembicara:** Ridho Rizky Prasetyo
- **Tampilan Slide:** Kartu Hijau (Kesimpulan Hari Ini) & Kartu Cyan (Jembatan Minggu Depan: Load Balancing).

> **Naskah Ridho:**  
> *"Sebagai kesimpulan akhir dari pemaparan materi dan demonstrasi kelompok kami hari ini:  
> 1. Komunikasi langsung antar-service tidak boleh bergantung pada IP dan Port statis.  
> 2. Service Registry bertindak sebagai Single Source of Truth katalog kesehatan layanan.  
> 3. Service Discovery berhasil menjawab tuntas pertanyaan lokasi: **'DI MANA alamat service yang saat ini sedang aktif dan sehat?'**  
>  
> **Jembatan Menuju Materi Minggu Depan:**  
> Hari ini kita telah berhasil mengetahui bahwa ada beberapa unit Apotek yang sama-sama aktif di port 8102 dan 8105.  
> Namun muncul pertanyaan baru yang sangat krusial:  
> **'Jika ada beberapa unit Apotek yang sama-sama sehat, unit mana yang harus menerima resep dari Dokter A dan Dokter B agar bebannya terbagi rata?'**  
>  
> Pertanyaan inilah yang membawa kita ke topik pertemuan minggu depan: **LOAD BALANCING** (Round Robin, Weighted, Least Connections).  
>  
> Sekian presentasi dan demonstrasi dari Kelompok 2. Kami mengundang masukan dan pertanyaan dari Bapak M. Zarkasi dan rekan-rekan sekalian. Terima kasih!"*

---

## 🛡️ BABAK 4: BANK TANYA JAWAB DOSEN (Q&A DEFENSE)

1. **"Kenapa tadi di demo terjadi ConnectionRefusedError di port 8102?"**  
   > *Jawaban:* "Karena port 8102 sengaja kami matikan untuk mensimulasikan kegagalan server akibat kelebihan beban memori dan CPU saat krisis wabah. Ini membuktikan bahwa tanpa Service Discovery, klien tidak tahu adanya unit darurat baru dan langsung mengalami kegagalan."

2. **"Kenapa studi kasusnya Tanggap Darurat Wabah?"**  
   > *Jawaban:* "Karena dalam domain layanan kesehatan, krisis wabah menular adalah kondisi paling ekstrem yang memicu fenomena lonjakan transaksi mendadak (*unpredictable traffic spike*) yang secara karakteristik komputasi identik dengan event flash sale di e-commerce. Kasus ini membuktikan kebutuhan nyata horizontal auto-scaling dan port dinamis di rumah sakit."

3. **"Bagaimana jika Service Registry-nya yang mati (Single Point of Failure)?"**  
   > *Jawaban:* "Dalam standar industri, klien menyimpan salinan *Client-Side Cache* daftar service terakhir. Selain itu, Registry di-deploy secara *High-Availability Cluster* (misal multi-node Eureka peer-to-peer atau Consul Raft consensus)."

4. **"Kenapa Load Balancing belum kalian terapkan di sini?"**  
   > *Jawaban:* "Sesuai silabus perkuliahan Bapak, materi hari ini kami fokuskan murni pada Service Discovery (registrasi, heartbeat, dan resolusi alamat). Mekanisme pembagian bebannya secara spesifik menggunakan algoritma Load Balancing telah kami jadwalkan untuk dipresentasikan minggu depan, Pak."
