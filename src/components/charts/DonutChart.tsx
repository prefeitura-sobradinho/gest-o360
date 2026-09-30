import { useState } from 'react';

export function DonutChart({ data, totalLabel }: { data: { nome: string; valor: number; cor: string }[]; totalLabel: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const cx = 80, cy = 80, outerR = 65, innerR = 42, gap = 0.025;
  const total = data.reduce((s, d) => s + d.valor, 0);
  let cum = -Math.PI / 2;
  const slices = data.map(d => {
    const angle = (d.valor / total) * (2 * Math.PI) - gap;
    const start = cum;
    cum += angle + gap;
    return { ...d, start, end: start + angle };
  });
  const arc = (s: number, e: number, oR: number, iR: number) => {
    const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x1, y1] = p(oR, s), [x2, y2] = p(oR, e), [x3, y3] = p(iR, e), [x4, y4] = p(iR, s);
    const lg = e - s > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${oR},${oR} 0 ${lg} 1 ${x2},${y2} L${x3},${y3} A${iR},${iR} 0 ${lg} 0 ${x4},${y4}Z`;
  };
  return (
    <svg viewBox="0 0 160 160" width="100%" height={155} style={{ overflow: 'visible' }} role="img" aria-label={`Distribuição: ${data.map(d => `${d.nome} ${d.valor}`).join(', ')}`}>
      {slices.map(s => (
        <path key={s.nome} d={arc(s.start, s.end, hover === s.nome ? outerR + 4 : outerR, innerR)} fill={s.cor}
          style={{ transition: 'all .15s', opacity: hover && hover !== s.nome ? 0.7 : 1 }}
          onMouseEnter={() => setHover(s.nome)} onMouseLeave={() => setHover(null)}>
          <title>{s.nome}: R$ {s.valor} Mi</title>
        </path>
      ))}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="#8B8576" fontSize={9} fontFamily="DM Mono,monospace">TOTAL</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#1C2331" fontSize={14} fontWeight="700" fontFamily="Fraunces,serif">{totalLabel}</text>
    </svg>
  );
}
