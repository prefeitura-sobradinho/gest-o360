import { useState } from 'react';
import { Link } from 'react-router';
import { Wallet, TrendingUp, ChevronRight, Download } from 'lucide-react';
import { BarraProgresso, Carregando, Erro, Fonte, KpiCard, Vazio } from '@/components/ui-custom';
import { programas } from '@/data/programas';
import { eixosPPA } from '@/data/eixos';
import { ppa, fmtMi, fmtReais } from '@/data/municipio';
import { useExecucao, useReceitas } from '@/hooks';
import { execucaoDoPrograma, percentualDoPPA, MESES } from '@/lib/execucao';
import { baixarCSV } from '@/lib/csv';
import { secretarias } from '@/data/secretarias';

/** Execução financeira do PPA, a partir dos dados do Portal da Transparência. */
export function Execucao() {
  const { doPPA, itens, totais, anos, carregando, erro, vazio } = useExecucao();
  const receitas = useReceitas();
  const [ano, setAno] = useState<number | 'todos'>('todos');

  const filtrados = ano === 'todos' ? doPPA : doPPA.filter(i => i.ano === ano);
  const exec = (id: string) => execucaoDoPrograma(filtrados, id);
  const totalLiquidado = filtrados.reduce((a, i) => a + i.liquidado, 0);
  const pctPPA = Math.round((totalLiquidado / ppa.orcamentoTotal) * 1000) / 10;

  const receitaAnos = [...receitas.porAno.entries()].sort((a, b) => a[0] - b[0]);
  const inicio = new Date(ppa.inicio).getTime(), fim = new Date(ppa.fim).getTime();
  const pctTempo = Math.max(0, Math.min(100, Math.round(((Date.now() - inicio) / (fim - inicio)) * 1000) / 10));

  const exportarCSV = () => baixarCSV(
    'execucao-ppa',
    ['Ano', 'Mês', 'Código da ação', 'Ação', 'Programa', 'Eixo', 'Secretaria', 'Função', 'Empenhado (R$)', 'Liquidado (R$)', 'Pago (R$)'],
    [...filtrados].sort((a, b) => a.ano - b.ano || a.mes - b.mes || b.liquidado - a.liquidado).map(i => {
      const prog = programas.find(p => p.id === i.programaId);
      const eixo = eixosPPA.find(e => e.id === prog?.eixoId);
      return [i.ano, MESES[i.mes], i.cdAcao, i.dsAcao, prog?.nome ?? '', eixo ? `${eixo.numero} — ${eixo.nome}` : '',
        secretarias[i.secretariaId]?.titulo ?? i.secretariaId, i.funcao, i.empenhado, i.liquidado, i.pago];
    }),
  );

  if (carregando) return <Carregando texto="Carregando execução financeira…" />;

  return (
    <div className="space-y-5 max-w-5xl">
      {erro && <Erro mensagem={erro} />}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="page-title"><Wallet className="mr-3 text-orange" size={22} /> Execução financeira</h2>
          <p className="text-sm text-muted mt-1">Quanto do PPA já foi executado, por programa · {ppa.periodo}</p>
        </div>
        <div className="flex gap-2">
          {anos.length > 1 && (
            <select value={ano} onChange={e => setAno(e.target.value === 'todos' ? 'todos' : Number(e.target.value))} className="modal-input" style={{ width: 'auto' }}>
              <option value="todos">Todo o quadriênio</option>
              {anos.filter(a => a >= 2026).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}
          {filtrados.length > 0 && <button onClick={exportarCSV} className="btn-ghost-sm"><Download size={12} className="mr-1" /> CSV</button>}
        </div>
      </div>

      {vazio ? (
        <Vazio
          titulo="Nenhum dado financeiro importado"
          texto="Exporte as despesas e receitas em JSON no Portal da Transparência e importe pela área administrativa."
          acao={<Link to="/admin" className="btn-gold-solid">Ir para as ferramentas</Link>}
        />
      ) : (
        <>
          <div className="panel">
            <div className="flex justify-between items-end mb-3 gap-3">
              <div>
                <p className="panel-sub">Liquidado no PPA</p>
                <p className="font-display text-3xl font-bold text-ink mt-1">{fmtMi(totalLiquidado)}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-orange">{pctPPA}%</p>
                <p className="text-[10px] font-mono-data text-stone">de {fmtMi(ppa.orcamentoTotal)} previstos</p>
              </div>
            </div>
            <BarraProgresso pct={Math.min(100, pctPPA)} esperado={pctTempo} tom="orange" altura={10} />
            <p className="text-xs text-muted mt-2">
              {pctPPA < pctTempo
                ? `Abaixo do ritmo linear: ${pctTempo}% do quadriênio já decorreu.`
                : `No ritmo: ${pctTempo}% do quadriênio decorrido.`}
            </p>
            <Fonte fonte="Portal da Transparência de Sobradinho · despesas liquidadas" className="mt-3" />
          </div>

          <div className="kpi-strip">
            <KpiCard icon={Wallet} label="Empenhado" valor={fmtMi(filtrados.reduce((a, i) => a + i.empenhado, 0))} sub="compromissos assumidos" acent="#1D7FB0" />
            <KpiCard icon={Wallet} label="Liquidado" valor={fmtMi(totalLiquidado)} sub="serviço entregue e conferido" acent="#EA580C" />
            <KpiCard icon={Wallet} label="Pago" valor={fmtMi(filtrados.reduce((a, i) => a + i.pago, 0))} sub="saiu do caixa" acent="#5C7A4C" />
            <KpiCard icon={TrendingUp} label="Ações monitoradas" valor={String(new Set(filtrados.map(i => i.cdAcao)).size)} sub="com movimento no período" acent="#7A2E3D" />
          </div>

          {receitaAnos.length > 0 && (
            <div className="panel">
              <h3 className="panel-title mb-4">Receita</h3>
              <div className="space-y-4">
                {receitaAnos.map(([a, r]) => {
                  const pct = r.previsto ? Math.round((r.arrecadado / r.previsto) * 1000) / 10 : 0;
                  return (
                    <div key={a}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-ink">{a} · arrecadado {fmtMi(r.arrecadado)}</span>
                        <span className="font-mono-data text-stone">{pct}% da previsão de {fmtMi(r.previsto)}</span>
                      </div>
                      <BarraProgresso pct={Math.min(100, pct)} tom="verde" altura={8} />
                    </div>
                  );
                })}
              </div>
              <Fonte fonte="Portal da Transparência · previsão da LOA e arrecadação realizada" className="mt-3" />
            </div>
          )}

          <div className="panel">
            <h3 className="panel-title mb-1">Execução por programa</h3>
            <p className="panel-sub mb-4">o percentual é sobre o recurso previsto no PPA para os quatro anos</p>
            <div className="space-y-4">
              {eixosPPA.map(eixo => {
                const progs = programas.filter(p => p.eixoId === eixo.id);
                if (!progs.some(p => exec(p.id).liquidado > 0 || p.notaExecucao)) return null;
                return (
                  <div key={eixo.id}>
                    <p className="secao-label mb-2">Eixo {eixo.numero} — {eixo.nome}</p>
                    <div className="space-y-3">
                      {progs.map(p => {
                        const e = exec(p.id);
                        const pct = percentualDoPPA(filtrados, p.id);
                        if (e.liquidado === 0 && p.notaExecucao) return (
                          <div key={p.id} className="nota-execucao">
                            <strong>{p.nome}</strong> · {fmtMi(p.recurso)} previstos. {p.notaExecucao}
                          </div>
                        );
                        return (
                          <div key={p.id}>
                            <div className="flex justify-between text-xs mb-1.5 gap-2">
                              <span className="text-ink font-medium leading-snug">{p.nome}</span>
                              <span className="font-mono-data shrink-0"><strong className="text-ink">{fmtReais(e.liquidado)}</strong> <span className="text-stone">/ {fmtMi(p.recurso)}</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1"><BarraProgresso pct={Math.min(100, pct)} tom={eixo.tom} altura={6} /></div>
                              <span className="font-mono-data text-xs font-bold text-ink shrink-0" style={{ minWidth: 42, textAlign: 'right' }}>{pct}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel p-0 overflow-x-auto">
            <table className="tabela">
              <thead><tr><th>Ação</th><th>Programa</th><th>Período</th><th className="text-right">Empenhado</th><th className="text-right">Liquidado</th><th className="text-right">Pago</th></tr></thead>
              <tbody>
                {[...filtrados].sort((a, b) => b.liquidado - a.liquidado).slice(0, 40).map(i => (
                  <tr key={i.id}>
                    <td><span className="font-mono-data text-stone mr-2">{i.cdAcao}</span>{i.dsAcao}</td>
                    <td className="text-muted">{programas.find(p => p.id === i.programaId)?.areaTematica ?? '—'}</td>
                    <td className="font-mono-data text-muted">{MESES[i.mes]}/{i.ano}</td>
                    <td className="font-mono-data text-right">{fmtReais(i.empenhado)}</td>
                    <td className="font-mono-data text-right font-bold">{fmtReais(i.liquidado)}</td>
                    <td className="font-mono-data text-right text-muted">{fmtReais(i.pago)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {itens.length > doPPA.length && (
            <p className="text-xs text-muted">
              Há {itens.length - doPPA.length} registros de exercícios anteriores a 2026 na base. Eles não entram no cálculo do PPA, mas ficam guardados para comparação histórica.
            </p>
          )}
        </>
      )}
    </div>
  );
}
