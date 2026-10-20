import pptxgen from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches (Standard 16:9 widescreen)

// --- Color Palette: Sleek Obsidian Dark Technical Theme (No Rainbow) ---
const C = {
  bg: '090D16',          // Deep Obsidian Slate
  cardBg: '111827',      // Matte Dark Slate
  cardBorder: '1E293B',  // Subtle Technical Hairline
  cardBorderHover: '334155',
  primary: '38BDF8',     // Electric Ice Cyan
  primaryDark: '0284C7',
  textDark: 'F8FAFC',    // Crisp Headings
  textMuted: '94A3B8',   // Secondary Spec Text
  textFaint: '64748B',   // Annotations
  terminalBg: '070B14',  // Pure Terminal Black
  terminalBar: '1E293B',
  terminalText: 'E2E8F0',
  codeCyan: '38BDF8',
  codeGreen: '4ADE80',
  codeYellow: 'FACC15',
  alertBg: '1C0A0A',
  alertBorder: '7F1D1D',
  alertText: 'FCA5A5',
  successBg: '062817',
  successBorder: '065F46',
  successText: '34D399',
};

const FONT_HEAD = 'DejaVu Sans';
const FONT_BODY = 'DejaVu Sans';
const FONT_CODE = 'DejaVu Sans Mono';

