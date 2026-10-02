import { HeartPulse, BookOpen, Home, Scale, Briefcase } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Tom } from '@/types';
import { acaoPorCodigo } from './acoes';

/**
 * AGENDA TRANSVERSAL DA CRIANÇA E DO ADOLESCENTE
 *
 * Base legal — Lei Municipal nº 712, de 11/12/2025 (PPA 2026–2029):
 *   Art. 15 — "Considera-se Agenda Transversal um conjunto de políticas públicas de diferentes
 *              áreas, articuladas para enfrentar problemas complexos que afetam crianças e
 *              adolescentes no município."
 *   Art. 16 — "[...] terá como foco a promoção e a garantia de direitos de crianças e
 *              adolescentes, em conformidade com o Estatuto da Criança e do Adolescente e
 *              demais normas aplicáveis."
 *   Art. 17 — "O município terá que elaborar e divulgar oficialmente a Agenda Transversal."
 *
 * A lei define o conceito e obriga a divulgação, mas não lista o conteúdo: cabe ao município
 * montá-lo. A organização adotada aqui segue os capítulos de direitos do próprio ECA
 * (Lei Federal nº 8.069/1990), que o Art. 16 manda observar — é a leitura mais defensável
 * perante o Conselho Municipal dos Direitos da Criança e do Adolescente e o Tribunal de Contas.
 *
 * ALCANCE DAS AÇÕES — por que a distinção importa
 * A metodologia do Orçamento Criança e Adolescente (OCA), do UNICEF e da Fundação Abrinq,
 * separa as ações orçamentárias em dois grupos:
 *   • exclusiva — a totalidade do gasto se destina a crianças e adolescentes
 *                 (ensino infantil, transporte escolar, Conselho Tutelar…);
 *   • ampliada  — o público é mais largo e só uma parcela do gasto chega a esse grupo
 *                 (atenção primária à saúde, Bolsa Família, eventos culturais…).
 *
 * O município ainda não apurou a parcela das ações de alcance ampliado. Enquanto isso não for
 * feito, os dois grupos são somados SEPARADAMENTE e nunca apresentados como um valor único:
 * somá-los produziria um número inflado do que de fato se investe na infância.
 */

export type Alcance = 'exclusiva' | 'ampliada';

export interface AcaoAgenda {
  /** CD_ACAO, como vem do Portal da Transparência */
  codigo: number;
  alcance: Alcance;
  /** por que a ação está na agenda */
  justificativa: string;
}

export interface EixoDireito {
  id: string;
  numero: string;
  nome: string;
  /** dispositivo do ECA que fundamenta o eixo */
  baseECA: string;
  descricao: string;
  tom: Tom;
  icone: LucideIcon;
  /** códigos dos indicadores do PPA (campo `codigo` da meta) */
  metas: string[];
  acoes: AcaoAgenda[];
  /** quando o PPA não prevê ação para o direito, o painel precisa dizer isso */
  lacuna?: string;
}

