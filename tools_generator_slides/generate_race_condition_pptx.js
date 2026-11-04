const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
pptx.author = 'Kelompok 2 - Sistem Terdistribusi UNEJ';
pptx.company = 'Fakultas Ilmu Komputer, Universitas Jember';
pptx.title = 'Konsistensi Data & Race Condition: Multi-Instance Layanan Apotek dengan PostgreSQL';

// --- Color Palette: Clean Porcelain ---
const C = {
  bg: 'F8FAFC',          // Crisp Porcelain Off-White (Slate 50)
  cardBg: 'FFFFFF',      // Pure White Card
  cardBorder: 'E2E8F0',  // Subtle Technical Hairline (Slate 200)
  cardBorderActive: '3B82F6', // Blue 500 active
  primary: '1E40AF',     // Deep Royal Cobalt / Navy
  primaryDark: '1E3A8A', // Navy 900
  primaryLight: 'EFF6FF',// Soft Blue 50 for Pills / Badges
  textDark: '0F172A',    // Deep Charcoal / Slate 900
  textMuted: '475569',   // Slate 600
  textFaint: '64748B',   // Slate 500
  terminalBg: '0F172A',  // Slate 900
  terminalBar: '1E293B', // Slate 800
  terminalText: 'F1F5F9',
  codeCyan: '38BDF8',
  codeGreen: '4ADE80',
  codeYellow: 'FACC15',
  alertBg: 'FEF2F2',     // Soft Red 50
  alertBorder: 'FECACA', // Red 200
  alertText: 'DC2626',   // Red 600
  successBg: 'ECFDF5',   // Soft Emerald 50
  successBorder: 'A7F3D0',// Emerald 200
  successText: '059669', // Emerald 600
  neutralBox: 'F1F5F9',  // Slate 100
};

const FONT_HEAD = 'DejaVu Sans';
const FONT_BODY = 'DejaVu Sans';
const FONT_CODE = 'DejaVu Sans Mono';

// Helper: Standard Slide Header (Eyebrow Badge, Title, Subtitle)
function addHeader(slide, eyebrow, title, subtitle) {
  // Eyebrow / Kicker Badge
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.45, w: 2.8, h: 0.32,
    fill: { color: C.primaryLight },
    line: { color: 'DBEAFE', width: 1 },
    rectRadius: 0.08
  });
  slide.addText(eyebrow.toUpperCase(), {
    x: 0.8, y: 0.45, w: 2.8, h: 0.32,
    fontSize: 9, bold: true, color: C.primary, fontFace: FONT_HEAD,
    align: 'center', valign: 'middle'
  });

  // Main Title
  slide.addText(title, {
    x: 0.8, y: 0.85, w: 8.4, h: 0.55,
    fontSize: 20, bold: true, color: C.textDark, fontFace: FONT_HEAD,
    valign: 'top'
  });

  // Subtitle / Problem Framing (1 contextual sentence)
  slide.addText(subtitle, {
    x: 0.8, y: 1.4, w: 8.4, h: 0.35,
    fontSize: 10, italic: false, color: C.textMuted, fontFace: FONT_BODY,
    valign: 'top'
  });
}

// Helper: Base slide with Clean Porcelain background
function createSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  return slide;
}

// =========================================================================
// SLIDE 1: COVER
// =========================================================================
{
  const s = createSlide();

  // Decorative Accent bar top
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.12,
    fill: { color: C.primary }, line: { type: 'none' }
  });

  // Eyebrow Badge
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.8, w: 3.5, h: 0.35,
    fill: { color: C.primaryLight },
    line: { color: 'DBEAFE', width: 1 },
    rectRadius: 0.08
  });
  s.addText('SISTEM TERDISTRIBUSI • FASILKOM UNEJ', {
    x: 0.8, y: 0.8, w: 3.5, h: 0.35,
    fontSize: 9.5, bold: true, color: C.primary, fontFace: FONT_HEAD,
    align: 'center', valign: 'middle'
  });

  // Main Title
  s.addText('Konsistensi Data &\nRace Condition', {
    x: 0.8, y: 1.35, w: 8.4, h: 1.3,
    fontSize: 28, bold: true, color: C.textDark, fontFace: FONT_HEAD,
    lineSpacingMultiple: 1.15
  });

  // Subtitle
  s.addText('Studi Kasus: Multi-Instance Layanan Apotek dengan PostgreSQL Terpusat', {
    x: 0.8, y: 2.75, w: 8.4, h: 0.45,
    fontSize: 13, bold: true, color: C.primary, fontFace: FONT_HEAD
  });

  // Description / Comparative Analysis
  s.addText('Analisis Komparasi: Naive, Atomic Operation, Database Transaction, dan Optimistic Locking', {
    x: 0.8, y: 3.2, w: 8.4, h: 0.35,
    fontSize: 11, color: C.textMuted, fontFace: FONT_BODY
  });

  // Tech Specs Pill
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 3.65, w: 8.4, h: 0.38,
    fill: { color: 'F1F5F9' },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.08
  });
  s.addText('Teknologi: Laravel (PHP 8.3)  •  PostgreSQL 16  •  Concurrency Engine Simulator', {
    x: 0.8, y: 3.65, w: 8.4, h: 0.38,
    fontSize: 10, bold: true, color: C.textMuted, fontFace: FONT_HEAD,
    align: 'center', valign: 'middle'
  });

  // Architecture mini-diagram card at bottom
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.2, w: 8.4, h: 1.1,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('3 SERVICE  →  1 DATABASE', {
    x: 1.0, y: 4.3, w: 3.0, h: 0.25,
    fontSize: 9, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('Service :8001  |  Service :8002  |  Service :8003\n3 Kasir (IGD, Rawat Inap, Poli Anak) akses bersamaan', {
    x: 1.0, y: 4.58, w: 4.5, h: 0.55,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY
  });

  // Database pill
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.8, y: 4.35, w: 3.2, h: 0.8,
    fill: { color: C.primaryLight },
    line: { color: 'BFDBFE', width: 1 },
    rectRadius: 0.08
  });
  s.addText('PostgreSQL: obats (stok = 1)\nStok tersisa: 1 botol terakhir', {
    x: 5.8, y: 4.35, w: 3.2, h: 0.8,
    fontSize: 10, bold: true, color: C.primaryDark, fontFace: FONT_HEAD,
    align: 'center', valign: 'middle'
  });

  s.addNotes('Selamat pagi Bapak/Ibu dosen dan rekan-rekan sekalian. Kami dari Kelompok 2 akan mempresentasikan topik penting dalam arsitektur sistem terdistribusi modern, yaitu: Konsistensi Data dan Penanganan Race Condition. Studi kasus nyata yang kami angkat adalah perebutan stok obat kritis pada layanan Farmasi/Apotek Rumah Sakit yang dijalankan secara multi-instance dengan Laravel dan PostgreSQL.');
}

