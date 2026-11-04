import React, { useState } from 'react';

// =========================================================================
// DIAGRAM ALUR DATA REAL-TIME (REQUEST -> GATEWAY -> REGISTRY -> SERVICES)
// =========================================================================
export function InteractiveDataFlowDiagram() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: 'Klien Kirim Request',
      detail: 'Client (Web/Mobile) menembak: POST http://localhost:8000/api/dokter/resep',
      highlight: 'client-to-gw'
    },
    {
      num: 2,
      title: 'Gateway Lookup ke Registry',
      detail: 'Gateway memeriksa rute "lb://DOKTER-SERVICE", lalu query: GET http://localhost:8761/services/DOKTER-SERVICE',
      highlight: 'gw-to-reg'
    },
    {
      num: 3,
      title: 'Registry Berikan Alamat Sehat',
      detail: 'Registry mengembalikan JSON: { "selected_instance": { "url": "http://localhost:8101", "status": "UP" } }',
      highlight: 'reg-to-gw'
    },
    {
      num: 4,
      title: 'Gateway Forward ke Instance',
      detail: 'Gateway mem-proxy payload HTTP ke http://localhost:8101/api/dokter/resep secara transparan',
      highlight: 'gw-to-service'
    }
  ];

  return (
    <div style={{ background: '#0b132b', borderRadius: '12px', border: '1.5px solid #1e293b', padding: '16px', color: '#e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.05em' }}>
          ALUR DATA STEP-BY-STEP (KLIK TAHAP UNTUK SIMULASI)
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: activeStep === s.num ? '1px solid #38bdf8' : '1px solid #334155',
                background: activeStep === s.num ? '#0284c7' : '#1e293b',
                color: activeStep === s.num ? '#ffffff' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Tahap {s.num}
            </button>
          ))}
        </div>
      </div>

      <svg width="100%" height="160" viewBox="0 0 640 160" fill="none">
        {/* Node 1: Klien */}
        <rect x="15" y="55" width="105" height="50" rx="8" fill="#1e293b" stroke={activeStep === 1 ? '#38bdf8' : '#475569'} strokeWidth={activeStep === 1 ? 2.5 : 1} />
        <text x="67" y="78" fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">CLIENT</text>
        <text x="67" y="93" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">Port Acak</text>

        {/* Node 2: Gateway */}
        <rect x="200" y="45" width="130" height="70" rx="8" fill="#0f172a" stroke={activeStep === 1 || activeStep === 2 || activeStep === 4 ? '#38bdf8' : '#334155'} strokeWidth={2} />
        <text x="265" y="72" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">API GATEWAY</text>
        <text x="265" y="88" fill="#f8fafc" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="monospace">:8000</text>
        <text x="265" y="103" fill="#64748b" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">Reverse Proxy</text>

        {/* Node 3: Service Registry */}
        <rect x="200" y="5" width="130" height="30" rx="6" fill="#064e3b" stroke={activeStep === 2 || activeStep === 3 ? '#10b981' : '#047857'} strokeWidth={activeStep === 2 || activeStep === 3 ? 2 : 1} />
        <text x="265" y="24" fill="#6ee7b7" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">REGISTRY :8761</text>

        {/* Node 4: Microservice Target */}
        <rect x="495" y="55" width="130" height="50" rx="8" fill="#1e293b" stroke={activeStep === 4 ? '#4ade80' : '#475569'} strokeWidth={activeStep === 4 ? 2.5 : 1} />
        <text x="560" y="78" fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">DOKTER SERVICE</text>
        <text x="560" y="93" fill="#4ade80" fontSize="9" textAnchor="middle" fontFamily="monospace">:8101 (UP)</text>

        {/* Connection Arrows based on activeStep */}
        {activeStep === 1 && (
          <g>
            <path d="M 120 80 L 195 80" stroke="#38bdf8" strokeWidth="2.5" />
            <polygon points="195,80 187,75 187,85" fill="#38bdf8" />
            <text x="157" y="72" fill="#38bdf8" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="monospace">POST /api/..</text>
          </g>
        )}

        {activeStep === 2 && (
          <g>
            <path d="M 265 45 L 265 37" stroke="#fbbf24" strokeWidth="2.5" />
            <polygon points="265,37 261,42 269,42" fill="#fbbf24" />
            <text x="310" y="32" fill="#fbbf24" fontSize="8" fontWeight="700" fontFamily="monospace">Lookup "lb://DOKTER"</text>
          </g>
        )}

        {activeStep === 3 && (
          <g>
            <path d="M 265 37 L 265 45" stroke="#10b981" strokeWidth="2.5" />
            <polygon points="265,45 261,40 269,40" fill="#10b981" />
            <text x="310" y="32" fill="#34d399" fontSize="8" fontWeight="700" fontFamily="monospace">Resp: :8101 (UP)</text>
          </g>
        )}

        {activeStep === 4 && (
          <g>
            <path d="M 330 80 L 490 80" stroke="#4ade80" strokeWidth="2.5" />
            <polygon points="490,80 482,75 482,85" fill="#4ade80" />
            <text x="410" y="72" fill="#4ade80" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="monospace">Proxy Forward :8101</text>
          </g>
        )}
      </svg>

      <div style={{ background: '#070c18', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid #38bdf8', fontSize: '12px' }}>
        <strong style={{ color: '#38bdf8' }}>Tahap {activeStep} - {steps[activeStep - 1].title}: </strong>
        <span style={{ color: '#cbd5e1' }}>{steps[activeStep - 1].detail}</span>
      </div>
    </div>
  );
}

