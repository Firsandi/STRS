# 🎨 Standar Baku Presentasi & Dek Slide (Kelompok 2 - Fasilkom UNEJ)

Pedoman ini menjadi aturan permanen untuk pembuatan dek slide presentasi (.pptx) Sistem Terdistribusi dan tugas akademik lainnya.

---

## 1. Aturan Palet Warna: Clean Porcelain (Jangan Terlalu Warna-Warni)
Gunakan palet terkurasi, minimalis, dan berbobot profesional. Hindari elemen yang terlalu warna-warni seperti pelangi:
* **Background Slide:** *Crisp Porcelain Off-White* (`#F8FAFC` - Slate 50).
* **Card / Kontainer:** *Pure White* (`#FFFFFF`) dengan border halus garis rambut teknis (`#E2E8F0` - Slate 200).
* **Warna Aksen Utama (Primary):** *Royal Cobalt / Deep Navy* (`#1E40AF` atau `#2563EB`) untuk judul penting, badge, dan fokus utama.
* **Warna Aksen Pendukung (Subtle):** *Emerald* (`#059669`) untuk status sehat/berhasil, dan *Slate Dark* (`#0F172A`) untuk jendela kode.
* **Tipografi Teks Utama:** *Deep Charcoal / Slate 900* (`#0F172A`) untuk kontras tajam pada proyektor.
* **Teks Penjelas (Body):** *Slate 600* (`#475569`).

---

## 2. Aturan Hierarki Visual & Konten (Wajib di Setiap Slide)
Setiap slide presentasi WAJIB memiliki 4 elemen hierarki berikut:
1. **Eyebrow / Kicker Badge Kecil:**
   * Format: Huruf kapital (UPPERCASE), tebal (bold), warna aksen primary.
   * Contoh: `"ANALISIS ALGORITMA"`, `"ARSITEKTUR DISTRIBUSI"`, `"KILAS BALIK & BATASAN"`.
2. **Judul Utama (Title):**
   * Format: Tegas, ringkas, *to-the-point*, font size proporsional (16–22 pt).
3. **Subjudul / Problem Framing:**
   * Format: Tepat 1 kalimat penjelas kontekstual di bawah judul (9.5–11 pt, warna muted `#475569`).
4. **Speaker Notes (Catatan Pembicara):**
   * Format: Paragraf naskah bicara kata-per-kata yang mengalir alami, formal, dan siap dibaca presenter di mimbar.

---

## 3. Standar Komponen Khusus

### A. Alur Sekuensial (4-Step Horizontal Process Cards)
* **DILARANG** menggunakan list bullet vertikal yang monoton untuk menjelaskan alur kerja sistem.
* **WAJIB** menggunakan **4-Step Horizontal Process Cards** berjejer dari kiri ke kanan dengan:
  * Nomor step badge (misal: `STEP 01`, `STEP 02`, `STEP 03`, `STEP 04`).
  * Judul langkah yang tegas.
  * Penjelasan ringkas 2–3 baris.
  * Panah / indikator transisi antar-kartu.

### B. Perbandingan Kode (2-Column Terminal / IDE Window)
* Gunakan 2 kolom perbandingan bertema *Dark Terminal Box* (`#0F172A`) dengan header bar abu-abu (`#1E293B`).
* **Kolom Kiri:** Pola Naif / Standar Pembanding (misal: Pola Naif Eloquent Read-Modify-Write).
* **Kolom Kanan:** Implementasi Solutif Sistem Kita (misal: Database Transaction & Row-Level Lock `lockForUpdate()` di PostgreSQL & Laravel).

### C. Matriks Evaluasi & Komparasi Konsep
* Gunakan tabel komparasi atau kartu kontras tinggi untuk membandingkan konsep (misal: *Naif vs Atomic vs Transaction vs Optimistic*).

---

## 4. Bahasa & Gaya Penulisan
* Seluruh slide ditulis dalam **Bahasa Indonesia teknis yang presisi, baku, dan elegan**.
* Hindari istilah informal atau jargon asing yang mempersulit audiens (gunakan istilah fungsional yang mudah dipahami).
* Bebas emotikon / emoji di seluruh slide slidedeck PPTX.