// =========================================================================
// SLIDE 2: ARSITEKTUR SISTEM
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '1 • Arsitektur Sistem', 'ARSITEKTUR SISTEM', 'Model Skalabilitas: Multi Order Service & Single Database');

  const cardY = 1.95;
  const cardW = 2.65;
  const cardH = 3.2;

  // Card 1: Multi-Client Concurrency
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.0, y: cardY + 0.2, w: 0.6, h: 0.28,
    fill: { color: C.primaryLight }, line: { type: 'none' }, rectRadius: 0.06
  });
  s.addText('1', {
    x: 1.0, y: cardY + 0.2, w: 0.6, h: 0.28,
    fontSize: 10, bold: true, color: C.primary, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });
  s.addText('Multi-Client\nConcurrency', {
    x: 1.0, y: cardY + 0.55, w: 2.25, h: 0.6,
    fontSize: 13, bold: true, color: C.textDark, fontFace: FONT_HEAD
  });
  s.addText('• Kasir IGD\n• Kasir Rawat Inap\n• Kasir Poli Anak', {
    x: 1.0, y: cardY + 1.25, w: 2.25, h: 0.7,
    fontSize: 10.5, bold: true, color: C.primary, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
  });
  s.addText('3 Kasir Rumah Sakit melakukan transaksi tebus resep secara simultan di milidetik yang sama ketika jam sibuk operasional.', {
    x: 1.0, y: cardY + 2.05, w: 2.25, h: 1.0,
    fontSize: 9.5, color: C.textMuted, fontFace: FONT_BODY
  });

  // Card 2: Multi Service Instances
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.65, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorderActive, width: 1.5 },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.85, y: cardY + 0.2, w: 0.6, h: 0.28,
    fill: { color: C.primaryLight }, line: { type: 'none' }, rectRadius: 0.06
  });
  s.addText('2', {
    x: 3.85, y: cardY + 0.2, w: 0.6, h: 0.28,
    fontSize: 10, bold: true, color: C.primary, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });
  s.addText('Multi Service\nInstances', {
    x: 3.85, y: cardY + 0.55, w: 2.25, h: 0.6,
    fontSize: 13, bold: true, color: C.textDark, fontFace: FONT_HEAD
  });
  s.addText('• Order Service :8001\n• Order Service :8002\n• Order Service :8003', {
    x: 3.85, y: cardY + 1.25, w: 2.25, h: 0.7,
    fontSize: 10.5, bold: true, color: C.primary, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
  });
  s.addText('3 Instance Apotek Order Service berjalan mandiri di port 8001, 8002, dan 8003 untuk load balancing dan ketersediaan tinggi.', {
    x: 3.85, y: cardY + 2.05, w: 2.25, h: 1.0,
    fontSize: 9.5, color: C.textMuted, fontFace: FONT_BODY
  });

  // Card 3: Single Shared Database
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.5, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.7, y: cardY + 0.2, w: 0.6, h: 0.28,
    fill: { color: C.primaryLight }, line: { type: 'none' }, rectRadius: 0.06
  });
  s.addText('3', {
    x: 6.7, y: cardY + 0.2, w: 0.6, h: 0.28,
    fontSize: 10, bold: true, color: C.primary, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });
  s.addText('Single Shared\nDatabase', {
    x: 6.7, y: cardY + 0.55, w: 2.25, h: 0.6,
    fontSize: 13, bold: true, color: C.textDark, fontFace: FONT_HEAD
  });
  s.addText('• PostgreSQL 16\n• obats (stok obat)\n• pesanan_obats', {
    x: 6.7, y: cardY + 1.25, w: 2.25, h: 0.7,
    fontSize: 10.5, bold: true, color: C.primary, fontFace: FONT_HEAD, lineSpacingMultiple: 1.2
  });
  s.addText('Ketiga service terhubung ke satu database PostgreSQL terpusat yang menyimpan tabel obats (stok obat) dan pesanan_obats.', {
    x: 6.7, y: cardY + 2.05, w: 2.25, h: 1.0,
    fontSize: 9.5, color: C.textMuted, fontFace: FONT_BODY
  });

  s.addNotes('Mari kita telaah arsitektur sistem pada slide ini. Untuk menjamin high availability, sistem apotek rumah sakit di-deploy secara horizontal menjadi 3 instance mandiri di port 8001, 8002, dan 8003. Ketiga instance ini melayani kasir dari unit berbeda—IGD, Rawat Inap, dan Poli Anak. Semua instance ini bermuara pada satu database engine PostgreSQL terpusat. Pertanyaannya: Mengapa inkonsistensi data tetap bisa terjadi padahal database-nya hanya ada satu? Mari kita lihat penjelasannya di slide berikutnya.');
}

