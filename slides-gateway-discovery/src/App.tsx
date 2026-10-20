import React from 'react';
import Deck from './deck/Deck';
import Slide from './deck/Slide';
import Cover from './components/Cover';
import CodeWindow from './components/CodeWindow';
import { InteractiveDataFlowDiagram, FailureComparisonIllustration } from './components/TechnicalArtifacts';

/* Sleek Dark Technical Palette (Obsidian & Electric Ice Blue) */
const card: React.CSSProperties = {
  background: '#111827',
  border: '1px solid #1e293b',
  borderRadius: '10px',
  padding: 'clamp(14px, 1.6vw, 20px)',
  boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
};

const cardHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
  paddingBottom: '8px',
  borderBottom: '1px solid #1e293b',
};

const badgeTech = (color: string, bg: string, border: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontFamily: 'monospace',
  fontWeight: 700,
  background: bg,
  color: color,
  border: `1px solid ${border}`,
});

export default function App() {
  return (
    <Deck>
      {/* ========================================================
          SLIDE 1: COVER
      ======================================================== */}
      <Slide
        nav="01. Judul"
        notes="Selamat pagi/siang Bapak M. Zarkasi dan rekan-rekan. Kami dari Kelompok 2 mempresentasikan implementasi arsitektur API Gateway dan evolusinya menuju Service Discovery pada Sistem Terdistribusi Layanan Rumah Sakit."
      >
        <Cover
          kicker="SISTEM TERDISTRIBUSI • FASILKOM UNIVERSITAS JEMBER"
          title={
            <>
              API Gateway &amp; <br />
              <span className="accent-text">Service Discovery</span>
            </>
          }
          subtitle="Evolusi Arsitektur Sistem Terdistribusi: Mengatasi Keterbatasan Hardcoded Routing Menuju Dynamic Service Registry pada Studi Kasus Layanan Rumah Sakit"
          author="Kelompok 2: Ridho Rizky Prasetyo • Firsandi Andraw F. • Ahmad Rafif Nandra U."
          date="Dosen Pengampu: M. Zarkasi, S.Kom., M.Kom. • Tahun Akademik 2025/2026"
        />
      </Slide>

      {/* ========================================================
          SLIDE 2: INTEGRASI 4 SERVICE RUMAH SAKIT
      ======================================================== */}
      <Slide
        nav="02. Integrasi Layanan"
        notes="Studi kasus kami mengintegrasikan 4 unit: Dokter poli, Apotek farmasi, Kasir billing, dan EMR rekam medis. Begitu dokter menerbitkan resep, payload JSON harus sampai ke 3 unit lainnya."
      >
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px', letterSpacing: '0.08em' }}>
            STUDI KASUS C — SISTEM TERDISTRIBUSI LAYANAN KESEHATAN
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px 0' }}>
            Alur Data Resep Terdistribusi Antar Layanan Mikro
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '18px' }}>
            <div style={card}>
              <div style={cardHeader}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#f8fafc' }}>KONTRAK PAYLOAD RESEP DOKTER</span>
                <span style={badgeTech('#38bdf8', '#0c2340', '#0369a1')}>POST /api/dokter/resep</span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0' }}>
                Ketika dokter di poli klinik menyelesaikan pemeriksaan, payload JSON ini diterbitkan ke sistem:
              </p>
              <div style={{ background: '#070b14', borderRadius: '6px', padding: '10px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.5, border: '1px solid #1e293b' }}>
                <span style={{ color: '#64748b' }}>&#123;</span><br />
                &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>"id_resep"</span>: <span style={{ color: '#facc15' }}>"RSP-20261020-001"</span>,<br />
                &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>"pasien"</span>: <span style={{ color: '#facc15' }}>"Budi Santoso"</span>,<br />
                &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>"diagnosa"</span>: <span style={{ color: '#facc15' }}>"Faringitis Akut"</span>,<br />
                &nbsp;&nbsp;<span style={{ color: '#38bdf8' }}>"obat"</span>: [<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&#123; <span style={{ color: '#38bdf8' }}>"nama"</span>: <span style={{ color: '#4ade80' }}>"Amoxicillin 500mg"</span>, <span style={{ color: '#38bdf8' }}>"qty"</span>: 15, <span style={{ color: '#38bdf8' }}>"harga"</span>: 45000 &#125;<br />
                &nbsp;&nbsp;]<br />
                <span style={{ color: '#64748b' }}>&#125;</span>
              </div>
            </div>

            <div style={card}>
              <div style={cardHeader}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#f8fafc' }}>DISTRIBUSI DATA KE 3 KONSUMEN</span>
                <span style={badgeTech('#94a3b8', '#1e293b', '#334155')}>Fanout Pub/Sub</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ padding: '8px 10px', background: '#0b1120', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                  <strong style={{ color: '#f8fafc' }}>Apotek Service (:8102)</strong>: Menyiapkan racikan obat dan memotong stok farmasi.
                </div>
                <div style={{ padding: '8px 10px', background: '#0b1120', borderRadius: '6px', borderLeft: '3px solid #0284c7' }}>
                  <strong style={{ color: '#f8fafc' }}>Kasir Service (:8103)</strong>: Menghitung tagihan biaya konsultasi + total resep.
                </div>
                <div style={{ padding: '8px 10px', background: '#0b1120', borderRadius: '6px', borderLeft: '3px solid #64748b' }}>
                  <strong style={{ color: '#f8fafc' }}>EMR Service (:8104)</strong>: Mencatat histori medis permanen ke rekam medis pasien.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ========================================================
          SLIDE 3: PROBLEM - DIRECT ACCESS
      ======================================================== */}
      <Slide
        nav="03. Direct Access"
        notes="Sebelum ada API Gateway, klien harus tahu seluruh port backend. Selain menyulitkan developer frontend, struktur port internal bocor ke publik dan sangat rentan."
      >
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#f87171', marginBottom: '4px', letterSpacing: '0.08em' }}>
            MASALAH DIRECT ACCESS (SLIDE 2 &amp; 3 PPT DOSEN)
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px 0' }}>
            Mengapa Direct Access ke Port Service Membahayakan Sistem?
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
            <div style={card}>
              <div style={cardHeader}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#fca5a5' }}>PORT INTERNAL TERBUKA LANGSUNG KE KLIEN</span>
                <span style={badgeTech('#f87171', '#2c1014', '#7f1d1d')}>Raw Port Dump</span>
              </div>
              <div style={{ background: '#070b14', borderRadius: '6px', padding: '12px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.6, border: '1px solid #1e293b' }}>
                <span style={{ color: '#f87171' }}>// Frontend klien harus menyimpan variabel alamat fisik:</span><br />
                const DOKTER_API = <span style={{ color: '#38bdf8' }}>"http://192.168.1.10:8101"</span>;<br />
                const APOTEK_API = <span style={{ color: '#38bdf8' }}>"http://192.168.1.10:8102"</span>;<br />
                const KASIR_API  = <span style={{ color: '#38bdf8' }}>"http://192.168.1.10:8103"</span>;<br />
                const EMR_API    = <span style={{ color: '#38bdf8' }}>"http://192.168.1.10:8104"</span>;
              </div>
              <div style={{ marginTop: '10px', padding: '8px 10px', background: '#220b0e', border: '1px solid #5c1d24', borderRadius: '6px', fontSize: '11.5px', color: '#fca5a5' }}>
                Jika port 8101 diganti karena konflik port di server, seluruh build aplikasi klien langsung gagal terhubung.
              </div>
            </div>

            <div style={card}>
              <div style={cardHeader}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#f8fafc' }}>3 RISIKO TEKNIS UTAMA</span>
                <span style={badgeTech('#94a3b8', '#1e293b', '#334155')}>Analysis</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#94a3b8' }}>
                <div>
                  <strong style={{ color: '#f8fafc' }}>1. Topologi Internal Bocor:</strong> Penyerang jaringan dapat langsung memindai (port scanning) ke port internal backend tanpa filter keamanan.
                </div>
                <div>
                  <strong style={{ color: '#f8fafc' }}>2. CORS &amp; SSL Overhead:</strong> Masing-masing dari 4 service harus mengurus sertifikat TLS dan CORS policy sendiri-sendiri.
                </div>
                <div>
                  <strong style={{ color: '#f8fafc' }}>3. Tightly Coupled:</strong> Tidak ada isolasi jaringan antara interface publik dan interface privat.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ========================================================
          SLIDE 4: SOLUSI 1 - API GATEWAY
      ======================================================== */}
      <Slide
        nav="04. API Gateway"
        notes="Solusi tahap pertama: membuat API Gateway di port 8000. Klien hanya tahu port 8000. Gateway mem-proxy URL /api/dokter/** ke port 8101, /api/apotek/** ke port 8102, dst."
      >
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px', letterSpacing: '0.08em' }}>
            SOLUSI TAHAP 1 (SLIDE 4 &amp; 5 PPT DOSEN)
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px 0' }}>
            API Gateway: <span className="accent-text">Single Entry Point</span> di Port 8000
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <CodeWindow
                title="gateway/src/main/resources/application.yml (Spring)"
                language="yaml"
                code={`server:
  port: 8000
spring:
  application:
    name: HOSPITAL-GATEWAY-SERVICE
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
            - Path=/api/apotek/**`}
              />
            </div>

            <div>
              <CodeWindow
                title="python_gateway/gateway.py (Reverse Proxy Flask)"
                language="python"
                code={`# Mapping Rute Statis ke Port Fisik
ROUTES = {
    "/api/dokter": "http://localhost:8101",
    "/api/apotek": "http://localhost:8102",
    "/api/kasir":  "http://localhost:8103",
    "/api/emr":    "http://localhost:8104"
}

@app.route("/api/<service>/<path:subpath>")
def proxy(service, subpath=""):
    target = ROUTES.get(f"/api/{service}")
    # Forward HTTP method, headers, & body...`}
              />
            </div>
          </div>
        </div>
      </Slide>

      {/* ========================================================
          SLIDE 5: HASIL PENGUJIAN GATEWAY HARDCODED
      ======================================================== */}
      <Slide
        nav="05. Uji Coba Gateway"
        notes="Berikut bukti eksekusi simulasi_gateway.py. Gateway di port 8000 sukses mem-proxy seluruh request ke service internal."
      >
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px', letterSpacing: '0.08em' }}>
            BUKTI EKSEKUSI NYATA
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px 0' }}>
            Verifikasi Routing Gateway Statis: Terminal Log &amp; Response
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
            <div style={{ background: '#070b14', borderRadius: '8px', padding: '14px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.5, border: '1px solid #1e293b' }}>
              <div style={{ color: '#38bdf8', marginBottom: '4px' }}>$ python3 simulasi_gateway.py</div>
              <div style={{ color: '#4ade80' }}>[1] MENYALAKAN 4 SERVICE (Port 8101..8104)... OK</div>
              <div style={{ color: '#4ade80' }}>[2] MENJALANKAN API GATEWAY DI PORT 8000... OK</div>
              <div style={{ color: '#94a3b8', marginTop: '6px' }}>--- PENGUJIAN SINGLE ENTRY POINT :8000 ---</div>
              <div style={{ color: '#facc15' }}>[POST] :8000/api/dokter/resep -&gt; Forward :8101 (201 Created)</div>
              <div style={{ color: '#facc15' }}>[GET]  :8000/api/apotek/antrean -&gt; Forward :8102 (200 OK)</div>
              <div style={{ color: '#facc15' }}>[GET]  :8000/api/kasir/tagihan -&gt; Forward :8103 (200 OK)</div>
              <div style={{ color: '#facc15' }}>[GET]  :8000/api/emr/rekam-medis -&gt; Forward :8104 (200 OK)</div>
              <div style={{ color: '#4ade80', marginTop: '6px' }}>✓ SELURUH REQUEST BERHASIL HANYA LEWAT PORT 8000!</div>
            </div>

            <div style={card}>
              <div style={cardHeader}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#f8fafc' }}>PENCAPAIAN TAHAP 1</span>
                <span style={badgeTech('#34d399', '#062817', '#065f46')}>Proven Decoupling</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                <div>
                  <strong style={{ color: '#f8fafc' }}>Space Decoupling Klien Terbukti:</strong> Klien tidak perlu tahu nomor port asli backend (8101..8104).
                </div>
                <div>
                  <strong style={{ color: '#f8fafc' }}>Pintu Masuk Terpadu:</strong> Otentikasi dan rate-limiting dapat diletakkan di port 8000 tanpa mengubah service backend.
                </div>
                <div style={{ padding: '8px', background: '#1c1507', borderRadius: '6px', border: '1px solid #78350f', fontSize: '11px', color: '#fde68a' }}>
                  <strong>Keterbatasan Kritis:</strong> Gateway masih mengunci alamat fisik di file konfigurasi (hardcoded routing).
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ========================================================
          SLIDE 6: SKENARIO KEGAGALAN 1 - HARDCODED CRASH
      ======================================================== */}
      <Slide
        nav="06. Kegagalan Hardcode"
        notes="Di slide ini kita tunjukkan titik kritisnya: apa yang terjadi jika salah satu service mati atau berganti port? Gateway tetap memaksa menembak ke port lama, menghasilkan 502 Bad Gateway."
      >
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#f87171', marginBottom: '4px', letterSpacing: '0.08em' }}>
            SIMULASI KEGAGALAN SISTEM
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px 0' }}>
            Skenario 1: Apa yang Terjadi Saat Service Mati atau Berganti Port?
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
            <FailureComparisonIllustration scenario="hardcode_crash" />

            <div style={card}>
              <div style={cardHeader}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#fca5a5' }}>MENGAPA HARDCODE GAGAL DI PRODUKSI?</span>
                <span style={badgeTech('#f87171', '#2c1014', '#7f1d1d')}>Limitations</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8' }}>
                <div>
                  <strong style={{ color: '#f8fafc' }}>1. Tidak Tahan Ganti Port:</strong> Jika port Postgres :5432, Vite :5173, atau backend dipindah untuk alasan keamanan, Gateway langsung putus.
                </div>
                <div>
                  <strong style={{ color: '#f8fafc' }}>2. Tidak Ada Health Check:</strong> Gateway tidak tahu apakah service di balik port tersebut masih hidup atau sudah mati.
                </div>
                <div>
                  <strong style={{ color: '#f8fafc' }}>3. Wajib Restart &amp; Downtime:</strong> Setiap perubahan port atau IP mesin, developer harus mengedit file YAML dan me-restart gateway.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ========================================================
          SLIDE 7: SOLUSI 2 - ARSITEKTUR SERVICE DISCOVERY
      ======================================================== */}
      <Slide
        nav="07. Service Discovery"
        notes="Solusi untuk mengatasi hardcode adalah Service Discovery. Setiap service mendaftarkan diri ke Registry port 8761 dan mengirim heartbeat. Gateway menanyakan alamat aktif ke Registry."
      >
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px', letterSpacing: '0.08em' }}>
            SOLUSI TAHAP 2 — SISTEM TERDISTRIBUSI MODERN
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px 0' }}>
            Service Discovery: <span className="accent-text">Buku Kontak Otomatis &amp; Dynamic Registry</span>
          </h2>

          <InteractiveDataFlowDiagram />
        </div>
      </Slide>

      {/* ========================================================
          SLIDE 8: BEDAH KONTRAK DATA DISCOVERY
      ======================================================== */}
      <Slide
        nav="08. Kontrak Discovery"
        notes="Di slide ini kita tunjukkan kontrak data asli: konfigurasi lb:// di Gateway dan payload JSON yang dikembalikan oleh Service Registry saat di-lookup."
      >
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px', letterSpacing: '0.08em' }}>
            IMPLEMENTASI DYNAMIC ROUTING
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px 0' }}>
            Bedah Kode: Protokol <span className="accent-text">lb://</span> &amp; JSON Registry Lookup
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <CodeWindow
                title="gateway/.../application-discovery.yml"
                language="yaml"
                code={`server:
  port: 8000
spring:
  cloud:
    gateway:
      routes:
        # BUKAN LAGI http://localhost:8101
        # Menggunakan prefix lb:// (Load Balanced)
        - id: dokter-service
          uri: lb://DOKTER-SERVICE
          predicates:
            - Path=/api/dokter/**

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/`}
              />
            </div>

            <div>
              <CodeWindow
                title="Endpoint Discovery: GET :8761/services/DOKTER-SERVICE"
                language="json"
                code={`{
  "service_name": "DOKTER-SERVICE",
  "selected_instance": {
    "url": "http://localhost:8101",
    "status": "UP",
    "last_heartbeat": 1776701500
  },
  "active_instances_count": 1,
  "load_balance_strategy": "Round-Robin"
}`}
              />
              <div style={{ marginTop: '8px', fontSize: '11.5px', color: '#94a3b8' }}>
                Gateway meng-inject HTTP header respon: <br />
                <code style={{ color: '#38bdf8' }}>X-Gateway-Mode: Dynamic-Service-Discovery</code><br />
                <code style={{ color: '#38bdf8' }}>X-Resolved-Service: DOKTER-SERVICE</code>
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ========================================================
          SLIDE 9: SKENARIO KEGAGALAN 2 - SELF-HEALING & LOAD BALANCING
      ======================================================== */}
      <Slide
        nav="09. Self-Healing"
        notes="Di slide ini kita buktikan ketahanan sistem: jika ada instance kasir yang mati, Registry otomatis mencoretnya dan Gateway mengalihkan trafik ke instance sehat tanpa downtime."
      >
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#34d399', marginBottom: '4px', letterSpacing: '0.08em' }}>
            PEMBUKTIAN KETAHANAN SISTEM (FAULT TOLERANCE)
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px 0' }}>
            Skenario 2: Pembuktian Self-Healing &amp; Auto-Failover
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
            <FailureComparisonIllustration scenario="discovery_heal" />

            <div style={card}>
              <div style={cardHeader}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#34d399' }}>HASIL PENGUJIAN LOG TERMINAL</span>
                <span style={badgeTech('#34d399', '#062817', '#065f46')}>simulasi_discovery.py</span>
              </div>
              <div style={{ background: '#070b14', borderRadius: '6px', padding: '10px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '10.5px', lineHeight: 1.5, border: '1px solid #1e293b' }}>
                <span style={{ color: '#4ade80' }}>✓ DOKTER-SERVICE terdaftar -&gt; :8101</span><br />
                <span style={{ color: '#4ade80' }}>✓ KASIR-SERVICE-1 terdaftar -&gt; :8103</span><br />
                <span style={{ color: '#4ade80' }}>✓ KASIR-SERVICE-2 terdaftar -&gt; :8105</span><br />
                <span style={{ color: '#f87171' }}>[SIMULASI] Kill PID Kasir-1 (:8103)</span><br />
                <span style={{ color: '#38bdf8' }}>[HEARTBEAT] Kasir-1 expired &gt; 30s -&gt; Marked DOWN</span><br />
                <span style={{ color: '#4ade80' }}>[ROUTING] Request dialihkan ke Kasir-2 (:8105) -&gt; 200 OK!</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
                Terbukti: Sistem tetap berjalan tanpa mengorbankan pengalaman pengguna (Zero Downtime).
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ========================================================
          SLIDE 10: KOMPARASI TEKNIS & LANDASAN TEORI
      ======================================================== */}
      <Slide
        nav="10. Landasan Teori"
        notes="Secara teori sistem terdistribusi, kita berhasil membuktikan dua pilar decoupling: Space Decoupling diwujudkan oleh Gateway dan Service Discovery, sedangkan Time Decoupling diwujudkan oleh RabbitMQ."
      >
        <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px', letterSpacing: '0.08em' }}>
            LANDASAN TEORITIS SISTEM TERDISTRIBUSI
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '0 0 14px 0' }}>
            Pembuktian Dua Pilar <span className="accent-text">Decoupling</span> pada Arsitektur
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div style={{ ...card, borderLeft: '3px solid #38bdf8' }}>
              <div style={cardHeader}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#38bdf8' }}>1. SPACE DECOUPLING (LOKASI FISIK)</span>
                <span style={badgeTech('#38bdf8', '#0c2340', '#0369a1')}>Gateway + Discovery</span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                Komponen sistem sama sekali <strong>tidak bergantung pada lokasi fisik (IP &amp; Port)</strong>:
              </p>
              <div style={{ background: '#0b1120', padding: '8px 10px', borderRadius: '6px', fontSize: '11.5px', color: '#94a3b8', border: '1px solid #1e293b' }}>
                • Klien hanya tahu: <code style={{ color: '#38bdf8' }}>http://localhost:8000</code><br />
                • Gateway hanya tahu: <code style={{ color: '#38bdf8' }}>lb://DOKTER-SERVICE</code><br />
                • Server bebas berpindah host atau port tanpa merusak konfigurasi.
              </div>
            </div>

            <div style={{ ...card, borderLeft: '3px solid #0284c7' }}>
              <div style={cardHeader}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#60a5fa' }}>2. TIME DECOUPLING (WAKTU SINKRON)</span>
                <span style={badgeTech('#60a5fa', '#0c1e3d', '#1d4ed8')}>RabbitMQ Fanout</span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
                Pengirim dan penerima pesan <strong>tidak harus aktif bersamaan</strong> saat pertukaran data:
              </p>
              <div style={{ background: '#0b1120', padding: '8px 10px', borderRadius: '6px', fontSize: '11.5px', color: '#94a3b8', border: '1px solid #1e293b' }}>
                • Dokter menerbitkan resep ke Fanout Exchange.<br />
                • Jika Apotek offline sejenak, pesan aman tertampung di antrean.<br />
                • Data diproses saat service online kembali tanpa data hilang.
              </div>
            </div>
          </div>
        </div>
      </Slide>

      {/* ========================================================
          SLIDE 11: KESIMPULAN & SESI TANYA JAWAB
      ======================================================== */}
      <Slide
        nav="11. Kesimpulan"
        notes="Sebagai penutup, kita telah membuktikan evolusi dari routing statis menuju dynamic discovery. Kami siap mendemokan simulasi_gateway.py dan simulasi_discovery.py secara live. Terima kasih."
      >
        <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px', letterSpacing: '0.08em' }}>
            PENUTUP &amp; PERSIAPAN DEMO LIVE
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px 0' }}>
            Ringkasan &amp; Kesiapan Demonstrasi Langsung
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', textAlign: 'left', marginBottom: '20px' }}>
            <div style={{ ...card, padding: '14px' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '13px', marginBottom: '4px' }}>1. Demo Gateway Hardcoded</div>
              <div style={{ fontSize: '11.5px', color: '#cbd5e1', fontFamily: 'monospace' }}>
                $ python3 simulasi_gateway.py
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Membuktikan Single Entry Point di port 8000 meneruskan ke port 8101..8104.
              </div>
            </div>

            <div style={{ ...card, padding: '14px' }}>
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '13px', marginBottom: '4px' }}>2. Demo Service Discovery</div>
              <div style={{ fontSize: '11.5px', color: '#34d399', fontFamily: 'monospace' }}>
                $ python3 simulasi_discovery.py
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Membuktikan dynamic lookup ke Registry port 8761 dan Web Dashboard GUI.
              </div>
            </div>

            <div style={{ ...card, padding: '14px' }}>
              <div style={{ fontWeight: 700, color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>3. Sesi Diskusi / Tanya Jawab</div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                Kelompok 2 siap mendiskusikan mekanisme failover, routing, dan decoupling.
              </div>
            </div>
          </div>

          <div style={{ padding: '16px', background: '#0b1120', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <h3 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '16px' }}>Terima Kasih atas Perhatian Bapak Dosen &amp; Rekan Sekalian</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>
              Kelompok 2 — Ridho Rizky Prasetyo • Firsandi Andraw F. • Ahmad Rafif Nandra U.
            </p>
          </div>
        </div>
      </Slide>
    </Deck>
  );
}
