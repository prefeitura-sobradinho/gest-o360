import { lerXlsx, cel, texto_, numero, dataISO, type Aba } from './xlsx';
import { secretarias } from '@/data/secretarias';

/**
 * Lê a planilha de coleta devolvida pelas secretarias.
 *
 * A planilha tem duas naturezas de dado, e o painel as trata de forma diferente:
 *
 *   · indicadores do PPA — fixados pela Lei nº 712/2025, com linha de base e meta.
 *     A secretaria informa a medição; o avanço entra no cálculo do Plano.
 *
 *   · indicadores próprios da secretaria — o que a pasta acompanha e o PPA não
 *     previu. O painel é da gestão inteira, não só do PPA, então estes também são
 *     publicados: aparecem na página da secretaria, sem afetar as metas do Plano.
 *
 * A leitura não depende de números fixos de linha. As seções são localizadas pelos
 * próprios rótulos da planilha, para o arquivo continuar sendo lido se alguém
 * inserir uma linha ou renomear a aba.
 */

export interface LinhaPPA {
  aba: string;
  codigo: string;
  valor: number;
  data: string | null;
  observacao: string;
}

export interface LinhaPropria {
  aba: string;
  secretariaId: string;
  label: string;
  unidade: string;
  valor: number;
  data: string | null;
  observacao: string;
}

export interface LeituraPlanilha {
  ppa: LinhaPPA[];
  proprios: LinhaPropria[];
  /** quem preencheu, por aba */
  responsaveis: { aba: string; secretariaId: string; quem: string; enviadoEm: string | null }[];
  avisos: string[];
  abasLidas: string[];
  abasIgnoradas: string[];
}

const ABAS_DE_APOIO = ['instruções', 'instrucoes', 'consolidado', 'outros indicadores'];

const semAcento = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** Procura a secretaria pelo título escrito na aba; cai no nome da aba se preciso. */
function acharSecretaria(titulo: string, nomeAba: string): string | null {
  const alvos = [titulo, nomeAba].map(semAcento).filter(Boolean);
  for (const [id, s] of Object.entries(secretarias)) {
    const t = semAcento(s.titulo);
    if (alvos.some(a => a === t || t.startsWith(a) || a.startsWith(t))) return id;
  }
  return null;
}

/** Primeira linha cuja coluna A bate com o rótulo procurado. */
function acharLinha(aba: Aba, coluna: string, teste: (v: string) => boolean, ate = 400): number | null {
  for (let r = 1; r <= Math.min(aba.ultimaLinha, ate); r++) {
    if (teste(semAcento(texto_(cel(aba, coluna, r))))) return r;
  }
  return null;
}

export async function lerPlanilhaColeta(arquivo: File): Promise<LeituraPlanilha> {
  const abas = await lerXlsx(arquivo);
  const out: LeituraPlanilha = {
    ppa: [], proprios: [], responsaveis: [], avisos: [], abasLidas: [], abasIgnoradas: [],
  };

  for (const aba of abas) {
    if (ABAS_DE_APOIO.includes(semAcento(aba.nome))) continue;

    const titulo = texto_(cel(aba, 'A', 2));
    const secretariaId = acharSecretaria(titulo, aba.nome);
    const cabecalho = acharLinha(aba, 'A', v => v === 'codigo');

    if (!secretariaId || cabecalho === null) {
      out.abasIgnoradas.push(aba.nome);
      continue;
    }
    out.abasLidas.push(aba.nome);

    const quem = texto_(cel(aba, 'C', 4)) || texto_(cel(aba, 'B', 4));
    out.responsaveis.push({
      aba: aba.nome, secretariaId, quem,
      enviadoEm: dataISO(cel(aba, 'G', 4)) ?? dataISO(cel(aba, 'E', 4)),
    });

    const faixa = acharLinha(aba, 'A', v => v.startsWith('outros indicadores'));
    const fimPPA = faixa !== null ? faixa - 1 : aba.ultimaLinha;

    /* ── indicadores do PPA ── */
    for (let r = cabecalho + 1; r <= fimPPA; r++) {
      const codigo = texto_(cel(aba, 'A', r)).toUpperCase();
      if (!/^[A-ZÇÃÕ]{3}-\d{2}$/.test(codigo)) continue;
      const bruto = cel(aba, 'F', r);
      if (bruto === null) continue;

      const valor = numero(bruto);
      if (valor === null) {
        out.avisos.push(`${aba.nome} · ${codigo}: "${texto_(bruto)}" não é um número — linha ignorada.`);
        continue;
      }
      const data = dataISO(cel(aba, 'G', r));
      if (cel(aba, 'G', r) !== null && data === null) {
        out.avisos.push(`${aba.nome} · ${codigo}: a data "${texto_(cel(aba, 'G', r))}" não foi reconhecida; usei a data de hoje.`);
      }
      out.ppa.push({ aba: aba.nome, codigo, valor, data, observacao: texto_(cel(aba, 'H', r)) });
    }

    /* ── indicadores próprios da secretaria ── */
    if (faixa === null) continue;
    const cabExtra = acharLinha(aba, 'A', v => v === 'no' || v === 'n') ?? faixa + 2;
    for (let r = Math.max(cabExtra, faixa) + 1; r <= aba.ultimaLinha; r++) {
      const label = texto_(cel(aba, 'B', r));
      const bruto = cel(aba, 'F', r);
      if (!label && bruto === null) continue;
      if (!label) {
        out.avisos.push(`${aba.nome} · linha ${r}: valor informado sem o nome do indicador — linha ignorada.`);
        continue;
      }
      const valor = numero(bruto);
      if (valor === null) {
        out.avisos.push(`${aba.nome} · "${label}": sem valor numérico — linha ignorada.`);
        continue;
      }
      out.proprios.push({
        aba: aba.nome, secretariaId, label, unidade: texto_(cel(aba, 'C', r)),
        valor, data: dataISO(cel(aba, 'G', r)), observacao: texto_(cel(aba, 'H', r)),
      });
    }
  }

  if (out.abasLidas.length === 0) {
    throw new Error('Não encontrei nenhuma aba de secretaria neste arquivo. '
      + 'Use a planilha enviada pela SEPLAN, sem apagar o cabeçalho das abas.');
  }
  return out;
}

/** Texto curto do valor, para a prévia. */
export const fmtValor = (v: number, unidade?: string) =>
  `${v.toLocaleString('pt-BR', { maximumFractionDigits: 3 })}${unidade ? ` ${unidade}` : ''}`;