// =========================================================================
// SLIDE 3: POLA MASALAH - SOLUSI
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '2 • Pola Masalah - Solusi', 'POLA MASALAH - SOLUSI', 'Mengapa Data Tidak Konsisten Meski Database Hanya Satu?');

  const cardW = 4.05;
  const cardH = 3.3;

  // Box Kiri: Masalah Nyata
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.9, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.alertBorder, width: 1.5 },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.05, y: 2.1, w: 3.55, h: 0.32,
    fill: { color: C.alertBg }, line: { type: 'none' }, rectRadius: 0.06
  });
  s.addText('MASALAH NYATA: STOK OBAT KRITIS TERSISA 1', {
    x: 1.05, y: 2.1, w: 3.55, h: 0.32,
    fontSize: 9.5, bold: true, color: C.alertText, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });
  s.addText('• Kasus: Obat "Amoxicillin Sirup" tersisa 1 botol terakhir.\n• Serentak: 3 Kasir menekan tombol konfirmasi tebus resep.\n• Race Condition: Ketiga service membaca stok = 1 bersamaan.\n• Overselling: 3 botol dinyatakan berhasil terjual, padahal fisik hanya ada 1 botol!\n• Dampak Medis: Pasien yang resepnya disetujui tidak mendapatkan obat karena stok fisik kosong di lemari farmasi.', {
    x: 1.05, y: 2.55, w: 3.55, h: 1.8,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  // Highlight Box Merah
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.05, y: 4.45, w: 3.55, h: 0.55,
    fill: { color: C.alertBg },
    line: { color: C.alertBorder, width: 1 },
    rectRadius: 0.08
  });
  s.addText('1 botol tersisa  →  3 botol terjual (OVERSELL)', {
    x: 1.05, y: 4.45, w: 3.55, h: 0.55,
    fontSize: 10.5, bold: true, color: C.alertText, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });

  // Box Kanan: Arah Solusi
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.15, y: 1.9, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.successBorder, width: 1.5 },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.4, y: 2.1, w: 3.55, h: 0.32,
    fill: { color: C.successBg }, line: { type: 'none' }, rectRadius: 0.06
  });
  s.addText('ARAH SOLUSI: KONSISTENSI DI DATABASE', {
    x: 5.4, y: 2.1, w: 3.55, h: 0.32,
    fontSize: 9.5, bold: true, color: C.successText, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });
  s.addText('• Akar Masalah: Aplikasi mempercayai data lokal di RAM yang sudah usang (stale read).\n• Prinsip Solusi: Memindahkan validasi stok dari memori aplikasi PHP ke mesin PostgreSQL.', {
    x: 5.4, y: 2.55, w: 3.55, h: 0.85,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  // 3 Pendekatan List
  s.addText('3 Pendekatan Solusi Teruji:', {
    x: 5.4, y: 3.45, w: 3.55, h: 0.25,
    fontSize: 9.5, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('1. Operasi Atomic: UPDATE ... WHERE stok >= 1 di SQL\n2. Database Transaction: SELECT FOR UPDATE kunci baris\n3. Optimistic Locking: Lacak nomor versi tanpa lock pembaca', {
    x: 5.4, y: 3.75, w: 3.55, h: 1.25,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });

  s.addNotes('Pada slide ini kita melihat kontras antara masalah nyata dan arah solusinya. Ketika stok tersisa 1 botol dan 3 kasir menekan tombol bersamaan, ketiga service membaca angka 1 yang sama. Akibatnya terjadi overselling: 1 botol fisik menghasilkan 3 transaksi sukses. Pasien yang resepnya disetujui tidak mendapatkan obat karena lemari fisik kosong. Akar masalahnya adalah aplikasi PHP mengandalkan data usang di memori RAM. Kunci solusinya adalah memindahkan validasi stok ke level database engine PostgreSQL.');
}

// =========================================================================
// SLIDE 4: MASA LALU (THE NAIVE ERA)
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '3 • Masa Lalu (The Naive Era)', 'MASA LALU (THE NAIVE ERA)', 'Kegagalan Pola "Read-Modify-Write" Saat Layanan Di-Scale');

  // Table Data
  const rows = [
    [
      { text: 'No', options: { bold: true, fill: C.neutralBox, color: C.textDark, align: 'center' } },
      { text: 'Pelaku / Instance', options: { bold: true, fill: C.neutralBox, color: C.textDark } },
      { text: 'Aksi Pemrosesan', options: { bold: true, fill: C.neutralBox, color: C.textDark } },
      { text: 'Database (Stok)', options: { bold: true, fill: C.neutralBox, color: C.textDark, align: 'center' } },
      { text: 'Evaluasi Status', options: { bold: true, fill: C.neutralBox, color: C.textDark, align: 'center' } },
    ],
    ['1', 'Service #1 (Port 8001)', 'Membaca stok obat dari DB → Hasil: 1', 'Stok: 1', 'Valid'],
    ['2', 'Service #2 (Port 8002)', 'Membaca stok obat dari DB → Hasil: 1', 'Stok: 1', 'Valid (Stale)'],
    ['3', 'Service #3 (Port 8003)', 'Membaca stok obat dari DB → Hasil: 1', 'Stok: 1', 'Valid (Stale)'],
    ['4', 'Service #1', 'Perhitungan di RAM: 1 - 1 = 0 → Simpan Stok = 0', 'Stok: 0', 'Order #1 Sukses'],
    ['5', 'Service #2', 'Perhitungan di RAM: 1 - 1 = 0 → Simpan Stok = 0', 'Stok: 0', 'Order #2 Sukses (OVERSELL!)'],
    ['6', 'Service #3', 'Perhitungan di RAM: 1 - 1 = 0 → Simpan Stok = 0', 'Stok: 0', 'Order #3 Sukses (OVERSELL!)'],
  ];

  s.addTable(rows, {
    x: 0.8, y: 1.85, w: 8.4, h: 2.5,
    colW: [0.5, 2.0, 3.2, 1.3, 1.4],
    border: { pt: 1, color: C.cardBorder },
    fill: C.cardBg,
    fontSize: 9,
    fontFace: FONT_BODY,
    color: C.textDark,
    valign: 'middle'
  });

  // Callout warning di bawah tabel
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.5, w: 8.4, h: 0.65,
    fill: { color: C.alertBg },
    line: { color: C.alertBorder, width: 1 },
    rectRadius: 0.08
  });
  s.addText('Langkah 1-3: ketiga service membaca stok = 1 sebelum ada yang menulis.\nLangkah 5-6: hasil hitung dari data usang tetap disimpan, sehingga terjadi overselling.', {
    x: 1.0, y: 4.5, w: 8.0, h: 0.65,
    fontSize: 9.5, bold: true, color: C.alertText, fontFace: FONT_HEAD,
    valign: 'middle'
  });

  s.addNotes('Mari perhatikan alur eksekusi pada tabel ini. Di langkah 1, 2, dan 3, ketiga instance membaca database secara paralel dan semuanya mendapati stok = 1. Ini adalah valid stale read. Di langkah 4, Service #1 mengurangi stok di memori menjadi 0 dan menyimpan ke database. Namun di langkah 5 dan 6, Service #2 dan #3 tidak tahu stok sudah habis! Mereka menimpa database dengan hasil hitung memorinya sendiri. Terjadilah overselling fatal.');
}

