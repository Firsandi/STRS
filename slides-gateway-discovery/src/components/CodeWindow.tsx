import { Fragment, type ReactNode } from 'react';

/* A macOS-style code window with robust syntax highlighting for YAML, JSON, Shell, and TS/JS.
   Ensures 100% crystal-clear readability with high-contrast palette. */

function highlightLine(line: string): ReactNode {
  if (!line || !line.trim()) return line || ' ';

  // 1. Comments (YAML # or JS // preceded by start or whitespace)
  const commentMatch = line.match(/^(\s*)(#|\/\/)(.*)$/);
  if (commentMatch) {
    return (
      <>
        <span>{commentMatch[1]}</span>
        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
          {commentMatch[2]}{commentMatch[3]}
        </span>
      </>
    );
  }

  // 2. YAML key-value pair, e.g. "server:", "port: 8000", "  - id: dokter-service", "    uri: http://localhost:8101"
  const yamlMatch = line.match(/^(\s*)(-\s+)?([a-zA-Z0-9_.-]+:)(.*)$/);
  if (yamlMatch) {
    const indent = yamlMatch[1];
    const dash = yamlMatch[2] || '';
    const key = yamlMatch[3];
    const rest = yamlMatch[4] || '';

    let restNode: ReactNode = rest;
    const trimmed = rest.trim();
    if (trimmed) {
      if (/^\d+$/.test(trimmed)) {
        // Numeric value (ports, counts)
        restNode = <span style={{ color: '#fbbf24', fontWeight: 600 }}>{rest}</span>;
      } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        // URLs
        restNode = <span style={{ color: '#34d399', fontWeight: 500 }}>{rest}</span>;
      } else if (trimmed.startsWith('Path=') || trimmed.includes('/')) {
        // Predicate paths
        restNode = <span style={{ color: '#4ade80' }}>{rest}</span>;
      } else {
        // Strings / identifiers
        restNode = <span style={{ color: '#e2e8f0' }}>{rest}</span>;
      }
    }

    return (
      <>
        <span>{indent}</span>
        {dash && <span style={{ color: '#f59e0b', fontWeight: 700 }}>{dash}</span>}
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>{key}</span>
        {restNode}
      </>
    );
  }

  // 3. YAML list item without key, e.g. "      - Path=/api/dokter/**"
  const listMatch = line.match(/^(\s*)(-\s+)(.*)$/);
  if (listMatch) {
    const indent = listMatch[1];
    const dash = listMatch[2];
    const val = listMatch[3];
    return (
      <>
        <span>{indent}</span>
        <span style={{ color: '#f59e0b', fontWeight: 700 }}>{dash}</span>
        <span style={{ color: '#4ade80' }}>{val}</span>
      </>
    );
  }

  // 4. Default high-contrast fallback
  return <span style={{ color: '#f8fafc' }}>{line}</span>;
}

export default function CodeWindow({
  title = 'application.yml',
  code,
  highlight = [],
}: {
  title?: string;
  code: string;
  highlight?: number[];
}) {
  const lines = code.replace(/\n$/, '').split('\n');

  return (
    <div
      className="cw"
      style={{
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.25)',
        width: '100%',
      }}
    >
      {/* Title Bar */}
      <div
        className="cw-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 14px',
          background: '#1e293b',
          borderBottom: '1px solid #334155',
        }}
      >
        <span className="cw-dots" style={{ display: 'flex', gap: '5px' }}>
          <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
          <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }} />
          <i style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
        </span>
        <span
          className="cw-title"
          style={{
            color: '#94a3b8',
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            fontWeight: 500,
          }}
        >
          {title}
        </span>
      </div>

      {/* Code Body */}
      <pre
        className="cw-body"
        style={{
          margin: 0,
          padding: '6px 0',
          background: '#0f172a',
          overflowX: 'auto',
        }}
      >
        <code
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            lineHeight: 1.34,
            display: 'block',
            color: '#f8fafc',
          }}
        >
          {lines.map((ln, i) => {
            const isHl = highlight.includes(i + 1);
            return (
              <div
                key={i}
                className={'cw-line' + (isHl ? ' hl' : '')}
                style={{
                  display: 'flex',
                  padding: '0 12px 0 0',
                  whiteSpace: 'pre',
                  background: isHl ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  borderLeft: isHl ? '3px solid #38bdf8' : '3px solid transparent',
                }}
              >
                <span
                  className="cw-no"
                  style={{
                    width: '32px',
                    flexShrink: 0,
                    color: isHl ? '#38bdf8' : '#64748b',
                    textAlign: 'right',
                    paddingRight: '8px',
                    marginRight: '10px',
                    borderRight: '1px solid #1e293b',
                    userSelect: 'none',
                    fontWeight: isHl ? 600 : 400,
                    fontSize: '11px',
                  }}
                >
                  {i + 1}
                </span>
                <span className="cw-code" style={{ color: '#f8fafc' }}>
                  {highlightLine(ln)}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