// =========================================================================
// ILUSTRASI CRASH / KEGAGALAN (HARDCODE VS SERVICE DISCOVERY)
// =========================================================================
export function FailureComparisonIllustration({ scenario }: { scenario: 'hardcode_crash' | 'discovery_heal' }) {
  if (scenario === 'hardcode_crash') {
    return (
      <div style={{ background: '#1c0a0a', border: '1.5px solid #dc2626', borderRadius: '10px', padding: '14px', color: '#fecaca', fontFamily: 'monospace', fontSize: '11.5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #7f1d1d', paddingBottom: '6px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 700, color: '#f87171' }}>SKENARIO KEGAGALAN: SERVICE CRASH PADA HARDCODE</span>
          <span style={{ background: '#991b1b', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>502 BAD GATEWAY</span>
        </div>
        <div style={{ color: '#94a3b8' }}>1. EMR Service (:8104) mati tiba-tiba ($ kill -9 &lt;pid&gt;)</div>
        <div style={{ color: '#94a3b8' }}>2. Klien kirim GET http://localhost:8000/api/emr/rekam-medis</div>
        <div style={{ color: '#f87171' }}>3. Gateway memaksakan forward ke konfigurasi statis: http://localhost:8104</div>
        <div style={{ color: '#ef4444', fontWeight: 700, marginTop: '6px' }}>
          [ERROR] ConnectionRefusedError: [Errno 111] Connection refused<br />
          HTTP/1.1 502 Bad Gateway (Klien menerima pesan error dan sistem down)
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#051b11', border: '1.5px solid #10b981', borderRadius: '10px', padding: '14px', color: '#a7f3d0', fontFamily: 'monospace', fontSize: '11.5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #065f46', paddingBottom: '6px', marginBottom: '8px' }}>
        <span style={{ fontWeight: 700, color: '#34d399' }}>SKENARIO SELF-HEALING: DISCOVERY &amp; ROUND-ROBIN</span>
        <span style={{ background: '#065f46', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>200 OK AUTO-FAILOVER</span>
      </div>
      <div style={{ color: '#94a3b8' }}>1. Kasir Service 1 (:8103) mati, tapi Kasir Service 2 (:8105) tetap aktif</div>
      <div style={{ color: '#94a3b8' }}>2. Heartbeat :8103 putus &gt; 30 detik -&gt; Registry otomatis mencoret :8103</div>
      <div style={{ color: '#34d399' }}>3. Gateway bertanya ke Registry: "Mana KASIR-SERVICE yang UP?"</div>
      <div style={{ color: '#10b981', fontWeight: 700, marginTop: '6px' }}>
        Registry menjawab: :8105 (Instance Sehat)<br />
        Gateway meneruskan ke :8105 -&gt; HTTP/1.1 200 OK (Zero Downtime!)
      </div>
    </div>
  );
}
