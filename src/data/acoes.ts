/**
 * Ações orçamentárias do município, como aparecem no Portal da Transparência
 * (campo CD_ACAO das despesas), vinculadas aos programas do PPA 2026–2029.
 *
 * O vínculo ação → programa segue o Anexo II do PPA. Quando a ação é de
 * manutenção de uma secretaria, ela foi atribuída ao programa temático da
 * pasta, que é a leitura mais útil para o gestor — ajuste aqui se a
 * Contabilidade classificar de outra forma.
 */
export interface Acao {
  codigo: number;
  nome: string;
  programaId: string;
  secretariaId: string;
}

export const acoes: Acao[] = [
  // ── Educação ──
  { codigo: 1001, nome: 'Construção, manutenção e ampliação de unidades escolares, creches e aquisição de mobiliário', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 1028, nome: 'Apoio ao ensino de níveis tecnológicos e superiores', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 2011, nome: 'Gestão do Programa Nacional de Alimentação Escolar', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 2013, nome: 'Manutenção das atividades administrativas da Secretaria de Educação', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 2014, nome: 'Manutenção do transporte escolar', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 2016, nome: 'Manutenção do ensino básico', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 2018, nome: 'Manutenção do ensino fundamental', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 2088, nome: 'Manutenção do ensino infantil', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 1004, nome: 'Construção de quadras poliesportivas, bibliotecas, refeitórios, auditórios e outros', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 2078, nome: 'Formação continuada dos profissionais de educação', programaId: 'educacao-basica', secretariaId: 'educacao' },
  { codigo: 2083, nome: 'Gestão dos recursos da educação — precatório do FUNDEF', programaId: 'educacao-basica', secretariaId: 'educacao' },

  // ── Saúde ──
  { codigo: 1007, nome: 'Construção, reforma, manutenção e ampliação de unidades básicas de saúde', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2021, nome: 'Ações de assistência hospitalar e ambulatorial — Hospital Municipal', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2023, nome: 'Gestão das ações do Fundo Municipal de Saúde', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2024, nome: 'Gestão das ações de tratamento fora do município', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2025, nome: 'Incentivo financeiro da APS — capitação ponderada', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2026, nome: 'Gestão do Programa de Assistência Farmacêutica', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2027, nome: 'Incentivo financeiro da APS — desempenho', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2028, nome: 'Gestão das ações de vigilância epidemiológica', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2051, nome: 'Média e alta complexidade — MAC (SAMU, CAPS, TFD)', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2074, nome: 'Manutenção do bloco da gestão do SUS', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2079, nome: 'Consórcio Público Interfederativo de Saúde da região de Juazeiro', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2080, nome: 'Assistência hospitalar e ambulatorial — especialidades', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2084, nome: 'Gestão das ações de vigilância sanitária', programaId: 'saude-qualidade', secretariaId: 'saude' },
  { codigo: 2086, nome: 'Gestão e promoção da vigilância em saúde', programaId: 'saude-qualidade', secretariaId: 'saude' },

  // ── Assistência Social ──
  { codigo: 1023, nome: 'Distribuição de leite para famílias carentes', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2029, nome: 'Manutenção da Secretaria Municipal de Assistência e Desenvolvimento Social', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2030, nome: 'Manutenção do Fundo Municipal de Assistência Social', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2053, nome: 'Gestão descentralizada do Programa Bolsa Família', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2055, nome: 'Aprimoramento da gestão do SUAS — IGD', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2059, nome: 'Manutenção do programa de benefícios eventuais', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2060, nome: 'Bloco Proteção Social Especial — PSE', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2061, nome: 'Manutenção do Conselho Tutelar', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2066, nome: 'Programa Criança Feliz', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2077, nome: 'Bloco Proteção Social Básica — PSB', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 1019, nome: 'Programa de melhoria habitacional', programaId: 'politicas-sociais', secretariaId: 'assistencia' },
  { codigo: 2032, nome: 'Gestão das ações do Conselho da Criança e do Adolescente', programaId: 'politicas-sociais', secretariaId: 'assistencia' },

  // ── Infraestrutura ──
  { codigo: 1026, nome: 'Construção, manutenção e recuperação de praças, pavimentações, ciclovias e bens de uso comum', programaId: 'cidade-humanizada', secretariaId: 'infra' },
  { codigo: 2033, nome: 'Manutenção da Secretaria Municipal de Infraestrutura e Serviços Públicos', programaId: 'cidade-humanizada', secretariaId: 'infra' },
  { codigo: 2035, nome: 'Gestão dos serviços de iluminação pública', programaId: 'cidade-humanizada', secretariaId: 'infra' },
  { codigo: 2034, nome: 'Gestão dos serviços de coleta e limpeza pública', programaId: 'cidade-humanizada', secretariaId: 'infra' },

  // ── Agricultura e Meio Ambiente ──
  { codigo: 1012, nome: 'Modernização de sistemas de irrigação para comunidades rurais', programaId: 'extensao-rural', secretariaId: 'agricultura' },
  { codigo: 2036, nome: 'Manutenção da Secretaria Municipal de Agricultura', programaId: 'extensao-rural', secretariaId: 'agricultura' },
  { codigo: 2038, nome: 'Apoio às organizações de produção de psicultura, pecuária e agrícola', programaId: 'extensao-rural', secretariaId: 'agricultura' },
  { codigo: 1024, nome: 'Reforma e ampliação do Mercado Municipal', programaId: 'extensao-rural', secretariaId: 'agricultura' },
  { codigo: 2056, nome: 'Gestão das ações do Fundo Municipal de Meio Ambiente', programaId: 'extensao-rural', secretariaId: 'agricultura' },

  // ── Turismo, Cultura e Esporte ──
  { codigo: 1021, nome: 'Construção, ampliação, manutenção e reforma de equipamentos esportivos', programaId: 'cultura-turismo-esporte', secretariaId: 'setuc' },
  { codigo: 2020, nome: 'Gestão das ações administrativas da Secretaria de Turismo, Cultura e Esportes', programaId: 'cultura-turismo-esporte', secretariaId: 'setuc' },
  { codigo: 2050, nome: 'Apoio e incentivo à prática esportiva', programaId: 'cultura-turismo-esporte', secretariaId: 'setuc' },
  { codigo: 2064, nome: 'Gerenciamento de eventos culturais', programaId: 'cultura-turismo-esporte', secretariaId: 'setuc' },

  // ── Gabinete, Fazenda e Administração ──
  { codigo: 2003, nome: 'Gestão das ações de comunicação e relação social', programaId: 'qualidade-administrativa', secretariaId: 'gabinete' },
  { codigo: 2004, nome: 'Manutenção do Gabinete do Prefeito', programaId: 'qualidade-administrativa', secretariaId: 'gabinete' },
  { codigo: 2010, nome: 'Secretaria de Fazenda e Administração', programaId: 'qualidade-administrativa', secretariaId: 'fazenda' },
  { codigo: 2022, nome: 'Consórcio de Desenvolvimento Sustentável do Território do Sertão do São Francisco — CONSTESF', programaId: 'qualidade-administrativa', secretariaId: 'gabinete' },

  // ── Convênios ──
  { codigo: 2070, nome: 'Manutenção da Secretaria Municipal de Convênios', programaId: 'qualidade-administrativa', secretariaId: 'convenios' },

  // ── Planejamento ──
  { codigo: 2008, nome: 'Manutenção da Secretaria Municipal de Planejamento e Gestão', programaId: 'cidade-organizada-gestao', secretariaId: 'planejamento' },

  // ── Procuradoria, Controladoria e Encargos ──
  { codigo: 2005, nome: 'Gestão das ações da Procuradoria Geral do Município', programaId: 'inova-sobradinho', secretariaId: 'controladoria' },
  { codigo: 2006, nome: 'Manutenção da Controladoria Geral do Município', programaId: 'inova-sobradinho', secretariaId: 'controladoria' },
  { codigo: 2012, nome: 'Amortização da dívida fundada', programaId: 'encargos', secretariaId: 'controladoria' },
  { codigo: 2049, nome: 'Outros encargos gerais e especiais', programaId: 'encargos', secretariaId: 'controladoria' },
];

const porCodigo = new Map(acoes.map(a => [a.codigo, a]));
export const acaoPorCodigo = (codigo: number) => porCodigo.get(codigo);
