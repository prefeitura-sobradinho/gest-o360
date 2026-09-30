import type { MetaInput, ItemPortfolio } from '@/types';
import { programaPorId } from './programas';

/**
 * Os 63 indicadores oficiais do PPA 2026–2029, transcritos do Anexo II
 * (Plano Plurianual — Espelho), Diário Oficial nº 4406, de 11/12/2025.
 *
 * Cada indicador vira uma meta monitorável:
 *   valorInicial = "Índice Atual" do PPA (linha de base)
 *   valorMeta    = "Índice Pretendido"
 *   valorAtual   = começa igual à linha de base e é atualizado pela secretaria
 */

const CARGA = '2026-01-01';

type Linha = [codigo: string, indicador: string, unidade: string, inicial: number, meta: number];

/** Monta as metas de um programa a partir das linhas da tabela de indicadores. */
function metasDoPrograma(programaId: string, linhas: Linha[], ordemInicial: number): MetaInput[] {
  const p = programaPorId(programaId);
  if (!p) throw new Error(`Programa desconhecido: ${programaId}`);
  return linhas.map(([codigo, indicador, unidade, inicial, meta], i) => ({
    codigo,
    titulo: indicador,
    descricao: `Indicador do programa “${p.nome}”.`,
    eixoId: p.eixoId,
    programaId: p.id,
    secretariaId: p.secretariaId,
    indicador,
    unidade,
    valorInicial: inicial,
    valorAtual: inicial,
    valorMeta: meta,
    prazo: '2029-12-31',
    status: 'nao_iniciada' as const,
    responsavel: p.unidadeResponsavel,
    fonte: `PPA 2026–2029 · Anexo II, pág. ${p.pagina} do DO nº 4406`,
    atualizadoEm: CARGA,
    atualizadoPor: 'carga inicial',
    historico: [{ data: CARGA, valor: inicial, observacao: 'Índice atual do PPA (linha de base)', autor: 'carga inicial' }],
    ordem: ordemInicial + i,
  }));
}

