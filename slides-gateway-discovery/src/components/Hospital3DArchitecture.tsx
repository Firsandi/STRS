import React, { useState, useEffect, useRef } from 'react';

export type SimStep = 'idle' | 'client_to_gw' | 'gw_to_doc' | 'doc_to_mq' | 'mq_fanout' | 'direct_sim' | 'completed';

interface ServiceNode {
  id: string;
  name: string;
  category: string;
  port: string;
  endpoint: string;
  protocol: string;
  x: number; // percentage in canvas (0-100)
  y: number; // percentage in canvas (0-100)
  color: string;
  bgLight: string;
  border: string;
  description: string;
  actions: string[];
}

const ALL_NODES: ServiceNode[] = [
  {
    id: 'client',
    name: 'Klien Frontend',
    category: 'Application Client',
    port: 'Mobile / Web App',
    endpoint: 'http://localhost:8000',
    protocol: 'HTTP / REST',
    x: 12,
    y: 50,
    color: '#2563eb',
    bgLight: '#eff6ff',
    border: '#bfdbfe',
    description: 'Aplikasi antarmuka pengguna bagi dokter dan pasien. Seluruh request hanya dialamatkan ke port tunggal 8000.',
    actions: ['POST /api/dokter/resep', 'GET /api/apotek/antrean', 'POST /api/kasir/bayar'],
  },
  {
    id: 'gateway',
    name: 'API Gateway',
    category: 'Single Entry Point',
    port: 'Port 8000',
    endpoint: 'http://localhost:8000',
    protocol: 'Reverse Proxy (HTTP)',
    x: 34,
    y: 50,
    color: '#1d4ed8',
    bgLight: '#dbeafe',
    border: '#93c5fd',
    description: 'Pintu gerbang utama sistem yang mem-forward request klien ke microservice backend berdasarkan path URL.',
    actions: ['/api/dokter/** -> :8101', '/api/apotek/** -> :8102', '/api/kasir/** -> :8103', '/api/emr/** -> :8104'],
  },
  {
    id: 'dokter',
    name: 'Dokter Service',
    category: 'Clinical Service',
    port: 'Port 8101',
    endpoint: 'http://localhost:8101',
    protocol: 'REST API + AMQP Publisher',
    x: 58,
    y: 20,
    color: '#0284c7',
    bgLight: '#e0f2fe',
    border: '#7dd3fc',
    description: 'Layanan poli klinik untuk memproses resep obat dan mempublikasikan event PrescriptionIssued ke message broker.',
    actions: ['Simpan resep medis', 'Publish event ke Exchange hospital_prescriptions'],
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ Fanout Hub',
    category: 'Message Broker',
    port: 'Port 5672',
    endpoint: 'amqp://localhost:5672',
    protocol: 'AMQP 0-9-1 (Fanout)',
    x: 60,
    y: 55,
    color: '#d97706',
    bgLight: '#fef3c7',
    border: '#fde68a',
    description: 'Exchange bertipe Fanout bernama hospital_prescriptions. Menduplikasi dan menyiarkan pesan serempak ke semua antrean subscriber.',
    actions: ['Duplikasi pesan simultan', 'Non-blocking broadcast', 'Durable queue preservation'],
  },
  {
    id: 'apotek',
    name: 'Apotek Service',
    category: 'Pharmacy Division',
    port: 'Port 8102',
    endpoint: 'http://localhost:8102',
    protocol: 'AMQP Consumer + REST API',
    x: 88,
    y: 20,
    color: '#16a34a',
    bgLight: '#dcfce7',
    border: '#86efac',
    description: 'Divisi farmasi yang mendengarkan event resep baru di background thread untuk menyiapkan obat dan memotong stok otomatis.',
    actions: ['Potong stok obat', 'Buat antrean racikan', 'Endpoint GET /api/apotek/antrean'],
  },
  {
    id: 'kasir',
    name: 'Kasir Service',
    category: 'Billing Division',
    port: 'Port 8103',
    endpoint: 'http://localhost:8103',
    protocol: 'AMQP Consumer + REST API',
    x: 88,
    y: 55,
    color: '#ea580c',
    bgLight: '#ffedd5',
    border: '#fdba74',
    description: 'Divisi kasir yang menerima event resep untuk mengkalkulasi grand total biaya dan menerbitkan invoice pembayaran.',
    actions: ['Kalkulasi obat + jasa dokter', 'Generate invoice', 'Endpoint POST /api/kasir/bayar'],
  },
  {
    id: 'emr',
    name: 'Rekam Medis (EMR)',
    category: 'Medical Archive',
    port: 'Port 8104',
    endpoint: 'http://localhost:8104',
    protocol: 'AMQP Consumer + REST API',
    x: 88,
    y: 85,
    color: '#7e22ce',
    bgLight: '#f3e8ff',
    border: '#d8b4fe',
    description: 'Layanan arsip rekam medis pasien untuk mendokumentasikan diagnosa, obat yang diberikan, dan riwayat kunjungan.',
    actions: ['Arsip histori pasien', 'Database RM terdistribusi', 'Endpoint GET /api/emr/riwayat'],
  },
];

