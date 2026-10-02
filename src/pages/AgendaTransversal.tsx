import { Link } from 'react-router';
import { Baby, Download, Scale, ChevronRight, AlertTriangle } from 'lucide-react';
import { BarraProgresso, Carregando, Erro, Fonte, KpiCard } from '@/components/ui-custom';
import {
  agenda, eixosDireito, acoesDaAgenda, codigosExclusivos, nomeDaAcao, secretariaDaAcao,
} from '@/data/agendaTransversal';
import { secretarias } from '@/data/secretarias';
import { fmtMi, fmtReais } from '@/data/municipio';
import { useExecucao, useMetas } from '@/hooks';
import { progresso, emRisco, fmtNum, semPrimeiraAtualizacao } from '@/lib/metas';
import { baixarCSV } from '@/lib/csv';

/**
 * Agenda Transversal da Criança e do Adolescente — divulgação exigida pelos
 * Arts. 15 a 17 da Lei Municipal nº 712/2025.
 */
export function AgendaTransversal() {
  const { metas, carregando, erro } = useMetas();
  const { doPPA, totais, vazio } = useExecucao();

  /* ── Financeiro ── */
  const liquidadoDe = (codigos: number[]) =>
    doPPA.filter(i => codigos.includes(i.cdAcao)).reduce((a, i) => a + i.liquidado, 0);

  const exclusivo = liquidadoDe(codigosExclusivos);
  const ampliado = liquidadoDe(acoesDaAgenda.filter(a => a.alcance === 'ampliada').map(a => a.codigo));
  const pctMunicipio = totais.liquidado ? Math.round((exclusivo / totais.liquidado) * 1000) / 10 : 0;

  /* ── Indicadores ── */
  const codigosMeta = new Set(eixosDireito.flatMap(e => e.metas));
  const metasAgenda = metas.filter(m => codigosMeta.has(m.codigo));
  const emRiscoQtd = metasAgenda.filter(m => emRisco(m)).length;
  const aguardando = metasAgenda.filter(semPrimeiraAtualizacao).length;
  /** nenhum indicador saiu da linha de base ainda: a média seria 0% e passaria a impressão errada */
  const todosNaLinhaDeBase = metasAgenda.length > 0 && aguardando === metasAgenda.length;
  const mediaGeral = metasAgenda.length
    ? Math.round(metasAgenda.reduce((a, m) => a + progresso(m), 0) / metasAgenda.length)
    : 0;

  const metasDoEixo = (codigos: string[]) =>
    codigos.map(c => metasAgenda.find(m => m.codigo === c)).filter((m): m is NonNullable<typeof m> => !!m);

  const exportarAcoes = () => baixarCSV(
    'agenda-transversal-acoes',
    ['Eixo', 'Direito (ECA)', 'Código da ação', 'Ação', 'Secretaria', 'Alcance', 'Justificativa', 'Empenhado (R$)', 'Liquidado (R$)', 'Pago (R$)'],
    eixosDireito.flatMap(e => e.acoes.map(a => {
      const linhas = doPPA.filter(i => i.cdAcao === a.codigo);
      const soma = (c: 'empenhado' | 'liquidado' | 'pago') => linhas.reduce((t, i) => t + i[c], 0);
      return [
        `${e.numero} — ${e.nome}`, e.baseECA, a.codigo, nomeDaAcao(a.codigo),
        secretarias[secretariaDaAcao(a.codigo)]?.titulo ?? '',
        a.alcance === 'exclusiva' ? 'Exclusiva' : 'Alcance ampliado', a.justificativa,
        soma('empenhado'), soma('liquidado'), soma('pago'),
      ];
    })),
  );

  const exportarIndicadores = () => baixarCSV(
    'agenda-transversal-indicadores',
    ['Eixo', 'Direito (ECA)', 'Código', 'Indicador', 'Unidade', 'Linha de base', 'Atual', 'Meta 2029', 'Avanço (%)', 'Responsável'],
    eixosDireito.flatMap(e => metasDoEixo(e.metas).map(m => [
      `${e.numero} — ${e.nome}`, e.baseECA, m.codigo, m.titulo, m.unidade,
      m.valorInicial ?? 0, m.valorAtual, m.valorMeta, progresso(m), m.responsavel,
    ])),
  );

  if (carregando) return <Carregando texto="Carregando a Agenda Transversal…" />;

  return (
    <div className="space-y-5 max-w-5xl">
      {erro && <Erro mensagem={erro} />}

      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <h2 className="page-title"><Baby className="mr-3 text-orange" size={22} /> Agenda Transversal</h2>
          <p className="text-sm text-muted mt-1">Criança e adolescente · {agenda.base}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={exportarIndicadores} className="btn-ghost-sm"><Download size={12} className="mr-1" /> Indicadores</button>
          <button onClick={exportarAcoes} className="btn-ghost-sm"><Download size={12} className="mr-1" /> Ações</button>
        </div>
      </div>

      {/* ── Fundamento legal ── */}
      <div className="panel agenda-lei">
        <div className="flex items-start gap-3">
          <div className="eixo-icon tom-gold shrink-0"><Scale size={18} /></div>
          <div className="min-w-0">
            <h3 className="panel-title">Por que esta página existe</h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              O <strong className="text-ink">Art. 15</strong> da Lei nº 712/2025 define a Agenda Transversal como
              “um conjunto de políticas públicas de diferentes áreas, articuladas para enfrentar problemas complexos
              que afetam crianças e adolescentes”. O <strong className="text-ink">Art. 16</strong> determina que ela
              siga o Estatuto da Criança e do Adolescente, e o <strong className="text-ink">Art. 17</strong> obriga o
              município a elaborá-la e divulgá-la oficialmente. Esta é a divulgação.
            </p>
            <p className="text-xs text-muted mt-3 leading-relaxed">{agenda.metodologia}</p>
            <Fonte fonte={`${agenda.base} · ${agenda.publicacao}`} className="mt-3" />
          </div>
        </div>
      </div>

      {/* ── Números ── */}
      <div className="kpi-strip">
        <KpiCard icon={Baby} label="Gasto exclusivo" valor={vazio ? '—' : fmtMi(exclusivo)}
          sub="ações 100% infantojuvenis" acent="#EA580C" />
        <KpiCard icon={Scale} label="Do município" valor={vazio ? '—' : `${pctMunicipio}%`}
          sub="do total já liquidado" acent="#1D7FB0" />
        <KpiCard icon={Baby} label="Indicadores" valor={String(metasAgenda.length)}
          sub={emRiscoQtd ? `${emRiscoQtd} em risco` : aguardando ? `${aguardando} sem 1ª medição` : 'nenhum em risco'}
          acent="#5C7A4C" />
        <KpiCard icon={Scale} label="Ações na agenda" valor={String(acoesDaAgenda.length)}
          sub={`${codigosExclusivos.length} exclusivas`} acent="#7A2E3D" />
      </div>

      <div className="nota-execucao">
        <div>
          <strong>Os dois grupos não se somam.</strong> As ações de alcance ampliado movimentaram{' '}
          {vazio ? '—' : fmtMi(ampliado)} no período, mas atendem também adultos e idosos. A parcela que chega a
          crianças e adolescentes ainda não foi apurada pela Contabilidade, então apresentá-la junto com o gasto
          exclusivo inflaria o investimento na infância. Quando o município aplicar os coeficientes do Orçamento
          Criança e Adolescente, o valor combinado passa a ser publicável.
        </div>
      </div>

      {metasAgenda.length > 0 && (
        <div className="panel">
          <div className="flex justify-between items-center mb-3 gap-3">
            <p className="text-sm font-bold text-ink">
              {todosNaLinhaDeBase
                ? 'Indicadores ainda na linha de base do PPA'
                : `Avanço médio dos indicadores da Agenda — ${mediaGeral}%`}
            </p>
            <span className="font-mono-data text-xs text-stone shrink-0">{metasAgenda.length} indicadores do PPA</span>
          </div>
          <BarraProgresso pct={todosNaLinhaDeBase ? 0 : mediaGeral} tom={todosNaLinhaDeBase ? 'stone' : 'orange'} altura={10} />
          {todosNaLinhaDeBase && (
            <p className="text-xs text-muted mt-2">
              Nenhum dos {metasAgenda.length} indicadores recebeu a primeira medição desde a carga do PPA. O avanço
              só passa a ser calculado quando as secretarias registrarem o valor apurado.
            </p>
          )}
        </div>
      )}

      {/* ── Eixos de direito ── */}
      {eixosDireito.map(eixo => {
        const ms = metasDoEixo(eixo.metas);
        const naBase = ms.length > 0 && ms.every(semPrimeiraAtualizacao);
        const pct = ms.length && !naBase ? Math.round(ms.reduce((a, m) => a + progresso(m), 0) / ms.length) : null;
        const liquidadoEixo = liquidadoDe(eixo.acoes.map(a => a.codigo));

        return (
          <div key={eixo.id} className="panel">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`eixo-icon tom-${eixo.tom} shrink-0`}><eixo.icone size={18} /></div>
                <div className="min-w-0">
                  <p className="font-mono-data text-[10px] text-stone uppercase tracking-wider">Eixo {eixo.numero} · {eixo.baseECA}</p>
                  <h3 className="font-bold text-ink font-display text-base leading-tight">{eixo.nome}</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{eixo.descricao}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`exec-badge tom-${eixo.tom}`}>{pct === null ? '—' : `${pct}%`}</div>
                {!vazio && eixo.acoes.length > 0 && (
                  <p className="font-mono-data text-[11px] text-stone mt-1.5">{fmtMi(liquidadoEixo)}</p>
                )}
              </div>
            </div>

            {ms.length > 0 && (
              <div className="space-y-2.5 mb-4">
                <p className="secao-label">Indicadores do PPA</p>
                {ms.map(m => {
                  const inicial = semPrimeiraAtualizacao(m);
                  const p = progresso(m);
                  const risco = emRisco(m);
                  return (
                    <Link key={m.id} to={`/ppa/metas/${m.id}`} className="agenda-meta">
                      <div className="min-w-0">
                        <p className="agenda-meta-titulo">
                          <span className="font-mono-data text-stone mr-1.5">{m.codigo}</span>{m.titulo}
                        </p>
                        <p className="agenda-meta-num">
                          {inicial
                            ? `aguardando 1ª medição · base ${fmtNum(m.valorInicial ?? 0)} ${m.unidade}, meta ${fmtNum(m.valorMeta)}`
                            : `${fmtNum(m.valorAtual)} de ${fmtNum(m.valorMeta)} ${m.unidade}${m.valorInicial != null ? ` · base ${fmtNum(m.valorInicial)}` : ''}`}
                        </p>
                      </div>
                      <div className="agenda-meta-barra">
                        <BarraProgresso pct={inicial ? 0 : p} tom={inicial ? 'stone' : risco ? 'alerta' : eixo.tom} altura={6} />
                      </div>
                      <span className="agenda-meta-pct">{inicial ? '—' : `${p}%`}</span>
                      <ChevronRight size={13} className="text-stone shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}

            {eixo.acoes.length > 0 && (
              <div className="space-y-2">
                <p className="secao-label">Ações orçamentárias</p>
                {eixo.acoes.map(a => {
                  const liq = liquidadoDe([a.codigo]);
                  return (
                    <div key={a.codigo} className="agenda-acao">
                      <div className="min-w-0">
                        <p className="agenda-acao-titulo">
                          <span className={a.alcance === 'exclusiva' ? 'tag-exclusiva' : 'tag-ampliada'}>
                            {a.alcance === 'exclusiva' ? 'exclusiva' : 'ampliada'}
                          </span>
                          <span className="font-mono-data text-stone mr-1.5">{a.codigo}</span>
                          {nomeDaAcao(a.codigo)}
                        </p>
                        <p className="agenda-acao-just">{a.justificativa}</p>
                      </div>
                      <span className="agenda-acao-valor">{vazio ? '—' : fmtReais(liq)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {eixo.lacuna && (
              <div className="agenda-lacuna mt-3">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>{eixo.lacuna}</span>
              </div>
            )}
          </div>
        );
      })}

      <p className="text-xs text-muted">
        Os valores vêm do Portal da Transparência de Sobradinho e cobrem apenas as despesas do Poder Executivo
        dentro da vigência do PPA. A composição da Agenda — quais ações e indicadores entram em cada direito — é
        decisão de gestão e deve ser homologada pelo Conselho Municipal dos Direitos da Criança e do Adolescente.
      </p>
    </div>
  );
}
