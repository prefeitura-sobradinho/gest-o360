import { acaoPorCodigo } from '@/data/acoes';
import { programas } from '@/data/programas';
import type { ExecucaoAcao, ReceitaPeriodo } from '@/types';

/* ────────────────────────────────────────────────────────────
   Leitura dos arquivos JSON exportados pelo Portal da Transparência
   de Sobradinho (transparencia.sobradinho.ba.gov.br).
   ──────────────────────────────────────────────────────────── */

interface LinhaDespesa {
  ANO: number; ID_MES: number; FASE: string; VALOR: number;
  CD_ACAO?: number; DS_ACAO?: string; CD_ORGAO?: number;
  FUNCAO?: string; SUBFUNCAO?: string; DS_FONTE_RECURSO?: string; CREDOR?: string;
}

interface LinhaReceita {
  ANO: number; ID_MES: number; VALOR: number;
  /** 1 = previsão da LOA · 2 = arrecadação realizada */
  TP_ARRECADAO: number;
  SN_DEDUTORA?: string; NATUREZA?: string; DS_FONTE_RECURSO?: string;
}

/** Normaliza a fase: o portal usa variações como "ESTORNO LIQUIDACAO" e "EMPENHO EMPENHO". */
function classificarFase(fase: string): { campo: 'empenhado' | 'liquidado' | 'pago'; sinal: number } | null {
  const f = fase.toUpperCase();
  const estorno = f.startsWith('ESTORNO');
  const sinal = estorno ? -1 : 1;
  if (f.includes('EMPENHO')) return { campo: 'empenhado', sinal };
  if (f.includes('LIQUIDA')) return { campo: 'liquidado', sinal };
  if (f.includes('PAGAMENTO')) return { campo: 'pago', sinal };
  return null;
}

export interface ResumoImportacao {
  ano: number;
  meses: number[];
  registros: number;
  semAcao: number;
  acoesDesconhecidas: number[];
  empenhado: number;
  liquidado: number;
  pago: number;
}

/**
 * Agrega as despesas por ano, mês e ação. Um documento por (ano, mês, ação),
 * em vez de um por lançamento — mantém a leitura do painel barata.
 */
export function agregarDespesas(linhas: LinhaDespesa[]): { itens: ExecucaoAcao[]; resumo: ResumoImportacao } {
  const mapa = new Map<string, ExecucaoAcao>();
  const desconhecidas = new Set<number>();
  const meses = new Set<number>();
  let semAcao = 0, ano = 0;

  for (const l of linhas) {
    const fase = classificarFase(l.FASE ?? '');
    if (!fase) continue;
    if (l.CD_ACAO == null) { semAcao++; continue; }

    ano = l.ANO;
    meses.add(l.ID_MES);
    const acao = acaoPorCodigo(l.CD_ACAO);
    if (!acao) desconhecidas.add(l.CD_ACAO);

    const id = `${l.ANO}-${String(l.ID_MES).padStart(2, '0')}-${l.CD_ACAO}`;
    const atual = mapa.get(id) ?? {
      id, ano: l.ANO, mes: l.ID_MES, cdAcao: l.CD_ACAO,
      dsAcao: acao?.nome ?? l.DS_ACAO ?? `Ação ${l.CD_ACAO}`,
      programaId: acao?.programaId ?? '', secretariaId: acao?.secretariaId ?? '',
      funcao: l.FUNCAO ?? '', empenhado: 0, liquidado: 0, pago: 0,
    };
    atual[fase.campo] = Math.round((atual[fase.campo] + l.VALOR * fase.sinal) * 100) / 100;
    mapa.set(id, atual);
  }

  const itens = [...mapa.values()].sort((a, b) => b.liquidado - a.liquidado);
  return {
    itens,
    resumo: {
      ano, meses: [...meses].sort((a, b) => a - b), registros: linhas.length, semAcao,
      acoesDesconhecidas: [...desconhecidas].sort((a, b) => a - b),
      empenhado: soma(itens, 'empenhado'), liquidado: soma(itens, 'liquidado'), pago: soma(itens, 'pago'),
    },
  };
}

/**
 * Separa a previsão da LOA (TP_ARRECADAO = 1, lançada em 1º de janeiro)
 * da arrecadação efetiva (TP_ARRECADAO = 2), e soma por mês.
 */
export function agregarReceitas(linhas: LinhaReceita[]): ReceitaPeriodo[] {
  const mapa = new Map<string, ReceitaPeriodo>();
  for (const l of linhas) {
    const id = `${l.ANO}-${String(l.ID_MES).padStart(2, '0')}`;
    const atual = mapa.get(id) ?? { id, ano: l.ANO, mes: l.ID_MES, previsto: 0, arrecadado: 0 };
    const valor = l.SN_DEDUTORA === 'S' ? -Math.abs(l.VALOR) : l.VALOR;
    if (l.TP_ARRECADAO === 1) atual.previsto += valor;
    else atual.arrecadado += valor;
    mapa.set(id, atual);
  }
  return [...mapa.values()]
    .map(r => ({ ...r, previsto: Math.round(r.previsto * 100) / 100, arrecadado: Math.round(r.arrecadado * 100) / 100 }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

const soma = (itens: ExecucaoAcao[], campo: 'empenhado' | 'liquidado' | 'pago') =>
  Math.round(itens.reduce((a, i) => a + i[campo], 0) * 100) / 100;

/** Execução acumulada de um programa, somando suas ações. */
export function execucaoDoPrograma(itens: ExecucaoAcao[], programaId: string) {
  const doPrograma = itens.filter(i => i.programaId === programaId);
  return {
    empenhado: soma(doPrograma, 'empenhado'),
    liquidado: soma(doPrograma, 'liquidado'),
    pago: soma(doPrograma, 'pago'),
    acoes: doPrograma.length,
  };
}

export function execucaoDaSecretaria(itens: ExecucaoAcao[], secretariaId: string) {
  const daSecretaria = itens.filter(i => i.secretariaId === secretariaId);
  return {
    empenhado: soma(daSecretaria, 'empenhado'),
    liquidado: soma(daSecretaria, 'liquidado'),
    pago: soma(daSecretaria, 'pago'),
    acoes: daSecretaria.length,
  };
}

/** Totais gerais do conjunto carregado. */
export const totaisExecucao = (itens: ExecucaoAcao[]) => ({
  empenhado: soma(itens, 'empenhado'),
  liquidado: soma(itens, 'liquidado'),
  pago: soma(itens, 'pago'),
});

/** Só os lançamentos dentro da vigência do PPA (2026–2029). */
export const dentroDoPPA = (itens: ExecucaoAcao[]) => itens.filter(i => i.ano >= 2026 && i.ano <= 2029);

/**
 * Percentual do recurso do PPA já liquidado, por programa.
 * O recurso cobre os quatro anos, então considera apenas lançamentos de 2026 a 2029.
 */
export function percentualDoPPA(itens: ExecucaoAcao[], programaId: string) {
  const p = programas.find(x => x.id === programaId);
  if (!p || p.recurso === 0) return 0;
  return Math.round((execucaoDoPrograma(dentroDoPPA(itens), programaId).liquidado / p.recurso) * 1000) / 10;
}

export const MESES = ['', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
