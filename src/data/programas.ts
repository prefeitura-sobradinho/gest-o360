import type { Programa } from '@/types';

/**
 * Os 13 programas do PPA 2026–2029, extraídos do Anexo II (Plano Plurianual — Espelho)
 * publicado no Diário Oficial nº 4406, de 11 de dezembro de 2025.
 * A soma dos recursos é R$ 672.577.000,00, igual à receita total do Anexo I.
 */
export const programas: Programa[] = [
  {
    id: 'acao-legislativa', nome: 'Ação Legislativa', nomeCurto: 'Ação Legislativa', eixoId: 'legislativo', areaTematica: 'Ação Legislativa',
    objetivo: 'Proporcionar a produção de normas adequadas à realidade política, social e econômica da sociedade; avaliar a execução das políticas públicas; definir as diretrizes do planejamento estratégico da Câmara Municipal; divulgar os trabalhos realizados e incentivar a participação popular.',
    recurso: 27_082_440, unidadeResponsavel: 'Câmara Municipal de Vereadores', secretariaId: 'camara', ods: ['ODS 16'], pagina: 10,
    notaExecucao: 'A Câmara Municipal é unidade gestora própria e presta contas separadamente; suas despesas não constam no portal do Executivo.',
  },
  {
    id: 'educacao-basica', nome: 'Educação Básica de Qualidade Social com Equidade', nomeCurto: 'Educação Básica', eixoId: 'social', areaTematica: 'Educação',
    objetivo: 'Implementar e executar políticas públicas educacionais que garantam o desenvolvimento intelectual, cognitivo, físico, social e emocional de crianças, adolescentes, jovens, adultos e idosos, assegurando acesso, permanência e aprendizagem.',
    recurso: 265_296_000, unidadeResponsavel: 'Fundo Municipal de Educação', secretariaId: 'educacao', ods: ['ODS 4', 'ODS 10'], pagina: 11,
  },
  {
    id: 'saude-qualidade', nome: 'Saúde de Qualidade para Garantia da Vida e da Longevidade', nomeCurto: 'Saúde', eixoId: 'social', areaTematica: 'Saúde',
    objetivo: 'Promover o cuidado integral ao ser humano no curso da vida, considerando a implantação de serviços que atendam às necessidades das políticas em saúde no âmbito do SUS.',
    recurso: 113_120_000, unidadeResponsavel: 'Fundo Municipal de Saúde', secretariaId: 'saude', ods: ['ODS 3', 'ODS 6'], pagina: 22,
  },
  {
    id: 'politicas-sociais', nome: 'Fortalecimento das Políticas Sociais, Cidadania e Direitos Humanos', nomeCurto: 'Assistência Social', eixoId: 'social', areaTematica: 'Assistência Social',
    objetivo: 'Combater a pobreza e a extrema pobreza no município, contribuindo para a redução de desigualdades sociais e promover a proteção social da população em situação de vulnerabilidade e risco social.',
    recurso: 15_414_000, unidadeResponsavel: 'Secretaria Munic. de Assist. e Desenvolv. Social', secretariaId: 'assistencia', ods: ['ODS 1', 'ODS 10'], pagina: 28,
  },
  {
    id: 'cidade-organizada-gestao', nome: 'Cidade Organizada: Gestão Moderna e Transparente', nomeCurto: 'Planejamento Urbano', eixoId: 'gestao', areaTematica: 'Planejamento',
    objetivo: 'Acompanhar, avaliar, fiscalizar e controlar o desempenho dos órgãos, entidades e programas da administração pública, visando melhorar a eficiência, eficácia e efetividade na utilização dos recursos públicos.',
    recurso: 2_036_000, unidadeResponsavel: 'Secretaria Mun. de Planej. e Gestão Urbanística', secretariaId: 'planejamento', ods: ['ODS 9', 'ODS 11'], pagina: 31,
  },
  {
    id: 'inova-sobradinho', nome: 'Inova Sobradinho — Modernização Administrativa e Estratégica', nomeCurto: 'Inova Sobradinho', eixoId: 'gestao', areaTematica: 'Administração',
    objetivo: 'Otimizar a Procuradoria Geral do Município com instrumentos facilitadores das suas atribuições de representação, consultoria e assessoramento das atividades jurídicas.',
    recurso: 3_024_000, unidadeResponsavel: 'Controladoria Geral Interna', secretariaId: 'controladoria', ods: ['ODS 16', 'ODS 17'], pagina: 32,
  },
  {
    id: 'qualidade-administrativa', nome: 'Qualidade Administrativa, Financeira, Fazendária e de Empreendedorismo', nomeCurto: 'Fazenda e Administração', eixoId: 'gestao', areaTematica: 'Administração',
    objetivo: 'Dar apoio aos órgãos da administração pública na gestão dos recursos humanos, administrativos, financeiros e de empreendedorismo, proporcionando uma gestão de qualidade, eficiência e eficácia.',
    recurso: 52_636_000, unidadeResponsavel: 'Secretaria Municipal da Fazenda e Administração', secretariaId: 'fazenda', ods: ['ODS 16', 'ODS 17'], pagina: 34,
  },
  {
    id: 'encargos', nome: 'Encargos e Operações do Município', nomeCurto: 'Encargos do Município', eixoId: 'gestao', areaTematica: 'Encargos Especiais',
    objetivo: 'Garantir o pagamento das despesas em relação às quais não se pode associar um bem ou serviço a ser gerado no processo produtivo corrente, tais como dívidas, ressarcimentos e indenizações.',
    recurso: 31_424_000, unidadeResponsavel: 'Controladoria Geral Interna', secretariaId: 'controladoria', ods: [], pagina: 36,
  },
  {
    id: 'cultura-turismo-esporte', nome: 'Cultura Identidade, Turismo Sustentável e Esporte Inclusivo', nomeCurto: 'Cultura, Turismo e Esporte', eixoId: 'economico', areaTematica: 'Turismo, Cultura e Esporte',
    objetivo: 'Promover o esporte e o lazer como direitos constitucionais, contribuindo para a melhoria da qualidade de vida e para o desenvolvimento humano, e gerir a infraestrutura necessária ao desenvolvimento do esporte e lazer.',
    recurso: 30_853_560, unidadeResponsavel: 'Secretaria Munic. de Turismo, Cultura e Esportes', secretariaId: 'setuc', ods: ['ODS 3', 'ODS 4', 'ODS 5', 'ODS 8', 'ODS 10', 'ODS 11'], pagina: 37,
  },
  {
    id: 'cidade-humanizada', nome: 'Cidade Organizada e Humanizada e Mais Eficiente', nomeCurto: 'Infraestrutura Urbana', eixoId: 'territorial', areaTematica: 'Infraestrutura',
    objetivo: 'Garantir ampliação e melhoria permanente da qualidade dos serviços públicos prestados à população com eficiência e sustentabilidade.',
    recurso: 46_392_000, unidadeResponsavel: 'Secretaria Munic. Infraestrutura e Serviços Públicos', secretariaId: 'infra', ods: ['ODS 11', 'ODS 16'], pagina: 40,
  },
  {
    id: 'extensao-rural', nome: 'Extensão Rural para o Desenvolvimento Sustentável e Preservação do Patrimônio Ambiental', nomeCurto: 'Extensão Rural', eixoId: 'territorial', areaTematica: 'Agricultura',
    objetivo: 'Promover o desenvolvimento rural sustentável do município, conjugando o desenvolvimento econômico, a promoção da cidadania e a preservação do meio ambiente.',
    recurso: 14_690_000, unidadeResponsavel: 'Sec. Municipal de Agricultura e Meio Ambiente', secretariaId: 'agricultura', ods: ['ODS 2', 'ODS 6', 'ODS 7', 'ODS 11', 'ODS 12', 'ODS 13', 'ODS 15'], pagina: 42,
  },
  {
    id: 'agua-saneamento', nome: 'Água de Qualidade e Saneamento Básico para o Município de Sobradinho', nomeCurto: 'Água e Saneamento', eixoId: 'agua', areaTematica: 'Água e Saneamento',
    objetivo: 'Garantir água de qualidade e saneamento básico para a população da sede e do interior.',
    recurso: 24_333_000, unidadeResponsavel: 'Serviço Autônomo de Água e Esgoto — SAAE', secretariaId: 'saae', ods: ['ODS 6'], pagina: 46,
    notaExecucao: 'O SAAE é autarquia com contabilidade própria; suas despesas não constam no portal do Executivo.',
  },
  {
    // O eixo VII é coordenado pela Secretaria Municipal de Convênios (SECONV), que executa a captação
    // de recursos. No espelho do PPA (pág. 48) a unidade responsável foi impressa como SEPLAN; a SECONV
    // aparece no documento na ação "Manutenção da Secretaria Municipal de Convênios" (pág. 35).
    id: 'infra-urbanistica', nome: 'Infraestrutura e Gestão Urbanística', nomeCurto: 'Gestão Urbanística', eixoId: 'convenios', areaTematica: 'Infraestrutura e Gestão Urbanística',
    objetivo: 'Proporcionar o desenvolvimento da cidade por meio de obras estruturantes com a captação dos recursos estaduais, federais e emenda parlamentar.',
    recurso: 46_276_000, unidadeResponsavel: 'Secretaria Municipal de Convênios (SECONV)', secretariaId: 'convenios', ods: ['ODS 11', 'ODS 16'], pagina: 48,
    notaExecucao: 'As obras captadas por convênio são empenhadas nas ações das secretarias que as executam; a ação própria da SECONV (2070) está classificada no programa de Qualidade Administrativa.',
  },
];

export const programaPorId = (id?: string) => programas.find(p => p.id === id);
export const programasDoEixo = (eixoId: string) => programas.filter(p => p.eixoId === eixoId);
export const programasDaSecretaria = (secretariaId: string) => programas.filter(p => p.secretariaId === secretariaId);

/** Recurso total do eixo, somando seus programas. */
export const recursoDoEixo = (eixoId: string) => programasDoEixo(eixoId).reduce((a, p) => a + p.recurso, 0);

export const recursoTotal = programas.reduce((a, p) => a + p.recurso, 0);
