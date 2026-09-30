import { useState, type FormEvent } from 'react';
import { Award } from 'lucide-react';
import { Modal, Campo } from './Modal';
import { publicarConclusao, periodoAtual } from '@/lib/portfolioRepo';
import { fmtNum } from '@/lib/metas';
import type { Meta } from '@/types';

/** Publica uma meta já concluída no Portfólio de Realizações. */
export function PublicarEntregaModal({ meta, onClose }: { meta: Meta; onClose: () => void }) {
  const ultima = [...meta.historico].reverse().find(h => h.observacao)?.observacao ?? '';
  const [periodo, setPeriodo] = useState(periodoAtual());
  const [titulo, setTitulo] = useState(meta.titulo);
  const [desc, setDesc] = useState(ultima || meta.descricao || `Meta ${meta.codigo} do PPA concluída: ${meta.indicador} atingiu ${fmtNum(meta.valorAtual)} ${meta.unidade}.`);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !desc.trim()) return;
    setSalvando(true);
    try {
      await publicarConclusao(meta, { data: periodo.trim() || periodoAtual(), titulo: titulo.trim(), desc: desc.trim() });
      onClose();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal titulo="Publicar no portfólio" icone={Award} onClose={onClose}>
      <form onSubmit={salvar} className="modal-form">
        <p className="text-xs text-muted">A entrega entra na linha do tempo do Portfólio de Realizações, ligada à meta {meta.codigo}.</p>
        <Campo label="Período"><input value={periodo} onChange={e => setPeriodo(e.target.value)} className="modal-input" autoFocus /></Campo>
        <Campo label="Título da entrega"><input value={titulo} onChange={e => setTitulo(e.target.value)} className="modal-input" /></Campo>
        <Campo label="Descrição"><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="modal-input" /></Campo>
        {erro && <p className="modal-erro">{erro}</p>}
        <button type="submit" disabled={!titulo.trim() || !desc.trim() || salvando} className="modal-btn-submit">
          {salvando ? <span className="modal-spinner" /> : 'Publicar entrega'}
        </button>
      </form>
    </Modal>
  );
}
