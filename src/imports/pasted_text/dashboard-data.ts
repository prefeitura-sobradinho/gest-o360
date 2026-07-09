import React, { useState } from 'react';
import {
  LayoutDashboard, HardHat, BookOpen, HeartPulse, Users, Music,
  TrendingUp, CheckCircle, Activity, Award, Home,
  FileText, Download, Trophy, Briefcase,
  Leaf, FileSignature, Map, Droplets, Calculator, Edit3, PlusCircle,
  Clock, User, DollarSign, AlertCircle, Phone, Mail, ChevronRight, Landmark
} from 'lucide-react';

const kpisGerais = {
  orcamentoPPA: "672,5 Mi",
  moradiasMCMV: 90,
  investimentoEducacao: "7,1 Mi+",
  impactoEconomico: "10 Mi+",
  empregosGerados: "232"
};

const statusAcoes = { concluidas: 142, emExecucao: 38, atrasadas: 4 };

const atividadesRecentes = [
  { id: 1, texto: "Escola Maria Ribeiro atingiu 90% de conclusão nas obras.", tempo: "Há 2 horas", icone: BookOpen, tom: "azul" },
  { id: 2, texto: "Novo lote de 1.100 sacas de milho entregue na zona rural.", tempo: "Ontem", icone: Leaf, tom: "verde" },
  { id: 3, texto: "Selo FNAS 2025 recebido e oficializado em Brasília.", tempo: "Há 2 dias", icone: Award, tom: "gold" },
  { id: 4, texto: "Atendimentos da Saúde ultrapassaram 5.900 na urgência.", tempo: "Há 3 dias", icone: HeartPulse, tom: "azul" },
];

const linhaDoTempo = [
  { id: 1, data: 'Dezembro 2025', titulo: 'Sanção do PPA 2026-2029', desc: 'Lei Municipal Nº 712/2025 sancionada, garantindo o planejamento estratégico do município.', icone: FileText, tom: 'gold' },
  { id: 2, data: 'Outubro 2025', titulo: '21º Forró do Vaqueiro', desc: 'Maior edição da história. Mais de R$ 10 Milhões injetados na economia local.', icone: Music, tom: 'vinho' },
  { id: 3, data: 'Setembro 2025', titulo: '1ª Conferência de Desenvolvimento Rural', desc: 'Foco na agricultura familiar e sustentabilidade. Tema: Do solo à mesa.', icone: Leaf, tom: 'verde' },
  { id: 4, data: 'Agosto 2025', titulo: 'Posse de Novos Concursados', desc: 'Fim de um hiato de 20 anos. Posse de dezenas de servidores para Saúde, Educação e SAAE.', icone: Users, tom: 'azul' },
  { id: 5, data: 'Julho 2025', titulo: 'Entrega das Quadras Poliesportivas', desc: 'Requalificação do espaço Francisco Wellington M. Santos com R$ 872 mil investidos.', icone: Trophy, tom: 'terracota' },
  { id: 6, data: 'Abril 2025', titulo: 'Programa Peixe na Mesa', desc: 'Distribuição de 5 toneladas de peixe na Semana Santa, agora garantido por Lei Municipal.', icone: CheckCircle, tom: 'verde' },
];

const secretariasMenu = [
  { id: 'dashboard', nome: 'Visão Geral', icone: LayoutDashboard, tom: 'gold', grupo: 'principal' },
  { id: 'portfolio', nome: 'Portfólio de Realizações', icone: Award, tom: 'gold', grupo: 'principal' },
  { id: 'gabinete', nome: 'Gabinete do Prefeito', icone: Briefcase, tom: 'gold', grupo: 'lideranca' },
  { id: 'fazenda', nome: 'Administração e Fazenda', icone: Calculator, tom: 'gold', grupo: 'lideranca' },
  { id: 'planejamento', nome: 'Planejamento e Gestão', icone: Map, tom: 'gold', grupo: 'lideranca' },
  { id: 'agricultura', nome: 'Agricultura e Meio Amb.', icone: Leaf, tom: 'verde', grupo: 'secretarias' },
  { id: 'assistencia', nome: 'Assistência Social (SEADS)', icone: Users, tom: 'terracota', grupo: 'secretarias' },
  { id: 'convenios', nome: 'Convênios', icone: FileSignature, tom: 'azul', grupo: 'secretarias' },
  { id: 'educacao', nome: 'Educação', icone: BookOpen, tom: 'azul', grupo: 'secretarias' },
  { id: 'infra', nome: 'Infraestrutura', icone: HardHat, tom: 'terracota', grupo: 'secretarias' },
  { id: 'saude', nome: 'Saúde (SMS)', icone: HeartPulse, tom: 'azul', grupo: 'secretarias' },
  { id: 'setuc', nome: 'Turismo, Esporte e Cultura', icone: Music, tom: 'vinho', grupo: 'secretarias' },
  { id: 'saae', nome: 'SAAE', icone: Droplets, tom: 'azul', grupo: 'secretarias' },
];

