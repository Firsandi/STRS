import pptxgen from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches (Standard 16:9 widescreen)

// --- Color Palette: Clean Porcelain Light Tech (High Contrast & Crisp for Projectors) ---
const C = {
  bg: 'F8FAFC',          // Crisp Off-White Porcelain (Slate 50)
  cardBg: 'FFFFFF',      // Pure White Card (Clean Depth)
  cardBorder: 'E2E8F0',  // Subtle Technical Hairline (Slate 200)
  cardBorderHover: 'CBD5E1',
  primary: '2563EB',     // Royal Cobalt Blue (Strong Vibrant Accent)
  primaryDark: '1D4ED8', // Deep Cobalt
  primaryLight: 'EFF6FF',// Soft Blue 50 for Badges/Pills
  textDark: '0F172A',    // Deep Charcoal / Slate 900 for high-contrast headings
  textMuted: '475569',   // Slate 600 for crisp body text
  textFaint: '64748B',   // Slate 500 for captions
  terminalBg: '0F172A',  // Deep Obsidian Slate for Terminal Window Contrast
  terminalBar: '1E293B',
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
  warningText: 'D97706', // Amber 600
  accentPurple: '7C3AED',// Deep Violet 600
  neutralBox: 'F1F5F9',  // Slate 100 for secondary containers
};

const FONT_HEAD = 'DejaVu Sans';
const FONT_BODY = 'DejaVu Sans';
const FONT_CODE = 'DejaVu Sans Mono';

