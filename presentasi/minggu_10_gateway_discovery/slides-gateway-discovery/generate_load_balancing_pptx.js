import pptxgen from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches (Standard 16:9 widescreen)

// --- Color Palette: Clean Porcelain (Strict, Minimalist, Curated, High-Contrast) ---
const C = {
  bg: 'F8FAFC',          // Crisp Porcelain Off-White (Slate 50)
  cardBg: 'FFFFFF',      // Pure White Card
  cardBorder: 'E2E8F0',  // Subtle Technical Hairline (Slate 200)
  cardBorderActive: '3B82F6', // Blue 500 active
  primary: '1E40AF',     // Deep Royal Cobalt / Navy (Strong focused accent)
  primaryDark: '1E3A8A', // Navy 900
  primaryLight: 'EFF6FF',// Soft Blue 50 for Pills / Badges
  textDark: '0F172A',    // Deep Charcoal / Slate 900 for high-contrast headings
  textMuted: '475569',   // Slate 600 for crisp body text
  textFaint: '64748B',   // Slate 500 for captions
  terminalBg: '0F172A',  // Slate 900 for Terminal Window Contrast
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
  neutralBox: 'F1F5F9',  // Slate 100 for secondary containers
};

const FONT_HEAD = 'DejaVu Sans';
const FONT_BODY = 'DejaVu Sans';
const FONT_CODE = 'DejaVu Sans Mono';

function addHeader(slide, kicker, titleParts, subtitle) {
  slide.background = { color: C.bg };

  // Eyebrow / Kicker Badge
  slide.addText(kicker.toUpperCase(), {
    x: 0.6,
    y: 0.30,
    w: 8.8,
    h: 0.22,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
    charSpacing: 1.2,
  });

  const titleRuns = titleParts.map((p) => ({
    text: p.text,
    options: {
      color: p.accent ? C.primary : p.green ? C.successText : p.alert ? C.alertText : C.textDark,
      bold: true,
    },
  }));

  slide.addText(titleRuns, {
    x: 0.6,
    y: 0.50,
    w: 8.8,
    h: 0.42,
    fontSize: 16,
    fontFace: FONT_HEAD,
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6,
      y: 0.92,
      w: 8.8,
      h: 0.25,
      fontSize: 9.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
    });
  }
}

