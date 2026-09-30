import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Edit3, Trash2, Calendar, User, Database, TrendingUp, Award, Target, Flag } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { registrarAtualizacao, excluirMeta } from '@/lib/metasRepo';
import { AdminOnly, AvisoExemplo, BarraProgresso, Carregando, InfoRow, StatusBadge, Vazio } from '@/components/ui-custom';
import { MetaModal, PublicarEntregaModal } from '@/components/modals';
import { eixoPorId } from '@/data/eixos';
import { programaPorId } from '@/data/programas';
import { secretarias } from '@/data/secretarias';
import { useAuth, useMetas } from '@/hooks';
import { STATUS_LABEL, progresso, progressoEsperado, emRisco, fmtData, fmtNum, diasSemAtualizar } from '@/lib/metas';
import type { StatusMeta } from '@/types';

export function MetaDetalhe() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { metas, carregando, exemplo } = useMetas();
  const meta = metas.find(m => m.id === id);
  const [editar, setEditar] = useState(false);
  const [publicar, setPublicar] = useState(false);
  const [valor, setValor] = useState('');
  const [obs, setObs] = useState('');
  const [status, setStatus] = useState<StatusMeta | ''>('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  if (carregando) return <Carregando />;
  if (!meta) return <Vazio titulo="Meta não encontrada" acao={<Link to="/ppa/metas" className="btn-ghost-sm">Voltar para a lista</Link>} />;

  const eixo = eixoPorId(meta.eixoId), sec = secretarias[meta.secretariaId];
  const prog = programaPorId(meta.programaId);
  const pct = progresso(meta), esp = progressoEsperado(meta), risco = emRisco(meta);
  const historico = [...meta.historico].sort((a, b) => a.data.localeCompare(b.data));

  const registrar = async (e: FormEvent) => {
    e.preventDefault();
    const v = Number(valor.replace(',', '.'));
    if (exemplo || Number.isNaN(v)) return;
    setSalvando(true);
    try {
      await registrarAtualizacao(meta, { valor: v, status, observacao: obs, autor: user?.email ?? 'admin' });
      setValor(''); setObs(''); setStatus('');
    } catch (err) { setErro((err as Error).message); } finally { setSalvando(false); }
  };

  const excluir = async () => {
    if (exemplo || !confirm(`Excluir a meta ${meta.codigo}? Esta ação não pode ser desfeita.`)) return;
    await excluirMeta(meta.id);
    nav('/ppa/metas');
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {editar && <MetaModal meta={meta} onClose={() => setEditar(false)} />}
      {publicar && <PublicarEntregaModal meta={meta} onClose={() => setPublicar(false)} />}
      {exemplo && <AvisoExemplo texto="Meta de exemplo: a atualização de valores só funciona depois de importar as metas para o Firestore." />}
      <Link to="/ppa/metas" className="text-xs font-bold text-orange hover:text-ink inline-flex items-center gap-1"><ArrowLeft size={13} /> Todas as metas</Link>

      <div className="flex items-start gap-4">
        {sec && <div className={`secao-icon tom-${sec.tom}`}><sec.icone size={22} /></div>}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <p className="font-mono-data text-xs text-stone">{meta.codigo} · Eixo {eixo?.numero} — {eixo?.nome}</p>
              <h2 className="page-title leading-tight">{meta.titulo}</h2>
              {meta.descricao && <p className="text-sm text-muted mt-1">{meta.descricao}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={risco && meta.status !== 'atrasada' ? 'atrasada' : meta.status} />
              <AdminOnly>
                <button onClick={() => setEditar(true)} className="btn-ghost-sm" disabled={exemplo}><Edit3 size={12} className="mr-1" /> Editar</button>
                <button onClick={excluir} className="btn-ghost-sm text-alerta" disabled={exemplo} aria-label="Excluir meta"><Trash2 size={12} /></button>
              </AdminOnly>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="panel">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="panel-sub">{meta.indicador}</p>
                <p className="font-display text-3xl font-bold text-ink mt-1">{fmtNum(meta.valorAtual)} <span className="text-base text-muted font-normal">/ {fmtNum(meta.valorMeta)} {meta.unidade}</span></p>
                <p className="text-[11px] font-mono-data text-stone mt-1">linha de base do PPA: {fmtNum(meta.valorInicial ?? 0)} {meta.unidade}</p>
              </div>
              <div className="text-right"><p className={`font-display text-2xl font-bold ${risco ? 'text-alerta' : pct === 100 ? 'text-verde' : 'text-ink'}`}>{pct}%</p><p className="text-[10px] font-mono-data text-stone">esperado hoje: {esp}%</p></div>
            </div>
            <BarraProgresso pct={pct} esperado={esp} tom={pct === 100 ? 'verde' : risco ? 'alerta' : eixo?.tom ?? 'azul'} altura={12} />
            {risco && <p className="text-xs text-alerta mt-3 font-medium">{new Date(meta.prazo) < new Date() ? 'O prazo desta meta já venceu.' : `Esta meta está ${esp - pct} p.p. abaixo do avanço esperado para a data.`}</p>}
            {diasSemAtualizar(meta) > 60 && <p className="text-xs text-stone mt-1">Sem atualização há {diasSemAtualizar(meta)} dias.</p>}

            {meta.status === 'concluida' && (
              <div className="faixa-entrega">
                <Award size={14} className="shrink-0" />
                {meta.portfolioId ? (
                  <span>Entrega publicada no <Link to="/portfolio" className="font-bold underline">Portfólio de Realizações</Link>.</span>
                ) : (
                  <>
                    <span>Meta concluída. Ela ainda não aparece no portfólio.</span>
                    <AdminOnly><button onClick={() => setPublicar(true)} className="btn-ghost-sm ml-auto shrink-0" disabled={exemplo}>Publicar entrega</button></AdminOnly>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="panel">
            <h3 className="panel-title flex items-center mb-4"><TrendingUp size={15} className="mr-2 text-stone" /> Evolução do indicador</h3>
            {historico.length < 2 ? <p className="text-sm text-muted">O gráfico aparece a partir da segunda atualização registrada.</p> : (
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historico.map(h => ({ ...h, data: fmtData(h.data) }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="data" tick={{ fontSize: 10, fontFamily: 'DM Mono' }} />
                    <YAxis tick={{ fontSize: 10, fontFamily: 'DM Mono' }} domain={[0, Math.max(meta.valorMeta, ...historico.map(h => h.valor))]} />
                    <Tooltip contentStyle={{ fontSize: 12, fontFamily: 'Inter' }} />
                    <ReferenceLine y={meta.valorMeta} stroke="#5C7A4C" strokeDasharray="4 4" label={{ value: 'meta', fontSize: 10, fill: '#5C7A4C', position: 'insideTopRight' }} />
                    <Line type="monotone" dataKey="valor" stroke="#EA580C" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="panel">
            <h3 className="panel-title mb-4">Histórico de atualizações</h3>
            <div className="space-y-3">
              {[...historico].reverse().map((h, i) => (
                <div key={i} className="card-flat-sm flex justify-between gap-3">
                  <div><p className="text-sm font-semibold text-ink">{fmtNum(h.valor)} {meta.unidade}</p>{h.observacao && <p className="text-xs text-muted mt-0.5">{h.observacao}</p>}</div>
                  <div className="text-right shrink-0"><p className="font-mono-data text-xs text-stone">{fmtData(h.data)}</p>{h.autor && <p className="text-[10px] text-stone">{h.autor}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="panel">
            <h3 className="panel-title mb-5">Ficha da meta</h3>
            <div className="space-y-4 text-sm">
              <InfoRow icon={User} label="Responsável" valor={meta.responsavel} />
              {prog && <InfoRow icon={Target} label="Programa" valor={prog.nome} />}
              {prog && <InfoRow icon={Flag} label="Área temática" valor={prog.areaTematica} />}
              {sec && <InfoRow icon={sec.icone} label="Secretaria" valor={sec.titulo} />}
              <InfoRow icon={Calendar} label="Prazo" valor={fmtData(meta.prazo)} />
              <InfoRow icon={Database} label="Fonte do dado" valor={meta.fonte || '—'} />
              <InfoRow icon={Calendar} label="Última atualização" valor={`${fmtData(meta.atualizadoEm)}${meta.atualizadoPor ? ` · ${meta.atualizadoPor}` : ''}`} />
            </div>
          </div>

          <AdminOnly>
            <form onSubmit={registrar} className="panel space-y-3">
              <h3 className="panel-title">Registrar atualização</h3>
              <div><label className="modal-label">Novo valor ({meta.unidade})</label><input value={valor} onChange={e => setValor(e.target.value)} inputMode="decimal" className="modal-input" placeholder={String(meta.valorAtual)} disabled={exemplo} /></div>
              <div><label className="modal-label">Status (opcional)</label>
                <select value={status} onChange={e => setStatus(e.target.value as StatusMeta | '')} className="modal-input" disabled={exemplo}>
                  <option value="">Manter / automático</option>{(Object.keys(STATUS_LABEL) as StatusMeta[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </div>
              <div><label className="modal-label">Observação / evidência</label><textarea value={obs} onChange={e => setObs(e.target.value)} rows={3} className="modal-input" placeholder="O que mudou, documento de referência, nº do processo…" disabled={exemplo} /></div>
              {erro && <p className="modal-erro">{erro}</p>}
              <button type="submit" disabled={!valor.trim() || salvando || exemplo} className="modal-btn-submit">{salvando ? <span className="modal-spinner" /> : 'Salvar atualização'}</button>
            </form>
          </AdminOnly>
        </div>
      </div>
    </div>
  );
}