function addHeader(slide, kicker, titleParts, subtitle) {
  slide.background = { color: C.bg };

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
      color: p.accent ? C.primary : p.red ? C.alertText : p.green ? C.successText : p.purple ? C.accentPurple : C.textDark,
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

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 0.7,
    w: 8.4,
    h: 4.2,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  // Badge Header
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 1.2,
    y: 1.0,
    w: 7.6,
    h: 0.35,
    fill: { color: C.primaryLight },
    line: { color: 'BFDBFE', width: 1 },
  });

  s.addText('SISTEM TERDISTRIBUSI • FASILKOM UNIVERSITAS JEMBER', {
    x: 1.3,
    y: 1.05,
    w: 7.4,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
    charSpacing: 1.5,
  });

  s.addText(
    [
      { text: 'Service Discovery:\n', options: { color: C.textDark } },
      { text: 'Fondasi Interaksi Dinamis Antar-Microservice', options: { color: C.primary } },
    ],
    {
      x: 1.2,
      y: 1.6,
      w: 7.6,
      h: 1.2,
      fontSize: 24,
      fontFace: FONT_HEAD,
      bold: true,
      lineSpacingMultiple: 1.15,
    }
  );

  s.addText(
    'Studi Kasus Tanggap Darurat Wabah: Mengelola Interaksi Antar-Service & Alamat Dinamis saat Lonjakan Resep Pasien Ekstrem',
    {
      x: 1.2,
      y: 3.0,
      w: 7.6,
      h: 0.7,
      fontSize: 11.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addNotes('Selamat malam Bapak M. Zarkasi dan rekan-rekan kelas Sistem Terdistribusi. Kami dari Kelompok 2 malam ini mempresentasikan materi mengenai Service Discovery: Fondasi Interaksi Dinamis Antar-Microservice, menggunakan studi kasus sistem layanan Rumah Sakit saat krisis wabah. Pertama-tama kami akan memaparkan konsep materi terlebih dahulu, kemudian kita akan membuktikannya melalui live demo sistem, dan diakhiri dengan kesimpulan.');
}

// ==========================================
// SLIDE 2: ANGGOTA KELOMPOK
// ==========================================
{
  const s = pptx.addSlide();
  s.background = { color: C.bg };

  // Outer framed container matching screenshot
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8,
    y: 0.7,
    w: 8.4,
    h: 4.2,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  // Top Kicker Badge: SISTEM TERDISTRIBUSI
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

  // Slide Title
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

  // 3 Member Cards side by side
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

    // Card Box
    s.addShape(pptx.shapes.RECTANGLE, {
      x: cx,
      y: cardY,
      w: cardW,
      h: cardH,
      fill: { color: m.highlight ? 'F0F7FF' : C.neutralBox },
      line: { color: m.highlight ? C.primary : C.cardBorder, width: m.highlight ? 1.5 : 1 },
    });

    // Kicker
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

    // Member Name
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

    // NIM
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

  s.addNotes('Perkenalkan, kami dari Kelompok 2 yang beranggotakan Ridho Rizky Prasetyo, Firsandi Andraw F., dan Ahmad Rafif Nandra U. Pada presentasi malam ini, kami memaparkan implementasi Service Discovery untuk komunikasi dinamis antar-microservice pada sistem rumah sakit saat tanggap darurat wabah.');
}

// ==========================================
// SLIDE 3: KILAS BALIK & BATASAN MASALAH
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Kilas Balik & Batasan Masalah',
    [
      { text: 'Akses Klien ke Gateway ' },
      { text: 'vs ', options: { color: C.textMuted } },
      { text: 'Interaksi Antar-Service', accent: true },
    ],
    'Mengapa keberadaan API Gateway minggu lalu saja belum cukup untuk komunikasi internal antar-service?'
  );

  // Card Left: Akses Gateway
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  s.addText('KILAS BALIK MINGGU LALU: KLIEN KE GATEWAY', {
    x: 0.85,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
  });

  s.addText('Akses Klien dari Luar (API Gateway)', {
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
    '• Klien luar (Aplikasi Web/Mobile Dokter) mengakses pintu gerbang tunggal: http://localhost:8000.\n\n' +
    '• API Gateway bertindak sebagai Reverse Proxy, menyembunyikan port internal microservices dari publik.\n\n' +
    '• BATASAN UTAMA: Gateway hanya mengatur lalu lintas dari luar ke dalam sistem.\n\n' +
    '• Gateway TIDAK mengatur bagaimana Dokter Service memanggil Apotek di dalam sistem backend!',
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

  // Card Right: Interaksi Antar-Service
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.primary, width: 1.5 },
  });

  s.addText('FOKUS MATERI HARI INI: INTERAKSI ANTAR-SERVICE', {
    x: 5.4,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.successText,
  });

  s.addText('Komunikasi Langsung di Balik Layar', {
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
    '• Ketika Dokter menyelesaikan resep obat di poli klinik, Dokter Service harus langsung memanggil:\n' +
    '   1. Apotek Service (alokasi & stok obat).\n' +
    '   2. Kasir Service (pembuatan draf billing tagihan).\n' +
    '   3. EMR Service (arsip rekam medis historis).\n\n' +
    '• TANTANGAN: Jika server Apotek berpindah alamat IP atau port-nya dinamis, bagaimana Dokter Service mengetahuinya?\n\n' +
    '• Di sinilah Service Discovery menjadi mutlak diperlukan!',
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

  s.addNotes('Pada pertemuan minggu lalu, kita telah membahas API Gateway yang mengatur akses request dari klien luar menuju gerbang sistem. Namun pekerjaan belum selesai. Di dalam sistem backend, interaksi terbesar adalah komunikasi antar-service itu sendiri. Saat dokter poli meresepkan obat, sistem harus mengalirkan data ke apotek, kasir, dan rekam medis. Bagaimana Dokter Service tahu ke mana data harus dikirim jika port apotek berubah dinamis? Inilah yang kita bedah hari ini.');
}

// ==========================================
// SLIDE 4: SKENARIO STUDI KASUS (KRISIS WABAH)
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Skenario Krisis Layanan Kesehatan',
    [
      { text: 'Lonjakan Resep Akibat Wabah ' },
      { text: '(KLB / Outbreak Spike)', accent: true },
    ],
    'Karakteristik lonjakan ekstrem (serupa Flash Sale) yang memicu kelahiran port dinamis (ephemeral)'
  );

  // Box 1: Kondisi Normal
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 2.7,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });
  s.addText('1. KONDISI NORMAL', { x: 0.8, y: 1.45, w: 2.3, h: 0.25, fontSize: 8.5, fontFace: FONT_HEAD, bold: true, color: C.primary });
  s.addText('Beban Rendah & Terprediksi', { x: 0.8, y: 1.7, w: 2.3, h: 0.3, fontSize: 11, fontFace: FONT_HEAD, bold: true, color: C.textDark });
  s.addText(
    '• Hari-hari biasa: Poli melayani 1 pasien tiap 10 menit.\n\n' +
    '• 1 Instance Apotek (:8102) cukup melayani seluruh permintaan obat.\n\n' +
    '• Alamat IP & Port stabil dan dapat diprediksi secara statis.',
    { x: 0.8, y: 2.1, w: 2.3, h: 2.7, fontSize: 9, fontFace: FONT_BODY, color: C.textMuted, lineSpacingMultiple: 1.2 }
  );

  // Box 2: Krisis Wabah
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 3.65,
    y: 1.3,
    w: 2.7,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.warningText, width: 1.5 },
  });
  s.addText('2. KRISIS WABAH / KLB (SPIKE)', { x: 3.85, y: 1.45, w: 2.3, h: 0.25, fontSize: 8.5, fontFace: FONT_HEAD, bold: true, color: C.warningText });
  s.addText('Lonjakan Pasien 100x Lipat', { x: 3.85, y: 1.7, w: 2.3, h: 0.3, fontSize: 11, fontFace: FONT_HEAD, bold: true, color: C.textDark });
  s.addText(
    '• Terjadi wabah infeksi menular massal: Ratusan pasien membanjiri IGD & Poli per menit.\n\n' +
    '• Karakteristik komputasi: Unpredictable Traffic Spike persis seperti Flash Sale e-commerce!\n\n' +
    '• Server Apotek tunggal (:8102) kehabisan buffer memori & CPU 100% (CRASH).',
    { x: 3.85, y: 2.1, w: 2.3, h: 2.7, fontSize: 9, fontFace: FONT_BODY, color: C.textMuted, lineSpacingMultiple: 1.2 }
  );

  // Box 3: Scale-Out Port Dinamis
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 6.7,
    y: 1.3,
    w: 2.7,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.alertText, width: 1.5 },
  });
  s.addText('3. SCALE-OUT PORT DINAMIS', { x: 6.9, y: 1.45, w: 2.3, h: 0.25, fontSize: 8.5, fontFace: FONT_HEAD, bold: true, color: C.alertText });
  s.addText('Ephemeral Instance (:8105)', { x: 6.9, y: 1.7, w: 2.3, h: 0.3, fontSize: 11, fontFace: FONT_HEAD, bold: true, color: C.textDark });
  s.addText(
    '• Rumah Sakit mengaktifkan unit Apotek darurat baru di port dinamis acak :8105.\n\n' +
    '• MASALAH: Jika Dokter Service masih hardcode :8102, resep darurat GAGAL terkirim.\n\n' +
    '• Instance baru menganggur, sementara resep obat macet total!',
    { x: 6.9, y: 2.1, w: 2.3, h: 2.7, fontSize: 9, fontFace: FONT_BODY, color: C.textMuted, lineSpacingMultiple: 1.2 }
  );

  s.addNotes('Mari kita bedah skenario lonjakan beban ini. Dalam sistem kesehatan rumah sakit, analogi flash sale terjadi nyata saat krisis wabah menular atau Kejadian Luar Biasa. Ratusan pasien tiba-tiba datang bersamaan. Server apotek tunggal kolaps. Rumah sakit harus melakukan auto-scale instance apotek darurat di port dinamis acak, misalnya 8105.');
}