// =========================================================================
// SLIDE 5: RULE OF THREE
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '4 • Rule of Three', 'RULE OF THREE', 'Tiga Pilar Menjaga Konsistensi Data Sistem Terdistribusi');

  const cardW = 2.65;
  const cardH = 3.3;
  const cardY = 1.9;

  // Pilar 1
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('PILAR 1\nAtomic Operation', {
    x: 1.0, y: cardY + 0.15, w: 2.25, h: 0.55,
    fontSize: 12, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('EKSEKUSI TUNGGAL DI SQL', {
    x: 1.0, y: cardY + 0.72, w: 2.25, h: 0.25,
    fontSize: 8.5, bold: true, color: C.textFaint, fontFace: FONT_HEAD
  });
  s.addText('Menyerahkan pengurangan stok langsung ke mesin PostgreSQL. Tidak ada data yang dibaca ke memori PHP terlebih dahulu.', {
    x: 1.0, y: cardY + 1.02, w: 2.25, h: 0.75,
    fontSize: 9, color: C.textMuted, fontFace: FONT_BODY
  });
  // Code box
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.95, y: cardY + 1.85, w: 2.35, h: 1.25,
    fill: { color: C.terminalBg }, line: { type: 'none' }, rectRadius: 0.06
  });
  s.addText('UPDATE obats\nSET stok = stok - 1\nWHERE id = 1\n  AND stok >= 1;', {
    x: 1.05, y: cardY + 1.95, w: 2.15, h: 1.05,
    fontSize: 8.5, color: C.codeGreen, fontFace: FONT_CODE
  });

  // Pilar 2
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.65, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorderActive, width: 1.5 },
    rectRadius: 0.1
  });
  s.addText('PILAR 2\nDatabase Transaction', {
    x: 3.85, y: cardY + 0.15, w: 2.25, h: 0.55,
    fontSize: 12, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('PESSIMISTIC LOCKING (ACID)', {
    x: 3.85, y: cardY + 0.72, w: 2.25, h: 0.25,
    fontSize: 8.5, bold: true, color: C.textFaint, fontFace: FONT_HEAD
  });
  s.addText('Mengunci baris obat (SELECT FOR UPDATE) sehingga service lain harus antre menunggu hingga transaksi commit atau rollback.', {
    x: 3.85, y: cardY + 1.02, w: 2.25, h: 0.75,
    fontSize: 9, color: C.textMuted, fontFace: FONT_BODY
  });
  // Code box
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.8, y: cardY + 1.85, w: 2.35, h: 1.25,
    fill: { color: C.terminalBg }, line: { type: 'none' }, rectRadius: 0.06
  });
  s.addText('BEGIN TRANSACTION;\nSELECT ... FOR UPDATE;\n-- kurangi & insert --\nCOMMIT / ROLLBACK;', {
    x: 3.9, y: cardY + 1.95, w: 2.15, h: 1.05,
    fontSize: 8.5, color: C.codeCyan, fontFace: FONT_CODE
  });

  // Pilar 3
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.5, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('PILAR 3\nOptimistic Locking', {
    x: 6.7, y: cardY + 0.15, w: 2.25, h: 0.55,
    fontSize: 12, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('VERSION TRACKING', {
    x: 6.7, y: cardY + 0.72, w: 2.25, h: 0.25,
    fontSize: 8.5, bold: true, color: C.textFaint, fontFace: FONT_HEAD
  });
  s.addText('Bebas antrean kunci. Setiap pembaruan memeriksa nomor versi data (kolom versi). Jika versi berubah, transaksi dibatalkan.', {
    x: 6.7, y: cardY + 1.02, w: 2.25, h: 0.75,
    fontSize: 9, color: C.textMuted, fontFace: FONT_BODY
  });
  // Code box
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.65, y: cardY + 1.85, w: 2.35, h: 1.25,
    fill: { color: C.terminalBg }, line: { type: 'none' }, rectRadius: 0.06
  });
  s.addText('UPDATE obats\nSET stok = 0, versi = 6\nWHERE id = 1\n  AND versi = 5;', {
    x: 6.75, y: cardY + 1.95, w: 2.15, h: 1.05,
    fontSize: 8.5, color: C.codeYellow, fontFace: FONT_CODE
  });

  s.addNotes('Untuk mengatasi permasalahan tersebut, industri software mengenal Rule of Three: Tiga pilar strategi menjaga konsistensi. Pilar 1 adalah Operasi Atomic, menyerahkan pengurangan langsung ke SQL tanpa memori PHP. Pilar 2 adalah Database Transaction dengan Pessimistic Locking menggunakan SELECT FOR UPDATE. Pilar 3 adalah Optimistic Locking menggunakan pelacakan nomor versi. Mari kita bahas implementasi masing-masing pilar secara mendalam.');
}

