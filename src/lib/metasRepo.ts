import { addDoc, arrayUnion, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { hojeISO } from './metas';
import type { Meta, MetaInput, StatusMeta } from '@/types';

export interface Atualizacao {
  valor: number;
  status?: StatusMeta | '';
  observacao?: string;
  autor: string;
}

/** Decide o status quando o responsável não escolheu um explicitamente. */
function statusAutomatico(meta: Meta, valor: number): StatusMeta {
  if (valor >= meta.valorMeta) return 'concluida';
  if (meta.status === 'nao_iniciada' && valor > 0) return 'em_execucao';
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