// ==========================================
// SLIDE 5: AKAR MASALAH ARSITEKTUR (KELEMAHAN HARDCODED)
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Akar Masalah Arsitektur',
    [
      { text: 'Kelemahan Fatal Komunikasi ' },
      { text: 'Secara Hardcoded (Statis)', red: true },
    ],
    'Mengapa menanam alamat URL fisik di dalam kode microservice adalah anti-pattern fatal'
  );

  // Terminal Simulator (Dark Slate Contrast)
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 5.0,
    h: 3.8,
    fill: { color: C.terminalBg },
    line: { color: C.terminalBar, width: 1 },
  });

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 5.0,
    h: 0.35,
    fill: { color: C.terminalBar },
  });
  s.addText('dokter_service.py (Anti-Pattern Hardcode)', {
    x: 0.8,
    y: 1.35,
    w: 4.6,
    h: 0.25,
    fontSize: 8.5,
    fontFace: FONT_CODE,
    color: '#F87171',
    bold: true,
  });

  s.addText(
    '# KODE STATIS TANPA SERVICE DISCOVERY:\n' +
    'def kirim_resep(payload):\n' +
    '    # Hardcoded port fisik apotek:\n' +
    '    url = "http://192.168.1.15:8102/api/apotek/sync"\n' +
    '    try:\n' +
    '        requests.post(url, json=payload, timeout=2)\n' +
    '    except requests.exceptions.ConnectionError:\n' +
    '        log.error("Koneksi Gagal ke Port 8102!")\n\n' +
    '# SIMULASI DAMPAK SAAT KRISIS WABAH:\n' +
    '[ERROR] ConnectionRefusedError: [Errno 111]\n' +
    '        Server :8102 hang kehabisan memory\n' +
    '[WARN]  Unit Apotek darurat :8105 tidak menerima resep!\n' +
    '[FATAL] CASCADING FAILURE KE KASIR & REKAM MEDIS',
    {
      x: 0.8,
      y: 1.75,
      w: 4.6,
      h: 3.2,
      fontSize: 8.5,
      fontFace: FONT_CODE,
      color: C.codeCyan,
      lineSpacingMultiple: 1.15,
    }
  );

  // Explanation Cards
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.9,
    y: 1.3,
    w: 3.5,
    h: 1.15,
    fill: { color: C.alertBg },
    line: { color: C.alertBorder, width: 1 },
  });
  s.addText('1. Tight Coupling (Keterikatan Fisik)', { x: 6.05, y: 1.4, w: 3.2, h: 0.25, fontSize: 10, fontFace: FONT_HEAD, bold: true, color: C.alertText });
  s.addText('Dokter Service terikat mati dengan port 8102. Ketika alamat berubah, aplikasi dokter langsung lumpuh.', { x: 6.05, y: 1.65, w: 3.2, h: 0.7, fontSize: 8.5, fontFace: FONT_BODY, color: C.textMuted });

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.9,
    y: 2.6,
    w: 3.5,
    h: 1.15,
    fill: { color: 'FFFBEB' },
    line: { color: 'FDE68A', width: 1 },
  });
  s.addText('2. Zero Scalability Awareness', { x: 6.05, y: 2.7, w: 3.2, h: 0.25, fontSize: 10, fontFace: FONT_HEAD, bold: true, color: C.warningText });
  s.addText('Dokter Service buta terhadap instance Apotek baru yang lahir di port 8105 saat lonjakan resep pasien wabah.', { x: 6.05, y: 2.95, w: 3.2, h: 0.7, fontSize: 8.5, fontFace: FONT_BODY, color: C.textMuted });

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.9,
    y: 3.9,
    w: 3.5,
    h: 1.2,
    fill: { color: C.alertBg },
    line: { color: C.alertBorder, width: 1 },
  });
  s.addText('3. Cascading Failure', { x: 6.05, y: 4.0, w: 3.2, h: 0.25, fontSize: 10, fontFace: FONT_HEAD, bold: true, color: C.alertText });
  s.addText('Thread dokter tertahan menunggu timeout port 8102, menyebabkan kegagalan beruntun ke sistem kasir dan EMR.', { x: 6.05, y: 4.25, w: 3.2, h: 0.75, fontSize: 8.5, fontFace: FONT_BODY, color: C.textMuted });

  s.addNotes('Inilah akar masalah dari pendekatan hardcoded. Pada kode di sebelah kiri, Dokter Service langsung menembak IP dan port 8102. Ketika terjadi lonjakan traffic dan server 8102 crash, pemanggilan langsung menghasilkan ConnectionRefusedError. Dokter Service tidak mengetahui bahwa sebenarnya sudah ada unit Apotek darurat yang baru dinyalakan di port 8105. Keterikatan kaku ini menyebabkan efek domino atau cascading failure.');
}

