# 📘 Panduan Lengkap Presentasi: Load Balancing Multi-Instance
**Mata Kuliah: Sistem Terdistribusi — Fakultas Ilmu Komputer, Universitas Jember**  
**Dosen Pengampu: M. Zarkasi, S.Kom., M.Kom.**  
**Kelompok 2:**
1. **Ridho Rizky Prasetyo** (242410102055)
2. **Firsandi Andraw F.** (242410102056)
3. **Ahmad Rafif Nandra U.** (242410102018)

---

## 🎯 Struktur Alur Tampil (Total ±15 Menit)

Alur presentasi dibagi menjadi 3 babak berurutan yang sangat rapi:
1. **Babak 1: Pemaparan Materi Slide (Slide 1 s.d. 9)**: Kilas balik Service Discovery, rumusan masalah hotspot, skenario krisis beban poli, taksonomi Client-Side vs Server-Side LB, algoritma modulo Round-Robin, algoritma lanjutan, 4-step workflow, dan komparasi kode Spring Cloud vs Python.
2. **Babak 2: Live Demo Pembuktian Multi-Port (Slide 10)**: Beralih ke Postman & Browser Registry untuk membuktikan rotasi request 50:50 antara Apotek `:8102` dan `:8105` serta auto-failover.
3. **Babak 3: Evaluasi & Kesimpulan (Slide 11 s.d. 12)**: Menarik kesimpulan berdasarkan matriks evaluasi, memberikan jembatan materi berikutnya (*Circuit Breaker*), dan membuka sesi tanya jawab.

---

## 🖥️ BABAK 1: PEMAPARAN MATERI SLIDE (SLIDE 1 s.d. SLIDE 9)
### Estimasi Waktu: ±8 Menit

---

### Slide 1: Cover & Judul Utama
- **Pembicara:** Ridho Rizky Prasetyo
- **Tampilan Slide:** Judul *"Load Balancing: Distribusi Trafik Cerdas Multi-Instance"*, Subjudul Penanganan Lonjakan Pasien.

> **Naskah Ridho:**  
> *"Selamat malam Bapak M. Zarkasi dan rekan-rekan kelas Sistem Terdistribusi.  
> Malam ini kami dari Kelompok 2 mempresentasikan materi lanjutan sistem terdistribusi, yaitu **Load Balancing: Distribusi Trafik Cerdas Multi-Instance**. Kami mengangkat studi kasus layanan Rumah Sakit saat krisis lonjakan antrean pasien poli, di mana terjadi penumpukan transaksi resep secara ekstrem.  
>  
> Pada sesi pertama ini, kami akan memaparkan konsep teori, arsitektur, dan algoritma penyeimbang beban. Setelah itu, kita akan membuktikannya secara langsung melalui live demo multi-instance via Postman, dan diakhiri dengan kesimpulan serta jembatan materi minggu depan. Mari kita mulai."*

---

### Slide 2: Anggota Kelompok 2
- **Pembicara:** Ridho Rizky Prasetyo
- **Tampilan Slide:** 3 Kartu Anggota (Ridho, Firsandi, Rafif).

> **Naskah Ridho:**  
> *"Perkenalkan, tim kami terdiri dari 3 orang:  
> 1. Saya sendiri, **Ridho Rizky Prasetyo** (NIM 242410102055),  
> 2. Rekan saya, **Firsandi Andraw F.** (NIM 242410102056), dan  
> 3. Rekan saya, **Ahmad Rafif Nandra U.** (NIM 242410102018).  
>  
> Pembahasan malam ini akan kami bagi secara berimbang mulai dari rumusan masalah hotspot beban, formula matematis modulo, 4-tahap alur kerja, hingga live demo rotasi request."*

---

### Slide 3: Kilas Balik & Rumusan Masalah
- **Pembicara:** Ridho Rizky Prasetyo
- **Tampilan Slide:** Capaian Service Discovery di kiri vs Rumusan Masalah Baru Load Balancing di kanan.