function addHeader(slide, kicker, titleParts, subtitle) {
  slide.background = { color: C.bg };

  slide.addText(kicker.toUpperCase(), {
    x: 0.6,
    y: 0.35,
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
      color: p.accent ? C.primary : p.red ? '#F87171' : p.green ? '#34D399' : C.textDark,
      bold: true,
    },
  }));

  slide.addText(titleRuns, {
    x: 0.6,
    y: 0.55,
    w: 8.8,
    h: 0.38,
    fontSize: 17,
    fontFace: FONT_HEAD,
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.6,
      y: 0.92,
      w: 8.8,
      h: 0.25,
      fontSize: 10,
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
    y: 0.8,
    w: 8.4,
    h: 4.0,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('SISTEM TERDISTRIBUSI • FASILKOM UNIVERSITAS JEMBER', {
    x: 1.2,
    y: 1.2,
    w: 7.6,
    h: 0.3,
    fontSize: 10.5,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
    charSpacing: 2,
  });

  s.addText(
    [
      { text: 'API Gateway &\n', options: { color: C.textDark } },
      { text: 'Service Discovery', options: { color: C.primary } },
    ],
    {
      x: 1.2,
      y: 1.55,
      w: 7.6,
      h: 1.2,
      fontSize: 28,
      fontFace: FONT_HEAD,
      bold: true,
      lineSpacingMultiple: 1.1,
    }
  );

  s.addText(
    'Evolusi Arsitektur Sistem Terdistribusi: Mengatasi Keterbatasan Hardcoded Routing Menuju Dynamic Service Registry pada Studi Kasus Layanan Rumah Sakit',
    {
      x: 1.2,
      y: 2.9,
      w: 7.6,
      h: 0.5,
      fontSize: 11.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
    }
  );

  s.addText(
    'Kelompok 2: Ridho Rizky Prasetyo • Firsandi Andraw F. • Ahmad Rafif Nandra U.\nDosen Pengampu: M. Zarkasi, S.Kom., M.Kom. • Tahun Akademik 2025/2026',
    {
      x: 1.2,
      y: 3.65,
      w: 7.6,
      h: 0.6,
      fontSize: 10.5,
      fontFace: FONT_BODY,
      bold: true,
      color: C.textFaint,
    }
  );

  s.addNotes('Selamat pagi/siang Bapak M. Zarkasi dan rekan-rekan. Kami dari Kelompok 2 mempresentasikan implementasi arsitektur API Gateway dan evolusinya menuju Service Discovery pada Sistem Terdistribusi Layanan Rumah Sakit.');
}

// ==========================================
// SLIDE 2: INTEGRASI 4 SERVICE & KONTRAK PAYLOAD RESEP
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Studi Kasus C — Sistem Terdistribusi Layanan Kesehatan',
    [{ text: 'Alur Data Resep Terdistribusi Antar Layanan Mikro' }],
    'Kontrak pertukaran data resep dari poli dokter menuju apotek, kasir, dan rekam medis'
  );

  // Kiri: JSON Payload
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.4,
    w: 4.4,
    h: 3.7,
    fill: { color: C.terminalBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('KONTRAK PAYLOAD: POST /api/dokter/resep', {
    x: 0.8,
    y: 1.55,
    w: 4.0,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_CODE,
    bold: true,
    color: C.codeCyan,
  });

  s.addText(
    `{
  "id_resep": "RSP-20261020-001",
  "pasien": "Budi Santoso",
  "diagnosa": "Faringitis Akut",
  "obat": [
    {
      "nama": "Amoxicillin 500mg",
      "qty": 15,
      "harga": 45000
    }
  ]
}`,
    {
      x: 0.8,
      y: 1.85,
      w: 4.0,
      h: 3.0,
      fontSize: 9.5,
      fontFace: FONT_CODE,
      color: C.terminalText,
      lineSpacingMultiple: 1.15,
    }
  );

  // Kanan: Penjelasan 3 Konsumen
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.2,
    y: 1.4,
    w: 4.2,
    h: 3.7,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('DISTRIBUSI DATA KE 3 KONSUMEN:', {
    x: 5.4,
    y: 1.6,
    w: 3.8,
    h: 0.3,
    fontSize: 11,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '1. Apotek Service (:8102)\nMenyiapkan racikan obat dan memotong stok gudang farmasi secara real-time.\n\n2. Kasir Service (:8103)\nMenghitung total rincian tagihan obat + biaya konsultasi dokter.\n\n3. EMR Service (:8104)\nMencatat diagnosis dan riwayat terapi ke rekam medis permanen pasien.',
    {
      x: 5.4,
      y: 2.05,
      w: 3.8,
      h: 2.8,
      fontSize: 10.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addNotes('Ketika dokter meresepkan obat, data JSON ini harus sampai ke Apotek untuk penyiapan obat, Kasir untuk tagihan, dan EMR untuk riwayat medis.');
}

// ==========================================
// SLIDE 3: MASALAH DIRECT ACCESS
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Masalah Direct Access (Slide 2 & 3 PPT Dosen)',
    [{ text: 'Kelemahan Fatal Akses Langsung (' }, { text: 'Direct Access', red: true }, { text: ')' }],
    'Klien frontend dan mobile mengakses port masing-masing service secara terpisah tanpa perantara'
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.4,
    w: 4.4,
    h: 3.7,
    fill: { color: C.terminalBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('KLIEN MENYIMPAN RAW IP & PORT:', {
    x: 0.8,
    y: 1.55,
    w: 4.0,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_CODE,
    bold: true,
    color: '#F87171',
  });

  s.addText(
    `// Klien frontend/mobile menyimpan raw IP & Port:
const DOKTER_API = "http://192.168.1.10:8101";
const APOTEK_API = "http://192.168.1.10:8102";
const KASIR_API  = "http://192.168.1.10:8103";
const EMR_API    = "http://192.168.1.10:8104";

// Jika port internal dipindah untuk security:
// -> SELURUH BUILD APLIKASI KLIEN RUSAK TOTAL!`,
    {
      x: 0.8,
      y: 1.85,
      w: 4.0,
      h: 3.0,
      fontSize: 9.5,
      fontFace: FONT_CODE,
      color: C.terminalText,
      lineSpacingMultiple: 1.2,
    }
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.2,
    y: 1.4,
    w: 4.2,
    h: 3.7,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('3 RISIKO TEKNIS UTAMA:', {
    x: 5.4,
    y: 1.6,
    w: 3.8,
    h: 0.3,
    fontSize: 11,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    '1. Kebocoran Topologi Jaringan\nPenyerang dapat langsung memindai port internal backend tanpa filter keamanan terpusat.\n\n2. Beban Konfigurasi CORS & SSL\nSetiap service harus mengurus sertifikat TLS dan header CORS masing-masing secara berulang.\n\n3. Tightly Coupled ke Lokasi Fisik\nKlien sangat bergantung pada alamat IP dan port server fisik (*Space Dependent*).',
    {
      x: 5.4,
      y: 2.05,
      w: 3.8,
      h: 2.8,
      fontSize: 10.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addNotes('Direct access memaksa klien menyimpan IP dan port service, membocorkan topologi backend ke publik, dan membuat sistem sangat rapuh.');
}

// ==========================================
// SLIDE 4: SOLUSI 1 - API GATEWAY (PORT 8000)
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Solusi Tahap 1 (Slide 4 & 5 PPT Dosen)',
    [{ text: 'API Gateway: ' }, { text: 'Single Entry Point', accent: true }, { text: ' di Port 8000' }],
    'Seluruh trafik klien diarahkan ke port 8000, lalu di-proxy ke port internal masing-masing service'
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.4,
    w: 4.3,
    h: 3.7,
    fill: { color: C.terminalBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('SPRING CLOUD GATEWAY (application.yml)', {
    x: 0.8,
    y: 1.55,
    w: 3.9,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_CODE,
    bold: true,
    color: C.codeCyan,
  });

  s.addText(
    `server:
  port: 8000
spring:
  cloud:
    gateway:
      routes:
        - id: dokter-service
          uri: http://localhost:8101
          predicates:
            - Path=/api/dokter/**

        - id: apotek-service
          uri: http://localhost:8102
          predicates:
            - Path=/api/apotek/**`,
    {
      x: 0.8,
      y: 1.85,
      w: 3.9,
      h: 3.0,
      fontSize: 9.5,
      fontFace: FONT_CODE,
      color: C.terminalText,
      lineSpacingMultiple: 1.15,
    }
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.1,
    y: 1.4,
    w: 4.3,
    h: 3.7,
    fill: { color: C.terminalBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('PYTHON GATEWAY (python_gateway/gateway.py)', {
    x: 5.3,
    y: 1.55,
    w: 3.9,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_CODE,
    bold: true,
    color: C.codeYellow,
  });

  s.addText(
    `ROUTES = {
    "/api/dokter": "http://localhost:8101",
    "/api/apotek": "http://localhost:8102",
    "/api/kasir":  "http://localhost:8103",
    "/api/emr":    "http://localhost:8104"
}

@app.route("/api/<service>/<path:subpath>")
def proxy(service, subpath=""):
    target = ROUTES.get(f"/api/{service}")
    # Forward HTTP method, headers, & body...`,
    {
      x: 5.3,
      y: 1.85,
      w: 3.9,
      h: 3.0,
      fontSize: 9.5,
      fontFace: FONT_CODE,
      color: C.terminalText,
      lineSpacingMultiple: 1.2,
    }
  );

  s.addNotes('API Gateway menyediakan satu gerbang tunggal di port 8000. Konfigurasi routing meneruskan request ke port 8101-8104.');
}

// ==========================================
// SLIDE 5: HASIL PENGUJIAN GATEWAY HARDCODED
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Bukti Eksekusi Nyata Sistem',
    [{ text: 'Verifikasi Routing Gateway Statis: ' }, { text: 'Log Terminal & Respon', green: true }],
    'Pengujian otomatis via simulasi_gateway.py membuktikan seluruh request berhasil lewat port 8000'
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.4,
    w: 5.0,
    h: 3.7,
    fill: { color: C.terminalBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('TERMINAL RUNTIME (simulasi_gateway.py)', {
    x: 0.8,
    y: 1.55,
    w: 4.6,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_CODE,
    bold: true,
    color: C.codeGreen,
  });

  s.addText(
    `$ python3 simulasi_gateway.py
[1] MENYALAKAN 4 SERVICE (Port 8101..8104)... OK
[2] MENJALANKAN API GATEWAY DI PORT 8000... OK

--- PENGUJIAN SINGLE ENTRY POINT :8000 ---
[POST] :8000/api/dokter/resep -> Forward :8101 (201 Created)
[GET]  :8000/api/apotek/antrean -> Forward :8102 (200 OK)
[GET]  :8000/api/kasir/tagihan -> Forward :8103 (200 OK)
[GET]  :8000/api/emr/rekam-medis -> Forward :8104 (200 OK)

SELURUH REQUEST BERHASIL HANYA LEWAT PORT 8000!`,
    {
      x: 0.8,
      y: 1.85,
      w: 4.6,
      h: 3.0,
      fontSize: 9,
      fontFace: FONT_CODE,
      color: C.terminalText,
      lineSpacingMultiple: 1.2,
    }
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.8,
    y: 1.4,
    w: 3.6,
    h: 3.7,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('EVALUASI TAHAP 1:', {
    x: 6.0,
    y: 1.6,
    w: 3.2,
    h: 0.3,
    fontSize: 11,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    'Pencapaian:\n• Klien berhasil di-decouple dari port fisik.\n• Pintu masuk terpusat di port 8000.\n\nKelemahan:\n• Konfigurasi rute di Gateway masih di-hardcode ke localhost:8101..8104.\n• Gateway tidak tahu jika service mati atau berpindah port!',
    {
      x: 6.0,
      y: 2.05,
      w: 3.2,
      h: 2.8,
      fontSize: 10.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.3,
    }
  );

  s.addNotes('Simulasi gateway membuktikan request sukses diteruskan melalui port 8000. Namun, rute di gateway masih terkunci secara statis.');
}

// ==========================================
// SLIDE 6: SKENARIO KEGAGALAN 1 - HARDCODED CRASH
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Simulasi Kegagalan Sistem',
    [{ text: 'Skenario 1: Apa yang Terjadi Saat Service Mati atau ' }, { text: 'Berganti Port?', red: true }],
    'Bukti log error 502 Bad Gateway akibat keterikatan routing statis'
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.4,
    w: 5.0,
    h: 3.7,
    fill: { color: C.alertBg },
    line: { color: C.alertBorder, width: 1.5 },
  });

  s.addText('LOG TERMINAL: CRASH PADA HARDCODED ROUTING', {
    x: 0.8,
    y: 1.55,
    w: 4.6,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_CODE,
    bold: true,
    color: '#F87171',
  });

  s.addText(
    `[SIMULASI KEGAGALAN SERVICE CRASH]
1. EMR Service (:8104) mati mendadak ($ kill -9 <pid>)
2. Klien kirim: GET :8000/api/emr/rekam-medis
3. Gateway memaksakan forward ke konfigurasi hardcode :8104

[GATEWAY ERROR]
ConnectionRefusedError: [Errno 111] Connection refused

HTTP/1.1 502 Bad Gateway
{
  "error": "Bad Gateway / Service Error",
  "target_url": "http://localhost:8104/api/emr/rekam-medis"
}`,
    {
      x: 0.8,
      y: 1.85,
      w: 4.6,
      h: 3.0,
      fontSize: 9,
      fontFace: FONT_CODE,
      color: C.alertText,
      lineSpacingMultiple: 1.2,
    }
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.8,
    y: 1.4,
    w: 3.6,
    h: 3.7,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('MENGAPA GAGAL DI PRODUKSI?', {
    x: 6.0,
    y: 1.6,
    w: 3.2,
    h: 0.3,
    fontSize: 11,
    fontFace: FONT_HEAD,
    bold: true,
    color: '#F87171',
  });

  s.addText(
    '1. Tidak Tahan Ganti Port\nJika port service diubah karena alasan keamanan atau konflik port (Laravel :8000, Vite :5173), Gateway langsung putus.\n\n2. Tidak Ada Health Check\nGateway tidak tahu apakah server di balik port tersebut masih hidup atau sudah mati.\n\n3. Wajib Restart Gateway\nSetiap perubahan port membutuhkan restart gateway.',
    {
      x: 6.0,
      y: 2.05,
      w: 3.2,
      h: 2.8,
      fontSize: 10.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.2,
    }
  );

  s.addNotes('Ketika service mati atau berganti port, gateway hardcoded tetap menembak ke port lama sehingga klien menerima 502 Bad Gateway.');
}

// ==========================================
// SLIDE 7: SOLUSI 2 - SERVICE DISCOVERY (EUREKA)
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Solusi Tahap 2 — Sistem Terdistribusi Modern',
    [{ text: 'Service Discovery: ' }, { text: 'Buku Kontak Otomatis & Dynamic Registry', accent: true }],
    'Pola pendaftaran mandiri (Self-Registration) dan pencarian rute dinamis saat runtime'
  );

  const steps = [
    { title: '1. Self-Registration (:8761)', desc: 'Saat booting, service melapor ke Registry: "Saya DOKTER-SERVICE di IP 127.0.0.1 port 8101".' },
    { title: '2. Heartbeat Health Check', desc: 'Setiap 10 detik service mengirim detak jantung. Jika putus > 30 detik, service otomatis dicoret.' },
    { title: '3. Dynamic Lookup (lb://)', desc: 'Saat request datang, Gateway bertanya ke Registry: "Mana DOKTER-SERVICE yang sehat?".' },
    { title: '4. Dynamic Proxy Forwarding', desc: 'Gateway meneruskan request ke alamat hasil lookup tanpa ada port yang di-hardcode di gateway.' },
  ];

  steps.forEach((st, i) => {
    const y = 1.4 + i * 0.9;
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.6,
      y,
      w: 8.8,
      h: 0.75,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1.2 },
    });

    s.addText(st.title, {
      x: 0.8,
      y: y + 0.1,
      w: 8.4,
      h: 0.25,
      fontSize: 12,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.primary,
    });

    s.addText(st.desc, {
      x: 0.8,
      y: y + 0.38,
      w: 8.4,
      h: 0.28,
      fontSize: 10.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
    });
  });

  s.addNotes('Service Discovery adalah buku kontak otomatis. Microservice mendaftarkan diri secara mandiri, mengirim heartbeat berkala, dan gateway mencarinya secara dinamis.');
}

// ==========================================
// SLIDE 8: BEDAH KONTRAK DATA DISCOVERY
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Implementasi Dynamic Routing',
    [{ text: 'Bedah Kode: Protokol ' }, { text: 'lb://', accent: true }, { text: ' & JSON Registry Lookup' }],
    'Gateway memetakan nama logis dan menanyakan alamat fisik aktif ke endpoint Registry :8761'
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.4,
    w: 4.3,
    h: 3.7,
    fill: { color: C.terminalBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('SPRING CLOUD (application-discovery.yml)', {
    x: 0.8,
    y: 1.55,
    w: 3.9,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_CODE,
    bold: true,
    color: C.codeGreen,
  });

  s.addText(
    `server:
  port: 8000
spring:
  cloud:
    gateway:
      routes:
        # BUKAN LAGI localhost:8101
        - id: dokter-service
          uri: lb://DOKTER-SERVICE
          predicates:
            - Path=/api/dokter/**

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/`,
    {
      x: 0.8,
      y: 1.85,
      w: 3.9,
      h: 3.0,
      fontSize: 9.5,
      fontFace: FONT_CODE,
      color: C.terminalText,
      lineSpacingMultiple: 1.15,
    }
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.1,
    y: 1.4,
    w: 4.3,
    h: 3.7,
    fill: { color: C.terminalBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('REGISTRY LOOKUP: GET :8761/services/DOKTER-SERVICE', {
    x: 5.3,
    y: 1.55,
    w: 3.9,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_CODE,
    bold: true,
    color: C.codeCyan,
  });

  s.addText(
    `{
  "service_name": "DOKTER-SERVICE",
  "selected_instance": {
    "url": "http://localhost:8101",
    "status": "UP",
    "last_heartbeat": 1776701500
  },
  "active_instances_count": 1,
  "load_balance_strategy": "Round-Robin"
}

// HTTP Response Header dari Gateway:
X-Gateway-Mode: Dynamic-Service-Discovery
X-Resolved-Service: DOKTER-SERVICE`,
    {
      x: 5.3,
      y: 1.85,
      w: 3.9,
      h: 3.0,
      fontSize: 9.5,
      fontFace: FONT_CODE,
      color: C.terminalText,
      lineSpacingMultiple: 1.15,
    }
  );

  s.addNotes('Di Spring Gateway, rute menggunakan lb://DOKTER-SERVICE. Di balik layar, registry mengembalikan JSON instance aktif dan gateway meng-inject header X-Gateway-Mode.');
}

// ==========================================
// SLIDE 9: SKENARIO KEGAGALAN 2 - SELF-HEALING & LOAD BALANCING
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Pembuktian Ketahanan Sistem (Fault Tolerance)',
    [{ text: 'Skenario 2: ' }, { text: 'Self-Healing', green: true }, { text: ' & Dynamic Round-Robin' }],
    'Bukti auto-failover dan load balancing dinamis tanpa mengubah konfigurasi Gateway'
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.4,
    w: 5.0,
    h: 3.7,
    fill: { color: C.successBg },
    line: { color: C.successBorder, width: 1.5 },
  });

  s.addText('LOG TERMINAL: AUTO-FAILOVER & SELF-HEALING', {
    x: 0.8,
    y: 1.55,
    w: 4.6,
    h: 0.25,
    fontSize: 9.5,
    fontFace: FONT_CODE,
    bold: true,
    color: '#34D399',
  });

  s.addText(
    `[SIMULASI AUTO-FAILOVER & LOAD BALANCING]
1. Service Kasir dijalankan 2 instance (:8103 & :8105)
2. Kedua instance mendaftar ke Registry port 8761
3. Kasir-1 (:8103) dihentikan / crash ($ kill -9)
4. Heartbeat :8103 putus > 30 detik -> Dicoret dari Registry
5. Request klien datang ke Gateway :8000/api/kasir/tagihan
6. Gateway query Registry -> Mendapatkan Kasir-2 (:8105)
7. Request berhasil diproses -> HTTP/1.1 200 OK!

HASIL: ZERO DOWNTIME! Sistem pulih secara mandiri.`,
    {
      x: 0.8,
      y: 1.85,
      w: 4.6,
      h: 3.0,
      fontSize: 9,
      fontFace: FONT_CODE,
      color: C.successText,
      lineSpacingMultiple: 1.2,
    }
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.8,
    y: 1.4,
    w: 3.6,
    h: 3.7,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('NILAI PLUS TERUJI:', {
    x: 6.0,
    y: 1.6,
    w: 3.2,
    h: 0.3,
    fontSize: 11,
    fontFace: FONT_HEAD,
    bold: true,
    color: '#34D399',
  });

  s.addText(
    '1. Dynamic Failover\nKetika ada instance yang mati, request otomatis dialihkan ke instance yang sehat.\n\n2. Round-Robin Load Balancing\nJika ada 2 kasir aktif, beban request dibagi rata secara bergantian.\n\n3. Zero Downtime Deployment\nPort baru dapat ditambahkan saat sistem sedang berjalan.',
    {
      x: 6.0,
      y: 2.05,
      w: 3.2,
      h: 2.8,
      fontSize: 10.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addNotes('Dengan Service Discovery, ketika satu instance mati, registry otomatis mencoretnya dan mengalihkan request ke instance lain tanpa downtime.');
}

// ==========================================
// SLIDE 10: KOMPARASI & LANDASAN TEORI
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Landasan Teoritis Sistem Terdistribusi',
    [{ text: 'Pembuktian Dua Pilar ' }, { text: 'Decoupling', accent: true }, { text: ' pada Sistem' }],
    'Pelepasan keterikatan ruang/lokasi (Space Decoupling) dan waktu sinkron (Time Decoupling)'
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 1.4,
    w: 4.3,
    h: 3.7,
    fill: { color: C.cardBg },
    line: { color: C.primary, width: 1.5 },
  });

  s.addText('1. SPACE DECOUPLING (LOKASI FISIK)', {
    x: 0.8,
    y: 1.6,
    w: 3.9,
    h: 0.3,
    fontSize: 11,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.primary,
  });

  s.addText(
    'Diwujudkan oleh API Gateway & Service Discovery:\n\n• Klien bebas dari lokasi: Klien hanya tahu port 8000, tidak tahu port 8101..8104.\n• Gateway bebas dari lokasi: Gateway hanya tahu nama lb://DOKTER-SERVICE, tidak menyimpan IP port fisik.\n\nServer bebas berpindah mesin atau port tanpa merusak konfigurasi sistem.',
    {
      x: 0.8,
      y: 2.05,
      w: 3.9,
      h: 2.8,
      fontSize: 10.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.1,
    y: 1.4,
    w: 4.3,
    h: 3.7,
    fill: { color: C.cardBg },
    line: { color: C.cardBorderHover, width: 1.5 },
  });

  s.addText('2. TIME DECOUPLING (WAKTU SINKRON)', {
    x: 5.3,
    y: 1.6,
    w: 3.9,
    h: 0.3,
    fontSize: 11,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
  });

  s.addText(
    'Diwujudkan oleh Message Broker RabbitMQ Fanout:\n\n• Dokter menerbitkan resep ke antrean RabbitMQ.\n• Konsumen (Apotek, Kasir, EMR) tidak harus aktif pada detik yang sama.\n• Jika Apotek sempat down sesaat, pesan tetap aman tersimpan di antrean dan diproses saat online kembali.',
    {
      x: 5.3,
      y: 2.05,
      w: 3.9,
      h: 2.8,
      fontSize: 10.5,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.25,
    }
  );

  s.addNotes('Sistem membuktikan Space Decoupling melalui API Gateway & Service Discovery, serta Time Decoupling melalui RabbitMQ.');
}

// ==========================================
// SLIDE 11: KESIMPULAN & DEMO READY
// ==========================================
{
  const s = pptx.addSlide();
  addHeader(
    s,
    'Penutup & Kesiapan Demonstrasi Langsung',
    [{ text: 'Ringkasan & ' }, { text: 'Kesiapan Live Demo', accent: true }],
    'Kedua skenario simulasi siap dijalankan secara live di hadapan Bapak Dosen'
  );

  const demoBoxes = [
    { title: '1. Demo Gateway Hardcoded', cmd: '$ python3 simulasi_gateway.py', desc: 'Membuktikan Single Entry Point port 8000 meneruskan ke port 8101..8104.' },
    { title: '2. Demo Service Discovery', cmd: '$ python3 simulasi_discovery.py', desc: 'Membuktikan dynamic lookup ke Registry port 8761 dan Web GUI Dashboard.' },
    { title: '3. Sesi Tanya Jawab', cmd: 'Tanya Jawab / Diskusi', desc: 'Kelompok 2 siap mendiskusikan mekanisme failover, routing, dan decoupling.' },
  ];

  demoBoxes.forEach((d, i) => {
    const x = 0.6 + i * 3.0;
    s.addShape(pptx.shapes.RECTANGLE, {
      x,
      y: 1.4,
      w: 2.85,
      h: 2.4,
      fill: { color: C.cardBg },
      line: { color: C.cardBorder, width: 1.5 },
    });

    s.addText(d.title, {
      x: x + 0.15,
      y: 1.6,
      w: 2.55,
      h: 0.35,
      fontSize: 11.5,
      fontFace: FONT_HEAD,
      bold: true,
      color: C.primary,
    });

    s.addText(d.cmd, {
      x: x + 0.15,
      y: 2.0,
      w: 2.55,
      h: 0.35,
      fontSize: 9.5,
      fontFace: FONT_CODE,
      bold: true,
      color: C.textDark,
    });

    s.addText(d.desc, {
      x: x + 0.15,
      y: 2.4,
      w: 2.55,
      h: 1.2,
      fontSize: 10,
      fontFace: FONT_BODY,
      color: C.textMuted,
      lineSpacingMultiple: 1.2,
    });
  });

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 4.0,
    w: 8.8,
    h: 1.1,
    fill: { color: C.cardBg },
    line: { color: C.cardBorder, width: 1.5 },
  });

  s.addText('TERIMA KASIH ATAS PERHATIAN BAPAK DOSEN & REKAN SEKALIAN', {
    x: 0.8,
    y: 4.15,
    w: 8.4,
    h: 0.35,
    fontSize: 13,
    fontFace: FONT_HEAD,
    bold: true,
    color: C.textDark,
    align: 'center',
  });

  s.addText('Kelompok 2: Ridho Rizky Prasetyo • Firsandi Andraw F. • Ahmad Rafif Nandra U.', {
    x: 0.8,
    y: 4.55,
    w: 8.4,
    h: 0.35,
    fontSize: 10.5,
    fontFace: FONT_BODY,
    color: C.textMuted,
    align: 'center',
  });

  s.addNotes('Sekian presentasi dari Kelompok 2. Kami siap mendemokan simulasi secara live dan menjawab pertanyaan Bapak Dosen serta rekan-rekan. Terima kasih.');
}

// Export output
const outputRoot = '/home/firsandia/Desktop/coba/Presentasi_API_Gateway_dan_Service_Discovery.pptx';
const outputLocal = path.resolve('Presentasi_API_Gateway_dan_Service_Discovery.pptx');

await pptx.writeFile({ fileName: outputRoot });
console.log(`Native PPTX successfully written to: ${outputRoot}`);

try {
  fs.copyFileSync(outputRoot, outputLocal);
  console.log(`Copied to: ${outputLocal}`);
} catch (e) {
  console.error('Copy error:', e);
}
