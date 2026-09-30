import { useState, type FormEvent } from 'react';
import { Target } from 'lucide-react';
import { Modal, Campo } from './Modal';
import { eixosPPA } from '@/data/eixos';
import { programas, programaPorId } from '@/data/programas';
import { secretarias } from '@/data/secretarias';
import { STATUS_LABEL } from '@/lib/metas';
import { criarMeta, editarMeta } from '@/lib/metasRepo';
import { useAuth } from '@/hooks';
import type { Meta, StatusMeta } from '@/types';

/** Cadastro / edição dos dados cadastrais da meta. O andamento é registrado pelo ProgressoModal. */
export function MetaModal({ meta, onClose, secretariaPadrao }: { meta: Meta | null; onClose: () => void; secretariaPadrao?: string }) {
  const { user } = useAuth();
  const [f, setF] = useState({
    codigo: meta?.codigo ?? '', titulo: meta?.titulo ?? '', descricao: meta?.descricao ?? '',
    eixoId: meta?.eixoId ?? 'social', programaId: meta?.programaId ?? '', secretariaId: meta?.secretariaId ?? secretariaPadrao ?? 'saude',
    indicador: meta?.indicador ?? '', unidade: meta?.unidade ?? '%',
    valorMeta: meta?.valorMeta ?? 100, valorAtual: meta?.valorAtual ?? 0, valorInicial: meta?.valorInicial ?? 0,
    prazo: meta?.prazo ?? '2029-12-31', status: (meta?.status ?? 'nao_iniciada') as StatusMeta,
    responsavel: meta?.responsavel ?? '', fonte: meta?.fonte ?? '',
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF(p => ({ ...p, [k]: v }));
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const invalido = !f.codigo.trim() || !f.titulo.trim() || !f.indicador.trim() || !f.responsavel.trim() || f.valorMeta <= 0;

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (invalido) return;
    setLoading(true);
    const autor = user?.email ?? 'admin';
    try {
      if (meta) await editarMeta(meta.id, f, autor);
      else await criarMeta(f, autor);
      onClose();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal titulo={meta ? 'Editar meta' : 'Nova meta do PPA'} icone={Target} onClose={onClose} largo>
      <form onSubmit={salvar} className="modal-form">
        <div className="grid grid-cols-3 gap-3">
          <Campo label="Código"><input value={f.codigo} onChange={e => set('codigo', e.target.value)} placeholder="SOC-05" className="modal-input" autoFocus /></Campo>
          <div className="col-span-2"><Campo label="Título"><input value={f.titulo} onChange={e => set('titulo', e.target.value)} className="modal-input" /></Campo></div>
        </div>
        <Campo label="Descrição (opcional)"><textarea value={f.descricao} onChange={e => set('descricao', e.target.value)} rows={2} className="modal-input" /></Campo>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Eixo estruturante">
            <select value={f.eixoId} onChange={e => set('eixoId', e.target.value)} className="modal-input">{eixosPPA.map(x => <option key={x.id} value={x.id}>{x.numero}. {x.nome}</option>)}</select>
          </Campo>
          <Campo label="Secretaria responsável">
            <select value={f.secretariaId} onChange={e => set('secretariaId', e.target.value)} className="modal-input">{Object.values(secretarias).map(s => <option key={s.id} value={s.id}>{s.titulo}</option>)}</select>
          </Campo>
        </div>
        <Campo label="Programa do PPA">
          <select value={f.programaId} onChange={e => {
            const prog = programaPorId(e.target.value);
            setF(p => ({ ...p, programaId: e.target.value, ...(prog ? { eixoId: prog.eixoId, secretariaId: prog.secretariaId, responsavel: prog.unidadeResponsavel } : {}) }));
          }} className="modal-input">
            <option value="">Sem programa vinculado</option>
            {programas.map(x => <option key={x.id} value={x.id}>{x.areaTematica} — {x.nome}</option>)}
          </select>
        </Campo>
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-2"><Campo label="Indicador"><input value={f.indicador} onChange={e => set('indicador', e.target.value)} placeholder="ex.: Cobertura ESF" className="modal-input" /></Campo></div>
          <Campo label="Unidade"><input value={f.unidade} onChange={e => set('unidade', e.target.value)} className="modal-input" /></Campo>
          <Campo label="Linha de base"><input type="number" value={f.valorInicial} onChange={e => set('valorInicial', Number(e.target.value))} className="modal-input" /></Campo>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Campo label="Valor-meta"><input type="number" value={f.valorMeta} onChange={e => set('valorMeta', Number(e.target.value))} className="modal-input" /></Campo>
          {!meta && <Campo label="Valor atual"><input type="number" value={f.valorAtual} onChange={e => set('valorAtual', Number(e.target.value))} className="modal-input" /></Campo>}
          <Campo label="Prazo"><input type="date" value={f.prazo} onChange={e => set('prazo', e.target.value)} className="modal-input" /></Campo>
          <Campo label="Status">
            <select value={f.status} onChange={e => set('status', e.target.value as StatusMeta)} className="modal-input">
              {(Object.keys(STATUS_LABEL) as StatusMeta[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </Campo>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Responsável"><input value={f.responsavel} onChange={e => set('responsavel', e.target.value)} className="modal-input" /></Campo>
          <Campo label="Fonte do dado"><input value={f.fonte} onChange={e => set('fonte', e.target.value)} placeholder="ex.: SIOPE, e-SUS, relatório da obra" className="modal-input" /></Campo>
        </div>
        {erro && <p className="modal-erro">{erro}</p>}
        <button type="submit" disabled={invalido || loading} className="modal-btn-submit">{loading ? <span className="modal-spinner" /> : 'Salvar meta'}</button>
      </form>
    </Modal>
  );
}