// =========================================================================
// SLIDE 6: MASA SEKARANG: SOLUSI 1
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '5 • Masa Sekarang: Solusi 1', 'MASA SEKARANG: SOLUSI 1', 'Operasi Atomic: Mengandalkan Conditional Update di SQL');

  const cardW = 4.05;
  const cardH = 3.3;

  // Box Kiri: Mekanisme Kerja
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.9, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('Mekanisme Kerja', {
    x: 1.05, y: 2.05, w: 3.55, h: 0.3,
    fontSize: 13, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('Alih-alih membaca stok ke PHP, query langsung dijalankan:', {
    x: 1.05, y: 2.4, w: 3.55, h: 0.25,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY
  });
  // Query terminal box
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.05, y: 2.7, w: 3.55, h: 0.75,
    fill: { color: C.terminalBg }, line: { type: 'none' }, rectRadius: 0.06
  });
  s.addText('UPDATE obats SET stok = stok - :qty\nWHERE id = :id AND stok >= :qty;', {
    x: 1.15, y: 2.78, w: 3.35, h: 0.6,
    fontSize: 9, color: C.codeGreen, fontFace: FONT_CODE
  });

  s.addText('PostgreSQL mengembalikan "Affected Rows":', {
    x: 1.05, y: 3.55, w: 3.55, h: 0.25,
    fontSize: 9.5, bold: true, color: C.textDark, fontFace: FONT_HEAD
  });
  s.addText('• 1 baris: Stok berhasil dipotong! Lanjut simpan pesanan.\n• 0 baris: Stok tidak cukup! Batalkan & kembalikan HTTP 400.', {
    x: 1.05, y: 3.82, w: 3.55, h: 0.55,
    fontSize: 9, color: C.textMuted, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.05, y: 4.45, w: 3.55, h: 0.55,
    fill: { color: C.successBg },
    line: { color: C.successBorder, width: 1 },
    rectRadius: 0.06
  });
  s.addText('Keunggulan: Sangat cepat, tanpa overhead transaksi panjang.', {
    x: 1.05, y: 4.45, w: 3.55, h: 0.55,
    fontSize: 9.5, bold: true, color: C.successText, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });

  // Box Kanan: Pertanyaan Kritis
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.15, y: 1.9, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.alertBorder, width: 1.5 },
    rectRadius: 0.1
  });
  s.addText('Pertanyaan Kritis', {
    x: 5.4, y: 2.05, w: 3.55, h: 0.3,
    fontSize: 13, bold: true, color: C.alertText, fontFace: FONT_HEAD
  });
  s.addText('"Bagaimana jika stok berhasil dikurangi, namun pesanan gagal disimpan ke database?"', {
    x: 5.4, y: 2.4, w: 3.55, h: 0.55,
    fontSize: 10, italic: true, bold: true, color: C.textDark, fontFace: FONT_HEAD
  });
  s.addText('Kelemahan Operasi Atomic Mandiri:\nJika server crash, koneksi putus, atau insert tabel pesanan_obats error setelah update stok berhasil, maka stok obat di database berkurang permanen tanpa ada bukti resep tercatat di sistem!', {
    x: 5.4, y: 3.05, w: 3.55, h: 1.25,
    fontSize: 9.5, color: C.textMuted, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.4, y: 4.45, w: 3.55, h: 0.55,
    fill: { color: C.primaryLight },
    line: { color: 'BFDBFE', width: 1 },
    rectRadius: 0.06
  });
  s.addText('Inilah alasan kita butuh Solusi 2: Database Transaction!', {
    x: 5.4, y: 4.45, w: 3.55, h: 0.55,
    fontSize: 9.5, bold: true, color: C.primary, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });

  s.addNotes('Pada Solusi 1 Operasi Atomic, kita memanfaatkan klausa kondisional SQL WHERE stok >= :qty. Database engine PostgreSQL mengeksekusi ini secara atomik. Jika baris terpengaruh bernilai 1, pesanan lanjut. Jika 0, stok habis. Solusi ini luar biasa cepat. Namun ada celah arsitektural: jika setelah memotong stok server mengalami crash sebelum menyimpan pesanan, maka obat di database hilang tanpa rekam medis! Ini membawa kita pada Solusi 2.');
}

