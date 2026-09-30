import { Landmark, HeartHandshake, ShieldCheck, TrendingUp, Map, Droplets, FileSignature } from 'lucide-react';
import type { Eixo } from '@/types';

/**
 * Os sete eixos estruturantes do PPA 2026–2029,
 * conforme o Art. 3º da Lei Municipal nº 712, de 11 de dezembro de 2025.
 */
export const eixosPPA: Eixo[] = [
  {
    id: 'legislativo', numero: 'I', nome: 'Atuação Legislativa',
    nomeOficial: 'Atuação Legislativa — Representação e Controle Social',
    descricao: 'Produção normativa, fiscalização e participação popular',
    tom: 'stone', cor: '#8B8576', icone: Landmark,
  },
  {
    id: 'social', numero: 'II', nome: 'Enfrentar as Injustiças',
    nomeOficial: 'Enfrentar as Injustiças, com Ênfase à População mais Vulnerável',
    descricao: 'Educação, Saúde e Assistência Social',
    tom: 'azul', cor: '#1D7FB0', icone: HeartHandshake,
  },
  {
    id: 'gestao', numero: 'III', nome: 'Cuidar bem do Dinheiro Público',
    nomeOficial: 'Cuidar bem do Dinheiro Público e Modernização da Gestão Pública',
    descricao: 'Planejamento, Administração, Fazenda e Encargos',
    tom: 'vinho', cor: '#7A2E3D', icone: ShieldCheck,
  },
  {
    id: 'economico', numero: 'IV', nome: 'Desenvolvimento Socioeconômico',
    nomeOficial: 'Eixo Estratégico de Desenvolvimento Socioeconômico Sustentável e Cultural',
    descricao: 'Turismo, Cultura e Esporte',
    tom: 'gold', cor: '#B8430A', icone: TrendingUp,
  },
  {
    id: 'territorial', numero: 'V', nome: 'Desenvolvimento Territorial',
    nomeOficial: 'Desenvolvimento Territorial Participativo e Sustentável',
    descricao: 'Infraestrutura, Agricultura e Meio Ambiente',
    tom: 'terracota', cor: '#A8551E', icone: Map,
  },
  {
    id: 'agua', numero: 'VI', nome: 'Água Potável e Saneamento',
    nomeOficial: 'Eixo Estratégico para Água Potável e Saneamento Básico',
    descricao: 'Abastecimento de água e esgotamento sanitário',
    tom: 'azul', cor: '#2A9BC4', icone: Droplets,
  },
  {
    id: 'convenios', numero: 'VII', nome: 'Captação e Gestão de Recursos',
    nomeOficial: 'Captação e Gestão de Recursos por meio de Convênios',
    descricao: 'Obras estruturantes com recursos estaduais, federais e emendas',
    tom: 'verde', cor: '#5C7A4C', icone: FileSignature,
  },
];

export const eixoPorId = (id: string) => eixosPPA.find(e => e.id === id);