// ==========================================
// SLIDE 6: SOLUSI: SERVICE DISCOVERY PATTERN
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Solusi Fundamental',
    [
      { text: 'Service Discovery Pattern: ' },
      { text: 'Buku Telepon Dinamis', accent: true },
    ],
    'Memisahkan identitas logis service dari alamat fisik jaringannya'
  );

  // 3 Component Cards Horizontal
  const components = [
    {
      role: 'SERVICE PROVIDER',
      name: 'Apotek / Kasir / EMR',
      badge: 'PRODUCER',
      color: C.successText,
      desc: '• Saat startup, mendaftarkan identitas:\n   - Service Name: "APOTEK-SERVICE"\n   - Instance URL: "http://localhost:8105"\n• Mengirim denyut jantung (heartbeat) berkala membuktikan CPU & port sehat.',
      x: 0.6,
    },
    {
      role: 'SERVICE REGISTRY',
      name: 'Eureka / Registry Server',
      badge: 'SOURCE OF TRUTH',
      color: C.primary,
      desc: '• Bertindak sebagai database alamat dinamis (Central Phonebook :8761).\n• Menyimpan katalog metadata instance aktif.\n• Menghapus otomatis (evict) instance yang mati jika heartbeat berhenti.',
      x: 3.65,
    },
    {
      role: 'SERVICE CONSUMER',
      name: 'Dokter Service',
      badge: 'CONSUMER',
      color: C.accentPurple,
      desc: '• Tidak lagi menyimpan IP atau Port fisik siapapun.\n• Cukup bertanya nama logis: "APOTEK-SERVICE".\n• Melakukan query (lookup) ke Registry sebelum mengirimkan request data resep.',
      x: 6.7,
    },
  ];

  components.forEach((c) => {
    s.addShape(pptx.shapes.RECTANGLE, {
      x: c.x,
      y: 1.3,
      w: 2.7,
      h: 3.8,
      fill: { color: C.cardBg },
      line: { color: c.color, width: 1.5 },
    });

    s.addText(c.role, {
      x: c.x + 0.2,
      y: 1.45,
      w: 2.3,
      h: 0.25,
      fontSize: 8.5,
      fontFace: FONT_HEAD,
      bold: true,
      color: c.color,
    });

    s.addText(c.name, {
      x: c.x + 0.2,
      y: 1.7,
      w: 2.3,
      h: 0.35,
      fontSize: 11,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.textDark,
    });

    s.addText(c.desc, {
      x: c.x + 0.2,
      y: 2.15,
      w: 2.3,
      h: 2.7,
      fontSize: 9,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    });
  });

  s.addNotes('Untuk mengatasi problem alamat dinamis tersebut, pola standar dalam sistem terdistribusi adalah Service Discovery Pattern. Pola ini bekerja persis seperti buku telepon dinamis atau Yellow Pages. Terdapat 3 entitas utama: Pertama, Service Provider seperti Apotek yang mendaftarkan alamatnya saat aktif. Kedua, Service Registry sebagai pusat data katalog alamat aktif. Dan ketiga, Service Consumer seperti Dokter Service yang cukup menanyakan nama logis ke Registry untuk memperoleh alamat fisik yang valid.');
}

