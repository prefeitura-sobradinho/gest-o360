import { useMemo, useState } from 'react';
import { FileSignature, PlusCircle, Edit3, Trash2, Calendar, Download, AlertCircle, Landmark, Wallet, CheckCircle } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminOnly, BarraProgresso, Carregando, Erro, Fonte, KpiCard, StatusBadge, Vazio } from '@/components/ui-custom';
import { ConvenioModal } from '@/components/modals';
import { secretarias } from '@/data/secretarias';
import { fmtReais, fmtMi } from '@/data/municipio';
import { useCollection } from '@/hooks';
import { baixarCSV } from '@/lib/csv';
import { fmtData } from '@/lib/metas';
import { SITUACAO_CONVENIO, TOM_CONVENIO, valorTotal, diasDeVigencia, vigenciaEmRisco, resumirConvenios } from '@/lib/convenios';
import type { Convenio } from '@/types';

/** Convênios e emendas parlamentares captados pelo município — acompanhamento da SECON. */
export function Convenios() {
  const { data, carregando, erro } = useCollection<Convenio>('convenios');
  const [modal, setModal] = useState<Convenio | null | 'novo'>(null);
  const [situacao, setSituacao] = useState('');

  const lista = useMemo(() => data.filter(c => !situacao || c.situacao === situacao), [data, situacao]);
  const resumo = useMemo(() => resumirConvenios(data), [data]);

  const excluir = async (c: Convenio) => {
    if (!confirm(`Excluir o convênio ${c.numeroPlano}?`)) return;
    await deleteDoc(doc(db, 'convenios', c.id));
  };

  const exportarCSV = () => baixarCSV(
    'convenios',
    ['Plano de Ação', 'Programa', 'Emenda', 'Parlamentar', 'Objeto', 'Custeio (R$)', 'Investimento (R$)', 'Total (R$)',
     'Recebido (R$)', 'Início da vigência', 'Fim da vigência', 'Dias restantes', 'Situação', 'Unidade executora', 'Ação orçamentária'],
    lista.map(c => [c.numeroPlano, c.programa ?? '', c.emenda ?? '', c.parlamentar ?? '', c.objeto,
      c.valorCusteio, c.valorInvestimento, valorTotal(c), c.valorRecebido ?? 0,
      fmtData(c.vigenciaInicio), fmtData(c.vigenciaFim), diasDeVigencia(c), SITUACAO_CONVENIO[c.situacao],
      secretarias[c.secretariaId]?.titulo ?? c.secretariaId, c.acaoOrcamentaria ?? '']),
  );

  if (carregando) return <Carregando texto="Carregando convênios…" />;

  return (
    <div className="space-y-5 max-w-5xl">
      {modal !== null && <ConvenioModal convenio={modal === 'novo' ? null : modal} onClose={() => setModal(null)} />}
      {erro && <Erro mensagem={erro} />}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="page-title"><FileSignature className="mr-3 text-orange" size={22} /> Convênios e emendas</h2>
          <p className="text-sm text-muted mt-1">Recursos captados junto à União, ao Estado e por emenda parlamentar</p>
        </div>
        <div className="flex gap-2">
          {lista.length > 0 && <button onClick={exportarCSV} className="btn-ghost-sm"><Download size={12} className="mr-1" /> CSV</button>}
          <AdminOnly><button onClick={() => setModal('novo')} className="btn-gold-solid"><PlusCircle size={14} className="mr-2" /> Novo convênio</button></AdminOnly>
        </div>
      </div>

      {data.length === 0 ? (
        <Vazio
          titulo="Nenhum convênio cadastrado"
          texto="Cadastre os Planos de Ação do Transferegov e os convênios firmados com o Estado para acompanhar a captação de recursos."
          acao={<AdminOnly><button onClick={() => setModal('novo')} className="btn-gold-solid"><PlusCircle size={14} className="mr-2" /> Cadastrar o primeiro</button></AdminOnly>}
        />
      ) : (
        <>
          <div className="kpi-strip">
            <KpiCard icon={Wallet} label="Total captado" valor={fmtMi(resumo.valorTotal)} sub={`${resumo.total} ${resumo.total === 1 ? 'instrumento' : 'instrumentos'}`} acent="#EA580C" />
            <KpiCard icon={CheckCircle} label="Já recebido" valor={fmtMi(resumo.recebido)} sub={`${resumo.valorTotal ? Math.round(resumo.recebido / resumo.valorTotal * 100) : 0}% do captado`} acent="#5C7A4C" />
            <KpiCard icon={Landmark} label="Ativos" valor={String(resumo.ativos)} sub="aprovados ou em execução" acent="#1D7FB0" />
            <KpiCard icon={AlertCircle} label="Vigência curta" valor={String(resumo.emRisco)} sub="vencem em menos de 6 meses" acent="#B23A2E" />
          </div>

          {resumo.porParlamentar.length > 0 && (
            <div className="panel">
              <h3 className="panel-title mb-4">Captação por origem</h3>
              <div className="space-y-3">
                {resumo.porParlamentar.map(p => (
                  <div key={p.nome}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-ink">{p.nome}</span>
                      <span className="font-mono-data text-ink">{fmtReais(p.valor)} <span className="text-stone">· {p.quantidade}</span></span>
                    </div>
                    <BarraProgresso pct={(p.valor / resumo.valorTotal) * 100} tom="verde" altura={6} />
                  </div>
                ))}
              </div>
              <Fonte fonte="Transferegov · Plataforma de Transferências Especiais" className="mt-3" />
            </div>
          )}

          <div className="panel filtros" style={{ gridTemplateColumns: '1fr' }}>
            <select value={situacao} onChange={e => setSituacao(e.target.value)} className="modal-input" aria-label="Situação">
              <option value="">Todas as situações</option>
              {Object.entries(SITUACAO_CONVENIO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            {lista.map(c => {
              const dias = diasDeVigencia(c);
              const risco = vigenciaEmRisco(c);
              const sec = secretarias[c.secretariaId];
              const pctRecebido = valorTotal(c) ? ((c.valorRecebido ?? 0) / valorTotal(c)) * 100 : 0;
              return (
                <div key={c.id} className="panel">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono-data text-[11px] text-stone">{c.numeroPlano}</span>
                        <span className={`status-badge tom-${TOM_CONVENIO[c.situacao]}`}>{SITUACAO_CONVENIO[c.situacao]}</span>
                        {risco && <span className="status-badge tom-alerta">{dias < 0 ? 'vigência vencida' : `vence em ${dias} dias`}</span>}
                      </div>
                      <p className="text-sm text-ink font-semibold mt-1.5 leading-snug">{c.objeto}</p>
                      <p className="text-xs text-muted mt-1">
                        {c.parlamentar && <>Emenda {c.emenda} · <strong>{c.parlamentar}</strong> · </>}
                        executado por {sec?.titulo ?? c.secretariaId}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-xl font-bold text-ink">{fmtReais(valorTotal(c))}</p>
                      <p className="text-[10px] font-mono-data text-stone">
                        {c.valorInvestimento > 0 && `investimento ${fmtReais(c.valorInvestimento)}`}
                        {c.valorCusteio > 0 && ` · custeio ${fmtReais(c.valorCusteio)}`}
                      </p>
                    </div>
                  </div>

                  {(c.valorRecebido ?? 0) > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-[11px] mb-1"><span className="text-muted">Recebido</span><span className="font-mono-data text-ink">{fmtReais(c.valorRecebido ?? 0)} · {Math.round(pctRecebido)}%</span></div>
                      <BarraProgresso pct={pctRecebido} tom="verde" altura={6} />
                    </div>
                  )}

                  <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-mono-data text-stone flex items-center gap-1.5">
                      <Calendar size={11} /> {fmtData(c.vigenciaInicio)} a {fmtData(c.vigenciaFim)}
                      {c.acaoOrcamentaria && <span className="text-muted"> · {c.acaoOrcamentaria}</span>}
                    </p>
                    <AdminOnly>
                      <div className="flex gap-2">
                        <button onClick={() => setModal(c)} className="btn-ghost-sm"><Edit3 size={11} className="mr-1" /> Editar</button>
                        <button onClick={() => excluir(c)} className="btn-ghost-sm text-alerta" aria-label="Excluir convênio"><Trash2 size={11} /></button>
                      </div>
                    </AdminOnly>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
