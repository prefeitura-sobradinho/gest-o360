import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ListChecks, PlusCircle, Download, RefreshCw } from 'lucide-react';
import { AdminOnly, AvisoExemplo, BarraProgresso, Carregando, Erro, StatusBadge, Vazio } from '@/components/ui-custom';
import { MetaModal, ProgressoModal } from '@/components/modals';
import { eixosPPA } from '@/data/eixos';
import { programas, programaPorId } from '@/data/programas';
import { baixarCSV } from '@/lib/csv';
import { secretarias } from '@/data/secretarias';
import { useMetas } from '@/hooks';
import { STATUS_LABEL, progresso, progressoEsperado, emRisco, fmtData, diasSemAtualizar } from '@/lib/metas';
import type { Meta, StatusMeta } from '@/types';

export function Metas() {
  const { metas, carregando, erro, exemplo } = useMetas();
  const [params, setParams] = useSearchParams();
  const [nova, setNova] = useState(false);
  const [progressoMeta, setProgressoMeta] = useState<Meta | null>(null);
  const [busca, setBusca] = useState('');

  const eixo = params.get('eixo') ?? '';
  const sec = params.get('secretaria') ?? '';
  const status = params.get('status') ?? '';
  const programa = params.get('programa') ?? '';
  const filtro = params.get('filtro') ?? '';
  const setParam = (k: string, v: string) => { const p = new URLSearchParams(params); v ? p.set(k, v) : p.delete(k); setParams(p); };

  const lista = useMemo(() => metas.filter(m =>
    (!eixo || m.eixoId === eixo) && (!sec || m.secretariaId === sec) && (!status || m.status === status) &&
    (!programa || m.programaId === programa) &&
    (filtro !== 'risco' || emRisco(m)) && (filtro !== 'desatualizadas' || diasSemAtualizar(m) > 60) &&
    (!busca || `${m.codigo} ${m.titulo} ${m.responsavel}`.toLowerCase().includes(busca.toLowerCase())),
  ), [metas, eixo, sec, status, programa, filtro, busca]);

  const exportarCSV = () => baixarCSV(
    'metas-ppa',
    ['Código', 'Meta', 'Eixo', 'Programa', 'Secretaria', 'Indicador', 'Unidade', 'Linha de base', 'Valor atual', 'Valor-meta',
     'Progresso (%)', 'Esperado hoje (%)', 'Situação', 'Em risco', 'Prazo', 'Responsável', 'Fonte', 'Atualizado em'],
    lista.map(m => {
      const eixo = eixosPPA.find(e => e.id === m.eixoId);
      return [m.codigo, m.titulo, eixo ? `${eixo.numero} — ${eixo.nome}` : m.eixoId, programaPorId(m.programaId)?.nome ?? '',
        secretarias[m.secretariaId]?.titulo ?? m.secretariaId, m.indicador, m.unidade, m.valorInicial ?? 0, m.valorAtual, m.valorMeta,
        progresso(m), progressoEsperado(m), STATUS_LABEL[m.status], emRisco(m) ? 'sim' : 'não',
        fmtData(m.prazo), m.responsavel, m.fonte, fmtData(m.atualizadoEm)];
    }),
  );

  return (
    <div className="space-y-5">
      {nova && <MetaModal meta={null} onClose={() => setNova(false)} />}
      {progressoMeta && <ProgressoModal meta={progressoMeta} somenteLeitura={exemplo} onClose={() => setProgressoMeta(null)} />}
      {exemplo && <AvisoExemplo />}
      {erro && <Erro mensagem={erro} />}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="page-title"><ListChecks className="mr-3 text-orange" size={22} /> Metas e indicadores</h2>
          <p className="text-sm text-muted mt-1">{lista.length} de {metas.length} metas</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportarCSV} className="btn-ghost-sm"><Download size={12} className="mr-1" /> Exportar CSV</button>
          <AdminOnly><button onClick={() => setNova(true)} className="btn-gold-solid"><PlusCircle size={14} className="mr-2" /> Nova meta</button></AdminOnly>
        </div>
      </div>

      <div className="panel filtros">
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por código, título ou responsável…" className="modal-input" aria-label="Buscar meta" />
        <select value={eixo} onChange={e => setParam('eixo', e.target.value)} className="modal-input" aria-label="Eixo"><option value="">Todos os eixos</option>{eixosPPA.map(x => <option key={x.id} value={x.id}>{x.numero}. {x.nome}</option>)}</select>
        <select value={sec} onChange={e => setParam('secretaria', e.target.value)} className="modal-input" aria-label="Secretaria"><option value="">Todas as secretarias</option>{Object.values(secretarias).map(s => <option key={s.id} value={s.id}>{s.titulo}</option>)}</select>
        <select value={status} onChange={e => setParam('status', e.target.value)} className="modal-input" aria-label="Status"><option value="">Todos os status</option>{(Object.keys(STATUS_LABEL) as StatusMeta[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select>
        <select value={programa} onChange={e => setParam('programa', e.target.value)} className="modal-input" aria-label="Programa"><option value="">Todos os programas</option>{programas.map(x => <option key={x.id} value={x.id}>{x.nome}</option>)}</select>
        <select value={filtro} onChange={e => setParam('filtro', e.target.value)} className="modal-input" aria-label="Alertas"><option value="">Sem filtro de alerta</option><option value="risco">Somente em risco</option><option value="desatualizadas">Sem atualização há 60+ dias</option></select>
      </div>

      {carregando ? <Carregando /> : lista.length === 0 ? (
        <Vazio titulo="Nenhuma meta encontrada" texto="Ajuste os filtros ou cadastre uma nova meta." />
      ) : (
        <div className="panel p-0 overflow-x-auto">
          <table className="tabela">
            <thead><tr><th>Código</th><th>Meta</th><th>Programa</th><th>Progresso</th><th>Status</th><th>Prazo</th><th>Atualizado</th><th aria-label="Ações" /></tr></thead>
            <tbody>
              {lista.map(m => {
                const pct = progresso(m), esp = progressoEsperado(m), risco = emRisco(m);
                return (
                  <tr key={m.id}>
                    <td className="font-mono-data text-stone">{m.codigo}</td>
                    <td><Link to={`/ppa/metas/${m.id}`} className="font-semibold text-ink hover:text-orange">{m.titulo}</Link><p className="text-[11px] text-muted">{m.indicador}: {m.valorAtual.toLocaleString('pt-BR')} / {m.valorMeta.toLocaleString('pt-BR')} {m.unidade}</p></td>
                    <td className="text-muted"><span className="block">{programaPorId(m.programaId)?.areaTematica ?? '—'}</span><span className="text-[10px] text-stone">{secretarias[m.secretariaId]?.titulo ?? m.secretariaId}</span></td>
                    <td style={{ minWidth: 140 }}><div className="flex items-center gap-2"><div className="flex-1"><BarraProgresso pct={pct} esperado={esp} tom={pct === 100 ? 'verde' : risco ? 'alerta' : 'azul'} altura={6} /></div><span className={`font-mono-data text-xs font-bold ${risco ? 'text-alerta' : 'text-ink'}`}>{pct}%</span></div></td>
                    <td><StatusBadge status={risco && m.status !== 'atrasada' ? 'atrasada' : m.status} /></td>
                    <td className="font-mono-data text-muted">{fmtData(m.prazo)}</td>
                    <td className="font-mono-data text-muted">{fmtData(m.atualizadoEm)}{diasSemAtualizar(m) > 60 && <span className="text-alerta"> ⚠</span>}</td>
                    <td><AdminOnly><button onClick={() => setProgressoMeta(m)} className="btn-ghost-sm whitespace-nowrap"><RefreshCw size={11} className="mr-1" /> Atualizar</button></AdminOnly></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