// ==========================================
// SLIDE 1: COVER
// ==========================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  // Framed Outer Card
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 0.7,
    w: 8.4,
    h: 4.2,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  // Top Eyebrow Badge
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 1.2,
    y: 1.15,
    w: 7.6,
    h: 0.36,
    fill: { color: C.primaryLight },
    line: { color: 'BFDBFE', width: 1 },
  });

  s.addText('SISTEM TERDISTRIBUSI • FASILKOM UNIVERSITAS JEMBER', {
    x: 1.3,
    y: 1.22,
    w: 7.4,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
    charSpacing: 1.5,
  });

  // Main Title
  s.addText(
    [
      { text: 'Load Balancing:\n', options: { color: C.textDark } },
      { text: 'Distribusi Trafik Cerdas Multi-Instance', options: { color: C.primary } },
    ],
    {
      x: 1.2,
      y: 1.75,
      w: 7.6,
      h: 1.25,
      fontSize: 24,
      fontFace: FONT_HEAD,
      bold: true,
      lineSpacingMultiple: 1.15,
    }
  );

  // Subtitle / Problem Framing
  s.addText(
    'Mencegah Overload & Single Point of Failure melalui Pembagian Beban Merata ke Klaster Layanan Rumah Sakit saat Lonjakan Antrean Pasien',
    {
      x: 1.2,
      y: 3.15,
      w: 7.6,
      h: 0.65,
      fontSize: 11,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  // Institutional Footer Tag
  s.addText('Kelompok 2 • Dosen Pengampu: M. Zarkasi, S.Kom., M.Kom. (2025/2026)', {
    x: 1.2,
    y: 4.2,
    w: 7.6,
    h: 0.3,
    fontSize: 9,
    fontFace: FONT_BODY,
    color: C.textFaint,
  });

  s.addNotes('Selamat malam Bapak M. Zarkasi dan rekan-rekan kelas Sistem Terdistribusi. Kami dari Kelompok 2 malam ini mempresentasikan materi lanjutan sistem terdistribusi, yaitu Load Balancing: Distribusi Trafik Cerdas Multi-Instance pada arsitektur microservices rumah sakit. Pada pertemuan ini kita akan membedah bagaimana beban ribuan resep pasien dibagi secara proporsional ke klaster server backend tanpa membebani satu node secara berlebih.');
}

// ==========================================
// SLIDE 2: ANGGOTA KELOMPOK
// ==========================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 0.7,
    w: 8.4,
    h: 4.2,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 1.2,
    y: 1.05,
    w: 7.6,
    h: 0.35,
    fill: { color: C.primaryLight },
    line: { color: 'BFDBFE', width: 1 },
  });

  s.addText('SISTEM TERDISTRIBUSI • FASILKOM UNIVERSITAS JEMBER', {
    x: 1.3,
    y: 1.1,
    w: 7.4,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
    charSpacing: 1.5,
  });

  s.addText('Anggota Kelompok 2', {
    x: 1.2,
    y: 1.55,
    w: 7.6,
    h: 0.45,
    fontSize: 22,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  const members = [
    { num: 'ANGGOTA 01', name: 'Ridho Rizky Prasetyo', nim: '242410102055', highlight: false },
    { num: 'ANGGOTA 02', name: 'Firsandi Andraw F.', nim: '242410102056', highlight: true },
    { num: 'ANGGOTA 03', name: 'Ahmad Rafif Nandra U.', nim: '242410102018', highlight: false },
  ];

  const cardW = 2.35;
  const cardH = 2.45;
  const startX = 1.2;
  const gap = 0.275;
  const cardY = 2.15;

  members.forEach((m, idx) => {
    const cx = startX + idx * (cardW + gap);

    s.addShape(pptx.shapes.RECTANGLE, {
      x: cx,
      y: cardY,
      w: cardW,
      h: cardH,
      fill: { color: m.highlight ? 'F0F7FF' : C.neutralBox },
      line: { color: m.highlight ? C.primary : C.cardBorder, width: m.highlight ? 1.5 : 1 },
    });

    s.addText(m.num, {
      x: cx + 0.2,
      y: cardY + 0.35,
      w: cardW - 0.4,
      h: 0.25,
      fontSize: 8.5,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.primary,
      charSpacing: 1.2,
    });

    s.addText(m.name, {
      x: cx + 0.2,
      y: cardY + 0.75,
      w: cardW - 0.4,
      h: 0.65,
      fontSize: 13.5,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.textDark,
      lineSpacingMultiple: 1.1,
    });

    s.addText(m.nim, {
      x: cx + 0.2,
      y: cardY + 1.55,
      w: cardW - 0.4,
      h: 0.3,
      fontSize: 11,
      fontFace: FONT_CODE,
      color: C.textMuted,
    });
  });

  s.addNotes('Perkenalkan, tim kami beranggotakan Ridho Rizky Prasetyo, Firsandi Andraw, dan Ahmad Rafif Nandra. Pada sesi malam ini kami akan memaparkan arsitektur load balancing multi-instance, algoritma pembagian beban, implementasi source code, serta pembuktian demo sistem langsung via Postman.');
}

// ==========================================
// SLIDE 3: KILAS BALIK & RUMUSAN MASALAH
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Kilas Balik & Rumusan Masalah',
    [
      { text: 'Service Discovery Menjawab Lokasi, ' },
      { text: 'Siapa yang Membagi Beban?', accent: true },
    ],
    'Menjelaskan mengapa keberadaan Service Registry saja belum cukup ketika banyak server aktif bersamaan'
  );

  // Left Card: Capaian Service Discovery
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('CAPAIAN SERVICE DISCOVERY', {
    x: 0.85,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.successText,
  });

  s.addText('Mengetahui Alamat Instance yang Sehat', {
    x: 0.85,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 12,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '• Service Registry (Eureka/Consul) berhasil mencatat seluruh instance backend yang aktif (UP).\n\n' +
    '• Ketika terjadi lonjakan pasien, rumah sakit menjalankan 2 instance Apotek (:8102 dan :8105).\n\n' +
    '• Masalah Lokasi Terpecahkan: Gateway & Dokter tahu bahwa kedua server tersebut sedang beroperasi.\n\n' +
    '• Namun Registry secara pasif hanya menyimpan katalog, bukan pengatur lalu lintas request!',
    {
      x: 0.85,
      y: 2.2,
      w: 3.75,
      h: 2.6,
      fontSize: 9.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  // Right Card: Rumusan Masalah Baru
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('RUMUSAN MASALAH LOAD BALANCING', {
    x: 5.4,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.alertText,
  });

  s.addText('Tantangan Distribusi Beban Trafik', {
    x: 5.4,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 12,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '• Masalah Hotspot Server:\n' +
    '  Jika klien selalu memilih instance pertama (:8102), server tersebut tetap overload 100% CPU, sedangkan instance :8105 menganggur.\n\n' +
    '• Pertanyaan Kunci:\n' +
    '  "Bagaimana cara membagi aliran request secara adil, berurutan, dan simetris ke seluruh replika yang tersedia?"\n\n' +
    '• Solusi: LOAD BALANCER yang menyeimbangkan beban request secara cerdas dan berkecepatan tinggi.',
    {
      x: 5.4,
      y: 2.2,
      w: 3.75,
      h: 2.6,
      fontSize: 9.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addNotes('Pada materi sebelumnya kita telah memahami Service Discovery yang bertugas mendeteksi lokasi server. Namun ketika sistem memiliki beberapa replika server yang sama-sama aktif, muncul masalah baru: kemana request harus diarahkan? Jika semua request tetap menumpuk di satu node, server tersebut akan tumbang sementara server lain menganggur. Di sinilah peran krusial Load Balancing.');
}

// ==========================================
// SLIDE 4: SKENARIO KRISIS BEBAN (STUDI KASUS)
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Studi Kasus & Skenario Krisis',
    [
      { text: 'Risiko Single Point of Overload ' },
      { text: 'saat Lonjakan Resep Pasien', accent: true },
    ],
    'Mengapa mekanisme pemilihan server acak atau statis berakibat fatal pada keandalan sistem rumah sakit'
  );

  const steps = [
    {
      tag: 'KONDISI 01: LONJAKAN ANTREAN',
      title: 'Lonjakan Ratusan Resep / Menit',
      desc: 'Saat terjadi krisis kesehatan (wabah atau insiden massal), seluruh poli dokter menerbitkan resep serentak. Volume request ke sistem meningkat hingga 10x lipat dari kapasitas normal.',
      accent: C.primary,
    },
    {
      tag: 'KONDISI 02: KEGAGALAN ALOKASI',
      title: 'Server :8102 Overload (Buffer Penuh)',
      desc: 'Tanpa Load Balancer, Dokter Service terus menembak port default :8102. Worker thread kehabisan memori, terjadi lag ekstrem, dan response time anjlok hingga connection timeout.',
      accent: C.alertText,
    },
    {
      tag: 'KONDISI 03: DISTRIBUSI MULTI-INSTANCE',
      title: 'Solusi: Replikasi & Load Balancer',
      desc: 'Membuka instance Apotek kedua di port :8105. Load Balancer membagi request secara proporsional 50:50 sehingga kedua server bekerja optimal dengan latensi stabil.',
      accent: C.successText,
    },
  ];

  steps.forEach((st, idx) => {
    const x = 0.6 + idx * 3.05;
    s.addShape(pptx.shapes.RECTANGLE, {
      x: x,
      y: 1.3,
      w: 2.85,
      h: 3.8,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1 },
    });

    s.addText(st.tag, {
      x: x + 0.2,
      y: 1.5,
      w: 2.45,
      h: 0.25,
      fontSize: 8.5,
      fontFace: FONT_HEAD,
      bold: true,
      color: st.accent,
      charSpacing: 1.1,
    });

    s.addText(st.title, {
      x: x + 0.2,
      y: 1.85,
      w: 2.45,
      h: 0.55,
      fontSize: 12,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.textDark,
      lineSpacingMultiple: 1.1,
    });

    s.addText(st.desc, {
      x: x + 0.2,
      y: 2.5,
      w: 2.45,
      h: 2.3,
      fontSize: 9.2,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.3,
    });
  });

  s.addNotes('Dalam studi kasus rumah sakit saat krisis antrean pasien, lonjakan ratusan resep dalam waktu singkat dapat membuat satu node server apotek tumbang karena kehabisan buffer memori. Dengan menerapkan load balancing ke dua instance (:8102 dan :8105), kapasitas sistem meningkat dua kali lipat dan risiko kegagalan total dapat dicegah.');
}

// ==========================================
// SLIDE 5: TAKSONOMI ARSITEKTUR LOAD BALANCING
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Taksonomi Arsitektur Sistem',
    [
      { text: 'Client-Side ' },
      { text: 'vs ', options: { color: C.textMuted } },
      { text: 'Server-Side Load Balancing', accent: true },
    ],
    'Dua paradigma penyeimbang beban dalam ekosistem arsitektur microservices modern'
  );

  // Left Card: Server-Side Load Balancing
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('MODEL 1: SERVER-SIDE LOAD BALANCER', {
    x: 0.85,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
  });

  s.addText('Reverse Proxy Terpusat (Nginx / Gateway)', {
    x: 0.85,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 12,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '• Lokasi: Berada di depan klaster server (contoh: Nginx, AWS ALB, Spring Cloud Gateway).\n\n' +
    '• Cara Kerja: Klien luar hanya menembak 1 alamat pintu gerbang. Proxy perantara yang memilih instance dan meneruskan request.\n\n' +
    '• Keunggulan: Klien luar sangat sederhana (tidak perlu tahu arsitektur internal backend).\n\n' +
    '• Konsekuensi: Menambah 1 network hop perantara dan berpotensi menjadi single point of bottleneck jika proxy kelebihan beban.',
    {
      x: 0.85,
      y: 2.2,
      w: 3.75,
      h: 2.6,
      fontSize: 9.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  // Right Card: Client-Side Load Balancing
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('MODEL 2: CLIENT-SIDE LOAD BALANCER', {
    x: 5.4,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.successText,
  });

  s.addText('Konsumen Cerdas (Spring Cloud LB / Python Dispatcher)', {
    x: 5.4,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 12,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '• Lokasi: Tertanam langsung di dalam kode service pemanggil (contoh: Dokter Service).\n\n' +
    '• Cara Kerja: Dokter Service bertanya ke Registry untuk mengambil daftar instance aktif, lalu menjalankan algoritma Round-Robin secara lokal.\n\n' +
    '• Keunggulan: Zero additional network hop! Resep langsung dikirimkan *point-to-point* ke instance Apotek dengan latensi sangat rendah.\n\n' +
    '• Di sistem kita: Kita menerapkan KEDUA TINGKATAN (Gateway Level & Client-Side Inter-Service Level).',
    {
      x: 5.4,
      y: 2.2,
      w: 3.75,
      h: 2.6,
      fontSize: 9.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addNotes('Dalam teori arsitektur, ada dua model penyeimbang beban: Server-side load balancing di mana router perantara yang membagi lalu lintas, dan Client-side load balancing di mana service pengirim sendiri yang memilih instance tujuan berdasarkan data dari registry. Sistem rumah sakit kita menerapkan kedua tingkatan ini secara sinergis.');
}

// ==========================================
// SLIDE 6: ALGORITMA LOAD BALANCING I: ROUND-ROBIN
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Analisis Algoritma Penyeimbang Beban',
    [
      { text: 'Round-Robin: ' },
      { text: 'Distribusi Siklis Berbasis Modulo', accent: true },
    ],
    'Prinsip matematis dan formula giliran berurutan untuk pembagian lalu lintas request yang merata'
  );

  // Left Card: Formula Modulo
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('FORMULA MATEMATIS ROUND-ROBIN', {
    x: 0.85,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
  });

  s.addText('Perputaran Indeks Modulo (N)', {
    x: 0.85,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 12,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  // Formula Container
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.85,
    y: 2.15,
    w: 3.75,
    h: 0.9,
    fill: { color: C.neutralBox },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('index = (request_counter)  %  N', {
    x: 0.95,
    y: 2.35,
    w: 3.55,
    h: 0.35,
    fontSize: 13,
    fontFace: FONT_CODE,
    bold: true,
    color: C.primary,
    align: 'center',
  });
  s.addText('Di mana N = Jumlah total instance aktif yang berstatus UP', {
    x: 0.95,
    y: 2.75,
    w: 3.55,
    h: 0.25,
    fontSize: 8,
    fontFace: FONT_BODY,
    color: C.textMuted,
    align: 'center',
  });

  s.addText(
    'Simulasi 4 Request pada 2 Instance Apotek (N = 2):\n' +
    '• Request #1 (Counter 0) -> 0 % 2 = 0 -> Apotek 1 (:8102)\n' +
    '• Request #2 (Counter 1) -> 1 % 2 = 1 -> Apotek 2 (:8105)\n' +
    '• Request #3 (Counter 2) -> 2 % 2 = 0 -> Apotek 1 (:8102)\n' +
    '• Request #4 (Counter 3) -> 3 % 2 = 1 -> Apotek 2 (:8105)\n' +
    'Hasil: Beban terbagi tepat 50% : 50%!',
    {
      x: 0.85,
      y: 3.15,
      w: 3.75,
      h: 1.8,
      fontSize: 9.2,
      fontFace: FONT_CODE,
      color: C.textMuted,
      lineSpacingMultiple: 1.2,
    }
  );

  // Right Card: Karakteristik & Limitasi
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('KARAKTERISTIK ALGORITMA', {
    x: 5.4,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.successText,
  });

  s.addText('Kelebihan & Limitasi Desain', {
    x: 5.4,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 12,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '✓ Keunggulan Utama:\n' +
    '  - Kompleksitas Waktu O(1): Komputasi instan tanpa overhead CPU.\n' +
    '  - Zero Memory Overhead: Hanya membutuhkan 1 variabel integer counter.\n' +
    '  - Sangat Efektif untuk transaksi mikro berdurasi setara (seperti cetak resep medis).\n\n' +
    '⚠ Limitasi yang Perlu Diperhatikan:\n' +
    '  - Mengasumsikan seluruh server memiliki spesifikasi hardware yang identik (homogen).\n' +
    '  - Mengabaikan durasi eksekusi request (jika resep A butuh racikan rumit, server bisa lebih lambat dibanding resep B).',
    {
      x: 5.4,
      y: 2.2,
      w: 3.75,
      h: 2.6,
      fontSize: 9.3,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addNotes('Algoritma Round-Robin bekerja menggunakan logika siklis berbasis operator modulo. Dengan membagi indeks pencacah terhadap jumlah instance aktif, trafik akan terdistribusi secara bergantian 50:50. Algoritma ini memiliki keunggulan kompleksitas waktu O(1) yang instan, sangat cocok untuk microservices dengan pola beban seragam.');
}

// ==========================================
// SLIDE 7: ALGORITMA LANJUTAN
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Strategi Algoritma Tingkat Lanjut',
    [
      { text: 'Pendekatan Heuristik: ' },
      { text: 'Ketika Server & Beban Tidak Seragam', accent: true },
    ],
    'Tiga alternatif algoritma penyeimbang beban saat menghadapi variasi spesifikasi perangkat keras dan latensi'
  );

  const algos = [
    {
      tag: 'ALGORITMA 01',
      title: 'Weighted Round-Robin',
      desc: 'Memberikan bobot numerik sesuai kapasitas server. Server dengan spesifikasi 16-Core menerima proporsi resep 3x lebih banyak dibanding server lama 4-Core (Rasio 3:1).',
      formula: 'Ratio Bobot: W(A)=3, W(B)=1',
    },
    {
      tag: 'ALGORITMA 02',
      title: 'Least Connections',
      desc: 'Mengarahkan request baru ke instance yang memiliki jumlah koneksi aktif paling sedikit. Sangat efektif jika transaksi resep memiliki durasi racik obat yang berbeda-beda.',
      formula: 'Target = Min(Active_Conn)',
    },
    {
      tag: 'ALGORITMA 03',
      title: 'IP Hash / Session Affinity',
      desc: 'Menghitung hash dari IP klien atau ID Pasien untuk mengunci transaksi ke server yang sama. Memaksimalkan efisiensi in-memory cache data riwayat medis pasien.',
      formula: 'Target = Hash(Patient_ID) % N',
    },
  ];

  algos.forEach((a, idx) => {
    const x = 0.6 + idx * 3.05;
    s.addShape(pptx.shapes.RECTANGLE, {
      x: x,
      y: 1.3,
      w: 2.85,
      h: 3.8,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1 },
    });

    s.addText(a.tag, {
      x: x + 0.2,
      y: 1.5,
      w: 2.45,
      h: 0.25,
      fontSize: 8.5,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.primary,
      charSpacing: 1.1,
    });

    s.addText(a.title, {
      x: x + 0.2,
      y: 1.85,
      w: 2.45,
      h: 0.5,
      fontSize: 12,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.textDark,
      lineSpacingMultiple: 1.1,
    });

    s.addShape(pptx.shapes.RECTANGLE, {
      x: x + 0.2,
      y: 2.45,
      w: 2.45,
      h: 0.4,
      fill: { color: C.neutralBox },
      line: { color: C.cardBorder, width: 1 },
    });
    s.addText(a.formula, {
      x: x + 0.25,
      y: 2.52,
      w: 2.35,
      h: 0.25,
      fontSize: 8,
      fontFace: FONT_CODE,
      color: C.primary,
      bold: true,
    });

    s.addText(a.desc, {
      x: x + 0.2,
      y: 3.0,
      w: 2.45,
      h: 1.9,
      fontSize: 9.2,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    });
  });

  s.addNotes('Selain Round-Robin standar, terdapat algoritma lanjutan: Weighted Round-Robin untuk klaster dengan spek mesin heterogen, Least Connections untuk request dengan waktu pemrosesan tidak seragam, dan IP Hash untuk mengoptimalkan pemanfaatan in-memory cache.');
}

// ==========================================
// SLIDE 8: 4-STEP HORIZONTAL WORKFLOW
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Workflow Sekuensial Sistem',
    [
      { text: 'Alur Kerja Terdistribusi: ' },
      { text: 'Permintaan Klien hingga Eksekusi Multi-Instance', accent: true },
    ],
    'Integrasi dinamis antara API Gateway, Service Registry, dan Klaster Microservice saat penanganan resep'
  );

  const steps = [
    {
      num: 'STEP 01',
      title: 'Client Request ke Gateway',
      desc: 'Aplikasi Web/Mobile Dokter mengirim transaksi resep via HTTP ke API Gateway di port 8000.',
    },
    {
      num: 'STEP 02',
      title: 'Registry Dynamic Lookup',
      desc: 'Gateway / Dokter Service query ke Registry (:8761) menanyakan daftar instance aktif yang berstatus UP.',
    },
    {
      num: 'STEP 03',
      title: 'Modulo Algorithm Selection',
      desc: 'Indeks counter dihitung via modulo (idx % N) untuk memilih instance tujuan berikutnya secara bergiliran.',
    },
    {
      num: 'STEP 04',
      title: 'Dispatch & Execution',
      desc: 'Payload diteruskan ke instance terpilih (:8102 atau :8105) dan mengembalikan respons HTTP 200 OK.',
    },
  ];

  const w = 2.05;
  const h = 3.6;
  const gap = 0.25;
  const startX = 0.6;

  steps.forEach((st, idx) => {
    const x = startX + idx * (w + gap);

    s.addShape(pptx.shapes.RECTANGLE, {
      x: x,
      y: 1.35,
      w: w,
      h: h,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1 },
    });

    // Step Header Pill
    s.addShape(pptx.shapes.RECTANGLE, {
      x: x + 0.15,
      y: 1.55,
      w: 0.9,
      h: 0.28,
      fill: { color: C.primaryLight },
      line: { color: 'BFDBFE', width: 1 },
    });
    s.addText(st.num, {
      x: x + 0.15,
      y: 1.6,
      w: 0.9,
      h: 0.2,
      fontSize: 8,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.primary,
      align: 'center',
    });

    s.addText(st.title, {
      x: x + 0.15,
      y: 2.0,
      w: w - 0.3,
      h: 0.7,
      fontSize: 11,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.textDark,
      lineSpacingMultiple: 1.1,
    });

    s.addText(st.desc, {
      x: x + 0.15,
      y: 2.8,
      w: w - 0.3,
      h: 2.0,
      fontSize: 9,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    });

    // Transition Arrow (except last)
    if (idx < steps.length - 1) {
      s.addText('→', {
        x: x + w + 0.03,
        y: 2.7,
        w: 0.2,
        h: 0.3,
        fontSize: 14,
        fontFace: FONT_HEAD,
        bold: true,
        color: C.primary,
        align: 'center',
      });
    }
  });

  s.addNotes('Slide ini mendemonstrasikan 4 tahapan sekuensial: Mulai dari klien luar yang menembak API Gateway di port 8000, proses pencarian daftar instance sehat ke Registry, penentuan target menggunakan rumus modulo, hingga payload diteruskan dan diproses sukses oleh instance farmasi terpilih.');
}

// ==========================================
// SLIDE 9: SOURCE CODE COMPARISON (JAVA VS PYTHON)
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Implementasi Sumber Kode',
    [
      { text: 'Komparasi Implementasi: ' },
      { text: 'Java Spring Cloud vs Python Native', accent: true },
    ],
    'Menghubungkan anotasi deklaratif enterprise dengan logika prosedural sistem nyata yang kita jalankan'
  );

  // Left Code Box: Spring Cloud LoadBalancer (Java)
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.terminalBg },
    line: { color: C.terminalBar, width: 1 },
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 4.25, h: 0.35, fill: { color: C.terminalBar } });
  s.addText('Java Spring Cloud (application.yml & Code)', { x: 0.8, y: 1.35, w: 3.8, h: 0.25, fontSize: 8.5, fontFace: FONT_CODE, color: C.textMuted });
  s.addText(
    '// 1. Gateway Route via lb:// prefix:\n' +
    'spring:\n' +
    '  cloud:\n' +
    '    gateway:\n' +
    '      routes:\n' +
    '        - id: apotek-service\n' +
    '          uri: lb://APOTEK-SERVICE\n' +
    '          predicates:\n' +
    '            - Path=/api/apotek/**\n\n' +
    '// 2. Client-Side LoadBalancer Bean:\n' +
    '@Bean\n' +
    '@LoadBalanced\n' +
    'public WebClient.Builder loadBalancedClient() {\n' +
    '    return WebClient.builder();\n' +
    '}',
    {
      x: 0.8,
      y: 1.75,
      w: 3.8,
      h: 3.2,
      fontSize: 8.5,
      fontFace: FONT_CODE,
      color: C.codeGreen,
      lineSpacingMultiple: 1.15,
    }
  );

  // Right Code Box: Python Native Round-Robin Dispatcher
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.terminalBg },
    line: { color: C.terminalBar, width: 1 },
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 5.15, y: 1.3, w: 4.25, h: 0.35, fill: { color: C.terminalBar } });
  s.addText('Python Native Dispatcher (registry_server.py)', { x: 5.35, y: 1.35, w: 3.8, h: 0.25, fontSize: 8.5, fontFace: FONT_CODE, color: C.textMuted });
  s.addText(
    '# Ambil seluruh instance yang berstatus UP:\n' +
    'instances = [i for i in REGISTRY[s]["instances"].values()\n' +
    '             if i["status"] == "UP"]\n\n' +
    '# Algoritma Round-Robin Murni via Modulo (%):\n' +
    'idx = REGISTRY[s]["round_robin_idx"] % len(instances)\n' +
    'chosen_instance = instances[idx]\n' +
    'REGISTRY[s]["round_robin_idx"] += 1\n\n' +
    'return jsonify({\n' +
    '    "service_name": s,\n' +
    '    "selected_instance": chosen_instance,\n' +
    '    "active_instances_count": len(instances)\n' +
    '})',
    {
      x: 5.35,
      y: 1.75,
      w: 3.8,
      h: 3.2,
      fontSize: 8,
      fontFace: FONT_CODE,
      color: C.codeCyan,
      lineSpacingMultiple: 1.15,
    }
  );

  s.addNotes('Pada sisi implementasi, di sebelah kiri kami perlihatkan standar Spring Cloud Gateway menggunakan prefiks lb:// yang secara otomatis mengaktifkan load balancer. Di sebelah kanan adalah implementasi murni pada sistem Python kita, di mana indeks modulo berputar dinamis membagi request ke instance sehat.');
}

