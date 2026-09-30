import type { Convenio, SituacaoConvenio, Tom } from '@/types';

export const SITUACAO_CONVENIO: Record<SituacaoConvenio, string> = {
  proposta: 'Proposta',
  aprovado: 'Aprovado',
  em_execucao: 'Em execução',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
};

export const TOM_CONVENIO: Record<SituacaoConvenio, Tom> = {
  proposta: 'stone',
  aprovado: 'azul',
  em_execucao: 'terracota',
  concluido: 'verde',
  cancelado: 'alerta',
};

export const valorTotal = (c: Pick<Convenio, 'valorCusteio' | 'valorInvestimento'>) =>
  c.valorCusteio + c.valorInvestimento;

/** Dias restantes até o fim da vigência (negativo se já venceu). */
export const diasDeVigencia = (c: Pick<Convenio, 'vigenciaFim'>, hoje = new Date()) =>
  Math.ceil((new Date(c.vigenciaFim).getTime() - hoje.getTime()) / 86_400_000);

/** Convênio que exige atenção: vence em menos de 180 dias e ainda não foi concluído. */
export const vigenciaEmRisco = (c: Convenio, hoje = new Date()) => {
  if (c.situacao === 'concluido' || c.situacao === 'cancelado') return false;
  const dias = diasDeVigencia(c, hoje);
  return dias < 180;
};

export interface ResumoConvenios {
  total: number;
  valorTotal: number;
  recebido: number;
  ativos: number;
  emRisco: number;
  porParlamentar: { nome: string; valor: number; quantidade: number }[];
}

export function resumirConvenios(lista: Convenio[], hoje = new Date()): ResumoConvenios {
  const porParlamentar = new Map<string, { valor: number; quantidade: number }>();
  for (const c of lista) {
    if (c.situacao === 'cancelado') continue;
    const nome = c.parlamentar?.trim() || 'Sem emenda parlamentar';
    const a = porParlamentar.get(nome) ?? { valor: 0, quantidade: 0 };
    a.valor += valorTotal(c); a.quantidade++;
    porParlamentar.set(nome, a);
  }
  const validos = lista.filter(c => c.situacao !== 'cancelado');
  return {
    total: lista.length,
    valorTotal: validos.reduce((a, c) => a + valorTotal(c), 0),
    recebido: validos.reduce((a, c) => a + (c.valorRecebido ?? 0), 0),
    ativos: lista.filter(c => c.situacao === 'aprovado' || c.situacao === 'em_execucao').length,
    emRisco: lista.filter(c => vigenciaEmRisco(c, hoje)).length,
    porParlamentar: [...porParlamentar.entries()]
      .map(([nome, v]) => ({ nome, ...v }))
      .sort((a, b) => b.valor - a.valor),
  };
}