> **Naskah Ridho:**  
> *"Bapak dan rekan-rekan, pada pertemuan sebelumnya kita telah berhasil menerapkan Service Discovery. Katalog Registry (Eureka/Consul) sukses mencatat alamat instance yang aktif, misalnya instance Apotek di port 8102 dan 8105.  
>  
> Namun muncul pertanyaan arsitektur yang sangat krusial: **Apakah Service Discovery otomatis membagi beban? Jawabannya: Belum.**  
> Service Discovery hanya menjawab pertanyaan lokasi: *'Di mana server yang sehat?'*. Tetapi jika klien selalu menembak instance pertama (port 8102), server tersebut akan tetap mengalami CPU 100% dan crash, sedangkan instance kedua di port 8105 menganggur tanpa pekerjaan (*idle*).  
> Inilah rumusan masalah kita: **Bagaimana mendistribusikan aliran request secara adil, proporsional, dan simetris ke seluruh replika sehat?** Jawabannya adalah Load Balancing."*

---

### Slide 4: Skenario Krisis Beban (Studi Kasus Rumah Sakit)
- **Pembicara:** Firsandi Andraw F.
- **Tampilan Slide:** 3 Box: Lonjakan Ratusan Resep -> Server 8102 Overload -> Replikasi & Load Balancer.

> **Naskah Firsandi:**  
> *"Terima kasih Ridho. Saya akan menjelaskan skenario darurat yang kami angkat.  
> Bayangkan saat terjadi krisis kesehatan di poli rumah sakit: ratusan pasien infeksi akut datang bersamaan. Para dokter menerbitkan resep obat dalam hitungan menit secara serentak.  
> Jika seluruh request dokter menumpuk hanya pada satu server Apotek di port 8102, buffer memori server akan penuh, response time anjlok hingga lag puluhan detik, dan akhirnya mengalami connection timeout.  
> Solusinya: Kita menjalankan replika instance Apotek kedua di port 8105, lalu menempatkan Load Balancer yang membagi aliran resep secara seimbang 50:50. Kapasitas sistem berlipat ganda dan antrean pasien tetap lancar."*

---

### Slide 5: Taksonomi Arsitektur (Client-Side vs Server-Side LB)
- **Pembicara:** Firsandi Andraw F.
- **Tampilan Slide:** Komparasi Model 1 (Server-Side) vs Model 2 (Client-Side).

> **Naskah Firsandi:**  
> *"Dalam teori sistem terdistribusi, terdapat dua paradigma Load Balancing:  
> 1. **Server-Side Load Balancing:** Contohnya Nginx, AWS ALB, atau API Gateway. Klien luar hanya menembak satu pintu gerbang, lalu gateway yang membagi request ke backend. Keunggulannya: kode klien sangat sederhana. Konsekuensinya: ada penambahan 1 network hop perantara.  
> 2. **Client-Side Load Balancing:** Contohnya Spring Cloud LoadBalancer atau modul dispatching Python kita. Service pemanggil (Dokter) sendiri yang mengambil daftar server aktif dari Registry dan mengeksekusi algoritma pemilihan instance. Keunggulannya: zero additional network hop, latensi antar-service sangat rendah.  
> Sistem rumah sakit kami menerapkan **kombinasi kedua tingkatan ini**: Server-side di Gateway untuk klien luar, dan Client-side di Dokter Service untuk pengiriman resep antar-backend."*

---

### Slide 6: Algoritma Load Balancing I (Round-Robin Native)
- **Pembicara:** Ahmad Rafif Nandra U.
- **Tampilan Slide:** Formula Modulo: `index = (counter) % N` dan simulasi 4 request.

> **Naskah Rafif:**  
> *"Bagaimana cara Load Balancer membagi request secara merata? Algoritma paling fundamental dan teruji adalah **Round-Robin Native**.  
> Prinsip matematisnya sangat sederhana dan elegan, yaitu menggunakan **operator modulo (%)**:  
> `index = (request_counter) % N`  
> Di mana N adalah jumlah instance aktif yang berstatus UP.  
>  
> Sebagai contoh, jika kita memiliki 2 instance Apotek (N=2):  
> - Request 1 (counter 0): 0 % 2 = 0 -> diarahkan ke Apotek 1 (port 8102).  
> - Request 2 (counter 1): 1 % 2 = 1 -> diarahkan ke Apotek 2 (port 8105).  
> - Request 3 (counter 2): 2 % 2 = 0 -> kembali ke Apotek 1 (port 8102).  
>  
> Keunggulannya: Kompleksitas waktunya adalah O(1) konstan, tidak membebani memori, dan menjamin pembagian beban tepat 50% : 50%."*

---

### Slide 7: Algoritma Lanjutan (Weighted, Least Connections, IP Hash)
- **Pembicara:** Ahmad Rafif Nandra U.
- **Tampilan Slide:** 3 Box: Weighted Round-Robin, Least Connections, IP Hash.

