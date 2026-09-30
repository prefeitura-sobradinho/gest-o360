import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowUpRight, ArrowDownRight, ChevronRight, Edit3, Landmark, Mail, Phone, PlusCircle, RefreshCw, X } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminOnly, AvisoExemplo, BarraProgresso, Fonte, InfoRow, StatusBadge, Vazio } from '@/components/ui-custom';
import { DestaqueModal, KpiModal, MetaModal, ProgressoModal } from '@/components/modals';
import { secretarias } from '@/data/secretarias';
import { programasDaSecretaria } from '@/data/programas';
import { fmtMi } from '@/data/municipio';
import { useCollection, useMetas, useExecucao } from '@/hooks';
import { execucaoDaSecretaria } from '@/lib/execucao';
import { valorTotal, SITUACAO_CONVENIO, TOM_CONVENIO } from '@/lib/convenios';
import { fmtReais } from '@/data/municipio';
import { progresso, progressoEsperado, emRisco, resumir, fmtNum, fmtData } from '@/lib/metas';
import type { Convenio, Destaque, Kpi, Meta } from '@/types';

export function Secretaria() {
  const { id = '' } = useParams();
  const s = secretarias[id];
  const kpisCol = useCollection<Kpi>('kpis');
  const destCol = useCollection<Destaque>('destaques');
  const convCol = useCollection<Convenio>('convenios');
  const { metas, exemplo: metasExemplo } = useMetas();
  const { doPPA } = useExecucao();
  const [kpiModal, setKpiModal] = useState<Kpi | null | 'novo'>(null);
  const [destModal, setDestModal] = useState<Destaque | null | 'novo'>(null);
  const [metaModal, setMetaModal] = useState<Meta | null | 'nova'>(null);
  const [progressoModal, setProgressoModal] = useState<Meta | null>(null);

  const kpisDb = useMemo(() => kpisCol.data.filter(k => k.secretaria_id === id), [kpisCol.data, id]);
  const destDb = useMemo(() => destCol.data.filter(d => d.secretaria_id === id), [destCol.data, id]);
  const metasSec = useMemo(() => metas.filter(m => m.secretariaId === id), [metas, id]);
  const progsSec = useMemo(() => programasDaSecretaria(id), [id]);
  const financeiro = useMemo(() => execucaoDaSecretaria(doPPA, id), [doPPA, id]);
  const convenios = useMemo(() => convCol.data.filter(c => c.secretariaId === id && c.situacao !== 'cancelado'), [convCol.data, id]);

  if (!s) return <Vazio titulo="Secretaria não encontrada" acao={<Link to="/" className="btn-ghost-sm">Voltar ao início</Link>} />;

  const kpisExemplo = !kpisCol.carregando && kpisDb.length === 0;
  const destExemplo = !destCol.carregando && destDb.length === 0;
  const kpis: (Kpi | (Omit<Kpi, 'id' | 'secretaria_id' | 'ordem'> & { id?: undefined }))[] = kpisExemplo ? s.kpisExemplo : kpisDb;
  const destaques: (Destaque | { id?: undefined; titulo: string; descricao: string })[] = destExemplo ? s.destaquesExemplo.map(d => ({ titulo: d.titulo, descricao: d.desc })) : destDb;
  const resumo = resumir(metasSec);

  return (
    <div className="space-y-5 max-w-5xl">
      {kpiModal !== null && <KpiModal secretariaId={id} kpi={kpiModal === 'novo' ? null : kpiModal} onClose={() => setKpiModal(null)} />}
      {destModal !== null && <DestaqueModal secretariaId={id} destaque={destModal === 'novo' ? null : destModal} onClose={() => setDestModal(null)} />}
      {metaModal !== null && <MetaModal meta={metaModal === 'nova' ? null : metaModal} secretariaPadrao={id} onClose={() => setMetaModal(null)} />}
      {progressoModal && <ProgressoModal meta={progressoModal} somenteLeitura={metasExemplo} onClose={() => setProgressoModal(null)} />}
      {(kpisExemplo || destExemplo) && <AvisoExemplo texto="Indicadores e destaques desta secretaria ainda são dados de exemplo." />}

      <div className="flex items-start gap-4">
        <div className={`secao-icon tom-${s.tom}`}><s.icone size={22} /></div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><h2 className="page-title leading-none">{s.titulo}</h2><p className="text-sm text-muted mt-1">{s.subtitulo}</p></div>
            <div className={`exec-badge tom-${s.tom} text-sm`}>{resumo.total ? `${resumo.progressoMedio}% dos indicadores` : 'sem indicadores vinculados'}</div>
          </div>
          {resumo.total > 0 && <div className="mt-3"><BarraProgresso pct={resumo.progressoMedio} tom={s.tom} altura={8} /></div>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <div key={k.id ?? `kpi-${i}`} className={`kpi-mini tom-${s.tom} relative`}>
            {k.id && (
              <AdminOnly>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => setKpiModal(k as Kpi)} className="text-orange hover:text-ink" aria-label="Editar indicador"><Edit3 size={12} /></button>
                  <button onClick={async () => { if (confirm('Excluir este indicador?')) await deleteDoc(doc(db, 'kpis', k.id!)); }} className="text-alerta hover:text-ink" aria-label="Excluir indicador"><X size={12} /></button>
                </div>
              </AdminOnly>
            )}
            <p className="kpi-mini-label">{k.label}</p>
            <p className="kpi-mini-valor">{k.valor}</p>
            {k.delta && <p className={`text-[10px] font-mono-data mt-1 flex items-center gap-0.5 ${k.trend === 'up' ? 'text-verde' : k.trend === 'down' ? 'text-alerta' : 'text-stone'}`}>{k.trend === 'up' && <ArrowUpRight size={11} />}{k.trend === 'down' && <ArrowDownRight size={11} />}{k.delta}</p>}
            {k.historico && k.historico.length >= 2 && (
              <div style={{ height: 26, marginTop: 6 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={k.historico}><Line type="monotone" dataKey="valor" stroke="currentColor" strokeWidth={1.5} dot={false} /></LineChart></ResponsiveContainer></div>
            )}
            <Fonte fonte={k.fonte} atualizadoEm={k.atualizadoEm} className="mt-2" />
          </div>
        ))}
        <AdminOnly>
          <button onClick={() => setKpiModal('novo')} className={`kpi-mini tom-${s.tom} flex items-center justify-center border-dashed border-2 text-sm font-bold gap-1.5 opacity-70 hover:opacity-100`}><PlusCircle size={15} /> Novo indicador</button>
        </AdminOnly>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {convenios.length > 0 && (
            <div className="panel">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="panel-title">Convênios e emendas</h3>
                  <p className="panel-sub">{fmtReais(convenios.reduce((a, c) => a + valorTotal(c), 0))} captados para esta unidade</p>
                </div>
                <Link to="/convenios" className="btn-ghost-sm">Ver todos <ChevronRight size={13} className="ml-1" /></Link>
              </div>
              <div className="space-y-2.5">
                {convenios.map(c => (
                  <div key={c.id} className="card-flat-sm">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-ink font-semibold leading-snug">{c.objeto}</p>
                        <p className="text-[11px] text-muted mt-0.5">{c.parlamentar ? `Emenda ${c.emenda} · ${c.parlamentar}` : c.numeroPlano}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono-data text-sm font-bold text-ink">{fmtReais(valorTotal(c))}</p>
                        <span className={`status-badge tom-${TOM_CONVENIO[c.situacao]} mt-1`}>{SITUACAO_CONVENIO[c.situacao]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Fonte fonte="Transferegov · Transferências Especiais" className="mt-3" />
            </div>
          )}

          {financeiro.liquidado > 0 && (
            <div className="panel">
              <div className="flex justify-between items-center mb-3">
                <div><h3 className="panel-title">Execução financeira</h3><p className="panel-sub">{financeiro.acoes} ações com movimento no PPA</p></div>
                <Link to="/execucao" className="btn-ghost-sm">Detalhar <ChevronRight size={13} className="ml-1" /></Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {([['Empenhado', financeiro.empenhado], ['Liquidado', financeiro.liquidado], ['Pago', financeiro.pago]] as [string, number][]).map(([rotulo, valor]) => (
                  <div key={rotulo} className="municipio-stat">
                    <p className="text-[10px] font-mono-data text-stone uppercase tracking-wider">{rotulo}</p>
                    <p className="text-base font-bold text-ink font-display mt-0.5">{fmtMi(valor)}</p>
                  </div>
                ))}
              </div>
              <Fonte fonte="Portal da Transparência de Sobradinho" className="mt-3" />
            </div>
          )}

          {progsSec.length > 0 && (
            <div className="panel">
              <div className="mb-4">
                <h3 className="panel-title">Programas do PPA</h3>
                <p className="panel-sub">{progsSec.length === 1 ? '1 programa' : `${progsSec.length} programas`} · {fmtMi(progsSec.reduce((a, p) => a + p.recurso, 0))} no quadriênio</p>
              </div>
              <div className="space-y-2.5">
                {progsSec.map(p => (
                  <div key={p.id} className="card-flat-sm">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h4 className="font-bold text-ink text-sm leading-snug">{p.nome}</h4>
                        <p className="text-[11px] text-muted mt-0.5">{p.areaTematica}{p.ods.length > 0 && ` · ${p.ods.join(', ')}`}</p>
                      </div>
                      <p className="font-mono-data text-sm font-bold text-ink shrink-0">{fmtMi(p.recurso)}</p>
                    </div>
                    <p className="text-xs text-muted mt-2 leading-relaxed">{p.objetivo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="panel">
            <div className="flex justify-between items-center mb-4 gap-2">
              <div><h3 className="panel-title">Indicadores do PPA sob responsabilidade</h3><p className="panel-sub">{resumo.total} indicadores · {resumo.emRisco} em risco</p></div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/ppa/metas?secretaria=${id}`} className="btn-ghost-sm">Ver lista <ChevronRight size={13} className="ml-1" /></Link>
                <AdminOnly><button onClick={() => setMetaModal('nova')} className="btn-gold-solid"><PlusCircle size={13} className="mr-1.5" /> Nova meta</button></AdminOnly>
              </div>
            </div>
            {metasSec.length === 0 ? (
              <p className="text-sm text-muted">Nenhum indicador vinculado a esta unidade no PPA. Cadastre o primeiro em “Nova meta”.</p>
            ) : (
              <div className="space-y-4">
                {metasSec.map(m => {
                  const pct = progresso(m), risco = emRisco(m);
                  return (
                    <div key={m.id} className="meta-linha">
                      <div className="flex justify-between text-xs mb-1.5 gap-2">
                        <Link to={`/ppa/metas/${m.id}`} className="text-ink font-medium leading-snug hover:text-orange">
                          <span className="font-mono-data text-stone mr-2">{m.codigo}</span>{m.titulo}
                        </Link>
                        <span className="flex items-center gap-2 shrink-0">{risco && <StatusBadge status="atrasada" />}<span className={`font-mono-data font-bold ${risco ? 'text-alerta' : pct === 100 ? 'text-verde' : 'text-ink'}`}>{pct}%</span></span>
                      </div>
                      <BarraProgresso pct={pct} esperado={progressoEsperado(m)} tom={pct === 100 ? 'verde' : risco ? 'alerta' : s.tom} altura={6} />
                      <div className="flex justify-between items-center gap-2 mt-1.5">
                        <p className="text-[11px] text-muted">
                          {m.indicador}: <strong className="text-ink">{fmtNum(m.valorAtual)}</strong> de {fmtNum(m.valorMeta)} {m.unidade}
                          <span className="text-stone"> · atualizado em {fmtData(m.atualizadoEm)}</span>
                        </p>
                        <AdminOnly>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => setProgressoModal(m)} className="btn-ghost-sm"><RefreshCw size={11} className="mr-1" /> Atualizar andamento</button>
                            <button onClick={() => setMetaModal(m)} className="btn-ghost-sm" aria-label={`Editar meta ${m.codigo}`}><Edit3 size={11} /></button>
                          </div>
                        </AdminOnly>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="panel">
            <div className="flex justify-between items-center mb-5">
              <h3 className="panel-title">Destaques e ações</h3>
              <AdminOnly><button onClick={() => setDestModal('novo')} className="btn-ghost-sm"><PlusCircle size={12} className="mr-1" /> Adicionar</button></AdminOnly>
            </div>
            <div className="space-y-3">
              {destaques.map((d, i) => (
                <div key={d.id ?? `dest-${i}`} className="card-flat-sm">
                  <h4 className="font-bold text-ink font-display text-sm flex items-center"><ChevronRight size={14} className={`mr-1.5 shrink-0 cor-${s.tom}`} /> {d.titulo}</h4>
                  <p className="text-xs text-muted mt-1.5 ml-5 leading-relaxed">{d.descricao}</p>
                  {d.id && (
                    <AdminOnly>
                      <div className="mt-2 ml-5 flex justify-end gap-3">
                        <button onClick={() => setDestModal(d as Destaque)} className="text-xs font-bold text-orange hover:text-ink flex items-center gap-1"><Edit3 size={11} /> Editar</button>
                        <button onClick={async () => { if (confirm('Excluir este destaque?')) await deleteDoc(doc(db, 'destaques', d.id!)); }} className="text-xs font-bold text-alerta hover:text-ink">Excluir</button>
                      </div>
                    </AdminOnly>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel h-fit">
          <h3 className="panel-title mb-5">Informações</h3>
          <div className="space-y-4 text-sm">
            <InfoRow icon={Landmark} label="Responsável" valor={s.responsavel} />
            <InfoRow icon={Mail} label="Contato" valor={s.contato} />
            <InfoRow icon={Phone} label="Atendimento" valor={s.atendimento ?? '—'} />
          </div>
        </div>
      </div>
    </div>
  );
}