const secretariasData = {
  gabinete: {
    titulo: 'Gabinete do Prefeito', icone: Briefcase, tom: 'gold',
    subtitulo: 'Coordenação geral de governo e relação institucional',
    kpis: [
      { label: 'Decretos publicados em 2026', valor: '34' },
      { label: 'Audiências públicas', valor: '12' },
      { label: 'Ouvidoria respondida', valor: '96%' },
    ],
    destaques: [
      { titulo: 'Agenda de Governo 2026', desc: 'Prioridades do primeiro semestre alinhadas às metas do PPA 2026-2029, com acompanhamento mensal por secretaria.' },
      { titulo: 'Posse de Novos Concursados', desc: 'Fim de um hiato de 20 anos: dezenas de servidores empossados para Saúde, Educação e SAAE.' },
      { titulo: 'Diálogos com a Comunidade', desc: 'Visitas semanais às localidades rurais para escuta direta da população e levantamento de demandas.' },
    ],
    responsavel: 'Joselito Macedo — Chefe de Gabinete', contato: 'gabinetepms@gmail.com',
  },
  fazenda: {
    titulo: 'Administração e Fazenda', icone: Calculator, tom: 'gold',
    subtitulo: 'Gestão orçamentária, arrecadação e transparência fiscal',
    kpis: [
      { label: 'Orçamento PPA 2026-2029', valor: 'R$ 672,5 Mi' },
      { label: 'Execução orçamentária', valor: '38%' },
      { label: 'Receita própria, var. anual', valor: '+11%' },
    ],
    destaques: [
      { titulo: 'PPA 2026-2029 Sancionado', desc: 'Lei Municipal Nº 712/2025 estabelece o planejamento estratégico e orçamentário dos próximos quatro anos.' },
      { titulo: 'Modernização do Fisco Municipal', desc: 'Reestruturação da cobrança de IPTU e ISS com novo cadastro imobiliário digital.' },
      { titulo: 'Transparência Ativa', desc: 'Portal da transparência atualizado conforme exigências da Lei de Acesso à Informação.' },
    ],
    responsavel: 'Luiz Nery Junior — Secretário', contato: 'fazenda@sobradinho.ba.gov.br',
  },
  planejamento: {
    titulo: 'Planejamento e Gestão', icone: Map, tom: 'gold',
    subtitulo: 'Articulação de metas, indicadores e instrumentos de planejamento',
    kpis: [
      { label: 'Metas do PPA monitoradas', valor: '184' },
      { label: 'Ações concluídas', valor: String(statusAcoes.concluidas) },
      { label: 'Ações em execução', valor: String(statusAcoes.emExecucao) },
    ],
    destaques: [
      { titulo: 'Sanção do PPA 2026-2029', desc: 'Instrumento central de planejamento da gestão, com 184 metas distribuídas entre as 11 secretarias.' },
      { titulo: 'Painel de Indicadores Municipais', desc: 'Mapeamento de indicadores socioeconômicos para orientar a tomada de decisão.' },
      { titulo: 'Revisão do Plano Diretor', desc: 'Atualização participativa do zoneamento urbano e rural do município.' },
    ],
    responsavel: 'Alexandre Deles — Secretário', contato: 'sobradinho.seplan@gmail.com',
  },
  agricultura: {
    titulo: 'Agricultura e Meio Ambiente', icone: Leaf, tom: 'verde',
    subtitulo: 'Apoio à produção rural, segurança alimentar e sustentabilidade',
    kpis: [
      { label: 'Sacas de milho distribuídas', valor: '1.100' },
      { label: 'Toneladas de peixe entregues', valor: '5' },
      { label: 'Famílias rurais atendidas', valor: '900+' },
    ],
    destaques: [
      { titulo: '1ª Conferência de Desenvolvimento Rural', desc: 'Tema "Do solo à mesa", com foco em agricultura familiar e sustentabilidade no semiárido.' },
      { titulo: 'Programa Peixe na Mesa', desc: 'Distribuição de 5 toneladas de peixe na Semana Santa, agora garantida por Lei Municipal.' },
      { titulo: 'Apoio à Agricultura Familiar', desc: 'Distribuição de sementes, insumos e assistência técnica para produtores da zona rural.' },
    ],
    responsavel: 'Adilson Rodrigues Ribeiro — Secretário', contato: 'pmsseama.gov.br@gmail.com',
  },
  assistencia: {
    titulo: 'Assistência Social — SEADS', icone: Users, tom: 'terracota',
    subtitulo: 'Proteção social, segurança alimentar e atenção às famílias',
    kpis: [
      { label: 'Famílias assistidas', valor: '2.800+' },
      { label: 'Reconhecimento nacional', valor: 'Selo FNAS' },
      { label: 'Unidades CRAS ativas', valor: '3' },
    ],
    destaques: [
      { titulo: 'Selo FNAS 2025', desc: 'Reconhecimento recebido e oficializado em Brasília pela qualidade da gestão do Sistema Único de Assistência Social.' },
      { titulo: 'Ampliação do Atendimento no CRAS', desc: 'Novo horário estendido e reforço de equipe técnica nas unidades de referência.' },
      { titulo: 'Mutirão do Cadastro Único', desc: 'Atualização cadastral de famílias para acesso a benefícios e programas sociais.' },
    ],
    responsavel: 'Raimundo Nonato — Secretário', contato: 'seadssob@gmail.com',
  },
  convenios: {
    titulo: 'Convênios', icone: FileSignature, tom: 'azul',
    subtitulo: 'Captação e gestão de recursos com Estado, União e instituições financeiras',
    kpis: [
      { label: 'Convênios ativos', valor: '7' },
      { label: 'Recursos captados em 2025', valor: 'R$ 18 Mi+' },
      { label: 'Moradias via Caixa/MCMV', valor: String(kpisGerais.moradiasMCMV) },
    ],
    destaques: [
      { titulo: 'PRO-RODOVIAS', desc: 'Mobilização e consulta para construção de pontes e correção de estradas vicinais na zona rural.' },
      { titulo: 'Convênio Caixa — Minha Casa Minha Vida', desc: '90 moradias contratadas em parceria com a Caixa Econômica Federal.' },
      { titulo: 'Parceria SEINFRA — BA-316', desc: 'Convênio com o Governo do Estado para requalificação asfáltica da rodovia.' },
    ],
    responsavel: 'Jheny Klay — Secretária', contato: 'gabinetepms@gmail.com',
  },
  educacao: {
    titulo: 'Educação', icone: BookOpen, tom: 'azul',
    subtitulo: 'Infraestrutura escolar, aprendizagem e acesso',
    kpis: [
      { label: 'Investimento 2025', valor: `R$ ${kpisGerais.investimentoEducacao}` },
      { label: 'Escola Maria Ribeiro', valor: '90% obra' },
      { label: 'Alunos na rede municipal', valor: '4.200+' },
    ],
    destaques: [
      { titulo: 'Escola Maria Ribeiro', desc: 'Obra de reconstrução atingiu 90% de conclusão, com entrega prevista para o próximo semestre.' },
      { titulo: 'Alfabetização na Idade Certa', desc: 'Programa de reforço pedagógico para garantir alfabetização até o 2º ano.' },
      { titulo: 'Transporte Escolar Rural', desc: 'Ampliação de rotas para atender comunidades mais distantes da zona rural.' },
    ],
    responsavel: 'Ducilene Kestering — Secretária', contato: 'sec.educ.sobradinho@gmail.com',
  },
  infra: {
    titulo: 'Infraestrutura e Serviços Públicos', icone: HardHat, tom: 'terracota',
    subtitulo: 'Mobilidade, obras públicas e requalificação urbana',
    kpis: [
      { label: 'Investido em quadras', valor: 'R$ 872 Mil' },
      { label: 'BA-316', valor: 'Em requalificação' },
      { label: 'Estradas vicinais em consulta', valor: '14' },
    ],
    destaques: [
      { titulo: 'BA-316 (Sobradinho - Casa Nova)', desc: 'Requalificação asfáltica iniciada em parceria com a SEINFRA e o Governo do Estado.' },
      { titulo: 'PRO-RODOVIAS', desc: 'Mobilização e consulta para construção de pontes e correção de estradas vicinais na zona rural.' },
      { titulo: 'Quadras Poliesportivas', desc: 'Requalificação do espaço Francisco Wellington M. Santos, com R$ 872 mil investidos.' },
    ],
    responsavel: 'Jarques Canturil — Sec. de Infraestrutura e Vice-Prefeito', contato: 'Tel: (74) 9 9958-0501',
  },
  saude: {
    titulo: 'Saúde — SMS', icone: HeartPulse, tom: 'azul',
    subtitulo: 'Atenção básica, urgência e vigilância em saúde',
    kpis: [
      { label: 'Atendimentos no período', valor: '15.000+' },
      { label: 'Atendimentos de urgência', valor: '5.900+' },
      { label: 'Equipes de Saúde da Família', valor: '9' },
    ],
    destaques: [
      { titulo: 'Reforço da Urgência e Emergência', desc: 'Atendimentos de urgência ultrapassaram 5.900 no período, com ampliação de plantões.' },
      { titulo: 'Postos de Saúde Rural', desc: 'Ampliação de horários e equipe técnica em unidades da zona rural.' },
      { titulo: 'Programa Saúde da Família', desc: 'Expansão de equipes para cobertura territorial mais ampla.' },
    ],
    responsavel: 'Josefa Moreira — Secretária', contato: 'sobradinho.licitacao@gmail.com',
  },
  setuc: {
    titulo: 'Turismo, Esporte e Cultura', icone: Music, tom: 'vinho',
    subtitulo: 'Identidade cultural, lazer e desenvolvimento turístico do Lago de Sobradinho',
    kpis: [
      { label: 'Impacto econômico do Forró', valor: `R$ ${kpisGerais.impactoEconomico}` },
      { label: 'Edição do Forró do Vaqueiro', valor: '21ª' },
      { label: 'Quadras requalificadas', valor: '1' },
    ],
    destaques: [
      { titulo: '21º Forró do Vaqueiro', desc: 'Maior edição da história do evento, com mais de R$ 10 milhões injetados na economia local.' },
      { titulo: 'Quadras Poliesportivas', desc: 'Requalificação do espaço Francisco Wellington M. Santos para prática esportiva comunitária.' },
      { titulo: 'Turismo do Lago de Sobradinho', desc: 'Estruturação de roteiros e apoio a empreendedores do turismo náutico e rural.' },
    ],
    responsavel: 'Patrick Carvalho — Secretário (SETUC)', contato: 'sobradinho.licitacao@gmail.com',
  },
  saae: {
    titulo: 'SAAE — Água e Esgoto', icone: Droplets, tom: 'azul',
    subtitulo: 'Abastecimento de água e saneamento básico',
    kpis: [
      { label: 'Cobertura de abastecimento', valor: '87%' },
      { label: 'Ligações de esgoto novas', valor: '340' },
      { label: 'Redução de perdas', valor: '-6 p.p.' },
    ],
    destaques: [
      { titulo: 'Modernização do Abastecimento', desc: 'Substituição de redes antigas e instalação de hidrômetros em bairros centrais.' },
      { titulo: 'Ampliação da Rede de Esgoto', desc: 'Extensão da coleta para novos loteamentos e zona de expansão urbana.' },
      { titulo: 'Combate a Perdas', desc: 'Programa de monitoramento de vazamentos com redução já registrada na macromedição.' },
    ],
    responsavel: 'Domingos Vieira — Diretor Geral', contato: 'saae@sobradinho.ba.gov.br',
  },
};

