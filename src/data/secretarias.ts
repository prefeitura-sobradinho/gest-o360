import { Briefcase, Calculator, Map, Leaf, Users, FileSignature, BookOpen, HardHat, HeartPulse, Music, Droplets, Landmark, ShieldCheck } from 'lucide-react';
import type { Secretaria } from '@/types';

const ATENDIMENTO = 'Seg. a sex., 8h às 14h';

export const secretarias: Record<string, Secretaria> = {
  gabinete: {
    id: 'gabinete', titulo: 'Gabinete do Prefeito', icone: Briefcase, tom: 'gold', subtitulo: 'Coordenação geral de governo e relação institucional',
    responsavel: 'Joselito Macedo — Chefe de Gabinete', contato: 'gabinetepms@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Decretos publicados em 2026', valor: '34', trend: 'up', delta: '+8 vs 2025' },
      { label: 'Audiências públicas realizadas', valor: '12', trend: 'up', delta: '+4 vs 2025' },
      { label: 'Ouvidoria respondida', valor: '96%', trend: 'up', delta: '+6 p.p.' },
    ],
    destaquesExemplo: [
      { titulo: 'Agenda de Governo 2026', desc: 'Prioridades do primeiro semestre alinhadas às metas do PPA 2026-2029, com acompanhamento mensal por secretaria.' },
      { titulo: 'Posse de Novos Concursados', desc: 'Fim de um hiato de 20 anos: dezenas de servidores empossados para Saúde, Educação e SAAE.' },
      { titulo: 'Diálogos com a Comunidade', desc: 'Visitas semanais às localidades rurais para escuta direta da população e levantamento de demandas.' },
    ],
  },
  fazenda: {
    id: 'fazenda', titulo: 'Administração e Fazenda', icone: Calculator, tom: 'gold', subtitulo: 'Gestão orçamentária, arrecadação e transparência fiscal',
    responsavel: 'Luiz Nery Junior — Secretário', contato: 'fazenda@sobradinho.ba.gov.br', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Orçamento PPA 2026-2029', valor: 'R$ 672,5 Mi', trend: 'neutral', delta: 'Lei Nº 712/2025' },
      { label: 'Execução orçamentária', valor: '38%', trend: 'up', delta: '+12 p.p.' },
      { label: 'Receita própria, var. anual', valor: '+11%', trend: 'up', delta: 'vs 2024' },
    ],
    destaquesExemplo: [
      { titulo: 'PPA 2026-2029 Sancionado', desc: 'Lei Municipal Nº 712/2025 estabelece o planejamento estratégico e orçamentário dos próximos quatro anos.' },
      { titulo: 'Modernização do Fisco Municipal', desc: 'Reestruturação da cobrança de IPTU e ISS com novo cadastro imobiliário digital.' },
      { titulo: 'Transparência Ativa', desc: 'Portal da transparência atualizado conforme exigências da Lei de Acesso à Informação.' },
    ],
  },
  planejamento: {
    id: 'planejamento', titulo: 'Planejamento e Gestão', icone: Map, tom: 'gold', subtitulo: 'Articulação de metas, indicadores e instrumentos de planejamento',
    responsavel: 'Alexandre Deles — Secretário', contato: 'sobradinho.seplan@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Metas do PPA monitoradas', valor: '184', trend: 'neutral', delta: 'Total do PPA' },
      { label: 'Ações concluídas', valor: '142', trend: 'up', delta: '77% do total' },
      { label: 'Ações em execução', valor: '38', trend: 'neutral', delta: '21% do total' },
    ],
    destaquesExemplo: [
      { titulo: 'Sanção do PPA 2026-2029', desc: 'Instrumento central de planejamento da gestão, com 184 metas distribuídas entre as 11 secretarias.' },
      { titulo: 'Painel de Indicadores Municipais', desc: 'Mapeamento de indicadores socioeconômicos para orientar a tomada de decisão.' },
      { titulo: 'Revisão do Plano Diretor', desc: 'Atualização participativa do zoneamento urbano e rural do município.' },
    ],
  },
  agricultura: {
    id: 'agricultura', titulo: 'Agricultura e Meio Ambiente', icone: Leaf, tom: 'verde', subtitulo: 'Apoio à produção rural, segurança alimentar e sustentabilidade',
    responsavel: 'Adilson Rodrigues Ribeiro — Secretário', contato: 'pmsseama.gov.br@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Sacas de milho distribuídas', valor: '1.100', trend: 'up', delta: '+22% vs 2024' },
      { label: 'Toneladas de peixe entregues', valor: '5 t', trend: 'neutral', delta: 'Semana Santa' },
      { label: 'Famílias rurais atendidas', valor: '900+', trend: 'up', delta: '+80 famílias' },
    ],
    destaquesExemplo: [
      { titulo: '1ª Conferência de Desenvolvimento Rural', desc: 'Tema "Do solo à mesa", com foco em agricultura familiar e sustentabilidade no semiárido.' },
      { titulo: 'Programa Peixe na Mesa', desc: 'Distribuição de 5 toneladas de peixe na Semana Santa, agora garantida por Lei Municipal.' },
      { titulo: 'Apoio à Agricultura Familiar', desc: 'Distribuição de sementes, insumos e assistência técnica para produtores da zona rural.' },
    ],
  },
  assistencia: {
    id: 'assistencia', titulo: 'Assistência Social — SEADS', icone: Users, tom: 'terracota', subtitulo: 'Proteção social, segurança alimentar e atenção às famílias',
    responsavel: 'Raimundo Nonato — Secretário', contato: 'seadssob@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Famílias assistidas', valor: '2.800+', trend: 'up', delta: '+200 famílias' },
      { label: 'Reconhecimento nacional', valor: 'Selo FNAS', trend: 'up', delta: '2025' },
      { label: 'Unidades CRAS ativas', valor: '3', trend: 'neutral', delta: 'Em funcionamento' },
    ],
    destaquesExemplo: [
      { titulo: 'Selo FNAS 2025', desc: 'Reconhecimento recebido e oficializado em Brasília pela qualidade da gestão do SUAS.' },
      { titulo: 'Ampliação do Atendimento no CRAS', desc: 'Novo horário estendido e reforço de equipe técnica nas unidades de referência.' },
      { titulo: 'Mutirão do Cadastro Único', desc: 'Atualização cadastral de famílias para acesso a benefícios e programas sociais.' },
    ],
  },
  convenios: {
    id: 'convenios', titulo: 'Secretaria Municipal de Convênios (SECON)', icone: FileSignature, tom: 'verde', subtitulo: 'Captação e gestão de recursos com o Estado, a União e instituições financeiras',
    responsavel: 'Jheny Klay — Secretária', contato: 'gabinetepms@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Convênios ativos', valor: '7', trend: 'up', delta: '+3 em 2025' },
      { label: 'Recursos captados em 2025', valor: 'R$ 18 Mi+', trend: 'up', delta: 'Novos recursos' },
      { label: 'Moradias via Caixa/MCMV', valor: '90', trend: 'neutral', delta: 'Contratadas' },
    ],
    destaquesExemplo: [
      { titulo: 'PRO-RODOVIAS', desc: 'Mobilização e consulta para construção de pontes e correção de estradas vicinais na zona rural.' },
      { titulo: 'Convênio Caixa — Minha Casa Minha Vida', desc: '90 moradias contratadas em parceria com a Caixa Econômica Federal.' },
      { titulo: 'Parceria SEINFRA — BA-316', desc: 'Convênio com o Governo do Estado para requalificação asfáltica da rodovia.' },
    ],
  },
  educacao: {
    id: 'educacao', titulo: 'Educação', icone: BookOpen, tom: 'azul', subtitulo: 'Infraestrutura escolar, aprendizagem e acesso',
    responsavel: 'Ducilene Kestering — Secretária', contato: 'sec.educ.sobradinho@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Investimento 2025', valor: 'R$ 7,1 Mi+', trend: 'up', delta: '+15% vs 2024' },
      { label: 'Escola Maria Ribeiro', valor: '90% obra', trend: 'up', delta: 'Em conclusão' },
      { label: 'Alunos na rede municipal', valor: '4.200+', trend: 'up', delta: '+180 matrículas' },
    ],
    destaquesExemplo: [
      { titulo: 'Escola Maria Ribeiro', desc: 'Obra de reconstrução atingiu 90% de conclusão, com entrega prevista para o próximo semestre.' },
      { titulo: 'Alfabetização na Idade Certa', desc: 'Programa de reforço pedagógico para garantir alfabetização até o 2º ano.' },
      { titulo: 'Transporte Escolar Rural', desc: 'Ampliação de rotas para atender comunidades mais distantes da zona rural.' },
    ],
  },
  infra: {
    id: 'infra', titulo: 'Infraestrutura e Serviços Públicos', icone: HardHat, tom: 'terracota', subtitulo: 'Mobilidade, obras públicas e requalificação urbana',
    responsavel: 'Jarques Canturil — Vice-Prefeito e Sec. de Infra', contato: '(74) 9 9958-0501', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Investido em quadras', valor: 'R$ 872 Mil', trend: 'neutral', delta: 'Concluído' },
      { label: 'BA-316', valor: 'Em execução', trend: 'up', delta: 'Iniciado 2025' },
      { label: 'Estradas vicinais em consulta', valor: '14', trend: 'neutral', delta: 'PRO-RODOVIAS' },
    ],
    destaquesExemplo: [
      { titulo: 'BA-316 (Sobradinho - Casa Nova)', desc: 'Requalificação asfáltica iniciada em parceria com a SEINFRA e o Governo do Estado.' },
      { titulo: 'PRO-RODOVIAS', desc: 'Mobilização e consulta para construção de pontes e correção de estradas vicinais na zona rural.' },
      { titulo: 'Quadras Poliesportivas', desc: 'Requalificação do espaço Francisco Wellington M. Santos, com R$ 872 mil investidos.' },
    ],
  },
  saude: {
    id: 'saude', titulo: 'Saúde — SMS', icone: HeartPulse, tom: 'azul', subtitulo: 'Atenção básica, urgência e vigilância em saúde',
    responsavel: 'Josefa Moreira — Secretária', contato: 'saudepms@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Atendimentos no período', valor: '15.000+', trend: 'up', delta: '+12% vs 2024' },
      { label: 'Atendimentos de urgência', valor: '5.900+', trend: 'up', delta: 'Ampliação de plantões' },
      { label: 'Equipes de Saúde da Família', valor: '9', trend: 'up', delta: '+2 equipes' },
    ],
    destaquesExemplo: [
      { titulo: 'Reforço da Urgência e Emergência', desc: 'Atendimentos de urgência ultrapassaram 5.900 no período, com ampliação de plantões.' },
      { titulo: 'Postos de Saúde Rural', desc: 'Ampliação de horários e equipe técnica em unidades da zona rural.' },
      { titulo: 'Programa Saúde da Família', desc: 'Expansão de equipes para cobertura territorial mais ampla do município.' },
    ],
  },
  setuc: {
    id: 'setuc', titulo: 'Turismo, Esporte e Cultura', icone: Music, tom: 'vinho', subtitulo: 'Identidade cultural, lazer e desenvolvimento turístico do Lago de Sobradinho',
    responsavel: 'Patrick Carvalho — Secretário (SETUC)', contato: 'setucpms@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Impacto econômico do Forró', valor: 'R$ 10 Mi+', trend: 'up', delta: 'Maior edição' },
      { label: 'Edição do Forró do Vaqueiro', valor: '21ª', trend: 'neutral', delta: 'Outubro 2025' },
      { label: 'Quadras requalificadas', valor: '1', trend: 'neutral', delta: 'R$ 872 Mil' },
    ],
    destaquesExemplo: [
      { titulo: '21º Forró do Vaqueiro', desc: 'Maior edição da história do evento, com mais de R$ 10 milhões injetados na economia local.' },
      { titulo: 'Quadras Poliesportivas', desc: 'Requalificação do espaço Francisco Wellington M. Santos para prática esportiva comunitária.' },
      { titulo: 'Turismo do Lago de Sobradinho', desc: 'Estruturação de roteiros e apoio a empreendedores do turismo náutico e rural.' },
    ],
  },
  saae: {
    id: 'saae', titulo: 'SAAE — Água e Esgoto', icone: Droplets, tom: 'azul', subtitulo: 'Abastecimento de água e saneamento básico',
    responsavel: 'Domingos Vieira — Diretor Geral', contato: 'saaesobradinho@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [
      { label: 'Cobertura de abastecimento', valor: '87%', trend: 'up', delta: '+3 p.p.' },
      { label: 'Ligações de esgoto novas', valor: '340', trend: 'up', delta: 'Em 2025' },
      { label: 'Redução de perdas', valor: '-6 p.p.', trend: 'up', delta: 'Macromedição' },
    ],
    destaquesExemplo: [
      { titulo: 'Modernização do Abastecimento', desc: 'Substituição de redes antigas e instalação de hidrômetros em bairros centrais.' },
      { titulo: 'Ampliação da Rede de Esgoto', desc: 'Extensão da coleta para novos loteamentos e zona de expansão urbana.' },
      { titulo: 'Combate a Perdas', desc: 'Programa de monitoramento de vazamentos com redução já registrada na macromedição.' },
    ],
  },
  camara: {
    id: 'camara', titulo: 'Câmara Municipal de Vereadores', icone: Landmark, tom: 'stone', subtitulo: 'Produção normativa, fiscalização e representação social',
    responsavel: 'Câmara Municipal de Vereadores', contato: 'contato@camarasobradinho.ba.gov.br', atendimento: ATENDIMENTO,
    kpisExemplo: [], destaquesExemplo: [],
  },
  controladoria: {
    id: 'controladoria', titulo: 'Controladoria Geral Interna', icone: ShieldCheck, tom: 'vinho', subtitulo: 'Controle interno, procuradoria e encargos do município',
    responsavel: 'Controladoria Geral Interna', contato: 'procuradorpms@gmail.com', atendimento: ATENDIMENTO,
    kpisExemplo: [], destaquesExemplo: [],
  },
};

export const secretariaPorId = (id: string): Secretaria | undefined => secretarias[id];