// ==========================================
// SLIDE 7: SIKLUS HIDUP LAYANAN (LIFECYCLE)
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Mekanisme Operasional',
    [
      { text: 'Empat Tahap Siklus Hidup ' },
      { text: 'Service Discovery', accent: true },
    ],
    'Bagaimana registry menjamin katalog layanan selalu akurat dan self-healing'
  );

  const steps = [
    { num: '01', title: 'Registration', sub: 'Pendaftaran Awal', desc: 'Saat instance Apotek darurat (:8105) menyala, ia memanggil POST /register ke registry membawa metadata (ID, URL, status UP).' },
    { num: '02', title: 'Heartbeat / Keep-Alive', sub: 'Pemeriksaan Kesehatan', desc: 'Tiap 10-30 detik instance mengirim ping di background daemon thread. Menandakan CPU & jaringan siap melayani resep.' },
    { num: '03', title: 'Lookup / Resolution', sub: 'Pencarian Alamat', desc: 'Dokter Service memanggil GET /services/APOTEK-SERVICE untuk memperoleh alamat URI aktif (:8105) sebelum kirim data.' },
    { num: '04', title: 'Eviction / Self-Healing', sub: 'Pembersihan Otomatis', desc: 'Jika instance crash atau tidak mengirim heartbeat selama batas ambang, registry otomatis mencoretnya dari katalog.' },
  ];

  steps.forEach((st, idx) => {
    const xPos = 0.6 + idx * 2.25;
    s.addShape(pptx.shapes.RECTANGLE, {
      x: xPos,
      y: 1.3,
      w: 2.05,
      h: 3.8,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1 },
    });

    s.addText(st.num, {
      x: xPos + 0.15,
      y: 1.45,
      w: 1.75,
      h: 0.35,
      fontSize: 18,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.primary,
    });

    s.addText(st.title, {
      x: xPos + 0.15,
      y: 1.85,
      w: 1.75,
      h: 0.3,
      fontSize: 10,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.textDark,
    });

    s.addText(st.sub, {
      x: xPos + 0.15,
      y: 2.15,
      w: 1.75,
      h: 0.25,
      fontSize: 8.5,
      fontFace: FONT_BODY,
      color: C.successText,
    });

    s.addText(st.desc, {
      x: xPos + 0.15,
      y: 2.5,
      w: 1.75,
      h: 2.4,
      fontSize: 8.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.2,
    });
  });

  s.addNotes('Ada 4 siklus operasional yang wajib dipahami: Pertama, Registration: saat service menyala, ia mendaftarkan diri. Kedua, Heartbeat: pembuktian hidup secara periodik melalui thread background. Ketiga, Resolution: pemanggilan alamat dinamis saat transaksi terjadi. Dan keempat, Eviction atau Self-Healing: pembersihan instance yang mati agar tidak ada request resep yang terkirim ke server rusak.');
}

// ==========================================
// SLIDE 8: DUA MODEL ARSITEKTUR DISCOVERY
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Pilihan Arsitektur',
    [
      { text: 'Client-Side Discovery ' },
      { text: 'vs ', options: { color: C.textMuted } },
      { text: 'Server-Side Discovery', accent: true },
    ],
    'Dua filosofi utama penyelesaian alamat dalam ekosistem sistem terdistribusi'
  );

  // Left Card: Client-Side
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.primary, width: 1.5 },
  });

  s.addText('MODEL 1: CLIENT-SIDE DISCOVERY (PENDEKATAN KITA)', {
    x: 0.85,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 8.5,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
  });

  s.addText('Service Konsumen Bertanya Langsung', {
    x: 0.85,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 11.5,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '• Alur: Dokter Service bertanya ke Registry -> Dapatkan port :8105 -> Kirim HTTP langsung ke :8105.\n\n' +
    '• Implementasi Populer: Netflix Eureka Client, Spring Cloud OpenFeign.\n\n' +
    '• Keunggulan: Sangat cepat (Zero additional network hops), tidak membebani router terpusat.\n\n' +
    '• Konsekuensi: Klien harus memiliki modul client helper untuk query ke registry.',
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

  // Right Card: Server-Side
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.accentPurple, width: 1.5 },
  });

  s.addText('MODEL 2: SERVER-SIDE DISCOVERY (KUBERNETES / AWS)', {
    x: 5.4,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 8.5,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.accentPurple,
  });

  s.addText('Router / Proxy Perantara yang Mencari', {
    x: 5.4,
    y: 1.75,
    w: 3.75,
    h: 0.35,
    fontSize: 11.5,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '• Alur: Dokter memanggil Router/Gateway virtual -> Router yang bertanya ke Registry -> Meneruskan ke Apotek.\n\n' +
    '• Implementasi Populer: Kubernetes Service (CoreDNS / kube-proxy), AWS ALB, HashiCorp Consul + Envoy.\n\n' +
    '• Keunggulan: Kode klien sangat sederhana (agnostik bahasa pemrograman).\n\n' +
    '• Konsekuensi: Menambah satu network hop perantara.',
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

  s.addNotes('Dalam literatur sistem terdistribusi, terdapat dua pendekatan arsitektur: Client-Side Discovery dan Server-Side Discovery. Pada Client-Side Discovery seperti Netflix Eureka dan pendekatan kita, service konsumen sendiri yang menghubungi registry lalu menembak langsung targetnya. Keunggulannya adalah performa yang sangat tinggi tanpa hop tambahan. Sedangkan Server-Side Discovery seperti Kubernetes Service memanfaatkan proxy perantara sehingga kode konsumen tidak perlu dependensi library khusus.');
}

// ==========================================
// SLIDE 9: DESAIN INTERAKSI ANTHAR-SERVICE RUMAH SAKIT
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Desain Arsitektur Sistem',
    [
      { text: 'Rangkaian Alur Resep: ' },
      { text: 'Dokter ke Apotek, Kasir & EMR', accent: true },
    ],
    'Bagaimana data resep wabah didistribusikan secara dinamis tanpa konfigurasi statis'
  );

  // Sequence Flow Container
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 8.8,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1 },
  });

  const flows = [
    { step: '1', title: 'Dokter Terbitkan Resep Wabah RSP-WABAH-9921', desc: 'Data resep obat darurat pasien wabah diinput di Poli Klinik.', color: C.primary },
    { step: '2', title: 'Lookup ke Registry (:8761)', desc: 'Dokter Service menanyakan alamat aktif "APOTEK-SERVICE", "KASIR-SERVICE", dan "EMR-SERVICE".', color: C.warningText },
    { step: '3', title: 'Resolusi Endpoint Dinamis', desc: 'Registry mengembalikan URL aktif saat ini (unit Apotek darurat di port dinamis :8105).', color: C.successText },
    { step: '4', title: 'Eksekusi Sinkronisasi Data (HTTP 200 OK)', desc: 'Data obat darurat terkirim tepat sasaran tanpa hardcoded IP/port, terhindar dari cascading failure.', color: C.textDark },
  ];

  flows.forEach((f, i) => {
    const yBox = 1.45 + i * 0.85;
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.9,
      y: yBox,
      w: 8.2,
      h: 0.72,
      fill: { color: C.neutralBox },
      line: { color: C.cardBorder, width: 1 },
    });

    s.addText(`LANGKAH ${f.step}: ${f.title.toUpperCase()}`, {
      x: 1.1,
      y: yBox + 0.1,
      w: 7.8,
      h: 0.22,
      fontSize: 9,
      fontFace: FONT_HEAD,
      bold: true,
      color: f.color,
    });

    s.addText(f.desc, {
      x: 1.1,
      y: yBox + 0.35,
      w: 7.8,
      h: 0.28,
      fontSize: 9,
      fontFace: FONT_BODY,
      color: C.textMuted,
    });
  });

  s.addNotes('Slide ini menggambarkan alur sekuensial pengiriman resep. Saat dokter menyelesaikan resep obat wabah, Dokter Service tidak langsung menembak port statis. Melainkan melakukan resolusi nama logis ke Service Registry di port 8761. Registry memberikan URI instance aktif yang sehat di port 8105, lalu Dokter Service mengeksekusi transfer payload ke Apotek, Kasir, dan EMR secara tepat.');
}