> **Naskah Rafif:**  
> *"Lalu bagaimana jika kondisi di lapangan tidak seragam? Kita bisa menggunakan 3 algoritma heuristik lanjutan:  
> 1. **Weighted Round-Robin:** Jika Rumah Sakit memiliki satu server baru 16-Core dan satu server lama 4-Core, kita memberi bobot 3:1 sehingga server kuat memproses 3x lebih banyak resep.  
> 2. **Least Connections:** Menghitung jumlah koneksi aktif secara real-time. Request baru dikirim ke instance yang sedang paling longgar. Sangat cocok jika ada resep racikan obat yang butuh komputasi lama.  
> 3. **IP Hash / Session Affinity:** Mengunci request dari dokter atau pasien yang sama ke instance yang sama, memaksimalkan efisiensi in-memory cache."*

---

### Slide 8: 4-Step Horizontal Workflow
- **Pembicara:** Firsandi Andraw F.
- **Tampilan Slide:** 4-Step Horizontal Process Cards (Client Request -> Registry Lookup -> Modulo Selection -> Dispatch).

> **Naskah Firsandi:**  
> *"Slide ini menggambarkan alur kerja sistem kami dari hulu ke hilir:  
> - **Step 01:** Aplikasi Dokter mengirim transaksi resep via HTTP ke API Gateway di port 8000.  
> - **Step 02:** Gateway query ke Eureka Registry di port 8761 menanyakan instance Apotek yang sedang UP.  
> - **Step 03:** Algoritma Round-Robin mengeksekusi perhitungan modulo untuk memilih giliran instance berikutnya.  
> - **Step 04:** Request di-forward ke instance terpilih (:8102 atau :8105) dan mengembalikan respons HTTP 200 OK dengan atribut `handled_by`."*

---

### Slide 9: Source Code Comparison (Java vs Python)
- **Pembicara:** Firsandi Andraw F.
- **Tampilan Slide:** 2 Kolom Terminal: Spring Cloud Java di kiri vs Python Native Modulo di kanan.

> **Naskah Firsandi:**  
> *"Untuk membandingkan dengan standar industri, di sebelah kiri kami tunjukkan implementasi deklaratif Java Spring Cloud menggunakan prefiks `lb://` dan anotasi `@LoadBalanced`.  
> Sedangkan di sebelah kanan adalah kode nyata yang menggerakkan sistem kita di `registry_server.py`, di mana perputaran indeks `round_robin_idx % len(instances)` dijalankan secara native dan mengembalikan instance terpilih secara bergiliran."*

---

## 🧪 BABAK 2: LIVE DEMO PEMBUKTIAN SISTEM (SLIDE 10)
### Estimasi Waktu: ±4 Menit

### Transisi di Proyektor (Slide 10):
- **Presenter:** Ahmad Rafif Nandra U.
- **Tampilan Slide 10:** Judul *"Pembuktian Multi-Port: Apotek Instance :8102 & :8105"*.

> **Skrip Rafif (Transisi ke Demo):**  
> *"Bapak M. Zarkasi dan rekan-rekan, seluruh teori dan algoritma telah kami paparkan. Sekarang mari kita buktikan secara empiris pembagian beban 50:50 ini secara langsung di Postman dan terminal."*

---

### Langkah Eksekusi Demo:
1. **Layar Kiri:** Buka Browser di `http://localhost:8761` (Tunjukkan ke dosen bahwa `APOTEK-SERVICE` memiliki 2 instance aktif: `apotek-8102` dan `apotek-8105`).
2. **Layar Kanan:** Buka **Postman**, pilih request:
   `GET http://localhost:8000/api/apotek/antrean`

#### Pengujian 1: Rotasi Beban 50:50
- Klik **Send** ke-1: Perhatikan Body JSON $\rightarrow$ `"handled_by": "apotek-8102"`.
- Klik **Send** ke-2: Perhatikan Body JSON $\rightarrow$ `"handled_by": "apotek-8105"`.
- Klik **Send** ke-3: Perhatikan Body JSON $\rightarrow$ `"handled_by": "apotek-8102"`.
- Klik **Send** ke-4: Perhatikan Body JSON $\rightarrow$ `"handled_by": "apotek-8105"`.

> **Skrip Rafif:**  
> *"Perhatikan di layar Postman: Klien hanya menembak port tunggal Gateway 8000. Setiap kali kami klik Send, atribut `handled_by` dan header `X-Upstream-URL` berganti secara teratur antara port 8102 dan 8105. Ini membuktikan bahwa algoritma Round-Robin modulo berhasil membagi beban tepat 50:50!"*