export const metasExemplo: MetaInput[] = [
  ...metasDoPrograma('acao-legislativa', [
    ['LEG-01', 'Promover o exercício do mandato parlamentar', '%', 90, 100],
    ['LEG-02', 'Promover eventos de capacitação para agentes públicos', '%', 100, 100],
    ['LEG-03', 'Reformar a unidade administrativa da Câmara Municipal', 'un', 1, 1],
  ], 100),

  ...metasDoPrograma('educacao-basica', [
    ['EDU-01', 'Escolas a serem ampliadas', 'un', 0, 7],
    ['EDU-02', 'Matrículas no ensino infantil da rede municipal', 'un', 1019, 1250],
    ['EDU-03', 'Alunos atendidos pelo programa de merenda escolar', 'un', 6000, 8000],
    ['EDU-04', 'Ônibus escolar próprio', 'un', 9, 18],
    ['EDU-05', 'Refeições ofertadas diariamente', 'un', 5978, 7050],
    ['EDU-06', 'Profissionais capacitados em Libras', 'un', 8, 150],
    ['EDU-07', 'Estudantes com defasagem idade-série', 'un', 209, 0],
    ['EDU-08', 'Estudantes com atendimento educacional especializado', '%', 80, 100],
    ['EDU-09', 'Matrículas na educação de jovens, adultos e idosos', 'un', 131, 300],
  ], 200),

  ...metasDoPrograma('saude-qualidade', [
    ['SAU-01', 'Área coberta por agentes comunitários de saúde', '%', 100, 100],
    ['SAU-02', 'Cobertura vacinal das crianças menores de 1 ano', '%', 75, 100],
    ['SAU-03', 'Óbitos maternos', 'un', 1, 0],
    ['SAU-04', 'Execução da média e alta complexidade', '%', 100, 100],
  ], 300),

  ...metasDoPrograma('politicas-sociais', [
    ['ASS-01', 'Famílias atendidas pelo programa de transferência de renda', 'famílias', 2884, 2500],
    ['ASS-02', 'Famílias incluídas no Cadastro Único', 'famílias', 5195, 6000],
    ['ASS-03', 'Crianças e adolescentes no serviço de convivência (6 a 17 anos)', 'un', 200, 300],
    ['ASS-04', 'Crianças no serviço de convivência (0 a 5 anos)', 'un', 30, 50],
    ['ASS-05', 'Idosos atendidos no SCFV', 'un', 204, 500],
  ], 400),

  ...metasDoPrograma('cidade-organizada-gestao', [
    ['PLA-01', 'Propostas para projeto de urbanização', 'un', 40, 70],
    ['PLA-02', 'Análise de processos do setor imobiliário', '%', 100, 100],
    ['PLA-03', 'Informatização dos processos e documentos', '%', 50, 90],
    ['PLA-04', 'Servidores da SEPLAN capacitados em cursos afins', 'un', 7, 13],
  ], 500),

  ...metasDoPrograma('inova-sobradinho', [
    ['INO-01', 'Atendimento assistencial jurídico demandado no Gabinete do Prefeito', '%', 100, 100],
  ], 600),

  ...metasDoPrograma('qualidade-administrativa', [
    ['ADM-01', 'Servidores capacitados', '%', 40, 100],
    ['ADM-02', 'Implementação da gestão de pessoas', '%', 50, 100],
    ['ADM-03', 'Melhoria e adequação em sistemas de processamento de dados', '%', 90, 100],
  ], 700),

  ...metasDoPrograma('cultura-turismo-esporte', [
    ['CUL-01', 'Frequência de público em eventos culturais do município', '%', 100, 100],
    ['CUL-02', 'Apoio a eventos culturais populares e de identidade', '%', 100, 100],
    ['CUL-03', 'Ações de promoção do destino turístico do município', '%', 100, 100],
    ['CUL-04', 'Requalificação urbana de espaços turísticos', '%', 0, 100],
    ['CUL-05', 'Atendimento de solicitações para uso de espaços de esporte e lazer', '%', 100, 100],
    ['CUL-06', 'Construção, reforma e ampliação de equipamentos de esporte', 'un', 4, 8],
  ], 800),

  ...metasDoPrograma('cidade-humanizada', [
    ['INF-01', 'Reforma da sede da Secretaria (SIESP)', 'un', 0, 1],
    ['INF-02', 'Iluminação pública do município', '%', 0, 100],
    ['INF-03', 'Paisagismo das rotatórias na sede do município', 'un', 0, 6],
    ['INF-04', 'Seletividade e descarte apropriado de lixo', '%', 0, 100],
    ['INF-05', 'Aquisição de veículos traçados para a SIESP', '%', 0, 50],
    ['INF-06', 'Drenagem total da rede do município', '%', 0, 100],
    ['INF-07', 'Compra de terreno para atender necessidade da população', '%', 0, 100],
  ], 900),

  ...metasDoPrograma('extensao-rural', [
    ['AGR-01', 'Requalificação das estradas vicinais do município', 'km', 10, 100],
    ['AGR-02', 'Fortalecer a agricultura familiar', '%', 50, 100],
    ['AGR-03', 'Projetos de fruticultura irrigada', '%', 40, 100],
    ['AGR-04', 'Construção e manutenção de adutora e canais de aproximação', '%', 70, 90],
    ['AGR-05', 'Captação e armazenamento de água da chuva para irrigação', '%', 60, 90],
    ['AGR-06', 'Inclusão de mais agricultores no PAA e PNAE', '%', 75, 100],
    ['AGR-07', 'Parcerias com SEBRAE e SENAR para capacitação de agricultores', '%', 70, 90],
    ['AGR-08', 'Parceria com CODEVASF e EMBRAPA', '%', 60, 90],
    ['AGR-09', 'Parceria com sindicatos rurais e FETAG-BA', '%', 60, 90],
    ['AGR-10', 'Habitação rural (Minha Casa Minha Vida Rural)', '%', 30, 90],
    ['AGR-11', 'Transição do convencional para o agroecológico', '%', 80, 100],
    ['AGR-12', 'Programa de agricultura familiar', '%', 70, 100],
    ['AGR-13', 'Hortas urbanas', '%', 70, 100],
    ['AGR-14', 'Agroindústria', '%', 10, 90],
    ['AGR-15', 'Parcerias com laboratórios de análise de solo', '%', 0, 90],
    ['AGR-16', 'Programa de convivência com a seca', '%', 70, 100],
    ['AGR-17', 'Capacitação para implementação de pequenos negócios', '%', 70, 100],
    ['AGR-18', 'Horas-máquina (retroescavadeira e patrol) nas estradas vicinais', '%', 70, 100],
    ['AGR-19', 'Limpeza e manutenção do Canal Serra da Batateira', '%', 50, 100],
    ['AGR-20', 'Limpeza e manutenção de barreiros, barragens e aguadas', '%', 50, 90],
  ], 1000),

  ...metasDoPrograma('agua-saneamento', [
    ['SAN-01', 'Ligações domiciliares de água', 'un', 10186, 13295],
    ['SAN-02', 'Ligações de saneamento básico', 'un', 8966, 13295],
  ], 1100),
];

