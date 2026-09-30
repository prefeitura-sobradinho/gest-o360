import { Link } from 'react-router';
import { Activity, AlertCircle, Building2, Calculator, CheckCircle, ChevronRight, Clock, Download, TrendingUp, Landmark, User, Users } from 'lucide-react';
import { KpiCard, Termometro, Fonte, AvisoExemplo, Carregando, Erro, BarraProgresso } from '@/components/ui-custom';
import { BarChartCSS } from '@/components/charts/BarChartCSS';
import { DonutChart } from '@/components/charts/DonutChart';
import { municipio, gestao, ppa, fmtMi } from '@/data/municipio';
import { programas, programasDoEixo, recursoDoEixo, recursoTotal } from '@/data/programas';
import { eixosPPA } from '@/data/eixos';
import { secretarias } from '@/data/secretarias';
import { useMetas, useExecucao } from '@/hooks';
import { progresso, progressoEsperado, emRisco, fmtData } from '@/lib/metas';

export function Dashboard() {
  const { metas, resumo, carregando, erro, exemplo, ultimaAtualizacao } = useMetas();
  const { totais: financeiro, vazio: semFinanceiro } = useExecucao();
  const esperadoGlobal = metas.length ? Math.round(metas.reduce((a, m) => a + progressoEsperado(m), 0) / metas.length) : 0;
  const recentes = [...metas].sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm)).slice(0, 5);
  const [nomeA, nomeB] = gestao.slogan.split('&').length === 2 ? gestao.slogan.split('&') : [gestao.slogan, ''];
  const orcamentoPorEixo = eixosPPA.map(e => ({ nome: `${e.numero}. ${e.nome}`, valor: recursoDoEixo(e.id) / 1_000_000, cor: e.cor }));
  const avancoProgramas = programas
    .map(p => {
      const ms = metas.filter(m => m.programaId === p.id);
      return { nome: p.areaTematica, exec: ms.length ? Math.round(ms.reduce((a, m) => a + progresso(m), 0) / ms.length) : 0, n: ms.length };
    })
    .filter(p => p.n > 0)
    .map(({ nome, exec }) => ({ nome, exec }));
  const criticas = metas.filter(m => emRisco(m)).sort((a, b) => (progresso(a) - progressoEsperado(a)) - (progresso(b) - progressoEsperado(b))).slice(0, 4);

  return (
    <div className="space-y-5">
      {exemplo && <AvisoExemplo />}
      {erro && <Erro mensagem={erro} />}

      {/* ESTADO DO PLANO */}
      <div className="hero-card">
        <div className="hero-bg-pattern" aria-hidden="true"><div className="hero-circle c1" /><div className="hero-circle c2" /><div className="hero-accent-line" /></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div>
              <p className="eyebrow-label">PPA {ppa.periodo} · {ppa.lei}</p>
              <h1 className="hero-title">{carregando ? '—' : `${resumo.progressoMedio}%`} <span className="hero-amp">do plano executado</span></h1>
              <p className="text-sm text-white/70 mt-2">Avanço esperado para hoje: <strong className="text-white">{esperadoGlobal}%</strong> · {resumo.total} metas monitoradas</p>
            </div>

            <div className="gestao-bloco">
              <div className="gestao-topo">
                <div className="gestao-avatares" aria-hidden="true">
                  <div className="avatar-ring avatar-g"><User size={26} /><span className="avatar-badge" /></div>
                  <div className="avatar-ring avatar-p"><User size={20} /></div>
                </div>
                <div>
                  <p className="eyebrow-label">Gestão municipal {gestao.periodo}</p>
                  <h2 className="gestao-slogan">{nomeA}<span className="hero-amp">&amp;</span>{nomeB}</h2>
                </div>
              </div>
              <div className="gestao-nomes">
                <p><strong>Prefeito</strong> — {gestao.prefeito}</p>
                <p className="vice"><strong>Vice-prefeito</strong> — {gestao.vice}</p>
              </div>
              <div className="gestao-rodape">
                <span className="municipio-chip">{municipio.nome} · {municipio.uf}</span>
                <button onClick={() => window.print()} className="btn-hero print:hidden"><Download size={15} className="mr-2" /> Relatório PDF</button>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <BarraProgresso pct={resumo.progressoMedio} esperado={esperadoGlobal} tom="orange" altura={10} />
            <div className="flex justify-between text-[10px] font-mono-data text-white/50 mt-1.5"><span>{fmtData(ppa.inicio)}</span><span>▲ hoje (esperado)</span><span>{fmtData(ppa.fim)}</span></div>
          </div>
        </div>
      </div>

      {/* TERMÔMETROS */}
      {carregando ? <Carregando /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Termometro icon={CheckCircle} tom="verde" label="Concluídas" valor={resumo.concluidas} sub={`${resumo.total ? Math.round(resumo.concluidas / resumo.total * 100) : 0}% do total`} />
          <Termometro icon={Activity} tom="azul" label="Em execução" valor={resumo.emExecucao} sub={`${resumo.total ? Math.round(resumo.emExecucao / resumo.total * 100) : 0}% do total`} />
          <Termometro icon={AlertCircle} tom="alerta" label="Em risco" valor={resumo.emRisco} sub="abaixo do esperado ou vencidas" />
          <Termometro icon={Clock} tom="stone" label={resumo.aguardandoPrimeira > 0 ? 'Aguardando 1ª medição' : 'Sem atualização'}
            valor={resumo.aguardandoPrimeira > 0 ? resumo.aguardandoPrimeira : resumo.desatualizadas}
            sub={resumo.aguardandoPrimeira > 0 ? 'secretaria ainda não lançou' : 'há mais de 60 dias'} />
        </div>
      )}

      {/* KPI STRIP */}
      <div className="kpi-strip">
        <KpiCard icon={Calculator} label="Orçamento PPA" valor={fmtMi(ppa.orcamentoTotal)} sub={ppa.periodo} acent="#EA580C" />
        <KpiCard icon={TrendingUp} label="Investimento Educação" valor="R$ 7,1 Mi+" sub="+15% vs 2024" trend="up" acent="#1D7FB0" />
        <KpiCard icon={Landmark} label="Impacto Econômico" valor="R$ 10 Mi+" sub="Forró do Vaqueiro" trend="up" acent="#7A2E3D" />
        <KpiCard icon={Users} label="Novos Servidores" valor="232 vagas" sub="Concurso público" trend="up" acent="#5C7A4C" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* METAS QUE PRECISAM DE ATENÇÃO */}
          <div className="panel">
            <div className="flex justify-between items-center mb-4">
              <div><h3 className="panel-title">Metas que precisam de atenção</h3><p className="panel-sub">maior desvio em relação ao esperado</p></div>
              <Link to="/ppa/metas?filtro=risco" className="btn-ghost-sm">Ver todas <ChevronRight size={13} className="ml-1" /></Link>
            </div>
            {criticas.length === 0 ? <p className="text-sm text-muted">Nenhuma meta em risco no momento.</p> : (
              <div className="space-y-3.5">
                {criticas.map(m => {
                  const pct = progresso(m), esp = progressoEsperado(m);
                  return (
                    <Link key={m.id} to={`/ppa/metas/${m.id}`} className="block group">
                      <div className="flex justify-between text-xs mb-1.5 gap-2">
                        <span className="text-ink font-medium leading-snug group-hover:text-orange transition-colors"><span className="font-mono-data text-stone mr-2">{m.codigo}</span>{m.titulo}</span>
                        <span className="font-mono-data shrink-0"><strong className="text-alerta">{pct}%</strong> <span className="text-stone">/ {esp}% esperado</span></span>
                      </div>
                      <BarraProgresso pct={pct} esperado={esp} tom="alerta" altura={6} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* EIXOS */}
          <div className="panel">
            <div className="flex justify-between items-center mb-4">
              <div><h3 className="panel-title">Avanço por eixo</h3><p className="panel-sub">média das metas de cada eixo</p></div>
              <Link to="/ppa" className="btn-ghost-sm">Detalhar <ChevronRight size={13} className="ml-1" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {eixosPPA.map(e => {
                const ms = metas.filter(m => m.eixoId === e.id);
                const pct = ms.length ? Math.round(ms.reduce((a, m) => a + progresso(m), 0) / ms.length) : 0;
                return (
                  <div key={e.id}>
                    <div className="flex justify-between text-xs mb-1.5 gap-2">
                      <span className="font-semibold text-ink flex items-center gap-1.5 min-w-0"><e.icone size={13} style={{ color: e.cor }} className="shrink-0" /><span className="truncate">{e.numero}. {e.nome}</span></span>
                      <span className="font-mono-data font-bold shrink-0" style={{ color: e.cor }}>{pct}%</span>
                    </div>
                    <BarraProgresso pct={pct} tom={e.tom} altura={6} />
                    <p className="text-[10px] font-mono-data text-stone mt-1">{programasDoEixo(e.id).length} programas · {ms.length} indicadores · {fmtMi(recursoDoEixo(e.id))}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel">
            <div className="mb-3">
              <p className="panel-title">Avanço dos programas</p>
              <p className="panel-sub">média dos indicadores de cada programa</p>
            </div>
            <BarChartCSS data={avancoProgramas} />
            <div className="flex gap-4 mt-2 flex-wrap">
              {([['#5C7A4C', '≥ 70% — Em dia'], ['#1D7FB0', '50–69% — Atenção'], ['#EA580C', '< 50% — Requer atenção']] as [string, string][]).map(([cor, txt]) => (
                <div key={txt} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: cor }} /><span className="text-[10px] font-mono-data text-stone">{txt}</span></div>
              ))}
            </div>
            <Fonte fonte="calculado a partir dos indicadores do PPA" atualizadoEm={ultimaAtualizacao} className="mt-3" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel">
            <h3 className="panel-title mb-0.5">Orçamento por eixo</h3>
            <p className="panel-sub mb-3">{fmtMi(ppa.orcamentoTotal)} · PPA {ppa.periodo}</p>
            <DonutChart data={orcamentoPorEixo} totalLabel={`${(ppa.orcamentoTotal / 1_000_000).toFixed(0)}Mi`} />
            <div className="grid grid-cols-1 gap-y-1.5 mt-1">
              {orcamentoPorEixo.map(s => (
                <div key={s.nome} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.cor }} />
                  <span className="text-[10px] font-mono-data text-muted truncate flex-1">{s.nome}</span>
                  <span className="text-[10px] font-mono-data text-ink shrink-0">{fmtMi(s.valor * 1_000_000)}</span>
                </div>
              ))}
            </div>
            <Fonte fonte={`${ppa.leiCurta} · ${ppa.publicacao}`} className="mt-3" />
          </div>

          {!semFinanceiro && financeiro.liquidado > 0 && (
            <div className="panel">
              <div className="flex justify-between items-center mb-3">
                <div><h3 className="panel-title">Execução financeira</h3><p className="panel-sub">liquidado no PPA</p></div>
                <Link to="/execucao" className="btn-ghost-sm">Ver <ChevronRight size={13} className="ml-1" /></Link>
              </div>
              <p className="font-display text-2xl font-bold text-ink">{fmtMi(financeiro.liquidado)}</p>
              <p className="text-[11px] font-mono-data text-stone mb-2">{Math.round(financeiro.liquidado / ppa.orcamentoTotal * 1000) / 10}% de {fmtMi(ppa.orcamentoTotal)}</p>
              <BarraProgresso pct={Math.min(100, financeiro.liquidado / ppa.orcamentoTotal * 100)} esperado={esperadoGlobal} tom="orange" altura={8} />
              <p className="text-[10px] font-mono-data text-stone mt-1.5">▲ marcador: avanço físico esperado hoje ({esperadoGlobal}%)</p>
              <Fonte fonte="Portal da Transparência de Sobradinho" className="mt-3" />
            </div>
          )}

          <div className="panel">
            <h3 className="panel-title flex items-center mb-4"><Clock size={15} className="mr-2 text-stone" /> Últimas atualizações</h3>
            {recentes.length === 0 ? <p className="text-sm text-muted">Nenhuma meta atualizada ainda.</p> : (
              <div className="space-y-3.5">
                {recentes.map(m => {
                  const sec = secretarias[m.secretariaId];
                  return (
                    <Link key={m.id} to={`/ppa/metas/${m.id}`} className="flex items-start gap-3 group">
                      {sec && <div className={`feed-icon tom-${sec.tom}`}><sec.icone size={14} /></div>}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-ink leading-snug group-hover:text-orange transition-colors truncate">{m.titulo}</p>
                        <p className="text-[10px] text-stone mt-0.5 font-mono-data">{m.valorAtual.toLocaleString('pt-BR')} {m.unidade} · {fmtData(m.atualizadoEm)}{m.atualizadoPor ? ` · ${m.atualizadoPor}` : ''}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            <Fonte atualizadoEm={ultimaAtualizacao} className="mt-3" />
          </div>
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title flex items-center mb-4"><Building2 size={16} className="mr-2 text-stone" /> Dados do município</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {([['População', municipio.populacao], ['Área territorial', municipio.area], ['PIB estimado', municipio.pib], ['IDH Municipal', municipio.idh], ['Altitude média', municipio.altitude], ['Fundação', municipio.fundacao]] as [string, string][]).map(([l, v]) => (
            <div key={l} className="municipio-stat"><p className="text-[10px] font-mono-data text-stone uppercase tracking-wider">{l}</p><p className="text-base font-bold text-ink font-display mt-0.5">{v}</p></div>
          ))}
        </div>
        <Fonte fonte={municipio.fonte} className="mt-3" />
      </div>
    </div>
  );
}