// ==========================================
// SLIDE 10: RENCANA / PEMBUKTIAN DEMO SISTEM
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Skenario Pengujian & Demonstrasi',
    [
      { text: 'Pembuktian Multi-Port: ' },
      { text: 'Apotek Instance :8102 & :8105', accent: true },
    ],
    'Validasi empiris pembagian beban menggunakan Postman dan observasi rotasi port pada atribut handled_by'
  );

  const boxes = [
    {
      num: 'PENGUJIAN 01',
      title: 'Klaster Multi-Instance Aktif',
      desc: 'Menjalankan Apotek Unit 1 di port 8102 dan Apotek Unit 2 di port 8105. Keduanya terdaftar berstatus UP di Dashboard Registry http://localhost:8761.',
      tag: 'KLASTER SEHAT',
      accent: C.successText,
    },
    {
      num: 'PENGUJIAN 02',
      title: 'Pengujian Postman (Header & Body)',
      desc: 'Mengirim request berulang ke Gateway http://localhost:8000/api/apotek/antrean. Nilai X-Upstream-URL dan atribut JSON handled_by berganti 50:50 antara :8102 dan :8105.',
      tag: 'ROTASI 50:50',
      accent: C.primary,
    },
    {
      num: 'PENGUJIAN 03',
      title: 'Auto-Failover saat Server Mati',
      desc: 'Mematikan salah satu port (Ctrl+C di :8102). Registry otomatis mencoret server mati, dan 100% request berikutnya dialihkan mulus ke port :8105 tanpa error di sisi klien.',
      tag: 'SELF-HEALING',
      accent: C.alertText,
    },
  ];

  boxes.forEach((b, idx) => {
    const x = 0.6 + idx * 3.05;
    s.addShape(pptx.shapes.RECTANGLE, {
      x: x,
      y: 1.3,
      w: 2.85,
      h: 3.8,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1 },
    });

    s.addText(b.num, {
      x: x + 0.2,
      y: 1.5,
      w: 2.45,
      h: 0.25,
      fontSize: 8.5,
      fontFace: FONT_HEAD,
      bold: true,
      color: b.accent,
      charSpacing: 1.1,
    });

    s.addText(b.title, {
      x: x + 0.2,
      y: 1.85,
      w: 2.45,
      h: 0.5,
      fontSize: 12,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.textDark,
      lineSpacingMultiple: 1.1,
    });

    s.addShape(pptx.shapes.RECTANGLE, {
      x: x + 0.2,
      y: 2.45,
      w: 2.45,
      h: 0.35,
      fill: { color: C.neutralBox },
      line: { color: C.cardBorder, width: 1 },
    });
    s.addText(b.tag, {
      x: x + 0.25,
      y: 2.52,
      w: 2.35,
      h: 0.2,
      fontSize: 8,
      fontFace: FONT_HEAD,
      bold: true,
      color: b.accent,
      align: 'center',
    });

    s.addText(b.desc, {
      x: x + 0.2,
      y: 2.95,
      w: 2.45,
      h: 2.0,
      fontSize: 9.2,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    });
  });

  s.addNotes('Pada sesi demonstrasi langsung, kami membuktikan tiga skenario: Pertama, verifikasi dua instance yang terdaftar UP di dashboard. Kedua, pengujian Postman di mana respons JSON dan header berganti-ganti port membuktikan round-robin. Ketiga, simulasi auto-failover saat salah satu server sengaja dimatikan.');
}