export default function Gestao360() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modoAdmin, setModoAdmin] = useState(false);

  const handleSimulateEdit = (tipo) => alert(`SIMULAÇÃO: Abrindo formulário para atualizar ${tipo}.`);

  const AdminBotao = ({ onClick, texto = "Atualizar informação" }) => {
    if (!modoAdmin) return null;
    return (
      <button onClick={onClick} className="btn-admin print:hidden">
        <Edit3 size={13} className="mr-2" /> {texto}
      </button>
    );
  };

  /* ---------- DASHBOARD ---------- */
  const renderDashboard = () => (
    <div className="space-y-6 print:space-y-6">

      {/* HERO com horizonte assinatura */}
      <div className="hero-card print:bg-white print:text-black print:border print:shadow-none">
        <svg className="hero-horizon print:hidden" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,160 L120,120 L260,150 L420,90 L600,135 L760,80 L940,140 L1100,100 L1200,130 L1200,220 L0,220 Z" fill="rgba(255,255,255,0.05)" />
          <path d="M0,190 L150,160 L320,185 L500,140 L680,175 L860,130 L1040,170 L1200,150 L1200,220 L0,220 Z" fill="rgba(255,255,255,0.08)" />
          <line x1="0" y1="120" x2="1200" y2="120" stroke="var(--gold)" strokeWidth="1.5" opacity="0.5" />
        </svg>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center md:space-x-6 text-center md:text-left">
            <div className="flex -space-x-4 mb-4 md:mb-0 print:hidden shrink-0">
              <div className="avatar-ring w-20 h-20 relative z-10">
                <User size={34} />
                <div className="absolute -bottom-1 -right-1 bg-gold w-5 h-5 rounded-full border-2 border-ink"></div>
              </div>
              <div className="avatar-ring w-16 h-16 mt-3 opacity-80">
                <User size={26} />
              </div>
            </div>
            <div>
              <p className="eyebrow-gold">Gestão 2025 – 2029</p>
              <h2 className="hero-title">
                Cleivynho <span className="hero-amp">&amp;</span> Canturil
              </h2>
              <div className="mt-3 space-y-1 border-t border-white/10 pt-3 print:border-slate-200">
                <p className="text-sm text-white/80 print:text-slate-600">
                  <span className="font-semibold text-white print:text-black">Prefeito </span> Regis Cleivys Sampaio Bento
                </p>
                <p className="text-sm text-white/60 print:text-slate-600">
                  <span className="font-semibold text-white/90 print:text-black">Vice-Prefeito </span> Carlos Jarques Canturil da Silva
                </p>
              </div>
            </div>
          </div>
          <button onClick={() => window.print()} className="btn-gold print:hidden">
            <Download size={20} className="mr-3" /> Gerar Relatório PDF
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="kpi-strip print:flex-row">
        <KpiItem icon={Calculator} label="Orçamento PPA" valor={`R$ ${kpisGerais.orcamentoPPA}`} />
        <KpiItem icon={BookOpen} label="Educação" valor={`R$ ${kpisGerais.investimentoEducacao}`} tom="azul" />
        <KpiItem icon={DollarSign} label="Impacto Econômico" valor={`R$ ${kpisGerais.impactoEconomico}`} tom="terracota" />
        <KpiItem icon={Users} label="Novos Empregos" valor={`${kpisGerais.empregosGerados} vagas`} tom="verde" />
      </div>

      {/* Cards-dossiê */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 print:grid-cols-4 print:gap-4">
        <DossieCard tom="azul" rotulo="Convênio Caixa" Icone={Home} linha1="Minha Casa Minha Vida" valor={`${kpisGerais.moradiasMCMV}`} unidade="moradias" admin={<AdminBotao onClick={() => handleSimulateEdit('Andamento MCMV')} />} />
        <DossieCard tom="terracota" rotulo="Obra em Andamento" Icone={HardHat} linha1="Rodovia BA-316" valorTexto="Requalificação" admin={<AdminBotao onClick={() => handleSimulateEdit('Status Obras BA-316')} />} />
        <DossieCard tom="gold" rotulo="Lei Nº 712/2025" Icone={FileText} linha1="PPA 2026–2029" valorTexto="Sancionado" admin={<AdminBotao texto="Anexar arquivo" onClick={() => handleSimulateEdit('Documento PPA')} />} />
        <DossieCard tom="verde" rotulo="Reconhecimento" Icone={Award} linha1="Assistência Social" valorTexto="Selo FNAS" />
      </div>

      {/* PPA + Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 print:grid-cols-2 print:gap-8">
        <div className="panel lg:col-span-2 print:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="panel-title">Avanço do Plano Plurianual</h3>
              <p className="text-sm text-muted mt-1">Acompanhamento das metas e status das ações</p>
            </div>
            {modoAdmin && (
              <button onClick={() => handleSimulateEdit('Meta Geral do PPA')} className="btn-ghost-gold print:hidden">
                <PlusCircle size={15} className="mr-2" /> Atualizar Metas
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <Termometro icon={CheckCircle} tom="verde" label="Concluídas" valor={statusAcoes.concluidas} />
            <Termometro icon={Activity} tom="azul" label="Em Execução" valor={statusAcoes.emExecucao} />
            <Termometro icon={AlertCircle} tom="alerta" label="Atrasadas" valor={statusAcoes.atrasadas} />
          </div>

          <div className="space-y-6">
            <Barra icon={BookOpen} tom="azul" titulo="Educação e Inclusão" pct={65} />
            <Barra icon={HardHat} tom="terracota" titulo="Infraestrutura e Serviços Públicos" pct={40} />
            <Barra icon={HeartPulse} tom="verde" titulo="Saúde e Assistência Social" pct={80} />
          </div>
        </div>

        <div className="panel print:shadow-none">
          <h3 className="panel-title mb-6 flex items-center"><Clock className="mr-2 text-stone" size={19} /> Feed da Gestão</h3>
          <div className="space-y-5">
            {atividadesRecentes.map((a) => (
              <div key={a.id} className="flex items-start group">
                <div className={`feed-icon tom-${a.tom}`}>
                  <a.icone size={17} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink leading-snug group-hover:text-gold-dark transition-colors">{a.texto}</p>
                  <p className="text-xs text-stone mt-1 font-medium">{a.tempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------- PORTFÓLIO ---------- */
  const renderPortfolio = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-2">
        <div>
          <h2 className="page-title"><Award className="mr-3 text-gold-dark" size={26} /> Portfólio de Conquistas</h2>
          <p className="text-sm text-muted mt-1">Histórico de realizações da gestão Cleivynho Sampaio.</p>
        </div>
        {modoAdmin && (
          <button onClick={() => handleSimulateEdit('Nova Entrega no Portfólio')} className="btn-gold-solid">
            <PlusCircle size={17} className="mr-2" /> Registrar Entrega
          </button>
        )}
      </div>

      <div className="relative border-l-2 border-stone/25 ml-4 md:ml-6 space-y-7 pb-10">
        {linhaDoTempo.map((item) => (
          <div key={item.id} className="relative pl-8 md:pl-10">
            <div className={`timeline-dot tom-${item.tom}`}>
              <item.icone size={14} />
            </div>
            <div className="card-flat">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
                <h3 className="text-lg font-bold text-ink font-display">{item.titulo}</h3>
                <span className="tag-data"><Clock size={12} className="mr-1" /> {item.data}</span>
              </div>
              <p className="text-sm text-muted">{item.desc}</p>
              {modoAdmin && (
                <div className="mt-4 pt-3 border-t border-stone/15 flex justify-end">
                  <button onClick={() => handleSimulateEdit(`Editar: ${item.titulo}`)} className="text-xs font-bold text-gold-dark hover:text-ink flex items-center">
                    <Edit3 size={13} className="mr-1" /> Editar Informações
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ---------- TEMPLATE DAS SECRETARIAS ---------- */
  const renderSecretaria = (id) => {
    const s = secretariasData[id];
    if (!s) return null;
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <div className={`secao-icon tom-${s.tom}`}><s.icone size={24} /></div>
          <div>
            <h2 className="page-title">{s.titulo}</h2>
            <p className="text-sm text-muted mt-0.5">{s.subtitulo}</p>
          </div>
        </div>

        <div className="kpi-row">
          {s.kpis.map((k, i) => (
            <div key={i} className={`kpi-mini tom-${s.tom}`}>
              <p className="kpi-mini-label">{k.label}</p>
              <p className="kpi-mini-valor">{k.valor}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 panel">
            <div className="flex justify-between items-center mb-5">
              <h3 className="panel-title">Destaques da Secretaria</h3>
              {modoAdmin && (
                <button onClick={() => handleSimulateEdit(`Novo destaque — ${s.titulo}`)} className="btn-ghost-gold print:hidden">
                  <PlusCircle size={15} className="mr-2" /> Adicionar
                </button>
              )}
            </div>
            <div className="space-y-4">
              {s.destaques.map((d, i) => (
                <div key={i} className="card-flat-sm">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-ink font-display flex items-center">
                      <ChevronRight size={16} className={`mr-1 shrink-0 cor-${s.tom}`} /> {d.titulo}
                    </h4>
                  </div>
                  <p className="text-sm text-muted mt-1 ml-5">{d.desc}</p>
                  {modoAdmin && (
                    <div className="mt-3 ml-5 flex justify-end">
                      <button onClick={() => handleSimulateEdit(d.titulo)} className="text-xs font-bold text-gold-dark hover:text-ink flex items-center">
                        <Edit3 size={12} className="mr-1" /> Editar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title mb-4">Informações</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <Landmark size={16} className="mr-3 mt-0.5 text-stone shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone font-bold">Responsável</p>
                  <p className="text-ink font-semibold">{s.responsavel}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail size={16} className="mr-3 mt-0.5 text-stone shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone font-bold">Contato</p>
                  <p className="text-ink font-semibold">{s.contato}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone size={16} className="mr-3 mt-0.5 text-stone shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone font-bold">Atendimento</p>
                  <p className="text-ink font-semibold">Seg. a sex., 8h às 14h</p>
                </div>
              </div>
            </div>
            {modoAdmin && (
              <button onClick={() => handleSimulateEdit(`Dados de contato — ${s.titulo}`)} className="btn-admin mt-5 w-full">
                <Edit3 size={13} className="mr-2" /> Atualizar Informações
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const itemAtivo = secretariasMenu.find(i => i.id === activeTab);

  return (
    <div className="app-root print:bg-white print:text-black">
      <style dangerouslySetInnerHTML={{ __html: estilos }} />

      {/* SIDEBAR */}
      <aside className="sidebar print:hidden">
        <div className="sidebar-brand">
          <h1 className="brand-title">Gestão360</h1>
          <p className="brand-sub">Prefeitura de Sobradinho · BA</p>
        </div>

        <nav className="sidebar-nav hidden md:flex">
          <p className="nav-group-label">Liderança</p>
          {secretariasMenu.filter(i => i.grupo !== 'secretarias').map((item) => (
            <NavItem key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
          ))}
          <p className="nav-group-label">Secretarias</p>
          {secretariasMenu.filter(i => i.grupo === 'secretarias').map((item) => (
            <NavItem key={item.id} item={item} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
          ))}
        </nav>

        <div className="md:hidden nav-mobile">
          {secretariasMenu.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`nav-pill ${activeTab === item.id ? `ativo` : ''}`}>
              <item.icone size={13} className="mr-2" /> {item.nome}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-area">
        <div className="brand-strip print:hidden"></div>
        <header className="topbar print:hidden">
          <div>
            <h2 className="topbar-title">{itemAtivo ? itemAtivo.nome : 'Gestão 360'}</h2>
            <p className="topbar-sub">Prefeitura Municipal de Sobradinho-BA · 2025–2029</p>
          </div>
          <div className="mode-toggle">
            <button onClick={() => setModoAdmin(false)} className={`mode-btn ${!modoAdmin ? 'ativo' : ''}`}>
              <LayoutDashboard size={14} className="mr-2" /> Visão Pública
            </button>
            <button onClick={() => setModoAdmin(true)} className={`mode-btn ${modoAdmin ? 'ativo-dark' : ''}`}>
              <Edit3 size={14} className="mr-2" /> Atualização (Secretarias)
            </button>
          </div>
        </header>

        <div className="content-scroll">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'portfolio' && renderPortfolio()}
          {secretariasData[activeTab] && renderSecretaria(activeTab)}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SUBCOMPONENTES
   ========================================================= */
function NavItem({ item, active, onClick }) {
  return (
    <button onClick={onClick} className={`nav-item ${active ? 'ativo' : ''}`}>
      <item.icone size={17} className="nav-icon" />
      <span className="nav-label">{item.nome}</span>
    </button>
  );
}

function KpiItem({ icon: Icon, label, valor, tom = 'gold' }) {
  return (
    <div className="kpi-item">
      <div className={`kpi-icon tom-${tom}`}><Icon size={19} /></div>
      <div>
        <p className="kpi-label">{label}</p>
        <p className="kpi-valor">{valor}</p>
      </div>
    </div>
  );
}

function DossieCard({ tom, rotulo, Icone, linha1, valor, valorTexto, unidade, admin }) {
  return (
    <div className={`dossie tom-${tom}`}>
      <div className="dossie-top">
        <span className="dossie-rotulo">{rotulo}</span>
        <Icone size={18} className="opacity-70" />
      </div>
      <p className="dossie-linha1">{linha1}</p>
      {valor ? (
        <p className="dossie-valor">{valor} <span className="dossie-unidade">{unidade}</span></p>
      ) : (
        <p className="dossie-valor-texto">{valorTexto}</p>
      )}
      {admin}
    </div>
  );
}

function Termometro({ icon: Icon, tom, label, valor }) {
  return (
    <div className={`termometro tom-${tom}`}>
      <div className="flex items-center mb-1">
        <Icon size={13} className="mr-1.5" />
        <p className="termometro-label">{label}</p>
      </div>
      <p className="termometro-valor">{valor}</p>
    </div>
  );
}

function Barra({ icon: Icon, tom, titulo, pct }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="flex items-center text-ink"><Icon size={16} className={`mr-2 cor-${tom}`} /> {titulo}</span>
        <span className={`barra-pct tom-${tom}`}>{pct}%</span>
      </div>
      <div className="barra-trilho">
        <div className={`barra-fill tom-${tom}`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

/* =========================================================
   ESTILOS — design tokens
   ========================================================= */
const estilos = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root{
  --ink:#1E3A8A; --ink-2:#2748A6; --paper:#F2EFE6; --paper-2:#F8F6F0;
  --gold:#EA580C; --gold-dark:#B8430A;
  --verde:#5C7A4C; --terracota:#A8551E; --azul:#1D7FB0; --vinho:#7A2E3D; --alerta:#B23A2E;
  --stone:#8B8576; --texto:#1E2A22; --muted:#5B6359;
  --orange:#EA580C; --azul-marinho:#1E3A8A;
}
.app-root{ min-height:100vh; display:flex; flex-direction:column; background:var(--paper); font-family:'Inter',sans-serif; color:var(--texto); }
@media(min-width:768px){ .app-root{ flex-direction:row; } }
.font-display{ font-family:'Fraunces',serif; }
.text-muted{ color:var(--muted); } .text-stone{ color:var(--stone); }
.text-gold{ color:var(--gold); } .text-gold-dark{ color:var(--gold-dark); }
.bg-gold{ background:var(--gold); } .border-ink{ border-color:var(--ink); }

/* SIDEBAR */
.sidebar{ width:100%; background:var(--orange); color:#2B0E00; display:flex; flex-direction:column; box-shadow:2px 0 24px rgba(0,0,0,.2); flex-shrink:0; position:relative; }
.sidebar::after{ content:''; position:absolute; top:0; right:0; width:4px; height:100%; background:var(--ink); }
@media(min-width:768px){ .sidebar{ width:17rem; height:100vh; position:sticky; top:0; overflow:hidden; } }
.sidebar-brand{ padding:1.5rem; border-bottom:1px solid rgba(0,0,0,.14); text-align:center; }
.brand-title{ font-family:'Fraunces',serif; font-size:1.5rem; font-weight:700; letter-spacing:-0.02em; color:var(--ink); }
.brand-sub{ font-family:'Space Grotesk',monospace; font-size:.65rem; color:rgba(30,58,138,0.78); margin-top:.25rem; text-transform:uppercase; letter-spacing:.12em; font-weight:700; }
.sidebar-nav{ flex:1; padding:.75rem; flex-direction:column; gap:.15rem; overflow-y:auto; }
.nav-group-label{ font-family:'Space Grotesk',monospace; font-size:.62rem; text-transform:uppercase; letter-spacing:.14em; color:rgba(30,58,138,0.6); font-weight:800; padding:1rem .6rem .35rem; }
.nav-item{ display:flex; align-items:center; gap:.7rem; padding:.62rem .75rem; border-radius:.6rem; color:#2B0E00; font-weight:600; transition:all .15s; border-left:3px solid transparent; text-align:left; }
.nav-item:hover{ background:rgba(30,58,138,.12); color:var(--ink); }
.nav-item.ativo{ background:var(--ink); color:#fff; border-left-color:var(--orange); border-radius:.6rem; box-shadow:0 4px 12px -4px rgba(30,58,138,.5); }
.nav-item.ativo .nav-icon{ color:#fff !important; }
.nav-item.ativo .nav-label{ color:#fff; }
.nav-icon{ flex-shrink:0; color:var(--ink); opacity:1; }
.nav-label{ font-size:.78rem; font-weight:700; line-height:1.2; }
.nav-mobile{ display:flex; overflow-x:auto; padding:.5rem; gap:.4rem; background:var(--orange); border-bottom:1px solid rgba(0,0,0,.12); }
.nav-mobile::-webkit-scrollbar { display: none; }
.nav-pill{ display:flex; align-items:center; white-space:nowrap; padding:.45rem .85rem; border-radius:999px; font-size:.68rem; font-weight:700; color:#2B0E00; background:rgba(30,58,138,.12); flex-shrink:0; }
.nav-pill.ativo{ background:var(--ink); color:#fff; }
.nav-pill.ativo svg{ color:#fff !important; }

/* MAIN */
.main-area{ flex:1; display:flex; flex-direction:column; height:100vh; overflow:hidden; }
@media(max-width:767px){ .main-area{ height:auto; } }
.brand-strip{ height:4px; flex-shrink:0; background:linear-gradient(90deg, var(--orange) 0%, var(--orange) 50%, var(--ink) 50%, var(--ink) 100%); }
.topbar{ background:var(--paper-2); border-bottom:1px solid rgba(30,58,138,.12); padding:1.1rem 1.75rem; display:flex; flex-direction:column; gap:.9rem; flex-shrink:0; }
@media(min-width:768px){ .topbar{ flex-direction:row; justify-content:space-between; align-items:center; } }
.topbar-title{ font-family:'Fraunces',serif; font-size:1.3rem; font-weight:600; color:var(--ink); }
.topbar-sub{ font-family:'Space Grotesk',monospace; font-size:.65rem; color:var(--stone); margin-top:.2rem; text-transform:uppercase; letter-spacing:.1em; }
.mode-toggle{ display:flex; background:#fff; padding:.25rem; border-radius:.7rem; border:1px solid rgba(30,58,138,.16); }
.mode-btn{ padding:.5rem .9rem; font-size:.68rem; font-weight:700; border-radius:.5rem; display:flex; align-items:center; color:var(--muted); }
.mode-btn.ativo{ background:var(--paper); color:var(--gold-dark); }
.mode-btn.ativo-dark{ background:var(--ink); color:#fff; }
.content-scroll{ flex:1; overflow:auto; padding:1.25rem; }
@media(min-width:768px){ .content-scroll{ padding:2rem; } }

/* HERO */
.hero-card{ position:relative; overflow:hidden; background:linear-gradient(180deg,var(--ink) 0%,var(--ink-2) 100%); padding:2.25rem; border-radius:1.5rem; color:#fff; box-shadow:0 12px 30px -10px rgba(16,42,56,.5); }
.hero-horizon{ position:absolute; inset:0; width:100%; height:100%; }
.eyebrow-gold{ color:var(--gold); font-family:'Space Grotesk',monospace; font-weight:700; text-transform:uppercase; letter-spacing:.14em; font-size:.7rem; margin-bottom:.4rem; }
.hero-title{ font-family:'Fraunces',serif; font-size:2.1rem; font-weight:600; letter-spacing:-0.01em; }
@media(min-width:768px){ .hero-title{ font-size:2.5rem; } }
.hero-amp{ font-weight:300; font-size:1.6rem; color:#9FB4C0; margin:0 .4rem; }
.avatar-ring{ background:rgba(255,255,255,.08); border-radius:999px; display:flex; align-items:center; justify-content:center; border:3px solid var(--ink); box-shadow:inset 0 0 0 1px rgba(255,255,255,.06); }
.btn-gold{ display:flex; align-items:center; background:var(--gold); color:#fff; padding:.9rem 1.4rem; border-radius:.9rem; font-weight:700; font-size:.85rem; box-shadow:0 8px 18px -6px rgba(234,88,12,.55); transition:transform .15s; }
.btn-gold:hover{ transform:translateY(-2px); }

/* UTILIDADES DE COR UNIVERSAIS (Tokens) */
.cor-azul{ color:var(--azul); } .cor-terracota{ color:var(--terracota); } .cor-verde{ color:var(--verde); } .cor-gold{ color:var(--gold-dark); } .cor-vinho{ color:var(--vinho); }

.kpi-icon.tom-azul, .feed-icon.tom-azul, .barra-pct.tom-azul { background: #E9F1F5; color: var(--azul); }
.kpi-icon.tom-verde, .feed-icon.tom-verde, .barra-pct.tom-verde { background: #EEF3EA; color: var(--verde); }
.kpi-icon.tom-gold, .feed-icon.tom-gold, .barra-pct.tom-gold { background: #F5EBD8; color: var(--gold-dark); }
.kpi-icon.tom-terracota, .feed-icon.tom-terracota, .barra-pct.tom-terracota { background: #F3E7DC; color: var(--terracota); }
.kpi-icon.tom-vinho, .feed-icon.tom-vinho, .barra-pct.tom-vinho { background: #F2E6E8; color: var(--vinho); }

.barra-fill.tom-azul { background: var(--azul); }
.barra-fill.tom-verde { background: var(--verde); }
.barra-fill.tom-terracota { background: var(--terracota); }
.barra-fill.tom-gold { background: var(--gold); }
.barra-fill.tom-vinho { background: var(--vinho); }

.dossie.tom-azul { border-top-color: var(--azul); }
.dossie.tom-verde { border-top-color: var(--verde); }
.dossie.tom-terracota { border-top-color: var(--terracota); }
.dossie.tom-gold { border-top-color: var(--gold); }
.dossie.tom-vinho { border-top-color: var(--vinho); }

/* KPI strip */
.kpi-strip{ background:#fff; border-radius:1rem; box-shadow:0 1px 3px rgba(16,42,56,.06); border:1px solid rgba(16,42,56,.08); display:flex; flex-direction:column; }
@media(min-width:1024px){ .kpi-strip{ flex-direction:row; } }
.kpi-item{ flex:1; padding:1.1rem 1.3rem; display:flex; align-items:center; gap:1rem; border-bottom:1px solid rgba(16,42,56,.06); }
@media(min-width:1024px){ .kpi-item{ border-bottom:none; border-right:1px solid rgba(16,42,56,.06); } .kpi-item:last-child{ border-right:none; } }
.kpi-icon{ padding:.65rem; border-radius:.7rem; flex-shrink:0; }
.kpi-label{ font-family:'Space Grotesk',monospace; color:var(--stone); font-size:.62rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
.kpi-valor{ font-family:'Space Grotesk',monospace; font-size:1.3rem; font-weight:700; color:var(--ink); margin-top:.1rem; }

/* Dossie cards */
.dossie{ position:relative; background:#fff; padding:1.4rem; border-radius:1.1rem; border:1px solid rgba(16,42,56,.08); border-top:4px solid; min-height:11rem; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 1px 2px rgba(16,42,56,.04); }
.dossie-top{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:.9rem; color:var(--ink); }
.dossie-rotulo{ font-family:'Space Grotesk',monospace; font-size:.6rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; background:var(--paper); padding:.3rem .55rem; border-radius:.4rem; color:var(--ink); }
.dossie-linha1{ font-size:.82rem; font-weight:600; color:var(--muted); margin-bottom:.15rem; }
.dossie-valor{ font-family:'Fraunces',serif; font-size:2.1rem; font-weight:600; color:var(--ink); }
.dossie-unidade{ font-family:'Inter',sans-serif; font-size:.85rem; font-weight:500; color:var(--stone); }
.dossie-valor-texto{ font-family:'Fraunces',serif; font-size:1.55rem; font-weight:600; line-height:1.2; color:var(--ink); }
.btn-admin{ margin-top:.9rem; display:flex; align-items:center; justify-content:center; width:100%; background:var(--paper); color:var(--ink); font-size:.68rem; font-weight:700; padding:.6rem; border-radius:.6rem; border:1px solid rgba(16,42,56,.1); }
.btn-admin:hover{ background:#e3dcc6; }

/* Panels */
.panel{ background:#fff; padding:1.5rem; border-radius:1.4rem; border:1px solid rgba(16,42,56,.08); box-shadow:0 1px 2px rgba(16,42,56,.04); }
@media(min-width:768px){ .panel{ padding:1.9rem; } }
.panel-title{ font-family:'Fraunces',serif; font-weight:600; font-size:1.2rem; color:var(--ink); }
.page-title{ font-family:'Fraunces',serif; font-size:1.5rem; font-weight:600; color:var(--ink); display:flex; align-items:center; }

/* Termômetro */
.termometro{ padding:.9rem; border-radius:1rem; border:1px solid; }
.termometro.tom-verde{ background:#EEF3EA; border-color:#D6E2CC; color:var(--verde); }
.termometro.tom-azul{ background:#E9F1F5; border-color:#CFE0E8; color:var(--azul); }
.termometro.tom-alerta{ background:#F8EAE7; border-color:#EBCFC8; color:var(--alerta); cursor:pointer; }
.termometro-label{ font-family:'Space Grotesk',monospace; font-size:.62rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
.termometro-valor{ font-family:'Fraunces',serif; font-size:1.8rem; font-weight:700; margin-top:.1rem; }

/* Barras */
.barra-trilho{ width:100%; background:var(--paper); border-radius:999px; height:.6rem; overflow:hidden; border:1px solid rgba(16,42,56,.08); }
.barra-fill{ height:100%; border-radius:999px; }
.barra-pct{ padding:.1rem .5rem; border-radius:.4rem; font-family:'Space Grotesk',monospace; }

/* Feed */
.feed-icon{ padding:.5rem; border-radius:.7rem; flex-shrink:0; margin-top:.1rem; margin-right:.9rem; }

/* Portfolio timeline */
.timeline-dot{ position:absolute; left:-1.05rem; top:.35rem; width:1.85rem; height:1.85rem; border-radius:999px; display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 0 0 4px var(--paper); }
.timeline-dot.tom-gold{ background:var(--gold-dark); } .timeline-dot.tom-vinho{ background:var(--vinho); } .timeline-dot.tom-verde{ background:var(--verde); } .timeline-dot.tom-azul{ background:var(--azul); } .timeline-dot.tom-terracota{ background:var(--terracota); }
.card-flat{ background:#fff; padding:1.3rem; border-radius:1.1rem; border:1px solid rgba(16,42,56,.08); }
.card-flat-sm{ background:var(--paper-2); padding:1rem 1.1rem; border-radius:.9rem; border:1px solid rgba(16,42,56,.06); }
.tag-data{ display:inline-flex; align-items:center; font-family:'Space Grotesk',monospace; font-size:.66rem; font-weight:700; color:var(--stone); background:var(--paper-2); padding:.3rem .55rem; border-radius:.4rem; width:fit-content; }
.btn-gold-solid{ background:var(--gold); color:var(--ink); padding:.6rem 1.1rem; border-radius:.7rem; font-weight:700; font-size:.8rem; display:flex; align-items:center; }
.btn-ghost-gold{ display:flex; align-items:center; font-size:.78rem; background:#F5EBD8; color:var(--gold-dark); padding:.5rem .9rem; border-radius:.7rem; font-weight:700; }

/* Secretaria template */
.secao-icon{ padding:.85rem; border-radius:1rem; color:#fff; flex-shrink:0; }
.secao-icon.tom-gold{ background:var(--gold-dark); } .secao-icon.tom-verde{ background:var(--verde); } .secao-icon.tom-terracota{ background:var(--terracota); } .secao-icon.tom-azul{ background:var(--azul); } .secao-icon.tom-vinho{ background:var(--vinho); }
.kpi-row{ display:grid; grid-template-columns:1fr; gap:.9rem; }
@media(min-width:768px){ .kpi-row{ grid-template-columns:repeat(3,1fr); } }
.kpi-mini{ background:#fff; border-radius:1rem; padding:1.1rem 1.3rem; border:1px solid rgba(16,42,56,.08); border-left:4px solid; }
.kpi-mini.tom-gold{ border-left-color:var(--gold); } .kpi-mini.tom-verde{ border-left-color:var(--verde); } .kpi-mini.tom-terracota{ border-left-color:var(--terracota); } .kpi-mini.tom-azul{ border-left-color:var(--azul); } .kpi-mini.tom-vinho{ border-left-color:var(--vinho); }
.kpi-mini-label{ font-family:'Space Grotesk',monospace; font-size:.62rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--stone); }
.kpi-mini-valor{ font-family:'Fraunces',serif; font-size:1.6rem; font-weight:600; color:var(--ink); margin-top:.15rem; }

/* REGRAS PARA IMPRESSÃO (PDF Limpo) */
@media print {
  .app-root, .main-area, .content-scroll { height: auto !important; overflow: visible !important; background: white !important; }
  .hero-card { background: white !important; border: 2px solid #e2e8f0 !important; color: black !important; box-shadow: none !important; }
  .hero-horizon { display: none !important; }
  .panel, .card-flat, .kpi-strip { box-shadow: none !important; border: 1px solid #cbd5e1 !important; break-inside: avoid; }
  .nav-mobile, .sidebar, .topbar { display: none !important; }
  .text-white { color: black !important; }
  .eyebrow-gold { color: #8B8576 !important; }
}
`;