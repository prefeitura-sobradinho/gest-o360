import { createContext, useContext, useMemo } from 'react';
import type { Meta } from '@/types';
import { useCollection } from './useCollection';
import { metasExemplo } from '@/data/seeds';
import { resumir, type ResumoMetas } from '@/lib/metas';

export interface MetasState {
  metas: Meta[];
  resumo: ResumoMetas;
  carregando: boolean;
  erro: string | null;
  /** true quando a coleção está vazia e estamos mostrando as metas de exemplo */
  exemplo: boolean;
  ultimaAtualizacao: string | null;
}

/** Assina a coleção `metas`, com fallback para os dados de exemplo enquanto ela estiver vazia. */
export function useProvideMetas(): MetasState {
  const { data, carregando, erro } = useCollection<Meta>('metas');
  return useMemo(() => {
    const exemplo = !carregando && !erro && data.length === 0;
    const metas: Meta[] = exemplo ? metasExemplo.map((m, i) => ({ ...m, id: `exemplo-${i}` })) : data;
    const ultimaAtualizacao = metas.reduce<string | null>((max, m) => (!max || m.atualizadoEm > max ? m.atualizadoEm : max), null);
    return { metas, resumo: resumir(metas), carregando, erro, exemplo, ultimaAtualizacao };
  }, [data, carregando, erro]);
}

export const MetasContext = createContext<MetasState | null>(null);

/** Uma única assinatura para toda a aplicação (provida no AppShell). */
export const useMetas = () => {
  const ctx = useContext(MetasContext);
  if (!ctx) throw new Error('useMetas precisa estar dentro de <MetasContext.Provider>');
  return ctx;
};
