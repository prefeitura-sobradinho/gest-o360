import { useMemo } from 'react';
import type { ExecucaoAcao, ReceitaPeriodo } from '@/types';
import { useCollection } from './useCollection';
import { totaisExecucao, dentroDoPPA } from '@/lib/execucao';

export interface ExecucaoState {
  itens: ExecucaoAcao[];
  /** apenas lançamentos de 2026 a 2029 */
  doPPA: ExecucaoAcao[];
  totais: { empenhado: number; liquidado: number; pago: number };
  anos: number[];
  carregando: boolean;
  erro: string | null;
  vazio: boolean;
}

export function useExecucao(): ExecucaoState {
  const { data, carregando, erro } = useCollection<ExecucaoAcao>('execucao', 'id');
  return useMemo(() => {
    const doPPA = dentroDoPPA(data);
    return {
      itens: data,
      doPPA,
      totais: totaisExecucao(doPPA),
      anos: [...new Set(data.map(i => i.ano))].sort(),
      carregando,
      erro,
      vazio: !carregando && !erro && data.length === 0,
    };
  }, [data, carregando, erro]);
}

export function useReceitas() {
  const { data, carregando, erro } = useCollection<ReceitaPeriodo>('receitas', 'id');
  return useMemo(() => {
    const porAno = new Map<number, { previsto: number; arrecadado: number }>();
    for (const r of data) {
      const a = porAno.get(r.ano) ?? { previsto: 0, arrecadado: 0 };
      a.previsto += r.previsto; a.arrecadado += r.arrecadado;
      porAno.set(r.ano, a);
    }
    return { meses: data, porAno, carregando, erro, vazio: !carregando && !erro && data.length === 0 };
  }, [data, carregando, erro]);
}
