import { useState, type FormEvent } from 'react';
import { Award } from 'lucide-react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Modal, Campo } from './Modal';
import type { ItemPortfolio } from '@/types';

export function PortfolioModal({ item, onClose }: { item: ItemPortfolio | null; onClose: () => void }) {
  const [data, setData] = useState(item?.data ?? '');
  const [titulo, setTitulo] = useState(item?.titulo ?? '');
  const [desc, setDesc] = useState(item?.desc ?? '');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (!data.trim() || !titulo.trim() || !desc.trim()) return;
    setLoading(true);
    try {
      if (item) await updateDoc(doc(db, 'portfolio', item.id), { data, titulo, desc });
      else await addDoc(collection(db, 'portfolio'), { data, titulo, desc, icone: 'Award', tom: 'gold', ordem: -Date.now() });
      onClose();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal titulo={item ? 'Editar entrega' : 'Registrar entrega'} icone={Award} onClose={onClose}>
      <form onSubmit={salvar} className="modal-form">
        <Campo label="Período (ex.: Março 2026)"><input value={data} onChange={e => setData(e.target.value)} className="modal-input" autoFocus /></Campo>
        <Campo label="Título"><input value={titulo} onChange={e => setTitulo(e.target.value)} className="modal-input" /></Campo>
        <Campo label="Descrição"><textarea value={desc} onChange={e => setDesc(e.target.value)} className="modal-input" rows={4} /></Campo>
        {erro && <p className="modal-erro">{erro}</p>}
        <button type="submit" disabled={!data.trim() || !titulo.trim() || !desc.trim() || loading} className="modal-btn-submit">
          {loading ? <span className="modal-spinner" /> : 'Salvar entrega'}
        </button>
      </form>
    </Modal>
  );
}
