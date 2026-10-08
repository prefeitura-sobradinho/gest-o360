import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { hojeISO } from './metas';
import { statusAutomatico } from './metasRepo';
import type { Kpi, Meta } from '@/types';
import type { LinhaPPA, LinhaPropria } from './planilhaColeta';

const semAcento = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');

/** "2026-03-15" → "mar/2026", para o histórico do indicador da secretaria. */
const periodoDe = (iso: string) => {
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${meses[Number(iso.slice(5, 7)) - 1]}/${iso.slice(0, 4)}`;
};

export interface PrevisaoMeta {
  meta: Meta;
  linha: LinhaPPA;
  valorAntes: number;
  mudou: boolean;
}

export interface PrevisaoColeta {
  atualizar: PrevisaoMeta[];
  semMudanca: PrevisaoMeta[];
  desconhecidas: LinhaPPA[];
  proprios: LinhaPropria[];
}

/** Casa as linhas da planilha com as metas que estão no banco, sem gravar nada. */
export function prever(ppa: LinhaPPA[], proprios: LinhaPropria[], metas: Meta[]): PrevisaoColeta {
  const porCodigo = new Map(metas.map(m => [m.codigo.toUpperCase(), m]));
  const atualizar: PrevisaoMeta[] = [];
  const semMudanca: PrevisaoMeta[] = [];
  const desconhecidas: LinhaPPA[] = [];

  for (const linha of ppa) {
    const meta = porCodigo.get(linha.codigo);
    if (!meta) { desconhecidas.push(linha); continue; }
    const previsao = { meta, linha, valorAntes: meta.valorAtual, mudou: meta.valorAtual !== linha.valor };
    (previsao.mudou ? atualizar : semMudanca).push(previsao);
  }
  return { atualizar, semMudanca, desconhecidas, proprios };
}

export interface ResultadoColeta {
  metasAtualizadas: number;
  kpisCriados: number;
  kpisAtualizados: number;
  concluidas: string[];
}

/**
 * Grava a planilha: atualiza as metas do PPA e publica os indicadores próprios
 * de cada secretaria. Reimportar o mesmo arquivo é seguro — as metas recebem o
 * mesmo valor e os indicadores próprios são reconhecidos pelo nome.
 */
export async function aplicarColeta(
  previsao: PrevisaoColeta, autor: string,
): Promise<ResultadoColeta> {
  const hoje = hojeISO();
  const concluidas: string[] = [];

  /* ── metas do PPA ── */
  const lote = writeBatch(db);
  for (const { meta, linha } of previsao.atualizar) {
    const status = statusAutomatico(meta, linha.valor);
    if (status === 'concluida' && meta.status !== 'concluida') concluidas.push(meta.codigo);
    const quando = linha.data ?? hoje;
    lote.update(doc(db, 'metas', meta.id), {
      valorAtual: linha.valor,
      status,
      atualizadoEm: quando,
      atualizadoPor: autor,
      historico: [...(meta.historico ?? []), {
        data: quando,
        valor: linha.valor,
        observacao: linha.observacao || `Planilha de coleta — ${linha.aba}`,
        autor,
      }],
    });
  }
  if (previsao.atualizar.length) await lote.commit();

  /* ── indicadores próprios das secretarias ── */
  const existentes = (await getDocs(collection(db, 'kpis'))).docs.map(
    d => ({ id: d.id, ...(d.data() as Omit<Kpi, 'id'>) }),
  );
  const chave = (secretaria: string, label: string) => `${secretaria}|${semAcento(label)}`;
  const porChave = new Map(existentes.map(k => [chave(k.secretaria_id, k.label), k]));

  let criados = 0, atualizados = 0;
  const loteKpi = writeBatch(db);
  for (const p of previsao.proprios) {
    const atual = porChave.get(chave(p.secretariaId, p.label));
    const quando = p.data ?? hoje;
    const valor = p.valor.toLocaleString('pt-BR', { maximumFractionDigits: 3 });
    const ponto = { periodo: periodoDe(quando), valor: p.valor };

    if (atual) {
      const historico = (atual.historico ?? []).filter(h => h.periodo !== ponto.periodo);
      loteKpi.update(doc(db, 'kpis', atual.id), {
        valor, unidade: p.unidade || atual.unidade || '',
        fonte: p.observacao || atual.fonte || '',
        atualizadoEm: quando,
        historico: [...historico, ponto],
      });
      atualizados++;
    } else {
      loteKpi.set(doc(collection(db, 'kpis')), {
        secretaria_id: p.secretariaId,
        label: p.label,
        valor,
        unidade: p.unidade || '',
        fonte: p.observacao || `Informado pela secretaria em ${quando.split('-').reverse().join('/')}`,
        atualizadoEm: quando,
        historico: [ponto],
        ordem: Date.now() + criados,
      });
      criados++;
    }
  }
  if (previsao.proprios.length) await loteKpi.commit();

  return {
    metasAtualizadas: previsao.atualizar.length,
    kpisCriados: criados,
    kpisAtualizados: atualizados,
    concluidas,
  };
}