/**
 * Entregas já realizadas pela gestão, para a linha do tempo do portfólio.
 * Substituir/complementar conforme os atos oficiais.
 */
export const portfolioExemplo: Omit<ItemPortfolio, 'id'>[] = [
  { data: 'Dezembro 2025', titulo: 'Sanção do PPA 2026–2029', desc: 'Lei Municipal nº 712, de 11 de dezembro de 2025, publicada no Diário Oficial nº 4406. Institui o Plano Plurianual do quadriênio com R$ 672,6 milhões distribuídos em 7 eixos estruturantes e 13 programas.', icone: 'FileText', tom: 'gold', ordem: 1 },
  { data: 'Dezembro 2025', titulo: 'Prorrogação do Plano Municipal de Educação', desc: 'Lei Municipal nº 713/2025 prorroga até 31 de dezembro de 2026 a vigência do PME, aprovado pela Lei nº 549/2015.', icone: 'BookOpen', tom: 'azul', ordem: 2 },
  { data: 'Outubro 2025', titulo: '21º Forró do Vaqueiro', desc: 'Maior edição da história do evento, com impacto econômico estimado em mais de R$ 10 milhões na economia local.', icone: 'Music', tom: 'vinho', ordem: 3 },
  { data: 'Setembro 2025', titulo: '1ª Conferência de Desenvolvimento Rural', desc: 'Tema “Do solo à mesa”, com foco em agricultura familiar e sustentabilidade no semiárido.', icone: 'Leaf', tom: 'verde', ordem: 4 },
  { data: 'Agosto 2025', titulo: 'Posse de novos concursados', desc: 'Fim de um hiato de 20 anos: servidores empossados para Saúde, Educação e SAAE.', icone: 'Users', tom: 'azul', ordem: 5 },
  { data: 'Julho 2025', titulo: 'Entrega das quadras poliesportivas', desc: 'Requalificação do espaço Francisco Wellington M. Santos, com R$ 872 mil investidos.', icone: 'Trophy', tom: 'terracota', ordem: 6 },
  { data: 'Abril 2025', titulo: 'Programa Peixe na Mesa', desc: 'Distribuição de 5 toneladas de peixe na Semana Santa, garantida por Lei Municipal.', icone: 'CheckCircle', tom: 'verde', ordem: 7 },
  { data: 'Janeiro 2025', titulo: 'Início da gestão Cleivynho & Canturil', desc: 'Posse oficial da gestão para o mandato 2025–2029.', icone: 'Briefcase', tom: 'gold', ordem: 8 },
];
