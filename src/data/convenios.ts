import type { Convenio } from '@/types';

/**
 * Planos de Ação de Transferências Especiais (emendas parlamentares) registrados
 * no Transferegov e destinados ao Município de Sobradinho (CNPJ 16.444.804/0001-10).
 * Carga inicial — novos convênios são cadastrados pela SECON no próprio painel.
 */
export const conveniosIniciais: Omit<Convenio, 'id'>[] = [
  {
    numeroPlano: '09032025-076225/2025', programa: '09032025',
    emenda: '202537270002', parlamentar: 'Mário Negromonte Jr.',
    objeto: 'Construção de praça no Bairro Vila São Francisco, na área urbana do município de Sobradinho.',
    valorCusteio: 0, valorInvestimento: 495_000,
    vigenciaInicio: '2025-10-22', vigenciaFim: '2028-10-22',
    situacao: 'aprovado', secretariaId: 'infra',
    acaoOrcamentaria: '1026 — Construção, manutenção e recuperação de praças, pavimentações e ciclovias',
    fonte: 'Transferegov · Transferências Especiais', ordem: 1,
  },
  {
    numeroPlano: '09032025-083012/2025', programa: '09032025',
    emenda: '202538980003', parlamentar: 'Adolfo Viana',
    objeto: 'Construção de praças no Bairro Vila São Francisco.',
    valorCusteio: 0, valorInvestimento: 990_000,
    vigenciaInicio: '2025-10-22', vigenciaFim: '2028-10-22',
    situacao: 'aprovado', secretariaId: 'infra',
    acaoOrcamentaria: '1026 — Construção, manutenção e recuperação de praças, pavimentações e ciclovias',
    fonte: 'Transferegov · Transferências Especiais', ordem: 2,
  },
  {
    numeroPlano: '09032026-089012/2026', programa: '09032026',
    emenda: '202637270003', parlamentar: 'Mário Negromonte Jr.',
    objeto: 'Reforma e requalificação da Praça da Juventude, para aumentar a atratividade, a permanência dos usuários e a valorização do espaço público.',
    valorCusteio: 0, valorInvestimento: 497_500,
    vigenciaInicio: '2026-05-12', vigenciaFim: '2029-05-12',
    situacao: 'aprovado', secretariaId: 'setuc',
    acaoOrcamentaria: '2055 — Manutenção e apoio às atividades turísticas',
    fonte: 'Transferegov · Transferências Especiais', ordem: 3,
  },
  {
    numeroPlano: '09032026-095711/2026', programa: '09032026',
    emenda: '202538980005', parlamentar: 'Adolfo Viana',
    objeto: 'Reforma e ampliação do Estádio Municipal de Sobradinho, com construção de arquibancadas, banheiros, iluminação e depósito.',
    valorCusteio: 0, valorInvestimento: 398_000,
    vigenciaInicio: '2026-05-12', vigenciaFim: '2029-05-12',
    situacao: 'aprovado', secretariaId: 'setuc',
    acaoOrcamentaria: '1031 — Construção, ampliação, manutenção e reforma de equipamentos esportivos',
    fonte: 'Transferegov · Transferências Especiais', ordem: 4,
  },
];
