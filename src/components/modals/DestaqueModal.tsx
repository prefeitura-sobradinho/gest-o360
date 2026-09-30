import { useState, type FormEvent } from 'react';
import { Edit3 } from 'lucide-react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Modal, Campo } from './Modal';
import type { Destaque } from '@/types';

export function DestaqueModal({ secretariaId, destaque, onClose }: { secretariaId: string; destaque: Destaque | null; onClose: () => void }) {
  const [titulo, setTitulo] = useState(destaque?.titulo ?? '');
  const [desc, setDesc] = useState(destaque?.descricao ?? '');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !desc.trim()) return;
    setLoading(true);
    try {
      if (destaque) await updateDoc(doc(db, 'destaques', destaque.id), { titulo, descricao: desc });
      else await addDoc(collection(db, 'destaques'), { secretaria_id: secretariaId, titulo, descricao: desc, ordem: Date.now() });
      onClose();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal titulo={destaque ? 'Editar destaque' : 'Novo destaque'} icone={Edit3} onClose={onClose}>
      <form onSubmit={salvar} className="modal-form">
        <Campo label="Título"><input value={titulo} onChange={e => setTitulo(e.target.value)} className="modal-input" autoFocus /></Campo>
        <Campo label="Descrição"><textarea value={desc} onChange={e => setDesc(e.target.value)} className="modal-input" rows={4} /></Campo>
        {erro && <p className="modal-erro">{erro}</p>}
        <button type="submit" disabled={!titulo.trim() || !desc.trim() || loading} className="modal-btn-submit">
          {loading ? <span className="modal-spinner" /> : 'Salvar destaque'}
        </button>
      </form>
    </Modal>
  );
}