// =========================================================================
// SLIDE 7: MASA SEKARANG: SOLUSI 2
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '6 • Masa Sekarang: Solusi 2', 'MASA SEKARANG: SOLUSI 2', 'Database Transaction (ACID): Menjamin "All or Nothing"');

  // Panel Kiri: Alur Transaksi
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.9, w: 4.4, h: 3.3,
    fill: { color: C.cardBg },
    line: { color: C.cardBorderActive, width: 1.5 },
    rectRadius: 0.1
  });
  s.addText('Prinsip Transaksi', {
    x: 1.05, y: 2.05, w: 3.9, h: 0.3,
    fontSize: 13, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('Tujuan: Jika salah satu tahapan gagal, seluruh perubahan dikembalikan ke kondisi semula (Rollback).', {
    x: 1.05, y: 2.38, w: 3.9, h: 0.45,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY
  });

  // Steps
  const steps = [
    '1. BEGIN TRANSACTION',
    '2. SELECT * FROM obats WHERE id=1 FOR UPDATE (Lock baris)',
    '3. Kurangi stok jika masih mencukupi',
    '4. Simpan pesanan ke pesanan_obats',
    '5. COMMIT TRANSACTION (Perubahan permanen)',
    '6. Jika gagal di tengah jalan → ROLLBACK TRANSACTION'
  ];
  s.addText(steps.join('\n'), {
    x: 1.05, y: 2.9, w: 3.9, h: 2.15,
    fontSize: 9, fontFace: FONT_CODE, color: C.textDark, lineSpacingMultiple: 1.3
  });

  // Panel Kanan Atas: Keunggulan Integritas
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.4, y: 1.9, w: 3.8, h: 1.5,
    fill: { color: C.cardBg },
    line: { color: C.successBorder, width: 1.5 },
    rectRadius: 0.1
  });
  s.addText('Keunggulan Integritas', {
    x: 5.65, y: 2.05, w: 3.3, h: 0.3,
    fontSize: 12, bold: true, color: C.successText, fontFace: FONT_HEAD
  });
  s.addText('Menjamin data tidak pernah korup. Kedua operasi (potong stok dan simpan resep) berada dalam satu kesatuan atomik ACID.', {
    x: 5.65, y: 2.4, w: 3.3, h: 0.85,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  // Panel Kanan Bawah: Konsekuensi Performa
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.4, y: 3.6, w: 3.8, h: 1.6,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('Konsekuensi Performa', {
    x: 5.65, y: 3.75, w: 3.3, h: 0.3,
    fontSize: 12, bold: true, color: C.textDark, fontFace: FONT_HEAD
  });
  s.addText('• Mengunci baris data (lock) membuat service lain harus menunggu (blocking) hingga transaksi selesai.\n• Berisiko memicu bottleneck atau deadlock jika transaksi berjalan terlalu lama.', {
    x: 5.65, y: 4.1, w: 3.3, h: 0.95,
    fontSize: 9, color: C.textMuted, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  s.addNotes('Solusi 2 adalah standar emas integritas data enterprise: Database Transaction dengan Pessimistic Locking. Ketika Service #1 mengeksekusi SELECT FOR UPDATE, PostgreSQL secara fisik mengunci baris obat tersebut. Service #2 dan #3 yang mencoba membaca baris yang sama akan dipaksa menunggu. Jika pembuatan resep gagal, seluruh perubahan di-rollback otomatis. Konsekuensinya adalah latensi sedikit bertambah karena ada antrean kunci.');
}

// =========================================================================
// SLIDE 8: MASA SEKARANG: SOLUSI 3
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '7 • Masa Sekarang: Solusi 3', 'MASA SEKARANG: SOLUSI 3', 'Optimistic Locking: Deteksi Konflik Berbasis Nomor Versi');

  const cardW = 4.05;
  const cardH = 3.3;

  // Kolom Kiri: Konsep Kolom Versi
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.9, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('Konsep Kolom Versi', {
    x: 1.05, y: 2.05, w: 3.55, h: 0.3,
    fontSize: 13, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('• Asumsi Optimis: Konflik tidak selalu terjadi, sehingga data tidak perlu dikunci di awal.\n• Proses lain bebas membaca data secara bersamaan (non-blocking reads).\n• Menambahkan kolom "versi" pada tabel obats (misal: stok=1, versi=5).\n• Setiap kali data diperbarui, nilai versi dinaikkan (versi = versi + 1).\n• Saat simpan, sistem memvalidasi apakah versi di DB masih sama dengan saat pertama dibaca.', {
    x: 1.05, y: 2.4, w: 3.55, h: 1.8,
    fontSize: 9, color: C.textDark, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  // Badge Stok & Versi
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.05, y: 4.45, w: 3.55, h: 0.55,
    fill: { color: C.primaryLight },
    line: { color: 'BFDBFE', width: 1 },
    rectRadius: 0.08
  });
  s.addText('stok = 1   |   versi = 5', {
    x: 1.05, y: 4.45, w: 3.55, h: 0.55,
    fontSize: 11, bold: true, color: C.primary, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });

  // Kolom Kanan: Timeline Eksekusi Versi
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.15, y: 1.9, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorderActive, width: 1.5 },
    rectRadius: 0.1
  });
  s.addText('Timeline Eksekusi Versi', {
    x: 5.4, y: 2.05, w: 3.55, h: 0.3,
    fontSize: 13, bold: true, color: C.textDark, fontFace: FONT_HEAD
  });

  const timelineSteps = [
    '1. Service #1 membaca: Stok=1, Versi=5',
    '2. Service #2 membaca: Stok=1, Versi=5',
    '3. Service #1 update: SET stok=0, versi=6 WHERE versi=5\n   → SUKSES • 1 row terupdate',
    '4. Service #2 update: SET stok=0, versi=6 WHERE versi=5\n   → DITOLAK • 0 row terupdate'
  ];
  s.addText(timelineSteps.join('\n\n'), {
    x: 5.4, y: 2.45, w: 3.55, h: 1.8,
    fontSize: 8.8, fontFace: FONT_BODY, color: C.textDark
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.4, y: 4.45, w: 3.55, h: 0.55,
    fill: { color: C.alertBg },
    line: { color: C.alertBorder, width: 1 },
    rectRadius: 0.08
  });
  s.addText('Alasan: versi sudah 6 bukan 5 → Ditolak (HTTP 409 Conflict)', {
    x: 5.4, y: 4.45, w: 3.55, h: 0.55,
    fontSize: 9, bold: true, color: C.alertText, fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });

  s.addNotes('Solusi 3 adalah Optimistic Locking. Pendekatan ini tidak mengunci baris database sama sekali, sehingga pembacaan sangat cepat dan bebas antrean. Kita menambahkan kolom integer "versi". Saat Service #1 berhasil mengupdate versi menjadi 6, maka ketika Service #2 mencoba mengupdate dengan klausa WHERE versi = 5, query tersebut otomatis mengenai 0 baris. Service #2 langsung tahu terjadi konflik dan mengembalikan HTTP 409 Conflict.');
}

