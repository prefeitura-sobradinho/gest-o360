import { useState } from 'react';

export function BarChartCSS({ data }: { data: { nome: string; exec: number }[] }) {
  const [tooltip, setTooltip] = useState<{ nome: string; exec: number } | null>(null);
  const cor = (v: number) => (v >= 70 ? '#5C7A4C' : v >= 50 ? '#1D7FB0' : '#EA580C');
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
        {data.map(item => (
          <div key={item.nome} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}
            onMouseEnter={() => setTooltip(item)} onMouseLeave={() => setTooltip(null)}>
            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 10, color: cor(item.exec), fontWeight: 600, lineHeight: 1 }}>{item.exec}%</span>
            <div style={{ width: '100%', background: '#EEE9E0', borderRadius: 4, height: 130, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: `${item.exec}%`, background: cor(item.exec), borderRadius: '4px 4px 0 0' }} />
            </div>
            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 10, color: '#6F6A5D', textAlign: 'center', lineHeight: 1.2, width: '100%' }}>{item.nome}</span>
          </div>
        ))}
      </div>
      {tooltip && (
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', background: '#1E3A8A', borderRadius: 8, padding: '7px 12px', fontSize: 11, fontFamily: 'DM Mono,monospace', color: '#fff', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 10 }}>
          {tooltip.nome}: {tooltip.exec}% executado
        </div>
      )}
    </div>
  );
}