// ==========================================
// SLIDE 10: IMPLEMENTASI TEKNIS & PEMBUKTIAN KODE
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Implementasi & Kode Sumber',
    [
      { text: 'Standar Industri Java ' },
      { text: '& Implementasi Sistem Kita', accent: true },
    ],
    'Menghubungkan teori perkuliahan Spring Cloud Eureka dengan kode nyata yang akan kita demokan'
  );

  // Left Code Box: Spring Cloud Standard (Dark Slate Contrast)
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.terminalBg },
    line: { color: C.terminalBar, width: 1 },
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 4.25, h: 0.35, fill: { color: C.terminalBar } });
  s.addText('Spring Cloud Eureka (Java Reference)', { x: 0.8, y: 1.35, w: 3.8, h: 0.25, fontSize: 8.5, fontFace: FONT_CODE, color: C.textMuted });
  s.addText(
    '// 1. Eureka Server Annotation:\n' +
    '@SpringBootApplication\n' +
    '@EnableEurekaServer\n' +
    'public class DiscoveryServerApplication {}\n\n' +
    '// 2. Client application.yml:\n' +
    'spring:\n' +
    '  application:\n' +
    '    name: APOTEK-SERVICE\n' +
    'eureka:\n' +
    '  client:\n' +
    '    service-url:\n' +
    '      defaultZone: http://localhost:8761/eureka/\n' +
    '  instance:\n' +
    '    prefer-ip-address: true',
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

  // Right Code Box: System Implementation (Python / REST Discovery)
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.terminalBg },
    line: { color: C.terminalBar, width: 1 },
  });
  s.addShape(pptx.shapes.RECTANGLE, { x: 5.15, y: 1.3, w: 4.25, h: 0.35, fill: { color: C.terminalBar } });
  s.addText('Implementasi Sistem Kita (client_helper.py)', { x: 5.35, y: 1.35, w: 3.8, h: 0.25, fontSize: 8.5, fontFace: FONT_CODE, color: C.textMuted });
  s.addText(
    '# Pendaftaran Otomatis + Heartbeat Daemon:\n' +
    'def register_to_discovery(name, inst_id, url):\n' +
    '    requests.post("http://localhost:8761/register",\n' +
    '        json={"service_name": name,\n' +
    '              "instance_id": inst_id, "url": url})\n' +
    '    \n' +
    '    # Background Daemon Heartbeat Thread:\n' +
    '    def _ping():\n' +
    '        while True:\n' +
    '            time.sleep(10)\n' +
    '            requests.post("http://localhost:8761/heartbeat",\n' +
    '                json={"service_name": name, "instance_id": inst_id})\n' +
    '    threading.Thread(target=_ping, daemon=True).start()',
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

  s.addNotes('Untuk menjaga kesinambungan dengan perkuliahan, di sisi kiri adalah konfigurasi standar Spring Cloud Netflix Eureka di Java. Dan di sisi kanan adalah implementasi fungsional pada sistem kita di file client_helper.py, di mana registrasi dan heartbeat dijalankan otomatis oleh background daemon thread.');
}

