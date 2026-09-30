export const municipio = {
  nome: 'Sobradinho',
  uf: 'BA',
  populacao: '27.097 hab.',
  area: '12.402 km²',
  pib: 'R$ 843,2 Mi',
  idh: '0,631',
  altitude: '520 m',
  fundacao: '1962',
  fonte: 'IBGE — Cidades',
};

export const gestao = {
  periodo: '2025 – 2029',
  slogan: 'Cleivynho & Canturil',
  prefeito: 'Regis Cleivys Sampaio Bento',
  vice: 'Carlos Jarques Canturil da Silva',
};

export const ppa = {
  lei: 'Lei Municipal Nº 712, de 11/12/2025',
  leiCurta: 'Lei Municipal Nº 712/2025',
  periodo: '2026–2029',
  inicio: '2026-01-01',
  fim: '2029-12-31',
  /** Receita/Despesa total do quadriênio — Anexo I do PPA */
  orcamentoTotal: 672_577_000,
  publicacao: 'Diário Oficial nº 4406, de 11/12/2025',
  fonte: 'PPA 2026–2029 · Lei Municipal nº 712/2025',
};

/** Formata reais em milhões, como "R$ 265,3 Mi". */
export const fmtMi = (valor: number) =>
  `R$ ${(valor / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Mi`;

export const fmtReais = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