// =========================================================================
// SLIDE 9: BUKTI EKSPERIMEN NYATA
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '8 • Bukti Eksperimen Nyata', 'BUKTI EKSPERIMEN NYATA', 'Hasil Uji Concurrency Paralel 3 Pembeli (Stok Awal = 1)');

  const rows = [
    [
      { text: 'Skenario Uji', options: { bold: true, fill: C.neutralBox, color: C.textDark } },
      { text: 'Service Instances', options: { bold: true, fill: C.neutralBox, color: C.textDark } },
      { text: 'Respon Pembeli', options: { bold: true, fill: C.neutralBox, color: C.textDark, align: 'center' } },
      { text: 'Pesanan Masuk', options: { bold: true, fill: C.neutralBox, color: C.textDark, align: 'center' } },
      { text: 'Stok Akhir', options: { bold: true, fill: C.neutralBox, color: C.textDark, align: 'center' } },
      { text: 'Status Konsistensi', options: { bold: true, fill: C.neutralBox, color: C.textDark, align: 'center' } },
    ],
    ['1. Naive (Tanpa Lock)', 'Port 8001, 8002, 8003', '3x Berhasil (HTTP 200)', '3 Pesanan', '0 (Bocor)', 'TIDAK KONSISTEN (OVERSELL)'],
    ['2. Atomic Operation', 'Port 8001, 8002, 8003', '1x 200, 2x 400 Gagal', '1 Pesanan', '0 (Akurat)', 'KONSISTEN (SQL Conditional)'],
    ['3. DB Transaction', 'Port 8001, 8002, 8003', '1x 200, 2x 400 Gagal', '1 Pesanan', '0 (Akurat)', 'KONSISTEN (ACID Rollback)'],
    ['4. Optimistic Locking', 'Port 8001, 8002, 8003', '1x 200, 2x 409 Ditolak', '1 Pesanan', '0 (Versi=6)', 'KONSISTEN (Version Check)'],
  ];

  s.addTable(rows, {
    x: 0.8, y: 1.85, w: 8.4, h: 2.2,
    colW: [1.8, 1.6, 1.4, 1.1, 1.0, 1.5],
    border: { pt: 1, color: C.cardBorder },
    fill: C.cardBg,
    fontSize: 8.8,
    fontFace: FONT_BODY,
    color: C.textDark,
    valign: 'middle'
  });

  // Callout Highlights Bawah
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.3, w: 4.1, h: 0.8,
    fill: { color: C.alertBg },
    line: { color: C.alertBorder, width: 1 },
    rectRadius: 0.08
  });
  s.addText('3 pesanan masuk pada skenario Naive untuk stok 1: terjadi overselling fatal.', {
    x: 0.95, y: 4.3, w: 3.8, h: 0.8,
    fontSize: 9.5, bold: true, color: C.alertText, fontFace: FONT_HEAD, valign: 'middle'
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 5.1, y: 4.3, w: 4.1, h: 0.8,
    fill: { color: C.successBg },
    line: { color: C.successBorder, width: 1 },
    rectRadius: 0.08
  });
  s.addText('1 pesanan masuk pada ketiga solusi: stok akhir akurat dan konsisten 100%.', {
    x: 5.25, y: 4.3, w: 3.8, h: 0.8,
    fontSize: 9.5, bold: true, color: C.successText, fontFace: FONT_HEAD, valign: 'middle'
  });

  s.addNotes('Berikut adalah bukti empiris dari simulator benchmarking yang kami jalankan dengan 3 request paralel serempak di milidetik yang sama. Pada skenario Naive, ketiga request berhasil, menghasilkan 3 pesanan untuk stok 1 botol. Sementara pada ketiga solusi yang kami tawarkan—Atomic, Transaction, dan Optimistic—hanya 1 transaksi yang berhasil disetujui, dan 2 lainnya ditolak secara elegan. Stok fisik di lemari farmasi terlindungi 100%.');
}

