import { useState, type FormEvent } from 'react';
import { FileSignature } from 'lucide-react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Modal, Campo } from './Modal';
import { secretarias } from '@/data/secretarias';
import { SITUACAO_CONVENIO } from '@/lib/convenios';
import type { Convenio, SituacaoConvenio } from '@/types';

export function ConvenioModal({ convenio, onClose }: { convenio: Convenio | null; onClose: () => void }) {
  const [f, setF] = useState({
    numeroPlano: convenio?.numeroPlano ?? '',
    programa: convenio?.programa ?? '',
    emenda: convenio?.emenda ?? '',
    parlamentar: convenio?.parlamentar ?? '',
    objeto: convenio?.objeto ?? '',
    valorCusteio: convenio?.valorCusteio ?? 0,
    valorInvestimento: convenio?.valorInvestimento ?? 0,
    valorRecebido: convenio?.valorRecebido ?? 0,
    vigenciaInicio: convenio?.vigenciaInicio ?? '',
    vigenciaFim: convenio?.vigenciaFim ?? '',
    situacao: (convenio?.situacao ?? 'aprovado') as SituacaoConvenio,
    secretariaId: convenio?.secretariaId ?? 'infra',
    acaoOrcamentaria: convenio?.acaoOrcamentaria ?? '',
    fonte: convenio?.fonte ?? 'Transferegov · Transferências Especiais',
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF(p => ({ ...p, [k]: v }));
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const invalido = !f.numeroPlano.trim() || !f.objeto.trim() || !f.vigenciaFim || (f.valorCusteio + f.valorInvestimento) <= 0;

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (invalido) return;
    setLoading(true);
    try {
      if (convenio) await updateDoc(doc(db, 'convenios', convenio.id), f);
      else await addDoc(collection(db, 'convenios'), { ...f, ordem: Date.now() });
      onClose();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal titulo={convenio ? 'Editar convênio' : 'Novo convênio ou emenda'} icone={FileSignature} onClose={onClose} largo>
      <form onSubmit={salvar} className="modal-form">
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Nº do Plano de Ação"><input value={f.numeroPlano} onChange={e => set('numeroPlano', e.target.value)} placeholder="09032026-095711/2026" className="modal-input" autoFocus /></Campo>
          <Campo label="Programa (Transferegov)"><input value={f.programa} onChange={e => set('programa', e.target.value)} placeholder="09032026" className="modal-input" /></Campo>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Nº da emenda"><input value={f.emenda} onChange={e => set('emenda', e.target.value)} className="modal-input" /></Campo>
          <Campo label="Parlamentar"><input value={f.parlamentar} onChange={e => set('parlamentar', e.target.value)} className="modal-input" /></Campo>
        </div>
        <Campo label="Objeto"><textarea value={f.objeto} onChange={e => set('objeto', e.target.value)} rows={3} className="modal-input" /></Campo>
        <div className="grid grid-cols-3 gap-3">
          <Campo label="Custeio (R$)"><input type="number" value={f.valorCusteio} onChange={e => set('valorCusteio', Number(e.target.value))} className="modal-input" /></Campo>
          <Campo label="Investimento (R$)"><input type="number" value={f.valorInvestimento} onChange={e => set('valorInvestimento', Number(e.target.value))} className="modal-input" /></Campo>
          <Campo label="Já recebido (R$)"><input type="number" value={f.valorRecebido} onChange={e => set('valorRecebido', Number(e.target.value))} className="modal-input" /></Campo>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Campo label="Início da vigência"><input type="date" value={f.vigenciaInicio} onChange={e => set('vigenciaInicio', e.target.value)} className="modal-input" /></Campo>
          <Campo label="Fim da vigência"><input type="date" value={f.vigenciaFim} onChange={e => set('vigenciaFim', e.target.value)} className="modal-input" /></Campo>
          <Campo label="Situação">
            <select value={f.situacao} onChange={e => set('situacao', e.target.value as SituacaoConvenio)} className="modal-input">
              {(Object.keys(SITUACAO_CONVENIO) as SituacaoConvenio[]).map(s => <option key={s} value={s}>{SITUACAO_CONVENIO[s]}</option>)}
            </select>
          </Campo>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Campo label="Unidade executora">
            <select value={f.secretariaId} onChange={e => set('secretariaId', e.target.value)} className="modal-input">
              {Object.values(secretarias).map(s => <option key={s.id} value={s.id}>{s.titulo}</option>)}
            </select>
          </Campo>
          <Campo label="Ação orçamentária"><input value={f.acaoOrcamentaria} onChange={e => set('acaoOrcamentaria', e.target.value)} className="modal-input" /></Campo>
        </div>
        {erro && <p className="modal-erro">{erro}</p>}
        <button type="submit" disabled={invalido || loading} className="modal-btn-submit">{loading ? <span className="modal-spinner" /> : 'Salvar convênio'}</button>
      </form>
    </Modal>
  );
}
