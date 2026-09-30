import type { Meta, StatusMeta, Tom } from '@/types';
import { ppa } from '@/data/municipio';

export const STATUS_LABEL: Record<StatusMeta, string> = {
  nao_iniciada: 'Não iniciada',
  em_execucao: 'Em execução',
  concluida: 'Concluída',
  atrasada: 'Atrasada',
  suspensa: 'Suspensa',
};

export const STATUS_TOM: Record<StatusMeta, Tom> = {
  nao_iniciada: 'stone',
  em_execucao: 'azul',
  concluida: 'verde',
  atrasada: 'alerta',
  suspensa: 'vinho',
};

/**
 * Progresso físico da meta, 0–100, medido a partir da linha de base do PPA.
 * Funciona nos dois sentidos: indicadores que devem crescer (cobertura vacinal
 * de 75 para 100) e que devem cair (óbitos maternos de 1 para 0).
 */
export const progresso = (m: Pick<Meta, 'valorMeta' | 'valorAtual'> & { valorInicial?: number }) => {
  const inicial = m.valorInicial ?? 0;
  const vao = m.valorMeta - inicial;
  // Indicador que só precisa ser mantido (índice atual já igual ao pretendido).
  if (vao === 0) return m.valorAtual >= m.valorMeta ? 100 : 0;
  return Math.max(0, Math.min(100, Math.round(((m.valorAtual - inicial) / vao) * 100)));
};

/** true quando a meta é de redução (o índice pretendido é menor que a linha de base) */
export const ehReducao = (m: Pick<Meta, 'valorMeta'> & { valorInicial?: number }) =>
  m.valorMeta < (m.valorInicial ?? 0);

/** Progresso esperado hoje, assumindo avanço linear do início do PPA até o prazo */
export const progressoEsperado = (m: Pick<Meta, 'prazo'>, hoje = new Date()) => {
  const inicio = new Date(ppa.inicio).getTime();
  const fim = new Date(m.prazo).getTime();
  if (fim <= inicio) return 100;
  return Math.max(0, Math.min(100, Math.round(((hoje.getTime() - inicio) / (fim - inicio)) * 100)));
};

/** Diferença entre o realizado e o esperado (pontos percentuais) */
export const desvio = (m: Meta, hoje = new Date()) => progresso(m) - progressoEsperado(m, hoje);

/**
 * Meta em risco: já começou e está mais de 15 p.p. abaixo do esperado, ou teve o prazo vencido.
 * Uma meta ainda não iniciada, dentro do prazo, não é risco — é pendência de atualização,
 * contada separadamente para não disparar alarme falso logo após a carga do PPA.
 */
export const emRisco = (m: Meta, hoje = new Date()) => {
  if (m.status === 'concluida' || m.status === 'suspensa') return false;
  if (new Date(m.prazo) < hoje) return true;
  if (m.status === 'nao_iniciada') return false;
  return desvio(m, hoje) < -15;
};

/** Meta que nunca recebeu atualização depois da carga inicial. */
export const semPrimeiraAtualizacao = (m: Meta) =>
  m.status === 'nao_iniciada' && (m.historico?.length ?? 0) <= 1;

/** Dias sem atualização */
export const diasSemAtualizar = (m: Meta, hoje = new Date()) =>
  Math.floor((hoje.getTime() - new Date(m.atualizadoEm).getTime()) / 86_400_000);

export interface ResumoMetas {
  total: number;
  concluidas: number;
  emExecucao: number;
  atrasadas: number;
  naoIniciadas: number;
  suspensas: number;
  emRisco: number;
  desatualizadas: number;
  aguardandoPrimeira: number;
  progressoMedio: number;
}

export const resumir = (metas: Meta[], hoje = new Date()): ResumoMetas => {
  const total = metas.length;
  const cont = (s: StatusMeta) => metas.filter(m => m.status === s).length;
  return {
    total,
    concluidas: cont('concluida'),
    emExecucao: cont('em_execucao'),
    atrasadas: cont('atrasada'),
    naoIniciadas: cont('nao_iniciada'),
    suspensas: cont('suspensa'),
    emRisco: metas.filter(m => emRisco(m, hoje)).length,
    aguardandoPrimeira: metas.filter(semPrimeiraAtualizacao).length,
    desatualizadas: metas.filter(m => diasSemAtualizar(m, hoje) > 60).length,
    progressoMedio: total ? Math.round(metas.reduce((a, m) => a + progresso(m), 0) / total) : 0,
  };
};

export const fmtData = (iso?: string) => {
  if (!iso) return '—';
  const [y, mo, d] = iso.slice(0, 10).split('-');
  return `${d}/${mo}/${y}`;
};

export const fmtNum = (n: number) => n.toLocaleString('pt-BR');

export const hojeISO = () => new Date().toISOString().slice(0, 10);
