import type { AcaoPPA } from '@/types';

/**
 * As 99 Ações do PPA 2026–2029, transcritas do Anexo II (Plano Plurianual — Espelho),
 * Diário Oficial nº 4406, de 11 de dezembro de 2025, páginas 10 a 49.
 *
 * O espelho é publicado como imagem, sem camada de texto, então os nomes foram lidos
 * por reconhecimento óptico coluna a coluna e conferidos contra as páginas do Diário.
 * As abreviações do original ("CONST.", "MANUT.", "SEC.") foram escritas por extenso
 * para leitura; o resto do texto é o do documento.
 *
 * Campos:
 *   regiao   — regionalização declarada no espelho. `null` quando a célula está em
 *              branco no documento oficial (acontece em 4 ações).
 *   produto  — produto declarado. O espelho traz "AÇÃO REALIZADA" em 84 das 99.
 *   codigo   — ação orçamentária correspondente no Portal da Transparência, quando
 *              existe. 38 ações planejadas no PPA não têm execução no portal.
 *   repetida — a mesma ação aparece duas vezes no espelho.
 */
export const acoesPPA: AcaoPPA[] = [
  { id: 'manutencao-dos-servicos-tecnicos-e-administrat-1', nome: 'Manutenção dos Serviços Técnicos e Administrativos da Câmara Municipal', programaId: 'acao-legislativa', regiao: 'sede', pagina: 10, produto: 'Ação realizada' },
  { id: 'reforma-e-ampliacao-do-predio-da-camara-2', nome: 'Reforma e Ampliação do Prédio da Câmara', programaId: 'acao-legislativa', regiao: 'sede', pagina: 10, produto: 'Obra realizada' },
  { id: 'gestao-do-controle-interno-3', nome: 'Gestão do Controle Interno', programaId: 'acao-legislativa', regiao: 'todo', pagina: 10, produto: 'Ação realizada' },
  { id: 'manutencao-do-ensino-infantil-4', nome: 'Manutenção do Ensino Infantil', programaId: 'educacao-basica', regiao: 'todo', pagina: 19, produto: 'Ação realizada', codigo: 2088 },
  { id: 'gestao-do-programa-nacional-de-alimentacao-esc-5', nome: 'Gestão do Programa Nacional de Alimentação Escolar', programaId: 'educacao-basica', regiao: 'todo', pagina: 19, produto: 'Ação realizada', codigo: 2011 },
  { id: 'manutencao-do-transporte-escolar-6', nome: 'Manutenção do Transporte Escolar', programaId: 'educacao-basica', regiao: 'todo', pagina: 19, produto: 'Ação realizada', codigo: 2014 },
  { id: 'manutencao-das-atividades-administrativas-da-s-7', nome: 'Manutenção das Atividades Administrativas da Secretaria de Educação', programaId: 'educacao-basica', regiao: 'todo', pagina: 19, produto: 'Ação realizada', codigo: 2013 },
  { id: 'manutencao-do-ensino-fundamental-8', nome: 'Manutenção do Ensino Fundamental', programaId: 'educacao-basica', regiao: 'todo', pagina: 19, codigo: 2018 },
  { id: 'apoio-ao-ensino-de-niveis-tecnologicos-e-super-9', nome: 'Apoio ao Ensino de Níveis Tecnológicos e Superiores', programaId: 'educacao-basica', regiao: 'todo', pagina: 20, produto: 'Alunos atendidos', codigo: 1028 },
  { id: 'gestao-dos-programas-do-fnde-10', nome: 'Gestão dos Programas do FNDE', programaId: 'educacao-basica', regiao: 'todo', pagina: 20, produto: 'Ação realizada' },
  { id: 'gestao-e-manutencao-do-programa-universidade-p-11', nome: 'Gestão e Manutenção do Programa Universidade para Todos (UPT)', programaId: 'educacao-basica', regiao: 'todo', pagina: 20, produto: 'Ação realizada' },
  { id: 'const-manut-e-ampliacao-de-unid-escolares-crec-12', nome: 'Construção Manutenção e Ampliação de Unidades Escolares, Creches e Aquisição de Mobiliários', programaId: 'educacao-basica', regiao: 'sede', pagina: 20, produto: 'Móveis adquiridos', codigo: 1001 },
  { id: 'construcao-de-quadras-poliesportivas-bibliotec-13', nome: 'Construção de Quadras Poliesportivas, Bibliotecas, Refeitórios, Auditórios e Outros', programaId: 'educacao-basica', regiao: 'sede', pagina: 20, produto: 'Obra realizada', codigo: 1004 },
  { id: 'manutencao-do-ensino-basico-14', nome: 'Manutenção do Ensino Básico', programaId: 'educacao-basica', regiao: 'todo', pagina: 20, produto: 'Ação realizada', codigo: 2016 },
  { id: 'manutencao-dos-conselhos-municipais-de-educaca-15', nome: 'Manutenção dos Conselhos Municipais de Educação', programaId: 'educacao-basica', regiao: 'todo', pagina: 20, produto: 'Ação realizada' },
  { id: 'formacao-continuada-dos-profissionais-de-educa-16', nome: 'Formação Continuada dos Profissionais de Educação', programaId: 'educacao-basica', regiao: 'todo', pagina: 20, codigo: 2078 },
  { id: 'gestao-dos-recursos-da-educacao-precatorio-do--17', nome: 'Gestão dos Recursos da Educação - Precatório do FUNDEF', programaId: 'educacao-basica', regiao: 'todo', pagina: 21, produto: 'Ação realizada', codigo: 2083 },
  { id: 'gestao-das-acoes-de-media-e-alta-complexidade--18', nome: 'Gestão das Ações de Média e Alta Complexidade - MAC (SAMU, CAPS, TFD)', programaId: 'saude-qualidade', regiao: 'todo', pagina: 25, produto: 'Ação realizada', codigo: 2051 },
  { id: 'gestao-das-acoes-de-vigilancia-epidemiologica-19', nome: 'Gestão das Ações de Vigilância Epidemiológica', programaId: 'saude-qualidade', regiao: 'todo', pagina: 25, produto: 'Ação realizada', codigo: 2028 },
  { id: 'gestao-das-acoes-de-incentivo-financeiro-da-ap-20', nome: 'Gestão das Ações de Incentivo Financeiro da APS - Capitação Ponderada', programaId: 'saude-qualidade', regiao: 'todo', pagina: 25, produto: 'Ação realizada', codigo: 2025 },
  { id: 'gestao-do-programa-de-assistencia-farmaceutica-21', nome: 'Gestão do Programa de Assistência Farmacêutica', programaId: 'saude-qualidade', regiao: 'todo', pagina: 25, produto: 'Ação realizada', codigo: 2026 },
  { id: 'const-ref-manut-e-ampliacao-de-unidades-basica-22', nome: 'Construção, Reforma, Manutenção, e Ampliação de Unidades Básicas de Saúde, Academia Saúde, Centros e Outros', programaId: 'saude-qualidade', regiao: 'sede', pagina: 26, produto: 'Obra realizada', codigo: 1007 },
  { id: 'gestao-das-acoes-do-fundo-municipal-de-saude-23', nome: 'Gestão das Ações do Fundo Municipal de Saúde', programaId: 'saude-qualidade', regiao: 'todo', pagina: 26, produto: 'Ação realizada', codigo: 2023 },
  { id: 'acoes-de-assistencia-hospitalar-e-ambulatorial-24', nome: 'Ações de Assistência Hospitalar e Ambulatorial - Hospital Municipal MAC', programaId: 'saude-qualidade', regiao: 'todo', pagina: 26, produto: 'Ação realizada', codigo: 2021 },
  { id: 'manutencao-do-conselho-municipal-de-saude-25', nome: 'Manutenção do Conselho Municipal de Saúde', programaId: 'saude-qualidade', regiao: 'todo', pagina: 26, produto: 'Ação realizada' },
  { id: 'gestao-das-acoes-de-incentivo-financeiro-da-ap-26', nome: 'Gestão das Ações de Incentivo Financeiro da APS - Desempenho', programaId: 'saude-qualidade', regiao: 'todo', pagina: 26, produto: 'Ação realizada', codigo: 2027 },
  { id: 'gestao-das-acoes-de-tratamento-fora-do-municip-27', nome: 'Gestão das Ações de Tratamento Fora do Município', programaId: 'saude-qualidade', regiao: 'todo', pagina: 26, produto: 'Ação realizada', codigo: 2024 },
  { id: 'manutencao-do-bloco-da-gestao-do-sus-28', nome: 'Manutenção do Bloco da Gestão do SUS', programaId: 'saude-qualidade', regiao: 'todo', pagina: 26, produto: 'Ação realizada', codigo: 2074 },
  { id: 'consorcio-publico-interfederativo-de-saude-da--29', nome: 'Consórcio Público Interfederativo de Saúde da Região de Juazeiro', programaId: 'saude-qualidade', regiao: 'todo', pagina: 26, produto: 'Ação realizada', codigo: 2079 },
  { id: 'acoes-de-assist-hospitalar-e-ambulatorial-espe-30', nome: 'Ações de Assistência Hospitalar e Ambulatorial Especialidades MAC', programaId: 'saude-qualidade', regiao: 'todo', pagina: 26, codigo: 2080 },
  { id: 'incentivo-para-acoes-estrategicas-31', nome: 'Incentivo para Ações Estratégicas', programaId: 'saude-qualidade', regiao: 'todo', pagina: 27, produto: 'Ação realizada' },
  { id: 'gestao-das-acoes-de-vigilancia-sanitaria-32', nome: 'Gestão das Ações de Vigilância Sanitária', programaId: 'saude-qualidade', regiao: 'todo', pagina: 27, produto: 'Ação realizada', codigo: 2084 },
  { id: 'enfrentamento-da-emergencial-e-combate-a-pande-33', nome: 'Enfrentamento da Emergência e Combate a Pandemias', programaId: 'saude-qualidade', regiao: 'todo', pagina: 27, produto: 'Ação realizada' },
  { id: 'gestao-e-promocao-da-vigilancia-em-saude-34', nome: 'Gestão e Promoção da Vigilância em Saúde', programaId: 'saude-qualidade', regiao: 'todo', pagina: 27, produto: 'Ação realizada', codigo: 2086 },
  { id: 'manutencao-do-bloco-da-atencao-primaria-35', nome: 'Manutenção do Bloco da Atenção Primária', programaId: 'saude-qualidade', regiao: 'todo', pagina: 27, produto: 'Ação realizada' },
  { id: 'gestao-das-acoes-de-outros-program-fundo-a-fun-36', nome: 'Gestão das Ações de Outros Programas Fundo a Fundo', programaId: 'saude-qualidade', regiao: 'todo', pagina: 27, produto: 'Ação realizada' },
  { id: 'aprimoramento-da-gestao-do-suas-igd-37', nome: 'Aprimoramento da Gestão do SUAS-IGD', programaId: 'politicas-sociais', regiao: 'todo', pagina: 28, produto: 'Ação realizada', codigo: 2055 },
  { id: 'manutencao-programa-beneficios-eventuais-38', nome: 'Manutenção Programa Benefícios Eventuais', programaId: 'politicas-sociais', regiao: 'todo', pagina: 28, produto: 'Ação realizada', codigo: 2059 },
  { id: 'programa-de-melhoria-habitacional-39', nome: 'Programa de Melhoria Habitacional', programaId: 'politicas-sociais', regiao: 'sede', pagina: 28, produto: 'Ação realizada', codigo: 1019 },
  { id: 'bloco-de-protecao-social-especial-40', nome: 'Bloco de Proteção Social Especial', programaId: 'politicas-sociais', regiao: 'todo', pagina: 29, produto: 'Ação realizada', codigo: 2060 },
  { id: 'distribuicao-de-leite-para-familias-carentes-41', nome: 'Distribuição de Leite para Famílias Carentes', programaId: 'politicas-sociais', regiao: 'sede', pagina: 29, produto: 'Ação realizada', codigo: 1023 },
  { id: 'fortalecimento-do-controle-sociac-cmas-42', nome: 'Fortalecimento do Controle Social (CMAS)', programaId: 'politicas-sociais', regiao: 'todo', pagina: 29, produto: 'Ação realizada' },
  { id: 'bloco-protecao-social-especial-pse-43', nome: 'Bloco Proteção Social Especial - PSE', programaId: 'politicas-sociais', regiao: 'todo', pagina: 29, produto: 'Ação realizada', codigo: 2060, repetida: true },
  { id: 'gestao-descentralizada-do-programa-bolsa-famil-44', nome: 'Gestão Descentralizada do Programa Bolsa Família', programaId: 'politicas-sociais', regiao: 'todo', pagina: 29, produto: 'Ação realizada', codigo: 2053 },
  { id: 'programa-crianca-feliz-45', nome: 'Programa Criança Feliz', programaId: 'politicas-sociais', regiao: 'todo', pagina: 29, produto: 'Ação realizada', codigo: 2066 },
  { id: 'const-do-centro-de-referencia-especializada-da-46', nome: 'Construção do Centro de Referência Especializada da Assistência Social - CREAS/CRAS', programaId: 'politicas-sociais', regiao: 'sede', pagina: 29, produto: 'Ação realizada' },
  { id: 'acoes-de-combate-a-desnutricao-infantil-47', nome: 'Ações de Combate a Desnutrição Infantil', programaId: 'politicas-sociais', regiao: 'todo', pagina: 29, produto: 'Ação realizada' },
  { id: 'bloco-protecao-social-basica-psb-48', nome: 'Bloco Proteção Social Básica - PSB', programaId: 'politicas-sociais', regiao: 'todo', pagina: 29, produto: 'Ação realizada', codigo: 2077 },
  { id: 'execucao-de-emendas-parlamentares-para-assiste-49', nome: 'Execução de Emendas Parlamentares para Assistência Social', programaId: 'politicas-sociais', regiao: 'todo', pagina: 29 },
  { id: 'gestao-das-acoes-do-conselho-da-crianca-e-adol-50', nome: 'Gestão das Ações do Conselho da Criança e Adolescente', programaId: 'politicas-sociais', regiao: 'todo', pagina: 30, produto: 'Ação realizada', codigo: 2032 },
  { id: 'manutencao-do-fundo-municipal-de-assist-social-51', nome: 'Manutenção do Fundo Municipal de Assistência Social', programaId: 'politicas-sociais', regiao: 'todo', pagina: 30, produto: 'Ação realizada', codigo: 2030 },
  { id: 'manutencao-conselho-tutelar-52', nome: 'Manutenção Conselho Tutelar', programaId: 'politicas-sociais', regiao: 'todo', pagina: 30, produto: 'Ação realizada', codigo: 2061 },
  { id: 'manutencao-da-controladoria-geral-do-municipio-53', nome: 'Manutenção da Controladoria Geral do Município', programaId: 'cidade-organizada-gestao', regiao: 'sede', pagina: 31, produto: 'Ação realizada', codigo: 2006 },
  { id: 'gestao-das-acoes-da-procuradoria-geral-do-muni-54', nome: 'Gestão das Ações da Procuradoria Geral do Município', programaId: 'inova-sobradinho', regiao: 'sede', pagina: 33, produto: 'Ação realizada', codigo: 2005 },
  { id: 'manutencao-do-gabinete-do-prefeito-55', nome: 'Manutenção do Gabinete do Prefeito', programaId: 'qualidade-administrativa', regiao: null, pagina: 34, produto: 'Ação realizada', codigo: 2004 },
  { id: 'manutencao-da-sec-municipal-de-assistencia-e-d-56', nome: 'Manutenção da Secretaria Municipal de Assistência e Desenvolvimento Social', programaId: 'qualidade-administrativa', regiao: 'todo', pagina: 34, produto: 'Ação realizada', codigo: 2029 },
  { id: 'manutencao-da-frota-57', nome: 'Manutenção da Frota', programaId: 'qualidade-administrativa', regiao: 'todo', pagina: 34, produto: 'Ação realizada' },
  { id: 'gestao-das-acoes-de-comunicacao-e-relacao-soci-58', nome: 'Gestão das Ações de Comunicação e Relação Social', programaId: 'qualidade-administrativa', regiao: 'todo', pagina: 34, codigo: 2003 },
  { id: 'consorcio-de-desenvolvimento-sustentavel-do-te-59', nome: 'Consórcio de Desenvolvimento Sustentável do Território do Sertão do São Francisco - CONSTESF', programaId: 'qualidade-administrativa', regiao: 'todo', pagina: 35, produto: 'Ação realizada', codigo: 2022 },
  { id: 'manutencao-da-secretaria-municipal-de-convenio-60', nome: 'Manutenção da Secretaria Municipal de Convênios', programaId: 'qualidade-administrativa', regiao: 'todo', pagina: 35, produto: 'Ação realizada', codigo: 2070 },
  { id: 'amortizacao-da-divida-fundada-61', nome: 'Amortização da Dívida Fundada', programaId: 'encargos', regiao: 'todo', pagina: 36, produto: 'Ação realizada', codigo: 2012 },
  { id: 'outros-encargos-gerais-e-especiais-62', nome: 'Outros Encargos Gerais e Especiais', programaId: 'encargos', regiao: 'todo', pagina: 36, produto: 'Ação realizada', codigo: 2049 },
  { id: 'reserva-de-contigencia-63', nome: 'Reserva de Contingência', programaId: 'encargos', regiao: 'todo', pagina: 36, produto: 'Ação realizada' },
  { id: 'outros-encargos-gerais-especiais-64', nome: 'Outros Encargos Gerais Especiais', programaId: 'encargos', regiao: 'todo', pagina: 36, produto: 'Ação realizada', codigo: 2049, repetida: true },
  { id: 'construcao-acesso-pontos-turisticos-65', nome: 'Construção Acesso Pontos Turísticos', programaId: 'cultura-turismo-esporte', regiao: 'sede', pagina: 38 },
  { id: 'const-reforma-ampliacao-e-melhoria-da-bibliote-66', nome: 'Construção Reforma, Ampliação e Melhoria da Biblioteca Municipal', programaId: 'cultura-turismo-esporte', regiao: 'sede', pagina: 39, produto: 'Obra realizada' },
  { id: 'apoio-e-incentivo-a-pratica-esportiva-67', nome: 'Apoio e Incentivo a Prática Esportiva', programaId: 'cultura-turismo-esporte', regiao: 'todo', pagina: 39, produto: 'Ação realizada', codigo: 2050 },
  { id: 'const-ampl-manut-e-reforma-de-equipamentos-esp-68', nome: 'Construção Ampliação Manutenção e Reforma de Equipamentos Esportivos', programaId: 'cultura-turismo-esporte', regiao: 'sede', pagina: 39, produto: 'Ação realizada', codigo: 1021 },
  { id: 'gestao-das-acoes-administrativas-da-sec-turism-69', nome: 'Gestão das Ações Administrativas da Secretaria Turismo, Cultura e Esportes', programaId: 'cultura-turismo-esporte', regiao: 'todo', pagina: 39, produto: 'Ação realizada', codigo: 2020 },
  { id: 'construcao-ampliacao-e-urbanizacao-de-balneari-70', nome: 'Construção, Ampliação e Urbanização de Balneários', programaId: 'cultura-turismo-esporte', regiao: 'sede', pagina: 39, produto: 'Ação realizada' },
  { id: 'manutencao-do-fundo-municipal-da-cultura-71', nome: 'Manutenção do Fundo Municipal da Cultura', programaId: 'cultura-turismo-esporte', regiao: null, pagina: 39, produto: 'Ação realizada' },
  { id: 'gerenciamento-eventos-culturais-72', nome: 'Gerenciamento Eventos Culturais', programaId: 'cultura-turismo-esporte', regiao: 'todo', pagina: 39, produto: 'Ação realizada', codigo: 2064 },
  { id: 'manut-e-apoio-as-atividades-turisticas-73', nome: 'Manutenção e Apoio as Atividades Turísticas', programaId: 'cultura-turismo-esporte', regiao: 'sede', pagina: 39, produto: 'Ação realizada' },
  { id: 'constr-manut-recup-de-pontes-passagens-molhada-74', nome: 'Construção Manutenção Recuperação de Pontes, Passagens Molhadas, Estradas Vicinais e Outros', programaId: 'cidade-humanizada', regiao: null, pagina: 41, produto: 'Obra realizada' },
  { id: 'const-manut-e-rec-de-pracas-pavimentacoes-cicl-75', nome: 'Construção, Manutenção, e Recuperação de Praças, Pavimentações, Ciclovias e Bens de Uso Comum', programaId: 'cidade-humanizada', regiao: 'sede', pagina: 41, produto: 'Ação realizada', codigo: 1026 },
  { id: 'rede-de-drenagem-e-saneamento-basico-76', nome: 'Rede de Drenagem e Saneamento Básico', programaId: 'cidade-humanizada', regiao: 'sede', pagina: 41, produto: 'Ação realizada' },
  { id: 'gestao-dos-servicos-de-iluminacao-publica-77', nome: 'Gestão dos Serviços de Iluminação Pública', programaId: 'cidade-humanizada', regiao: 'todo', pagina: 41, produto: 'Ação realizada', codigo: 2035 },
  { id: 'gestao-dos-servicos-de-coleta-e-limpeza-public-78', nome: 'Gestão dos Serviços de Coleta e Limpeza Pública', programaId: 'cidade-humanizada', regiao: 'todo', pagina: 41, produto: 'Ação realizada', codigo: 2034 },
  { id: 'construcao-e-manutencao-de-cemiterios-publicos-79', nome: 'Construção e Manutenção de Cemitérios Públicos', programaId: 'cidade-humanizada', regiao: 'todo', pagina: 41, produto: 'Ação realizada' },
  { id: 'aquisicao-de-maquinas-e-equipamentos-80', nome: 'Aquisição de Máquinas e Equipamentos', programaId: 'cidade-humanizada', regiao: 'sede', pagina: 41, produto: 'Ação realizada' },
  { id: 'implantacao-da-coleta-de-lixo-no-interior-81', nome: 'Implantação da Coleta de Lixo no Interior', programaId: 'cidade-humanizada', regiao: 'todo', pagina: 41, produto: 'Ação realizada' },
  { id: 'reforma-e-ampliacao-do-mercado-municipal-82', nome: 'Reforma e Ampliação do Mercado Municipal', programaId: 'extensao-rural', regiao: 'sede', pagina: 44, produto: 'Ação realizada', codigo: 1024 },
  { id: 'gestao-das-acoes-do-fundo-municipal-de-meio-am-83', nome: 'Gestão das Ações do Fundo Municipal de Meio Ambiente', programaId: 'extensao-rural', regiao: null, pagina: 44, produto: 'Ação realizada', codigo: 2056 },
  { id: 'apoio-a-agricultura-familiar-84', nome: 'Apoio a Agricultura Familiar', programaId: 'extensao-rural', regiao: 'todo', pagina: 44, produto: 'Ação realizada' },
  { id: 'apoio-as-organizacoes-de-producao-de-psicultur-85', nome: 'Apoio as Organizações de Produção de Piscicultura, Pecuária e Agrícola', programaId: 'extensao-rural', regiao: 'todo', pagina: 44, produto: 'Ação realizada', codigo: 2038 },
  { id: 'modernizacao-de-sistemas-de-irrigacao-para-com-86', nome: 'Modernização de Sistemas de Irrigação para Comunidades Rurais', programaId: 'extensao-rural', regiao: 'sede', pagina: 45, produto: 'Ação realizada', codigo: 1012 },
  { id: 'manutencao-da-sec-municipal-de-agricultura-87', nome: 'Manutenção da Secretaria Municipal de Agricultura', programaId: 'extensao-rural', regiao: 'todo', pagina: 45, produto: 'Ação realizada', codigo: 2036 },
  { id: 'realizacao-de-feiras-e-exposicoes-88', nome: 'Realização de Feiras e Exposições', programaId: 'extensao-rural', regiao: 'todo', pagina: 45, produto: 'Ação realizada' },
  { id: 'implantacao-de-unidade-de-beneficiamento-de-le-89', nome: 'Implantação de Unidade de Beneficiamento de Leite', programaId: 'extensao-rural', regiao: 'sede', pagina: 45, produto: 'Ação realizada' },
  { id: 'reestrutura-regulamentacao-e-fiscalizacao-do-a-90', nome: 'Reestruturação, Regulamentação e Fiscalização do Abatedouro Público', programaId: 'extensao-rural', regiao: 'todo', pagina: 45, produto: 'Ação realizada' },
  { id: 'gestao-das-acoes-do-projeto-assent-agrario-91', nome: 'Gestão das Ações do Projeto Assentamento Agrário', programaId: 'extensao-rural', regiao: 'todo', pagina: 45, produto: 'Ação realizada' },
  { id: 'protecao-a-biodiversidade-92', nome: 'Proteção a Biodiversidade', programaId: 'extensao-rural', regiao: 'todo', pagina: 45, produto: 'Ação realizada' },
  { id: 'manutencao-das-acoes-adm-do-saae-93', nome: 'Manutenção das Ações Administrativas do SAAE', programaId: 'agua-saneamento', regiao: 'todo', pagina: 46, produto: 'Ação realizada' },
  { id: 'manutenca-e-ampliacao-da-rede-de-esgoto-94', nome: 'Manutenção e Ampliação da Rede de Esgoto', programaId: 'agua-saneamento', regiao: 'todo', pagina: 46 },
  { id: 'manut-e-ampl-do-sist-abast-e-tratamento-de-agu-95', nome: 'Manutenção e Ampliação do Sistema Abastecimento e Tratamento de Água', programaId: 'agua-saneamento', regiao: 'todo', pagina: 47, produto: 'Ação realizada' },
  { id: 'ampliacao-do-servico-de-hidrometria-96', nome: 'Ampliação do Serviço de Hidrometria', programaId: 'agua-saneamento', regiao: 'sede', pagina: 47, produto: 'Ação realizada' },
  { id: 'manut-area-de-ti-tecnol-da-inform-97', nome: 'Manutenção Área de TI Tecnologia da Informação', programaId: 'agua-saneamento', regiao: 'todo', pagina: 47, produto: 'Ação realizada' },
  { id: 'manutencao-da-sec-municipal-de-planejamento-e--98', nome: 'Manutenção da Secretaria Municipal de Planejamento e Gestão', programaId: 'infra-urbanistica', regiao: 'todo', pagina: 48, produto: 'Ação realizada', codigo: 2008 },
  { id: 'sec-de-fazenda-e-administracao-99', nome: 'Secretaria de Fazenda e Administração', programaId: 'infra-urbanistica', regiao: 'todo', pagina: 48, codigo: 2010 },
];

export const acoesPPADoPrograma = (programaId: string) =>
  acoesPPA.filter(a => a.programaId === programaId);

/** Ações do PPA que já aparecem com empenho no Portal da Transparência. */
export const acoesComCodigo = acoesPPA.filter(a => a.codigo != null && !a.repetida);

/** Ações planejadas no PPA que ainda não têm ação orçamentária correspondente. */
export const acoesSemExecucao = acoesPPA.filter(a => a.codigo == null);

export const REGIAO_LABEL: Record<string, string> = {
  todo: 'Todo o município', sede: 'Sede', interior: 'Interior',
};