export const eixosDireito: EixoDireito[] = [
  {
    id: 'vida-saude',
    numero: 'I',
    nome: 'Vida e saúde',
    baseECA: 'ECA, arts. 7º a 14',
    descricao:
      'Direito à vida e à saúde desde a gestação: atendimento pré e perinatal, vacinação, acompanhamento do crescimento e nutrição.',
    tom: 'vinho',
    icone: HeartPulse,
    metas: ['SAU-02', 'SAU-03'],
    acoes: [
      { codigo: 2028, alcance: 'ampliada', justificativa: 'Vigilância epidemiológica — executa a campanha de vacinação infantil.' },
      { codigo: 2025, alcance: 'ampliada', justificativa: 'Atenção primária por capitação — puericultura e pré-natal nas equipes de saúde da família.' },
      { codigo: 2027, alcance: 'ampliada', justificativa: 'Atenção primária por desempenho — indicadores incluem vacinação e pré-natal.' },
      { codigo: 2021, alcance: 'ampliada', justificativa: 'Hospital Municipal — atendimento pediátrico e obstétrico.' },
      { codigo: 1007, alcance: 'ampliada', justificativa: 'Unidades básicas de saúde, porta de entrada do acompanhamento infantil.' },
      { codigo: 1023, alcance: 'ampliada', justificativa: 'Distribuição de leite — combate à desnutrição infantil em famílias de baixa renda.' },
    ],
  },
  {
    id: 'educacao-cultura',
    numero: 'II',
    nome: 'Educação, cultura, esporte e lazer',
    baseECA: 'ECA, arts. 53 a 59',
    descricao:
      'Direito à educação com acesso e permanência na escola, e à cultura, ao esporte e ao lazer como parte da formação.',
    tom: 'azul',
    icone: BookOpen,
    metas: ['EDU-01', 'EDU-02', 'EDU-03', 'EDU-04', 'EDU-05', 'EDU-06', 'EDU-07', 'EDU-08'],
    acoes: [
      { codigo: 2088, alcance: 'exclusiva', justificativa: 'Ensino infantil — creche e pré-escola.' },
      { codigo: 2018, alcance: 'exclusiva', justificativa: 'Ensino fundamental da rede municipal.' },
      { codigo: 2016, alcance: 'exclusiva', justificativa: 'Manutenção do ensino básico.' },
      { codigo: 2011, alcance: 'exclusiva', justificativa: 'Alimentação escolar (PNAE) — atende exclusivamente os estudantes.' },
      { codigo: 2014, alcance: 'exclusiva', justificativa: 'Transporte escolar — garante o acesso à escola.' },
      { codigo: 1001, alcance: 'exclusiva', justificativa: 'Construção e ampliação de escolas e creches.' },
      { codigo: 1004, alcance: 'exclusiva', justificativa: 'Quadras, bibliotecas, refeitórios e auditórios das unidades escolares.' },
      { codigo: 2013, alcance: 'exclusiva', justificativa: 'Administração da rede municipal de ensino.' },
      { codigo: 2078, alcance: 'exclusiva', justificativa: 'Formação continuada dos profissionais que atendem os estudantes.' },
      { codigo: 2050, alcance: 'ampliada', justificativa: 'Apoio à prática esportiva — escolinhas e competições estudantis.' },
      { codigo: 1021, alcance: 'ampliada', justificativa: 'Equipamentos esportivos usados pelas escolas e pelos projetos de contraturno.' },
      { codigo: 2064, alcance: 'ampliada', justificativa: 'Eventos culturais com programação e acesso para o público infantojuvenil.' },
    ],
  },
  {
    id: 'convivencia',
    numero: 'III',
    nome: 'Convivência familiar e comunitária',
    baseECA: 'ECA, arts. 19 a 52',
    descricao:
      'Direito de crescer na própria família e na comunidade, com apoio à primeira infância e fortalecimento dos vínculos familiares.',
    tom: 'verde',
    icone: Home,
    metas: ['ASS-03', 'ASS-04'],
    acoes: [
      { codigo: 2066, alcance: 'exclusiva', justificativa: 'Programa Criança Feliz — visitas domiciliares na primeira infância.' },
      { codigo: 2077, alcance: 'ampliada', justificativa: 'Proteção Social Básica — CRAS e serviço de convivência de 0 a 17 anos.' },
      { codigo: 2053, alcance: 'ampliada', justificativa: 'Bolsa Família — condicionalidades de frequência escolar e saúde das crianças.' },
      { codigo: 2055, alcance: 'ampliada', justificativa: 'Gestão do SUAS (IGD) — sustenta o acompanhamento das famílias com crianças.' },
      { codigo: 2059, alcance: 'ampliada', justificativa: 'Benefícios eventuais — auxílio natalidade e apoio em situação de vulnerabilidade.' },
    ],
  },
  {
    id: 'protecao',
    numero: 'IV',
    nome: 'Liberdade, respeito e dignidade',
    baseECA: 'ECA, arts. 15 a 18; arts. 88, 131 a 140',
    descricao:
      'Proteção contra violência, negligência e exploração, e funcionamento dos órgãos de defesa de direitos.',
    tom: 'terracota',
    icone: Scale,
    metas: [],
    acoes: [
      { codigo: 2061, alcance: 'exclusiva', justificativa: 'Conselho Tutelar — órgão de defesa dos direitos da criança e do adolescente.' },
      { codigo: 2032, alcance: 'exclusiva', justificativa: 'Conselho Municipal dos Direitos da Criança e do Adolescente (CMDCA).' },
      { codigo: 2060, alcance: 'ampliada', justificativa: 'Proteção Social Especial — CREAS, que acolhe vítimas de violência e negligência.' },
    ],
    lacuna:
      'Este eixo não tem indicador próprio no Anexo II do PPA. Enquanto não houver, o acompanhamento depende dos relatórios do Conselho Tutelar e do CMDCA.',
  },
  {
    id: 'profissionalizacao',
    numero: 'V',
    nome: 'Profissionalização e proteção no trabalho',
    baseECA: 'ECA, arts. 60 a 69',
    descricao:
      'Direito do adolescente à aprendizagem profissional e à proteção contra o trabalho infantil.',
    tom: 'stone',
    icone: Briefcase,
    metas: [],
    acoes: [],
    lacuna:
      'O PPA 2026–2029 não prevê ação orçamentária nem indicador para este direito. É a principal lacuna da Agenda e deve ser levada à revisão do Plano, pela via do Art. 14 da Lei nº 712/2025.',
  },
];

/* ── Derivados ────────────────────────────────────────────── */

/** Todos os códigos de ação da Agenda, com o eixo e o alcance de cada um. */
export const acoesDaAgenda = eixosDireito.flatMap(e =>
  e.acoes.map(a => ({ ...a, eixoId: e.id, eixoNome: e.nome })),
);

const porCodigo = new Map(acoesDaAgenda.map(a => [a.codigo, a]));
export const acaoDaAgenda = (codigo: number) => porCodigo.get(codigo);
export const naAgenda = (codigo: number) => porCodigo.has(codigo);

export const codigosExclusivos = acoesDaAgenda.filter(a => a.alcance === 'exclusiva').map(a => a.codigo);
export const codigosAmpliados = acoesDaAgenda.filter(a => a.alcance === 'ampliada').map(a => a.codigo);

/** Códigos dos indicadores do PPA que compõem a Agenda. */
export const metasDaAgenda = eixosDireito.flatMap(e => e.metas);

/** Nome oficial da ação, vindo do cadastro de ações orçamentárias. */
export const nomeDaAcao = (codigo: number) => acaoPorCodigo(codigo)?.nome ?? `Ação ${codigo}`;
export const secretariaDaAcao = (codigo: number) => acaoPorCodigo(codigo)?.secretariaId ?? '';

export const agenda = {
  titulo: 'Agenda Transversal da Criança e do Adolescente',
  base: 'Arts. 15 a 17 da Lei Municipal nº 712, de 11/12/2025',
  publicacao: 'Diário Oficial nº 4406, de 11/12/2025',
  metodologia:
    'Eixos organizados pelos capítulos de direitos do Estatuto da Criança e do Adolescente (Lei Federal nº 8.069/1990), conforme determina o Art. 16. Ações classificadas em exclusivas e de alcance ampliado segundo a metodologia do Orçamento Criança e Adolescente (OCA).',
};
