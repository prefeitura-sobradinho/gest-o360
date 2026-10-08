import { addDoc, arrayUnion, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { hojeISO, progresso } from './metas';
import type { Meta, MetaInput, StatusMeta } from '@/types';

export interface Atualizacao {
  valor: number;
  status?: StatusMeta | '';
  observacao?: string;
  autor: string;
}

/**
 * Decide o status quando o responsável não escolheu um explicitamente.
 *
 * Compara pelo avanço, e não pelo valor bruto: em indicadores de redução
 * (óbitos maternos, de 1 para 0; defasagem idade-série, de 209 para 0) a meta é
 * um número menor que a linha de base, e "valor >= meta" daria meta concluída
 * logo na primeira medição.
 */
export function statusAutomatico(meta: Meta, valor: number): StatusMeta {
  if (progresso({ ...meta, valorAtual: valor }) >= 100) return 'concluida';
  // qualquer medição informada tira a meta de "não iniciada", mesmo que repita a linha de base
  if (meta.status === 'nao_iniciada') return 'em_execucao';
  return meta.status;
}

/** Registra um novo valor para a meta e guarda a linha correspondente no histórico. */
export async function registrarAtualizacao(meta: Meta, { valor, status, observacao, autor }: Atualizacao) {
  await updateDoc(doc(db, 'metas', meta.id), {
    valorAtual: valor,
    status: status || statusAutomatico(meta, valor),
    atualizadoEm: hojeISO(),
    atualizadoPor: autor,
    historico: arrayUnion({ data: hojeISO(), valor, observacao: observacao?.trim() ?? '', autor }),
  });
}

/** Cria uma meta já com a primeira linha de histórico. */
export async function criarMeta(dados: Omit<MetaInput, 'ordem' | 'atualizadoEm' | 'atualizadoPor' | 'historico'>, autor: string) {
  await addDoc(collection(db, 'metas'), {
    ...dados,
    ordem: Date.now(),
    atualizadoEm: hojeISO(),
    atualizadoPor: autor,
    historico: [{ data: hojeISO(), valor: dados.valorAtual, observacao: 'Cadastro da meta', autor }],
  });
}

export async function editarMeta(id: string, dados: Partial<MetaInput>, autor: string) {
  await updateDoc(doc(db, 'metas', id), { ...dados, atualizadoEm: hojeISO(), atualizadoPor: autor });
}

export const excluirMeta = (id: string) => deleteDoc(doc(db, 'metas', id));