// ==========================================
// SLIDE 11: SESI LIVE DEMO (TRANSISI DEMO)
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Sesi Pengujian Langsung',
    [
      { text: 'Live Demo: ' },
      { text: 'Pembuktian Teori pada Sistem Nyata', accent: true },
    ],
    'Menyaksikan langsung kegagalan hardcode dan keberhasilan Service Discovery di terminal & browser'
  );

  // 3 Demo Stage Cards
  const demoCards = [
    {
      phase: 'FASE 1: BUKTI MASALAH',
      title: 'Kegagalan Hardcode saat Crash',
      badge: 'PROBLEM',
      color: C.alertText,
      desc: '• Server Apotek lama (:8102) mati akibat kelebihan beban resep wabah.\n\n• Dokter Service mencoba memanggil alamat hardcode :8102.\n\n• Hasil: ConnectionRefusedError! Resep gagal terkirim (Cascading Failure).',
      x: 0.6,
    },
    {
      phase: 'FASE 2: SCALE-OUT DARURAT',
      title: 'Pendaftaran Unit Dinamis :8105',
      badge: 'SCALE-OUT',
      color: C.warningText,
      desc: '• Rumah Sakit menyalakan unit Apotek darurat di port dinamis acak :8105.\n\n• Instance baru otomatis memanggil POST /register ke Registry (:8761).\n\n• Bukti Visual: Dashboard browser menampilkan status UP.',
      x: 3.65,
    },
    {
      phase: 'FASE 3: DYNAMIC LOOKUP',
      title: 'Resolusi & Transmisi Sukses',
      badge: 'SUCCESS',
      color: C.successText,
      desc: '• Dokter Service bertanya ke Registry: "Siapa APOTEK-SERVICE aktif?".\n\n• Registry mengembalikan URL :8105.\n\n• Dokter sukses mengirim resep wabah: HTTP 200 OK tanpa ubah kode!',
      x: 6.7,
    },
  ];

  demoCards.forEach((c) => {
    s.addShape(pptx.shapes.RECTANGLE, {
      x: c.x,
      y: 1.3,
      w: 2.7,
      h: 3.8,
      fill: { color: C.cardBg },
      line: { color: c.color, width: 1.5 },
    });

    s.addText(c.phase, {
      x: c.x + 0.2,
      y: 1.45,
      w: 2.3,
      h: 0.25,
      fontSize: 8,
      fontFace: FONT_HEAD,
      bold: true,
      color: c.color,
    });

    s.addText(c.title, {
      x: c.x + 0.2,
      y: 1.7,
      w: 2.3,
      h: 0.35,
      fontSize: 10.5,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.textDark,
    });

    s.addText(c.desc, {
      x: c.x + 0.2,
      y: 2.15,
      w: 2.3,
      h: 2.7,
      fontSize: 9,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    });
  });

  s.addNotes('Bapak Zarkasi dan rekan-rekan, seluruh konsep teori dan arsitektur telah selesai kami paparkan. Sekarang, mari kita buktikan secara nyata di sistem melalui Live Demo di terminal dan browser dashboard sebelum kita menarik kesimpulan akhir.');
}