export default function Hospital3DArchitecture() {
  const [mode, setMode] = useState<'gateway' | 'direct'>('gateway');
  const [selectedNode, setSelectedNode] = useState<ServiceNode>(ALL_NODES[1]); // default Gateway
  const [simStep, setSimStep] = useState<SimStep>('idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter nodes: In Direct mode, API Gateway and RabbitMQ DO NOT exist!
  const visibleNodes = mode === 'direct'
    ? ALL_NODES.filter((n) => n.id !== 'gateway' && n.id !== 'rabbitmq')
    : ALL_NODES;

  // Handle switching modes: ensure selectedNode is valid
  const handleModeChange = (newMode: 'gateway' | 'direct') => {
    setMode(newMode);
    setSimStep('idle');
    if (newMode === 'direct') {
      if (selectedNode.id === 'gateway' || selectedNode.id === 'rabbitmq') {
        setSelectedNode(ALL_NODES[2]); // select Dokter
      }
    } else {
      setSelectedNode(ALL_NODES[1]); // select Gateway
    }
  };

  // Simulation runner
  const startSimulation = () => {
    if (simStep !== 'idle' && simStep !== 'completed') return;

    if (mode === 'direct') {
      // Direct access simulation: client fires to all 4 ports
      setSimStep('direct_sim');
      setTimeout(() => {
        setSimStep('completed');
      }, 2500);
      return;
    }

    // Gateway + RabbitMQ simulation flow
    setSimStep('client_to_gw');
    setTimeout(() => {
      setSimStep('gw_to_doc');
      setTimeout(() => {
        setSimStep('doc_to_mq');
        setTimeout(() => {
          setSimStep('mq_fanout');
          setTimeout(() => {
            setSimStep('completed');
          }, 1800);
        }, 1100);
      }, 1000);
    }, 1000);
  };

  const resetSimulation = () => setSimStep('idle');

  // Canvas visual rendering for animated packet lines and high-tech paths
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Helper to map percent coordinate to canvas pixel
      const getPt = (nodeId: string) => {
        const n = ALL_NODES.find((item) => item.id === nodeId);
        if (!n) return { x: 0, y: 0 };
        return { x: (n.x / 100) * w, y: (n.y / 100) * h };
      };

      // Draw connection line helper
      const drawLine = (
        fromId: string,
        toId: string,
        strokeColor: string,
        lineWidth: number,
        isDashed: boolean = false,
        isAnimated: boolean = false
      ) => {
        const p1 = getPt(fromId);
        const p2 = getPt(toId);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        if (isDashed) ctx.setLineDash([6, 6]);
        ctx.stroke();

        // Pulsing light particle ONLY when simulation is actively running!
        if (isAnimated && simStep !== 'idle') {
          const progress = (t * 0.8) % 1;
          const px = p1.x + (p2.x - p1.x) * progress;
          const py = p1.y + (p2.y - p1.y) * progress;

          ctx.beginPath();
          ctx.arc(px, py, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = strokeColor;
          ctx.shadowBlur = 10;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = strokeColor;
          ctx.fill();
        }
        ctx.restore();
      };

      if (mode === 'direct') {
        // Red direct lines from Client to each 4 services (NO Gateway, NO RabbitMQ)
        const isSim = simStep === 'direct_sim';
        drawLine('client', 'dokter', '#ef4444', isSim ? 2.5 : 1.5, true, isSim);
        drawLine('client', 'apotek', '#ef4444', isSim ? 2.5 : 1.5, true, isSim);
        drawLine('client', 'kasir', '#ef4444', isSim ? 2.5 : 1.5, true, isSim);
        drawLine('client', 'emr', '#ef4444', isSim ? 2.5 : 1.5, true, isSim);
      } else {
        // Clean Gateway + RabbitMQ Architecture lines
        const isC2G = simStep === 'client_to_gw';
        const isG2D = simStep === 'gw_to_doc';
        const isD2M = simStep === 'doc_to_mq';
        const isBroadcast = simStep === 'mq_fanout' || simStep === 'completed';

        // Client -> Gateway
        drawLine('client', 'gateway', isC2G ? '#2563eb' : '#94a3b8', isC2G ? 3.5 : 2, false, isC2G);

        // Gateway -> Dokter
        drawLine('gateway', 'dokter', isG2D ? '#0284c7' : '#cbd5e1', isG2D ? 3.5 : 1.5, false, isG2D);

        // Dokter -> RabbitMQ
        drawLine('dokter', 'rabbitmq', isD2M ? '#d97706' : '#fcd34d', isD2M ? 3.5 : 2, false, isD2M);

        // RabbitMQ Fanout Broadcast -> Apotek, Kasir, EMR
        drawLine('rabbitmq', 'apotek', isBroadcast ? '#16a34a' : '#86efac', isBroadcast ? 3.5 : 1.5, false, isBroadcast);
        drawLine('rabbitmq', 'kasir', isBroadcast ? '#ea580c' : '#fdba74', isBroadcast ? 3.5 : 1.5, false, isBroadcast);
        drawLine('rabbitmq', 'emr', isBroadcast ? '#7e22ce' : '#d8b4fe', isBroadcast ? 3.5 : 1.5, false, isBroadcast);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mode, simStep]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '20px',
        height: '100%',
        maxHeight: '440px',
      }}
    >
      {/* Kolom Kiri: Visualisator Arsitektur */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1.5px solid #cbd5e1',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
        }}
      >
        {/* Top Control Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleModeChange('gateway')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: mode === 'gateway' ? '#2563eb' : '#cbd5e1',
                background: mode === 'gateway' ? '#eff6ff' : '#ffffff',
                color: mode === 'gateway' ? '#1d4ed8' : '#475569',
                cursor: 'pointer',
              }}
            >
              Mode Solusi: API Gateway + RabbitMQ
            </button>
            <button
              onClick={() => handleModeChange('direct')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                border: '1px solid',
                borderColor: mode === 'direct' ? '#dc2626' : '#cbd5e1',
                background: mode === 'direct' ? '#fef2f2' : '#ffffff',
                color: mode === 'direct' ? '#991b1b' : '#475569',
                cursor: 'pointer',
              }}
            >
              Mode Masalah: Direct Access
            </button>
          </div>

          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
            {mode === 'gateway' ? 'Pintu Tunggal :8000' : 'Akses Port Mandiri (Kacau)'}
          </span>
        </div>

        {/* Area Diagram: Canvas Garis + DOM Nodes yang Jelas */}
        <div style={{ flex: 1, position: 'relative', background: '#f8fafc' }}>
          <canvas
            ref={canvasRef}
            width={720}
            height={360}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          />

          {/* DOM Interactive Cards (Menghilangkan Gateway dan RabbitMQ saat mode Direct Access) */}
          {visibleNodes.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{
                  position: 'absolute',
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isSelected ? 20 : 10,
                  cursor: 'pointer',
                  background: isSelected ? '#ffffff' : node.bgLight,
                  border: `2px solid ${isSelected ? node.color : node.border}`,
                  borderRadius: '10px',
                  padding: '8px 12px',
                  boxShadow: isSelected
                    ? `0 6px 18px -2px ${node.color}33, 0 0 0 3px ${node.color}22`
                    : '0 2px 6px rgba(15, 23, 42, 0.05)',
                  minWidth: '110px',
                  textAlign: 'center',
                  transition: 'all 0.18s ease',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{node.name}</div>
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: node.color,
                    marginTop: '2px',
                  }}
                >
                  {node.port}
                </div>
              </div>
            );
          })}

          {/* Floating Status Step Box Saat Simulasi Berjalan */}
          {simStep !== 'idle' && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '14px',
                zIndex: 25,
                background: '#0f172a',
                color: '#ffffff',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: simStep === 'completed' ? '#4ade80' : '#38bdf8',
                }}
              />
              {mode === 'direct' && simStep === 'direct_sim' && 'Simulasi Direct Access: Klien harus menembak 4 port berbeda sekaligus!'}
              {mode === 'gateway' && simStep === 'client_to_gw' && 'Tahap 1: Klien mengirim POST /api/dokter/resep ke Gateway :8000'}
              {mode === 'gateway' && simStep === 'gw_to_doc' && 'Tahap 2: API Gateway mem-forward request ke Dokter Service :8101'}
              {mode === 'gateway' && simStep === 'doc_to_mq' && 'Tahap 3: Dokter mempublikasikan event PrescriptionIssued ke RabbitMQ'}
              {mode === 'gateway' && simStep === 'mq_fanout' && 'Tahap 4: RabbitMQ menyiarkan serempak ke Apotek, Kasir, dan EMR!'}
              {simStep === 'completed' && 'Selesai: Seluruh tahapan berhasil disimulasikan!'}
            </div>
          )}
        </div>

        {/* Bottom Simulation Bar */}
        <div
          style={{
            padding: '10px 16px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={startSimulation}
              disabled={simStep !== 'idle' && simStep !== 'completed'}
              style={{
                padding: '7px 18px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                background: simStep !== 'idle' && simStep !== 'completed' ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                cursor: simStep !== 'idle' && simStep !== 'completed' ? 'not-allowed' : 'pointer',
              }}
            >
              Jalankan Simulasi Alur
            </button>
            {simStep !== 'idle' && (
              <button
                onClick={resetSimulation}
                style={{
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            )}
          </div>

          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Pilih komponen pada diagram untuk melihat spesifikasi teknis
          </span>
        </div>
      </div>

      {/* Kolom Kanan: Panel Detail Komponen (Murni Teknis) */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1.5px solid #cbd5e1',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            SPESIFIKASI KOMPONEN
          </span>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              background: selectedNode.bgLight,
              color: selectedNode.color,
              border: `1px solid ${selectedNode.border}`,
            }}
          >
            {selectedNode.protocol}
          </span>
        </div>

        {/* Selected Component Header */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0f172a', fontWeight: 700 }}>
            {selectedNode.name}
          </h3>
          <div style={{ fontSize: '12.5px', color: '#2563eb', fontFamily: 'monospace', fontWeight: 600 }}>
            {selectedNode.endpoint}
          </div>
        </div>

        {/* Deskripsi Sistem */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
            Fungsi Sistem:
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
            {selectedNode.description}
          </p>
        </div>

        {/* Operasi / Endpoint Terkait */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
            Tanggung Jawab &amp; Operasi:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {selectedNode.actions.map((act, i) => (
              <div
                key={i}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11.5px',
                  fontFamily: 'monospace',
                  color: '#1e293b',
                }}
              >
                • {act}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Node Selector Pills */}
        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
            Pilih Komponen:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {visibleNodes.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNode(n)}
                style={{
                  padding: '4px 9px',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: selectedNode.id === n.id ? n.color : '#cbd5e1',
                  background: selectedNode.id === n.id ? n.color : '#ffffff',
                  color: selectedNode.id === n.id ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                }}
              >
                {n.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
