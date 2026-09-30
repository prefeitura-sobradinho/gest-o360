import { addDoc, collection, deleteDoc, deleteField, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { secretarias } from '@/data/secretarias';
import type { Meta, Tom } from '@/types';

/** Nome do ícone do portfólio correspondente a cada secretaria. */
const ICONE_POR_SECRETARIA: Record<string, string> = {
  gabinete: 'Briefcase', fazenda: 'Calculator', planejamento: 'Map', agricultura: 'Leaf',
  assistencia: 'Users', convenios: 'FileSignature', educacao: 'BookOpen', infra: 'HardHat',
  saude: 'HeartPulse', setuc: 'Music', saae: 'Droplets',
};

/** "Setembro 2026" — formato usado na linha do tempo do portfólio. */
export function periodoAtual(d = new Date()) {
  const mes = d.toLocaleDateString('pt-BR', { month: 'long' });
  return `${mes.charAt(0).toUpperCase()}${mes.slice(1)} ${d.getFullYear()}`;
}

export interface EntradaPortfolio {
  data: string;
  titulo: string;
  desc: string;
}

/**
 * Publica a conclusão de uma meta como entrega no Portfólio de Realizações
 * e guarda a ligação nos dois sentidos (meta ↔ item do portfólio).
 */
export async function publicarConclusao(meta: Meta, entrada: EntradaPortfolio) {
  const sec = secretarias[meta.secretariaId];
  const ref = await addDoc(collection(db, 'portfolio'), {
    ...entrada,
    icone: ICONE_POR_SECRETARIA[meta.secretariaId] ?? 'Award',
    tom: (sec?.tom ?? 'gold') as Tom,
    ordem: -Date.now(),
    metaId: meta.id,
    metaCodigo: meta.codigo,
  });
  await updateDoc(doc(db, 'metas', meta.id), { portfolioId: ref.id });
  return ref.id;
}

/** Remove uma entrega e, se ela veio de uma meta, desfaz a ligação para permitir republicar. */
export async function excluirEntrega(item: { id: string; metaId?: string }) {
  if (item.metaId) {
    try { await updateDoc(doc(db, 'metas', item.metaId), { portfolioId: deleteField() }); } catch { /* a meta pode já ter sido excluída */ }
  }
  await deleteDoc(doc(db, 'portfolio', item.id));
}