// ==========================================
// SLIDE 11: MATRIKS EVALUASI ARSITEKTUR
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Evaluasi & Benchmark Sistem',
    [
      { text: 'Matriks Evaluasi Kinerja: ' },
      { text: 'Single Node vs Multi-Instance LB', accent: true },
    ],
    'Perbandingan kuantitatif dan parameter keandalan sebelum dan sesudah penerapan load balancing'
  );

  // Table Container
  const rows = [
    [
      { text: 'Parameter Evaluasi', options: { bold: true, fill: { color: C.neutralBox }, color: C.textDark } },
      { text: 'Arsitektur Single Node (Lama)', options: { bold: true, fill: { color: C.neutralBox }, color: C.alertText } },
      { text: 'Multi-Instance + Load Balancer', options: { bold: true, fill: { color: C.neutralBox }, color: C.successText } },
    ],
    [
      { text: 'Throughput (Kapasitas Req/Detik)', options: { bold: true } },
      { text: 'Terbatas kapasitas 1 mesin (~400 rps)' },
      { text: 'Meningkat linier N kali lipat (~800+ rps)' },
    ],
    [
      { text: 'Response Time saat Lonjakan Pasien', options: { bold: true } },
      { text: 'Meningkat tajam (Antrean buffer lag)' },
      { text: 'Stabil dan rendah (Beban terbagi rata)' },
    ],
    [
      { text: 'Downtime Risiko Kegagalan', options: { bold: true } },
      { text: 'Single Point of Failure (Sistem mati total)' },
      { text: 'High Availability (Auto-Failover mulus)' },
    ],
    [
      { text: 'Fleksibilitas Penambahan Kapasitas', options: { bold: true } },
      { text: 'Kaku (Harus restart & ubah konfigurasi)' },
      { text: 'Elastis (Nyalakan instance baru di port acak)' },
    ],
    [
      { text: 'Dampak Biaya Hardware', options: { bold: true } },
      { text: 'Perlu server tunggal berspesifikasi mahal' },
      { text: 'Cukup menggunakan klaster mesin komoditas' },
    ],
  ];

  s.addTable(rows, {
    x: 0.6,
    y: 1.35,
    w: 8.8,
    h: 3.7,
    colW: [2.5, 3.15, 3.15],
    border: { pt: 1, color: C.cardBorder },
    fill: { color: C.cardBg },
    fontSize: 9,
    fontFace: FONT_BODY,
    color: C.textDark,
    align: 'left',
    valign: 'middle',
  });

  s.addNotes('Tabel matriks evaluasi ini menegaskan keunggulan arsitektur multi-instance ber-load balancer: Throughput sistem meningkat dua kali lipat, response time tetap stabil saat antrean memuncak, dan risiko downtime tereliminasi berkat kemampuan failover otomatis.');
}

