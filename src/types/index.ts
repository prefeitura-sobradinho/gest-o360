import type { LucideIcon } from 'lucide-react';

/** Tons de cor usados nas classes CSS `tom-*` */
export type Tom = 'azul' | 'verde' | 'terracota' | 'vinho' | 'gold' | 'stone' | 'alerta' | 'orange';

export type Trend = 'up' | 'down' | 'neutral';

/* ── Metas do PPA (coleção `metas`) ── */
export type StatusMeta = 'nao_iniciada' | 'em_execucao' | 'concluida' | 'atrasada' | 'suspensa';

export interface PontoHistorico {
  data: string;          // ISO yyyy-mm-dd
  valor: number;
  observacao?: string;
  autor?: string;
}

export interface Meta {
  id: string;
  codigo: string;        // ex.: "EDU-01"
  titulo: string;
  descricao?: string;
  eixoId: string;        // eixo estruturante do PPA (Art. 3º da Lei 712/2025)
  programaId?: string;   // programa do PPA a que o indicador pertence
  secretariaId: string;  // unidade responsável
  indicador: string;     // o que é medido
  unidade: string;       // %, un, km, famílias…
  /** índice atual do PPA: linha de base a partir da qual o avanço é medido */
  valorInicial?: number;
  valorMeta: number;     // índice pretendido
  valorAtual: number;
  prazo: string;         // ISO yyyy-mm-dd
  status: StatusMeta;
  responsavel: string;
  fonte: string;         // origem do dado
  atualizadoEm: string;  // ISO
  atualizadoPor?: string;
  historico: PontoHistorico[];
  ordem: number;
  /** id do item do portfólio, quando a conclusão já foi publicada */
  portfolioId?: string;
}

export type MetaInput = Omit<Meta, 'id'>;

/* ── KPIs por secretaria (coleção `kpis`) ── */
export interface Kpi {
  id: string;
  secretaria_id: string;
  label: string;
  valor: string;
  unidade?: string;
  trend?: Trend;
  delta?: string;
  historico?: { periodo: string; valor: number }[];
  fonte?: string;
  atualizadoEm?: string;
  ordem: number;
}

/* ── Destaques por secretaria (coleção `destaques`) ── */
export interface Destaque {
  id: string;
  secretaria_id: string;
  titulo: string;
  descricao: string;
  ordem: number;
}

/* ── Portfólio de entregas (coleção `portfolio`) ── */
export interface ItemPortfolio {
  id: string;
  data: string;
  titulo: string;
  desc: string;
  icone: string;
  tom: Tom;
  ordem: number;
  /** meta do PPA que originou esta entrega, quando publicada a partir dela */
  metaId?: string;
  metaCodigo?: string;
}

/* ── Dados estáticos ── */
export interface Secretaria {
  id: string;
  titulo: string;
  subtitulo: string;
  icone: LucideIcon;
  tom: Tom;
  responsavel: string;
  contato: string;
  atendimento?: string;
  /** dados de exemplo, usados só enquanto o Firestore estiver vazio */
  kpisExemplo: Omit<Kpi, 'id' | 'secretaria_id' | 'ordem'>[];
  destaquesExemplo: { titulo: string; desc: string }[];
}

export interface Eixo {
  id: string;
  /** algarismo romano como na lei */
  numero: string;
  nome: string;
  /** nome completo como consta no Art. 3º da Lei 712/2025 */
  nomeOficial: string;
  tom: Tom;
  cor: string;
  descricao: string;
  icone: LucideIcon;
}

/** Programa do PPA — nível entre o eixo e os indicadores (Art. 4º da Lei 712/2025) */
export interface Programa {
  id: string;
  nome: string;
  eixoId: string;
  areaTematica: string;
  objetivo: string;
  /** recurso do programa, em reais */
  recurso: number;
  unidadeResponsavel: string;
  secretariaId: string;
  /** ODS relacionados, conforme o Anexo VI */
  ods: string[];
  /** página do Diário Oficial nº 4406 onde o programa está no espelho */
  pagina: number;
  /** explica a ausência de execução no portal do Executivo, quando for o caso */
  notaExecucao?: string;
}

export interface ItemMenu {
  id: string;
  nome: string;
  icone: LucideIcon;
  grupo: 'principal' | 'lideranca' | 'secretarias';
  rota: string;
}

/* ── Execução financeira (Portal da Transparência) ── */

/** Despesa agregada por ano, mês e ação orçamentária. Coleção `execucao`. */
export interface ExecucaoAcao {
  id: string;            // "2026-01-2018"
  ano: number;
  mes: number;
  cdAcao: number;
  dsAcao: string;
  programaId: string;
  secretariaId: string;
  funcao: string;
  empenhado: number;
  liquidado: number;
  pago: number;
}

/** Receita do mês: previsão da LOA e arrecadação realizada. Coleção `receitas`. */
export interface ReceitaPeriodo {
  id: string;            // "2026-01"
  ano: number;
  mes: number;
  previsto: number;
  arrecadado: number;
}

/* ── Convênios e emendas parlamentares (Transferegov) ── */

export type SituacaoConvenio = 'proposta' | 'aprovado' | 'em_execucao' | 'concluido' | 'cancelado';

/** Plano de Ação de transferência especial ou convênio captado pelo município. Coleção `convenios`. */
export interface Convenio {
  id: string;
  /** nº do Plano de Ação no Transferegov, ex.: "09032026-095711/2026" */
  numeroPlano: string;
  /** código do programa no Transferegov */
  programa?: string;
  /** nº da emenda parlamentar */
  emenda?: string;
  /** autor da emenda */
  parlamentar?: string;
  objeto: string;
  valorCusteio: number;
  valorInvestimento: number;
  /** já recebido/executado, alimentado manualmente pela SECONV */
  valorRecebido?: number;
  vigenciaInicio: string;   // ISO
  vigenciaFim: string;      // ISO
  situacao: SituacaoConvenio;
  /** unidade que executa o objeto */
  secretariaId: string;
  /** ação orçamentária onde a despesa é empenhada, quando conhecida */
  acaoOrcamentaria?: string;
  /** meta do PPA que esta captação ajuda a cumprir */
  metaId?: string;
  fonte?: string;
  ordem: number;
}
