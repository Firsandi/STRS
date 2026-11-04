import React from 'react';

// Clean SVG Icons for academic/enterprise presentations (Replacing Emojis)
export const Icons = {
  Server: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/>
      <line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Gateway: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18M15 9l-3 3 3 3"/>
    </svg>
  ),
  Discovery: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <circle cx="11" cy="11" r="3"/>
    </svg>
  ),
  Heartbeat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Network: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="6" rx="1"/>
      <rect x="2" y="16" width="6" height="6" rx="1"/>
      <rect x="16" y="16" width="6" height="6" rx="1"/>
      <path d="M12 8v4M5 16v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Alert: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
};

// =========================================================================
// ILUSTRASI 1: Direct Access vs API Gateway Single Entry Point
// =========================================================================
export function DirectVsGatewayIllustration({ mode = 'gateway' }: { mode?: 'direct' | 'gateway' }) {
  return (
    <div style={{ width: '100%', height: '220px', background: '#0b1329', borderRadius: '12px', border: '1px solid #1e293b', position: 'relative', overflow: 'hidden', padding: '12px' }}>
      <svg width="100%" height="100%" viewBox="0 0 600 200" fill="none">
        <defs>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Client Box */}
        <rect x="20" y="70" width="110" height="60" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="75" y="97" fill="#f8fafc" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">CLIENT APP</text>
        <text x="75" y="115" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Web / Mobile</text>

        {/* 4 Backend Services */}
        {[
          { y: 15, name: 'Dokter', port: ':8101', color: '#38bdf8' },
          { y: 65, name: 'Apotek', port: ':8102', color: '#4ade80' },
          { y: 115, name: 'Kasir', port: ':8103', color: '#fbbf24' },
          { y: 165, name: 'EMR', port: ':8104', color: '#c084fc' }
        ].map((srv, idx) => (
          <g key={idx}>
            <rect x="470" y={srv.y} width="110" height="34" rx="6" fill="#1e293b" stroke={srv.color} strokeWidth="1.2" />
            <text x="525" y={srv.y + 16} fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">{srv.name}</text>
            <text x="525" y={srv.y + 28} fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">{srv.port}</text>
          </g>
        ))}

        {mode === 'direct' ? (
          // Direct Mode: Tangled Red Lines
          <>
            <path d="M 130 85 C 250 85, 350 32, 470 32" stroke="url(#redGrad)" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M 130 95 C 250 95, 350 82, 470 82" stroke="url(#redGrad)" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M 130 105 C 250 105, 350 132, 470 132" stroke="url(#redGrad)" strokeWidth="2" strokeDasharray="4 3" />
            <path d="M 130 115 C 250 115, 350 182, 470 182" stroke="url(#redGrad)" strokeWidth="2" strokeDasharray="4 3" />
            <rect x="230" y="80" width="140" height="40" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
            <text x="300" y="98" fill="#fca5a5" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">TIGHT COUPLING</text>
            <text x="300" y="112" fill="#ef4444" fontSize="9" textAnchor="middle" fontFamily="sans-serif">4 Alamat Port Terbuka Bebas</text>
          </>
        ) : (
          // Gateway Mode: Structured Single Entry Point
          <>
            {/* Connection: Client -> Gateway */}
            <path d="M 130 100 L 230 100" stroke="#38bdf8" strokeWidth="3" filter="url(#glow)" />
            <circle cx="180" cy="100" r="4" fill="#38bdf8" />

            {/* Gateway Central Node */}
            <rect x="230" y="45" width="140" height="110" rx="10" fill="#0f172a" stroke="#2563eb" strokeWidth="2" filter="url(#glow)" />
            <rect x="240" y="55" width="120" height="24" rx="4" fill="#1e3a8a" />
            <text x="300" y="71" fill="#60a5fa" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">API GATEWAY</text>
            <text x="300" y="95" fill="#f8fafc" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">PORT 8000</text>
            <text x="300" y="113" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Single Entry Point</text>
            <text x="300" y="128" fill="#38bdf8" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">Reverse Proxy / Routing</text>

            {/* Controlled Forwarding Lines */}
            <path d="M 370 80 C 420 80, 420 32, 470 32" stroke="#38bdf8" strokeWidth="1.8" />
            <path d="M 370 93 C 420 93, 420 82, 470 82" stroke="#4ade80" strokeWidth="1.8" />
            <path d="M 370 107 C 420 107, 420 132, 470 132" stroke="#fbbf24" strokeWidth="1.8" />
            <path d="M 370 120 C 420 120, 420 182, 470 182" stroke="#c084fc" strokeWidth="1.8" />
          </>
        )}
      </svg>
    </div>
  );
}

