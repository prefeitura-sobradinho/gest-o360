import { useMemo, useState } from 'react';
import { ListTree, Download, Search, AlertTriangle } from 'lucide-react';
import { Carregando, Erro, Fonte, KpiCard, SelosODS } from '@/components/ui-custom';
import { acoesPPA, acoesPPADoPrograma, REGIAO_LABEL } from '@/data/acoesPPA';
import { eixosPPA } from '@/data/eixos';
import { programas, programasDoEixo } from '@/data/programas';
import { ppa, fmtMi, fmtReais } from '@/data/municipio';
import { secretarias } from '@/data/secretarias';
import { useExecucao } from '@/hooks';
import { baixarCSV } from '@/lib/csv';

type Filtro = 'todas' | 'com' | 'sem';

/** As Ações do Anexo II do PPA, com a execução orçamentária de cada uma. */
export function AcoesPPA() {
  const { doPPA, carregando, erro, vazio } = useExecucao();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [busca, setBusca] = useState('');

  /** liquidado por código de ação orçamentária */
  const liquidadoPorCodigo = useMemo(() => {
    const m = new Map<number, number>();
    for (const i of doPPA) m.set(i.cdAcao, (m.get(i.cdAcao) ?? 0) + i.liquidado);
    return m;
  }, [doPPA]);

  const liquidadoDe = (a: { codigo?: number; repetida?: boolean }) =>
    a.codigo == null || a.repetida ? 0 : liquidadoPorCodigo.get(a.codigo) ?? 0;

  const comCodigo = acoesPPA.filter(a => a.codigo != null && !a.repetida);
  const semCodigo = acoesPPA.filter(a => a.codigo == null);
  const totalLiquidado = comCodigo.reduce((t, a) => t + liquidadoDe(a), 0);
  const semMovimento = comCodigo.filter(a => liquidadoDe(a) === 0).length;

  const termo = busca.trim().toLowerCase();
  const passa = (a: typeof acoesPPA[number]) =>
    (filtro === 'todas' || (filtro === 'com' ? a.codigo != null : a.codigo == null)) &&
    (!termo || a.nome.toLowerCase().includes(termo));

  const exportar = () => baixarCSV(
    'acoes-ppa',
    ['Eixo', 'Programa', 'Ação', 'Produto', 'Regionalização', 'Página do DO',
     'Código orçamentário', 'Liquidado (R$)', 'Situação'],
    acoesPPA.map(a => {
      const p = programas.find(x => x.id === a.programaId);
      const e = eixosPPA.find(x => x.id === p?.eixoId);
      return [
        e ? `${e.numero} — ${e.nome}` : '', p?.nome ?? '', a.nome, a.produto ?? '',
        a.regiao ? REGIAO_LABEL[a.regiao] : 'não informada', a.pagina,
        a.codigo ?? '', liquidadoDe(a),
        a.repetida ? 'repetida no PPA' : a.codigo == null ? 'sem ação orçamentária'
          : liquidadoDe(a) > 0 ? 'em execução' : 'sem movimento',
      ];
    }),
  );

  if (carregando) return <Carregando texto="Carregando as ações do PPA…" />;

  return (
    <div className="space-y-5 max-w-5xl">
      {erro && <Erro mensagem={erro} />}

      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h2 className="page-title"><ListTree className="mr-3 text-orange" size={22} /> Ações do PPA</h2>
          <p className="text-sm text-muted mt-1">
            {acoesPPA.length} ações do Anexo II · {ppa.leiCurta}
          </p>
        </div>
        <button onClick={exportar} className="btn-ghost-sm shrink-0"><Download size={12} className="mr-1" /> CSV</button>
      </div>

      <div className="kpi-strip">
        <KpiCard icon={ListTree} label="Ações no PPA" valor={String(acoesPPA.length)}
          sub={`em ${programas.length} programas`} acent="#EA580C" />
        <KpiCard icon={ListTree} label="Com orçamento" valor={String(comCodigo.length)}
          sub="têm ação no portal" acent="#1D7FB0" />
        <KpiCard icon={AlertTriangle} label="Sem orçamento" valor={String(semCodigo.length)}
          sub="planejadas, não abertas" acent="#B23A2E" />
        <KpiCard icon={ListTree} label="Liquidado" valor={vazio ? '—' : fmtMi(totalLiquidado)}
          sub={vazio ? 'sem dados importados' : `${semMovimento} ainda sem movimento`} acent="#5C7A4C" />
      </div>

      <div className="nota-execucao">
        <div>
          <strong>{semCodigo.length} das {acoesPPA.length} ações previstas no PPA não têm ação orçamentária
          correspondente</strong> no Portal da Transparência. Elas foram planejadas no Anexo II mas ainda não
          foram abertas no orçamento, então não podem receber empenho. Abrir a dotação depende de crédito na LOA
          ou de abertura por decreto.
        </div>
      </div>

      <div className="panel flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="search-wrap flex-1">
          <Search size={14} className="search-icon" />
          <input className="search-input" placeholder="Buscar ação…" value={busca}
            onChange={e => setBusca(e.target.value)} />
        </div>
        <div className="mode-toggle">
          {([['todas', 'Todas'], ['com', 'Com orçamento'], ['sem', 'Sem orçamento']] as const).map(([v, t]) => (
            <button key={v} onClick={() => setFiltro(v)} className={`mode-btn ${filtro === v ? 'ativo' : ''}`}>{t}</button>
          ))}
        </div>
      </div>

      {eixosPPA.map(eixo => {
        const progs = programasDoEixo(eixo.id).filter(p => acoesPPADoPrograma(p.id).some(passa));
        if (!progs.length) return null;
        return (
          <div key={eixo.id} className="space-y-4">
            <p className="secao-label">Eixo {eixo.numero} — {eixo.nome}</p>
            {progs.map(prog => {
              const lista = acoesPPADoPrograma(prog.id).filter(passa);
              const liq = acoesPPADoPrograma(prog.id).reduce((t, a) => t + liquidadoDe(a), 0);
              return (
                <div key={prog.id} className="panel">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-bold text-ink text-sm leading-snug">{prog.nome}</h3>
                      <p className="text-[11px] text-muted mt-0.5">
                        {[prog.unidadeResponsavel, secretarias[prog.secretariaId]?.titulo]
                          .filter((v, i, a) => v && a.indexOf(v) === i).join(' · ')}
                      </p>
                      <div className="mt-2"><SelosODS codigos={prog.ods} /></div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono-data text-sm font-bold text-ink">{vazio ? '—' : fmtMi(liq)}</p>
                      <p className="font-mono-data text-[10px] text-stone">
                        {lista.length} de {acoesPPADoPrograma(prog.id).length} ações
                      </p>
                    </div>
                  </div>

                  {prog.notaExecucao && (
                    <p className="text-xs text-muted mb-3 leading-relaxed">{prog.notaExecucao}</p>
                  )}

                  <div className="space-y-2">
                    {lista.map(a => {
                      const valor = liquidadoDe(a);
                      const semExec = a.codigo == null;
                      return (
                        <div key={a.id} className={`acao-linha ${semExec ? 'sem-exec' : ''}`}>
                          <div className="min-w-0">
                            <p className="acao-nome">{a.nome}</p>
                            <div className="acao-meta">
                              <span className="tag-regiao">{a.regiao ? REGIAO_LABEL[a.regiao] : 'região não informada'}</span>
                              {a.produto && <span className="tag-produto">{a.produto}</span>}
                              {a.codigo != null && <span className="tag-codigo">ação {a.codigo}</span>}
                              {a.repetida && <span className="tag-repetida">repetida no PPA</span>}
                              <span className="font-mono-data text-[10px] text-stone">pág. {a.pagina} do DO</span>
                            </div>
                          </div>
                          <span className={`acao-valor ${valor === 0 ? 'vazio' : ''}`}>
                            {vazio ? '—' : a.repetida ? 'contada acima'
                              : semExec ? 'sem dotação' : valor === 0 ? 'sem movimento' : fmtReais(valor)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <Fonte fonte={`PPA 2026–2029 · Anexo II (Espelho), ${ppa.publicacao} · execução do Portal da Transparência`} />
    </div>
  );
}