#### Pengujian 2: Auto-Failover saat Server Mati
- Di terminal Apotek 8102, tekan `Ctrl + C` (matikan server 8102).
- Kembali ke Postman, klik **Send** 3 kali berturut-turut.
- Hasil: Seluruh request 100% dialihkan ke `"handled_by": "apotek-8105"` tanpa error!

> **Skrip Rafif:**  
> *"Ketika Apotek 8102 mati, Load Balancer bersinergi dengan Service Discovery langsung mengalihkan 100% traffic ke Apotek 8105. Klien tidak mengalami error dan layanan farmasi tetap online!"*

---

## 📊 BABAK 3: EVALUASI & KESIMPULAN (SLIDE 11 & SLIDE 12)
### Estimasi Waktu: ±3 Menit

---

### Slide 11: Matriks Evaluasi Kinerja Arsitektur
- **Pembicara:** Ahmad Rafif Nandra U.
- **Tampilan Slide:** Tabel Matriks 5 Parameter Komparasi.

> **Naskah Rafif:**  
> *"Berdasarkan hasil pengujian tadi, tabel evaluasi membuktikan bahwa:  
> 1. Throughput sistem meningkat dua kali lipat seiring bertambahnya replika.  
> 2. Latensi tetap stabil rendah meskipun antrean resep melonjak.  
> 3. Risiko Single Point of Failure berhasil dihilangkan berkat mekanisme auto-failover."*

---

### Slide 12: Kesimpulan Akhir & Jembatan ke Circuit Breaker
- **Pembicara:** Ridho Rizky Prasetyo
- **Tampilan Slide:** Kartu Hijau (Kesimpulan Load Balancing) & Kartu Biru (Jembatan Materi: Circuit Breaker).

> **Naskah Ridho:**  
> *"Sebagai kesimpulan akhir:  
> 1. Load Balancing berhasil menghilangkan titik hotspot kemacetan pada server rumah sakit.  
> 2. Algoritma Round-Robin native modulo terbukti sangat efisien dengan kompleksitas O(1).  
> 3. Sinergi antara Service Discovery dan Load Balancing menghasilkan sistem yang elastis dan tangguh.  
>  
> **Jembatan Menuju Materi Minggu Depan:**  
> Round-Robin membagi request dengan asumsi seluruh server merespons cepat. Namun, bagaimana jika sebuah server tidak mati total, melainkan mengalami *koma atau lag* hingga 30 detik? Bukankah Round-Robin tetap akan mengirim resep ke server yang lambat tersebut dan membuat antrean macet?  
> Pertanyaan krusial inilah yang mengantarkan kita ke materi minggu depan: **CIRCUIT BREAKER (Resilience4j / Hystrix)** untuk memutus arus ke server yang sedang sakit!  
>  
> Sekian presentasi dari Kelompok 2. Kami mengundang pertanyaan dan masukan dari Bapak M. Zarkasi dan rekan-rekan. Terima kasih!"*

---

## 🛡️ BABAK 4: BANK TANYA JAWAB DOSEN (Q&A DEFENSE)

1. **"Apa perbedaan mendasar antara Service Discovery dan Load Balancing?"**  
   *Jawaban:* Service Discovery bertugas sebagai buku telepon (menjawab *'Di mana alamat server yang aktif?'*), sedangkan Load Balancing bertugas sebagai polisi lalu lintas (menjawab *'Jika ada 2 server yang sama-sama aktif, server mana yang harus melayani request ini?'*). Load Balancing dinamis tidak bisa berjalan tanpa Service Discovery.

2. **"Kenapa memilih algoritma Round-Robin dan bukan Least Connections?"**  
   *Jawaban:* Pada transaksi pemrosesan resep medis, ukuran payload dan waktu eksekusinya relatif seragam (CPU-bound ringan). Round-Robin memiliki keunggulan kompleksitas O(1) tanpa perlu melacak status koneksi yang memakan overhead CPU/memori tambahan.

3. **"Bagaimana jika session login pasien hilang saat dipindah ke server kedua?"**  
   *Jawaban:* Sistem kami dirancang *stateless*. Data resep dan autentikasi tidak disimpan di memory lokal server, melainkan di basis data/cache terpusat, sehingga request bebas diarahkan ke server mana pun tanpa kehilangan konteks.