// ==========================================
// SLIDE 12: MATRIKS EVALUASI PASCA-DEMO
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Evaluasi Pembuktian Demo',
    [
      { text: 'Matriks Evaluasi: ' },
      { text: 'Hardcoded Direct vs Service Discovery', accent: true },
    ],
    'Bukti peningkatan skalabilitas, keandalan, dan kemudahan operasional yang baru saja kita amati bersama'
  );

  // Table with clean porcelain light style
  const tableData = [
    [
      { text: 'Parameter Evaluasi', options: { bold: true, color: C.primary, fill: 'E2E8F0' } },
      { text: 'Pendekatan Lama (Hardcoded)', options: { bold: true, color: C.alertText, fill: 'E2E8F0' } },
      { text: 'Dengan Service Discovery', options: { bold: true, color: C.successText, fill: 'E2E8F0' } },
    ],
    [
      { text: 'Keterikatan Alamat (Coupling)', options: { bold: true, color: C.textDark, fill: 'FFFFFF' } },
      { text: 'Tinggi (Tergantung IP & Port fisik statis)', options: { color: C.textMuted, fill: 'FFFFFF' } },
      { text: 'Rendah (Terkopel ke Logical Service Name)', options: { color: C.successText, fill: 'FFFFFF' } },
    ],
    [
      { text: 'Skalabilitas saat Wabah / Lonjakan Ekstrem', options: { bold: true, color: C.textDark, fill: 'F8FAFC' } },
      { text: 'Nol (Instance darurat :8105 tidak terjangkau)', options: { color: C.alertText, fill: 'F8FAFC' } },
      { text: 'Elastis (Instance darurat langsung terdaftar otomatis)', options: { color: C.successText, fill: 'F8FAFC' } },
    ],
    [
      { text: 'Downtime saat Deployment / Pindah Port', options: { bold: true, color: C.textDark, fill: 'FFFFFF' } },
      { text: 'Tinggi (Wajib re-compile / restart client)', options: { color: C.alertText, fill: 'FFFFFF' } },
      { text: 'Zero Downtime (Pembaruan katalog seketika)', options: { color: C.successText, fill: 'FFFFFF' } },
    ],
    [
      { text: 'Penanganan Kegagalan (Fault Tolerance)', options: { bold: true, color: C.textDark, fill: 'F8FAFC' } },
      { text: 'Cascading Failure (Request terus terkirim ke server mati)', options: { color: C.alertText, fill: 'F8FAFC' } },
      { text: 'Self-Healing (Instance mati dieviction via heartbeat)', options: { color: C.successText, fill: 'F8FAFC' } },
    ],
  ];

  s.addTable(tableData, {
    x: 0.6,
    y: 1.3,
    w: 8.8,
    h: 3.8,
    fontSize: 9.5,
    fontFace: FONT_BODY,
    align: 'left',
    valign: 'middle',
    border: { pt: 1, color: C.cardBorder },
  });

  s.addNotes('Setelah demo berhasil dijalankan, tabel matriks ini menyimpulkan keunggulan mutlak Service Discovery. Kita melihat sendiri di demo bahwa instance darurat di port 8105 langsung terdaftar dan dapat menerima resep dalam hitungan detik, serta terhindar dari cascading failure.');
}

// ==========================================
// SLIDE 13: KESIMPULAN & JEMBATAN MINGGU DEPAN
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Kesimpulan Akhir & Arah Perkuliahan',
    [
      { text: 'Kesimpulan Hari Ini & ' },
      { text: 'Jembatan ke Materi Minggu Depan', accent: true },
    ],
    'Bagaimana Service Discovery membuka jalan bagi implementasi Load Balancing'
  );

  // Left Card: Kesimpulan Hari Ini
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.successText, width: 1.5 },
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

  s.addText('Service Discovery Menyelesaikan Lokasi', {
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
    '1. Interaksi antar-microservice tidak boleh bergantung pada IP dan Port statis.\n\n' +
    '2. Service Registry bertindak sebagai Single Source of Truth katalog kesehatan layanan.\n\n' +
    '3. Service Discovery menjawab tuntas pertanyaan fundamental: "DI MANA alamat service yang sedang sehat dan aktif?"',
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

  // Right Card: Jembatan Minggu Depan
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.15,
    y: 1.3,
    w: 4.25,
    h: 3.8,
    fill: { color: C.cardBg },
    line: { color: C.primary, width: 1.5 },
  });

  s.addText('JEMBATAN KE MATERI MINGGU DEPAN', {
    x: 5.4,
    y: 1.45,
    w: 3.75,
    h: 0.25,
    fontSize: 9,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
  });

  s.addText('Load Balancing: Membagi Beban Antara Instance', {
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
    '• Hari ini kita berhasil: Mengetahui bahwa ada beberapa instance Apotek yang aktif (:8102 dan :8105).\n\n' +
    '• Pertanyaan Baru untuk Pertemuan Berikutnya:\n' +
    '  "Jika ada 3 instance Apotek yang sama-sama sehat, instance mana yang harus menerima resep dari Dokter A dan Dokter B?"\n\n' +
    '• Jawabannya adalah LOAD BALANCING (Round Robin, Least Connections, Weighted) yang akan kita bedah di pertemuan minggu depan!',
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

  s.addNotes('Sebagai penutup, hari ini materi dan demo kita telah membuktikan bahwa Service Discovery berhasil memecahkan persoalan lokasi: "Di mana alamat service yang aktif?". Namun, jika Registry mengembalikan beberapa instance yang sama-sama sehat, instance mana yang harus dipilih? Pertanyaan krusial inilah yang mengantarkan kita ke topik minggu depan: Load Balancing. Sekian presentasi dari Kelompok 2, kami menyambut pertanyaan dari Bapak Zarkasi dan rekan-rekan.');
}

// Generate PPTX File to BOTH files
const outputPath1 = '/home/firsandia/Desktop/coba/Presentasi_Service_Discovery_Kelompok2.pptx';
const outputPath2 = '/home/firsandia/Desktop/coba/Presentasi_API_Gateway_dan_Service_Discovery.pptx';

await pptx.writeFile({ fileName: outputPath1 });
console.log(`[OK] PPTX berhasil ditulis ke: ${outputPath1}`);

try {
  fs.copyFileSync(outputPath1, outputPath2);
  console.log(`[OK] PPTX juga disinkronkan ke: ${outputPath2}`);
} catch (err) {
  console.error(`[ERROR] Gagal copy file kedua:`, err);
}
