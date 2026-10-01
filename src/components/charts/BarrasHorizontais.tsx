/** Barras horizontais: o nome fica à esquerda, com espaço para ser lido por inteiro. */
export interface ItemBarra {
  id: string;
  nome: string;
  pct: number;
  detalhe?: string;
  /** quando não há o que medir ainda, a barra fica neutra e o texto explica */
  semDados?: boolean;
}

const cor = (pct: number) => (pct >= 70 ? 'var(--verde)' : pct >= 50 ? 'var(--azul)' : 'var(--orange)');

export function BarrasHorizontais({ dados }: { dados: ItemBarra[] }) {
  return (
    <div className="barras-h">
      {dados.map(d => (
        <div key={d.id} className="barra-h-linha">
          <div className="barra-h-nome">
            <span className="barra-h-titulo">{d.nome}</span>
            {d.detalhe && <span className="barra-h-detalhe">{d.detalhe}</span>}
          </div>
          <div className="barra-h-trilho">
            {!d.semDados && <div className="barra-h-fill" style={{ width: `${Math.max(d.pct, 0.8)}%`, background: cor(d.pct) }} />}
          </div>
          <span className="barra-h-valor" style={{ color: d.semDados ? 'var(--stone)' : cor(d.pct) }}>
            {d.semDados ? '—' : `${d.pct}%`}
          </span>
        </div>
      ))}
    </div>
  );
}