// =========================================================================
// ILUSTRASI 2: Arsitektur Service Discovery (Eureka Registry)
// =========================================================================
export function ServiceDiscoveryIllustration() {
  return (
    <div style={{ width: '100%', height: '240px', background: '#090d16', borderRadius: '12px', border: '1px solid #1e293b', position: 'relative', overflow: 'hidden', padding: '10px' }}>
      <svg width="100%" height="100%" viewBox="0 0 620 220" fill="none">
        <defs>
          <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* TOP: SERVICE REGISTRY (PORT 8761) */}
        <rect x="180" y="12" width="260" height="65" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="2" filter="url(#greenGlow)" />
        <rect x="195" y="20" width="230" height="20" rx="4" fill="#064e3b" />
        <text x="310" y="34" fill="#34d399" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">SERVICE REGISTRY (EUREKA / CONSUL)</text>
        <text x="310" y="52" fill="#f8fafc" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">PORT 8761: Central Directory</text>
        <text x="310" y="67" fill="#94a3b8" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">Heartbeat Monitor &amp; Dynamic Instance Table</text>

        {/* BOTTOM LEFT: API GATEWAY */}
        <rect x="25" y="130" width="150" height="75" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="100" y="152" fill="#93c5fd" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">API GATEWAY</text>
        <text x="100" y="170" fill="#f8fafc" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">Port 8000</text>
        <rect x="35" y="178" width="130" height="18" rx="4" fill="#1e3a8a" />
        <text x="100" y="190" fill="#bfdbfe" fontSize="8.5" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">Lookup via lb://</text>

        {/* BOTTOM RIGHT: MICROSERVICES CLUSTER */}
        <rect x="350" y="125" width="245" height="85" rx="8" fill="#131c31" stroke="#334155" strokeWidth="1.2" />
        <text x="472" y="142" fill="#94a3b8" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">REGISTERED MICROSERVICES</text>

        {[
          { x: 360, name: 'Dokter', port: ':8101', color: '#38bdf8' },
          { x: 420, name: 'Apotek', port: ':8102', color: '#4ade80' },
          { x: 480, name: 'Kasir', port: ':8103', color: '#fbbf24' },
          { x: 540, name: 'EMR', port: ':8104', color: '#c084fc' }
        ].map((inst, i) => (
          <g key={i}>
            <rect x={inst.x} y="152" width="50" height="48" rx="5" fill="#1e293b" stroke={inst.color} strokeWidth="1" />
            <circle cx={inst.x + 10} cy="164" r="3" fill="#10b981" />
            <text x={inst.x + 25} y="176" fill="#f8fafc" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">{inst.name}</text>
            <text x={inst.x + 25} y="190" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">{inst.port}</text>
          </g>
        ))}

        {/* ARROWS: Registration & Heartbeat (Services -> Registry) */}
        <path d="M 470 125 L 390 77" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
        <text x="460" y="100" fill="#34d399" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">1. Self-Registration &amp; Heartbeat (10s)</text>

        {/* ARROWS: Lookup (Gateway <-> Registry) */}
        <path d="M 125 130 L 220 77" stroke="#38bdf8" strokeWidth="2" />
        <text x="110" y="100" fill="#38bdf8" fontSize="8.5" fontWeight="600" fontFamily="sans-serif">2. Lookup "lb://DOKTER"</text>

        {/* ARROW: Dynamic Proxy Forward (Gateway -> Services) */}
        <path d="M 175 170 L 350 170" stroke="#f59e0b" strokeWidth="2.5" />
        <text x="260" y="163" fill="#f59e0b" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">3. Dynamic Proxy</text>
      </svg>
    </div>
  );
}
