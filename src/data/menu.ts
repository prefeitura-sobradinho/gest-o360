import {
  LayoutDashboard, Target, Award, Briefcase, Calculator, Map, Leaf, Users,
  FileSignature, BookOpen, HardHat, HeartPulse, Music, Droplets, ListChecks, Landmark, ShieldCheck, Wallet,
} from 'lucide-react';
import type { ItemMenu } from '@/types';

export const menu: ItemMenu[] = [
  { id: 'dashboard', nome: 'Visão Geral', icone: LayoutDashboard, grupo: 'principal', rota: '/' },
  { id: 'ppa', nome: 'PPA 2026–2029', icone: Target, grupo: 'principal', rota: '/ppa' },
  { id: 'metas', nome: 'Metas e Indicadores', icone: ListChecks, grupo: 'principal', rota: '/ppa/metas' },
  { id: 'execucao', nome: 'Execução Financeira', icone: Wallet, grupo: 'principal', rota: '/execucao' },
  { id: 'convenios-lista', nome: 'Convênios e Emendas', icone: FileSignature, grupo: 'principal', rota: '/convenios' },
  { id: 'portfolio', nome: 'Portfólio de Realizações', icone: Award, grupo: 'principal', rota: '/portfolio' },
  { id: 'gabinete', nome: 'Gabinete do Prefeito', icone: Briefcase, grupo: 'lideranca', rota: '/secretarias/gabinete' },
  { id: 'controladoria', nome: 'Controladoria Geral', icone: ShieldCheck, grupo: 'lideranca', rota: '/secretarias/controladoria' },
  { id: 'fazenda', nome: 'Administração e Fazenda', icone: Calculator, grupo: 'lideranca', rota: '/secretarias/fazenda' },
  { id: 'planejamento', nome: 'Planejamento e Gestão', icone: Map, grupo: 'lideranca', rota: '/secretarias/planejamento' },
  { id: 'agricultura', nome: 'Agricultura e Meio Amb.', icone: Leaf, grupo: 'secretarias', rota: '/secretarias/agricultura' },
  { id: 'assistencia', nome: 'Assistência Social (SEADS)', icone: Users, grupo: 'secretarias', rota: '/secretarias/assistencia' },
  { id: 'convenios', nome: 'Convênios (SECONV)', icone: FileSignature, grupo: 'secretarias', rota: '/secretarias/convenios' },
  { id: 'educacao', nome: 'Educação', icone: BookOpen, grupo: 'secretarias', rota: '/secretarias/educacao' },
  { id: 'infra', nome: 'Infraestrutura', icone: HardHat, grupo: 'secretarias', rota: '/secretarias/infra' },
  { id: 'saude', nome: 'Saúde (SMS)', icone: HeartPulse, grupo: 'secretarias', rota: '/secretarias/saude' },
  { id: 'setuc', nome: 'Turismo, Esporte e Cultura', icone: Music, grupo: 'secretarias', rota: '/secretarias/setuc' },
  { id: 'saae', nome: 'SAAE', icone: Droplets, grupo: 'secretarias', rota: '/secretarias/saae' },
  { id: 'camara', nome: 'Câmara Municipal', icone: Landmark, grupo: 'secretarias', rota: '/secretarias/camara' },
];
