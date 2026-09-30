import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, type DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CollectionState<T> {
  data: T[];
  carregando: boolean;
  erro: string | null;
}

/**
 * Assina uma coleção do Firestore em tempo real, ordenada por `campoOrdem`.
 * Devolve sempre os três estados: dados, carregando e erro.
 */
export function useCollection<T extends { id: string }>(nome: string, campoOrdem = 'ordem'): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({ data: [], carregando: true, erro: null });

  useEffect(() => {
    const q = query(collection(db, nome), orderBy(campoOrdem, 'asc'));
    const unsub = onSnapshot(
      q,
      snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...(d.data() as DocumentData) }) as T);
        setState({ data, carregando: false, erro: null });
      },
      err => {
        console.error(`Erro ao carregar "${nome}":`, err);
        setState(s => ({ ...s, carregando: false, erro: err.message }));
      },
    );
    return unsub;
  }, [nome, campoOrdem]);

  return state;
}