// =========================================================================
// SLIDE 10: MASA DEPAN (NEXT-GEN DISTRIBUTED SYSTEMS)
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '9 • Masa Depan', 'MASA DEPAN (NEXT-GEN DISTRIBUTED SYSTEMS)', 'Tantangan Konkurensi Skala Lanjut (Database-per-Service)');

  const cardW = 2.65;
  const cardH = 3.3;
  const cardY = 1.9;

  // Box 1: Distributed Locks
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('Distributed Locks\n(Redis)', {
    x: 1.0, y: cardY + 0.2, w: 2.25, h: 0.6,
    fontSize: 13, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('REDLOCK ALGORITHM', {
    x: 1.0, y: cardY + 0.85, w: 2.25, h: 0.25,
    fontSize: 8.5, bold: true, color: C.textFaint, fontFace: FONT_HEAD
  });
  s.addText('Ketika database dipecah menjadi beberapa cluster terpisah, lock database tunggal tidak cukup. Redis Distributed Lock mengunci resource lintas cluster di level in-memory dengan algoritma Redlock.', {
    x: 1.0, y: cardY + 1.2, w: 2.25, h: 1.8,
    fontSize: 9.5, color: C.textMuted, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });

  // Box 2: Saga Pattern
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.65, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorderActive, width: 1.5 },
    rectRadius: 0.1
  });
  s.addText('Saga Pattern &\nEvent-Driven', {
    x: 3.85, y: cardY + 0.2, w: 2.25, h: 0.6,
    fontSize: 13, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('ORKESTRASI ASINKRON', {
    x: 3.85, y: cardY + 0.85, w: 2.25, h: 0.25,
    fontSize: 8.5, bold: true, color: C.textFaint, fontFace: FONT_HEAD
  });
  s.addText('Menggunakan event broker (Apache Kafka / RabbitMQ) untuk pemesanan obat, verifikasi stok, dan pembayaran dengan mekanisme compensating transactions jika salah satu tahapan gagal.', {
    x: 3.85, y: cardY + 1.2, w: 2.25, h: 1.8,
    fontSize: 9.5, color: C.textMuted, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });

  // Box 3: Eventual Consistency & CQRS
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.5, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('Eventual Consistency\n& CQRS', {
    x: 6.7, y: cardY + 0.2, w: 2.25, h: 0.6,
    fontSize: 13, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('PEMISAHAN BACA & TULIS', {
    x: 6.7, y: cardY + 0.85, w: 2.25, h: 0.25,
    fontSize: 8.5, bold: true, color: C.textFaint, fontFace: FONT_HEAD
  });
  s.addText('Command Query Responsibility Segregation (CQRS) memisahkan alur pembacaan stok dengan alur transaksi pemotongan agar throughput aplikasi mencapai puluhan ribu RPS di skala global.', {
    x: 6.7, y: cardY + 1.2, w: 2.25, h: 1.8,
    fontSize: 9.5, color: C.textMuted, fontFace: FONT_BODY, lineSpacingMultiple: 1.25
  });

  s.addNotes('Bagaimana jika sistem berkembang lebih besar lagi dengan pola Database-per-Service? Pada skala tersebut, database transaction lokal tidak bisa lagi menjangkau database layanan lain. Kita beralih ke Redis Distributed Lock untuk resource lock global, Saga Pattern dengan Apache Kafka untuk transaksi terdistribusi multi-tahap, dan CQRS untuk throughput ribuan transaksi per detik.');
}

// =========================================================================
// SLIDE 11: KESIMPULAN
// =========================================================================
{
  const s = createSlide();
  addHeader(s, '10 • Kesimpulan', 'KESIMPULAN', 'Panduan Pemilihan Strategi Konsistensi Data');

  const cardW = 2.65;
  const cardH = 2.2;
  const cardY = 1.9;

  // Rekomendasi 1
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('Pilih Operasi Atomic Jika...', {
    x: 1.0, y: cardY + 0.2, w: 2.25, h: 0.5,
    fontSize: 12, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('Operasi hanya melibatkan 1 tabel tunggal, volume transaksi sangat tinggi, dan butuh performa tercepat tanpa overhead blocking transaksi.', {
    x: 1.0, y: cardY + 0.75, w: 2.25, h: 1.25,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  // Rekomendasi 2
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 3.65, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorderActive, width: 1.5 },
    rectRadius: 0.1
  });
  s.addText('Pilih DB Transaction Jika...', {
    x: 3.85, y: cardY + 0.2, w: 2.25, h: 0.5,
    fontSize: 12, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('Operasi melibatkan beberapa tabel (stok + pesanan + audit log) yang wajib konsisten bersama ("All or Nothing") di satu basis data.', {
    x: 3.85, y: cardY + 0.75, w: 2.25, h: 1.25,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  // Rekomendasi 3
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.5, y: cardY, w: cardW, h: cardH,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.1
  });
  s.addText('Pilih Optimistic Locking Jika...', {
    x: 6.7, y: cardY + 0.2, w: 2.25, h: 0.5,
    fontSize: 12, bold: true, color: C.primary, fontFace: FONT_HEAD
  });
  s.addText('Beban pembacaan jauh lebih tinggi daripada penulisan, latensi pengguna panjang (pengisian formulir), dan tingkat konflik jarang terjadi.', {
    x: 6.7, y: cardY + 0.75, w: 2.25, h: 1.25,
    fontSize: 9.5, color: C.textDark, fontFace: FONT_BODY, lineSpacingMultiple: 1.2
  });

  // Footer bar: Github Link & Q&A
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 4.35, w: 5.5, h: 0.7,
    fill: { color: C.neutralBox },
    line: { color: C.cardBorder, width: 1 },
    rectRadius: 0.08
  });
  s.addText('Demo Kode Praktikum & Simulator: github.com/.../apotek-race-condition-pg', {
    x: 1.0, y: 4.35, w: 5.1, h: 0.7,
    fontSize: 10, bold: true, color: C.primary, fontFace: FONT_HEAD, valign: 'middle'
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.5, y: 4.35, w: 2.65, h: 0.7,
    fill: { color: C.primary },
    line: { type: 'none' },
    rectRadius: 0.08
  });
  s.addText('Q&A Session', {
    x: 6.5, y: 4.35, w: 2.65, h: 0.7,
    fontSize: 13, bold: true, color: 'FFFFFF', fontFace: FONT_HEAD, align: 'center', valign: 'middle'
  });

  s.addNotes('Sebagai penutup, pemilihan strategi konsistensi data bergantung pada trade-off: Pilih Atomic untuk kecepatan maksimal tabel tunggal; pilih Database Transaction untuk integritas mutlak multi-tabel; dan pilih Optimistic Locking untuk arsitektur read-heavy tanpa blocking. Terima kasih atas perhatian Bapak/Ibu dosen dan rekan-rekan sekalian. Kami membuka sesi tanya jawab (Q&A).');
}

// Generate the PPTX file
const targetDir = path.join(__dirname, '..', 'presentasi', 'minggu_11_race_condition');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}
const outPath = path.join(targetDir, 'Presentasi_Minggu11_RaceCondition_Kelompok2.pptx');
pptx.writeFile({ fileName: outPath })
  .then(() => {
    console.log('Successfully generated PPTX:', outPath);
    // Also copy to Presentasi_Minggu11_RaceCondition.pptx
    const copyPath = path.join(targetDir, 'Presentasi_Minggu11_RaceCondition.pptx');
    fs.copyFileSync(outPath, copyPath);
    console.log('Successfully copied to:', copyPath);
  })
  .catch(err => {
    console.error('Error generating PPTX:', err);
    process.exit(1);
  });