// ==========================================
// SLIDE 12: KESIMPULAN & JEMBATAN MINGGU DEPAN
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Kesimpulan & Jembatan Materi',
    [
      { text: 'Distribusi Beban Optimal & ' },
      { text: 'Fondasi Resiliensi Sistem', accent: true },
    ],
    'Menjawab tantangan skalabilitas dan mengantarkan ke materi pertemuan berikutnya: Circuit Breaker'
  );

  // Left Card: Kesimpulan Load Balancing
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('KESIMPULAN PERTEMUAN HARI INI', {
    x: 0.85,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.successText,
  });

  s.addText('Tiga Pilar Utama Load Balancing', {
    x: 0.85,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 12,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '1. Menghilangkan Hotspot Beban:\n' +
    '   Load Balancer membagi request resep secara merata ke seluruh instance replika tanpa membiarkan satu node pun kelebihan kapasitas.\n\n' +
    '2. Algoritma Round-Robin Efisien:\n' +
    '   Operasi modulo native indeks terbukti ringan, berkecepatan tinggi, dan menjamin distribusi 50:50 yang adil.\n\n' +
    '3. High Availability Sejati:\n' +
    '   Bersinergi dengan Service Discovery, klaster mampu melakukan isolasi server rusak dan pemulihan mandiri.',
    {
      x: 0.85,
      y: 2.2,
      w: 3.75,
      h: 2.6,
      fontSize: 9.3,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  // Right Card: Jembatan ke Pertemuan Berikutnya
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('JEMBATAN MATERI MINGGU DEPAN', {
    x: 5.4,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
  });

  s.addText('Bagaimana Jika Server Mulai Macet (Lag)?', {
    x: 5.4,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 12,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '• Pertanyaan Baru untuk Pertemuan Berikutnya:\n' +
    '  "Jika salah satu instance Apotek tidak mati total, namun mengalami hang/koma sehingga response time-nya mencapai 30 detik, bukankah Round-Robin tetap akan mengirim resep ke server yang lambat tersebut?"\n\n' +
    '• Dampak: Request dokter akan menumpuk dan antrean poli macet (*cascading latency*).\n\n' +
    '• Jawabannya adalah CIRCUIT BREAKER (Resilience4j / Hystrix) yang secara cerdas memutus arus ke server yang sedang sakit!',
    {
      x: 5.4,
      y: 2.2,
      w: 3.75,
      h: 2.6,
      fontSize: 9.3,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addNotes('Sebagai penutup, Load Balancing berhasil membagi beban trafik secara simetris dan adil. Namun, bagaimana jika sebuah server tidak mati total melainkan mengalami lag ekstrem? Masalah tersebut akan kita tuntaskan di materi minggu depan dengan pola Circuit Breaker. Sekian presentasi dari Kelompok 2, kami menyambut pertanyaan dari Bapak M. Zarkasi dan rekan-rekan.');
}

// Generate PPTX File
const outputPath = '/home/firsandia/Desktop/coba/Presentasi_Load_Balancing_Kelompok2.pptx';
await pptx.writeFile({ fileName: outputPath });
console.log(`[OK] PPTX Load Balancing berhasil ditulis ke: ${outputPath}`);
