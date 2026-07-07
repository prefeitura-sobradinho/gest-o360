import React, { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  LayoutDashboard, HardHat, BookOpen, HeartPulse, Users, Music,
  TrendingUp, CheckCircle, Activity, Award, Home,
  FileText, Download, Trophy, Briefcase,
  Leaf, FileSignature, Map, Droplets, Calculator, Edit3, PlusCircle,
  Clock, User, DollarSign, AlertCircle, Phone, Mail, ChevronRight, Landmark,
  Search, Bell, Menu, X, Target, BarChart2, Building2, Shield,
  ArrowUpRight, ArrowDownRight, Globe, ChevronDown
} from 'lucide-react';

/* ── DADOS ── */
const municipio = { populacao:'31.800 hab.', area:'12.402 km²', pib:'R$ 380 Mi', idh:'0,614', altitude:'520 m', fundacao:'1962' };
const kpisGerais = { orcamentoPPA:'672,5 Mi', moradiasMCMV:90, investimentoEducacao:'7,1 Mi+', impactoEconomico:'10 Mi+', empregosGerados:'232' };
const statusAcoes = { concluidas:142, emExecucao:38, atrasadas:4, total:184 };

const orcamentoSecretarias = [
  { nome:'Infraestrutura', valor:200, cor:'#A8551E' },
  { nome:'Saúde', valor:150, cor:'#1D7FB0' },
  { nome:'Educação', valor:120, cor:'#1E3A8A' },
  { nome:'Assist. Social', valor:80, cor:'#7A2E3D' },
  { nome:'Agricultura', valor:60, cor:'#5C7A4C' },
  { nome:'Outros', valor:62.5, cor:'#8B8576' },
];

const execucaoSecretarias = [
  { nome:'Saúde', exec:80 }, { nome:'SEADS', exec:74 }, { nome:'SAAE', exec:70 },
  { nome:'Educação', exec:65 }, { nome:'Turismo', exec:55 }, { nome:'Agric.', exec:58 },
  { nome:'Convênios', exec:45 }, { nome:'Infra', exec:40 },
];

const eixosPPA = [
  { id:'social', nome:'Eixo Social', tom:'azul', cor:'#1D7FB0', descricao:'Saúde, Educação, Assistência Social e Habitação', icone:HeartPulse, orcamento:'R$ 270 Mi',
    metas:[{ nome:'Ampliar cobertura da Saúde da Família para 100%', pct:80 },{ nome:'Construir e reformar unidades escolares', pct:65 },{ nome:'Entregar 90 moradias pelo MCMV', pct:60 },{ nome:'Ampliar atendimento a famílias vulneráveis', pct:74 }] },
  { id:'infra', nome:'Eixo Infraestrutura', tom:'terracota', cor:'#A8551E', descricao:'Obras, Mobilidade, Saneamento e Urbanismo', icone:HardHat, orcamento:'R$ 200 Mi',
    metas:[{ nome:'Requalificar BA-316 (Sobradinho–Casa Nova)', pct:40 },{ nome:'Construir pontes e recuperar estradas vicinais', pct:25 },{ nome:'Expandir rede de esgoto urbana', pct:55 },{ nome:'Modernizar abastecimento de água', pct:70 }] },
  { id:'economico', nome:'Eixo Econômico', tom:'verde', cor:'#5C7A4C', descricao:'Agricultura, Turismo, Empreendedorismo e Renda', icone:TrendingUp, orcamento:'R$ 120 Mi',
    metas:[{ nome:'Apoiar 900+ famílias rurais com insumos', pct:58 },{ nome:'Estruturar turismo náutico do Lago', pct:30 },{ nome:'Gerar 500 novos empregos formais', pct:46 },{ nome:'Modernizar arrecadação fiscal', pct:62 }] },
  { id:'gestao', nome:'Eixo Gestão', tom:'vinho', cor:'#7A2E3D', descricao:'Planejamento, Transparência, Digitalização e Cidadania', icone:Shield, orcamento:'R$ 82,5 Mi',
    metas:[{ nome:'Portal de transparência em pleno funcionamento', pct:85 },{ nome:'Realizar concurso público', pct:100 },{ nome:'Digitalizar processos internos', pct:50 },{ nome:'Revisar Plano Diretor Municipal', pct:25 }] },
];

const atividadesRecentes = [
  { id:1, texto:'Escola Maria Ribeiro atingiu 90% de conclusão nas obras.', tempo:'Há 2 horas', icone:BookOpen, tom:'azul' },
  { id:2, texto:'Novo lote de 1.100 sacas de milho entregue na zona rural.', tempo:'Ontem', icone:Leaf, tom:'verde' },
  { id:3, texto:'Selo FNAS 2025 recebido e oficializado em Brasília.', tempo:'Há 2 dias', icone:Award, tom:'gold' },
  { id:4, texto:'Atendimentos de urgência ultrapassaram 5.900 no período.', tempo:'Há 3 dias', icone:HeartPulse, tom:'azul' },
  { id:5, texto:'Decreto Nº 034/2026 publicado — regula uso de áreas públicas.', tempo:'Há 4 dias', icone:FileText, tom:'stone' },
];

const linhaDoTempo = [
  { id:1, data:'Dezembro 2025', titulo:'Sanção do PPA 2026–2029', desc:'Lei Municipal Nº 712/2025 sancionada, garantindo o planejamento estratégico do município por quatro anos.', icone:FileText, tom:'gold' },
  { id:2, data:'Outubro 2025', titulo:'21º Forró do Vaqueiro', desc:'Maior edição da história. Mais de R$ 10 Milhões injetados na economia local. 3 dias de festa e cultura.', icone:Music, tom:'vinho' },
  { id:3, data:'Setembro 2025', titulo:'1ª Conferência de Desenvolvimento Rural', desc:'Foco em agricultura familiar e sustentabilidade no semiárido. Tema: Do solo à mesa.', icone:Leaf, tom:'verde' },
  { id:4, data:'Agosto 2025', titulo:'Posse de Novos Concursados', desc:'Fim de um hiato de 20 anos. Dezenas de servidores empossados para Saúde, Educação e SAAE.', icone:Users, tom:'azul' },
  { id:5, data:'Julho 2025', titulo:'Entrega das Quadras Poliesportivas', desc:'Requalificação do espaço Francisco Wellington M. Santos com R$ 872 mil investidos.', icone:Trophy, tom:'terracota' },
  { id:6, data:'Abril 2025', titulo:'Programa Peixe na Mesa', desc:'Distribuição de 5 toneladas de peixe na Semana Santa, agora garantido por Lei Municipal.', icone:CheckCircle, tom:'verde' },
  { id:7, data:'Janeiro 2025', titulo:'Início da Gestão Cleivynho & Canturil', desc:'Posse oficial da nova gestão para o mandato 2025–2029. Pacto com a população por desenvolvimento e transparência.', icone:Briefcase, tom:'gold' },
];

const secretariasMenu = [
  { id:'dashboard', nome:'Visão Geral', icone:LayoutDashboard, grupo:'principal' },
  { id:'ppa', nome:'PPA 2026–2029', icone:Target, grupo:'principal' },
  { id:'portfolio', nome:'Portfólio de Realizações', icone:Award, grupo:'principal' },
  { id:'gabinete', nome:'Gabinete do Prefeito', icone:Briefcase, grupo:'lideranca' },
  { id:'fazenda', nome:'Administração e Fazenda', icone:Calculator, grupo:'lideranca' },
  { id:'planejamento', nome:'Planejamento e Gestão', icone:Map, grupo:'lideranca' },
  { id:'agricultura', nome:'Agricultura e Meio Amb.', icone:Leaf, tom:'verde', grupo:'secretarias' },
  { id:'assistencia', nome:'Assistência Social (SEADS)', icone:Users, tom:'terracota', grupo:'secretarias' },
  { id:'convenios', nome:'Convênios', icone:FileSignature, tom:'azul', grupo:'secretarias' },
  { id:'educacao', nome:'Educação', icone:BookOpen, tom:'azul', grupo:'secretarias' },
  { id:'infra', nome:'Infraestrutura', icone:HardHat, tom:'terracota', grupo:'secretarias' },
  { id:'saude', nome:'Saúde (SMS)', icone:HeartPulse, tom:'azul', grupo:'secretarias' },
  { id:'setuc', nome:'Turismo, Esporte e Cultura', icone:Music, tom:'vinho', grupo:'secretarias' },
  { id:'saae', nome:'SAAE', icone:Droplets, tom:'azul', grupo:'secretarias' },
];

const secretariasData = {
  gabinete:{ titulo:'Gabinete do Prefeito', icone:Briefcase, tom:'gold', execucao:72, subtitulo:'Coordenação geral de governo e relação institucional',
    kpis:[{ label:'Decretos publicados em 2026', valor:'34', trend:'up', delta:'+8 vs 2025' },{ label:'Audiências públicas realizadas', valor:'12', trend:'up', delta:'+4 vs 2025' },{ label:'Ouvidoria respondida', valor:'96%', trend:'up', delta:'+6 p.p.' }],
    destaques:[{ titulo:'Agenda de Governo 2026', desc:'Prioridades do primeiro semestre alinhadas às metas do PPA 2026-2029, com acompanhamento mensal por secretaria.' },{ titulo:'Posse de Novos Concursados', desc:'Fim de um hiato de 20 anos: dezenas de servidores empossados para Saúde, Educação e SAAE.' },{ titulo:'Diálogos com a Comunidade', desc:'Visitas semanais às localidades rurais para escuta direta da população e levantamento de demandas.' }],
    responsavel:'Joselito Macedo — Chefe de Gabinete', contato:'gabinetepms@gmail.com' },
  fazenda:{ titulo:'Administração e Fazenda', icone:Calculator, tom:'gold', execucao:62, subtitulo:'Gestão orçamentária, arrecadação e transparência fiscal',
    kpis:[{ label:'Orçamento PPA 2026-2029', valor:'R$ 672,5 Mi', trend:'neutral', delta:'Lei Nº 712/2025' },{ label:'Execução orçamentária', valor:'38%', trend:'up', delta:'+12 p.p.' },{ label:'Receita própria, var. anual', valor:'+11%', trend:'up', delta:'vs 2024' }],
    destaques:[{ titulo:'PPA 2026-2029 Sancionado', desc:'Lei Municipal Nº 712/2025 estabelece o planejamento estratégico e orçamentário dos próximos quatro anos.' },{ titulo:'Modernização do Fisco Municipal', desc:'Reestruturação da cobrança de IPTU e ISS com novo cadastro imobiliário digital.' },{ titulo:'Transparência Ativa', desc:'Portal da transparência atualizado conforme exigências da Lei de Acesso à Informação.' }],
    responsavel:'Luiz Nery Junior — Secretário', contato:'fazenda@sobradinho.ba.gov.br' },
  planejamento:{ titulo:'Planejamento e Gestão', icone:Map, tom:'gold', execucao:68, subtitulo:'Articulação de metas, indicadores e instrumentos de planejamento',
    kpis:[{ label:'Metas do PPA monitoradas', valor:'184', trend:'neutral', delta:'Total do PPA' },{ label:'Ações concluídas', valor:'142', trend:'up', delta:'77% do total' },{ label:'Ações em execução', valor:'38', trend:'neutral', delta:'21% do total' }],
    destaques:[{ titulo:'Sanção do PPA 2026-2029', desc:'Instrumento central de planejamento da gestão, com 184 metas distribuídas entre as 11 secretarias.' },{ titulo:'Painel de Indicadores Municipais', desc:'Mapeamento de indicadores socioeconômicos para orientar a tomada de decisão.' },{ titulo:'Revisão do Plano Diretor', desc:'Atualização participativa do zoneamento urbano e rural do município.' }],
    responsavel:'Alexandre Deles — Secretário', contato:'sobradinho.seplan@gmail.com' },
  agricultura:{ titulo:'Agricultura e Meio Ambiente', icone:Leaf, tom:'verde', execucao:58, subtitulo:'Apoio à produção rural, segurança alimentar e sustentabilidade',
    kpis:[{ label:'Sacas de milho distribuídas', valor:'1.100', trend:'up', delta:'+22% vs 2024' },{ label:'Toneladas de peixe entregues', valor:'5 t', trend:'neutral', delta:'Semana Santa' },{ label:'Famílias rurais atendidas', valor:'900+', trend:'up', delta:'+80 famílias' }],
    destaques:[{ titulo:'1ª Conferência de Desenvolvimento Rural', desc:'Tema "Do solo à mesa", com foco em agricultura familiar e sustentabilidade no semiárido.' },{ titulo:'Programa Peixe na Mesa', desc:'Distribuição de 5 toneladas de peixe na Semana Santa, agora garantida por Lei Municipal.' },{ titulo:'Apoio à Agricultura Familiar', desc:'Distribuição de sementes, insumos e assistência técnica para produtores da zona rural.' }],
    responsavel:'Adilson Rodrigues Ribeiro — Secretário', contato:'pmsseama.gov.br@gmail.com' },
  assistencia:{ titulo:'Assistência Social — SEADS', icone:Users, tom:'terracota', execucao:74, subtitulo:'Proteção social, segurança alimentar e atenção às famílias',
    kpis:[{ label:'Famílias assistidas', valor:'2.800+', trend:'up', delta:'+200 famílias' },{ label:'Reconhecimento nacional', valor:'Selo FNAS', trend:'up', delta:'2025' },{ label:'Unidades CRAS ativas', valor:'3', trend:'neutral', delta:'Em funcionamento' }],
    destaques:[{ titulo:'Selo FNAS 2025', desc:'Reconhecimento recebido e oficializado em Brasília pela qualidade da gestão do SUAS.' },{ titulo:'Ampliação do Atendimento no CRAS', desc:'Novo horário estendido e reforço de equipe técnica nas unidades de referência.' },{ titulo:'Mutirão do Cadastro Único', desc:'Atualização cadastral de famílias para acesso a benefícios e programas sociais.' }],
    responsavel:'Raimundo Nonato — Secretário', contato:'seadssob@gmail.com' },
  convenios:{ titulo:'Convênios', icone:FileSignature, tom:'azul', execucao:45, subtitulo:'Captação e gestão de recursos com Estado, União e instituições financeiras',
    kpis:[{ label:'Convênios ativos', valor:'7', trend:'up', delta:'+3 em 2025' },{ label:'Recursos captados em 2025', valor:'R$ 18 Mi+', trend:'up', delta:'Novos recursos' },{ label:'Moradias via Caixa/MCMV', valor:'90', trend:'neutral', delta:'Contratadas' }],
    destaques:[{ titulo:'PRO-RODOVIAS', desc:'Mobilização e consulta para construção de pontes e correção de estradas vicinais na zona rural.' },{ titulo:'Convênio Caixa — Minha Casa Minha Vida', desc:'90 moradias contratadas em parceria com a Caixa Econômica Federal.' },{ titulo:'Parceria SEINFRA — BA-316', desc:'Convênio com o Governo do Estado para requalificação asfáltica da rodovia.' }],
    responsavel:'Jheny Klay — Secretária', contato:'gabinetepms@gmail.com' },
  educacao:{ titulo:'Educação', icone:BookOpen, tom:'azul', execucao:65, subtitulo:'Infraestrutura escolar, aprendizagem e acesso',
    kpis:[{ label:'Investimento 2025', valor:'R$ 7,1 Mi+', trend:'up', delta:'+15% vs 2024' },{ label:'Escola Maria Ribeiro', valor:'90% obra', trend:'up', delta:'Em conclusão' },{ label:'Alunos na rede municipal', valor:'4.200+', trend:'up', delta:'+180 matrículas' }],
    destaques:[{ titulo:'Escola Maria Ribeiro', desc:'Obra de reconstrução atingiu 90% de conclusão, com entrega prevista para o próximo semestre.' },{ titulo:'Alfabetização na Idade Certa', desc:'Programa de reforço pedagógico para garantir alfabetização até o 2º ano.' },{ titulo:'Transporte Escolar Rural', desc:'Ampliação de rotas para atender comunidades mais distantes da zona rural.' }],
    responsavel:'Ducilene Kestering — Secretária', contato:'sec.educ.sobradinho@gmail.com' },
  infra:{ titulo:'Infraestrutura e Serviços Públicos', icone:HardHat, tom:'terracota', execucao:40, subtitulo:'Mobilidade, obras públicas e requalificação urbana',
    kpis:[{ label:'Investido em quadras', valor:'R$ 872 Mil', trend:'neutral', delta:'Concluído' },{ label:'BA-316', valor:'Em execução', trend:'up', delta:'Iniciado 2025' },{ label:'Estradas vicinais em consulta', valor:'14', trend:'neutral', delta:'PRO-RODOVIAS' }],
    destaques:[{ titulo:'BA-316 (Sobradinho - Casa Nova)', desc:'Requalificação asfáltica iniciada em parceria com a SEINFRA e o Governo do Estado.' },{ titulo:'PRO-RODOVIAS', desc:'Mobilização e consulta para construção de pontes e correção de estradas vicinais na zona rural.' },{ titulo:'Quadras Poliesportivas', desc:'Requalificação do espaço Francisco Wellington M. Santos, com R$ 872 mil investidos.' }],
    responsavel:'Jarques Canturil — Vice-Prefeito e Sec. de Infra', contato:'(74) 9 9958-0501' },
  saude:{ titulo:'Saúde — SMS', icone:HeartPulse, tom:'azul', execucao:80, subtitulo:'Atenção básica, urgência e vigilância em saúde',
    kpis:[{ label:'Atendimentos no período', valor:'15.000+', trend:'up', delta:'+12% vs 2024' },{ label:'Atendimentos de urgência', valor:'5.900+', trend:'up', delta:'Ampliação de plantões' },{ label:'Equipes de Saúde da Família', valor:'9', trend:'up', delta:'+2 equipes' }],
    destaques:[{ titulo:'Reforço da Urgência e Emergência', desc:'Atendimentos de urgência ultrapassaram 5.900 no período, com ampliação de plantões.' },{ titulo:'Postos de Saúde Rural', desc:'Ampliação de horários e equipe técnica em unidades da zona rural.' },{ titulo:'Programa Saúde da Família', desc:'Expansão de equipes para cobertura territorial mais ampla do município.' }],
    responsavel:'Josefa Moreira — Secretária', contato:'sms@sobradinho.ba.gov.br' },
  setuc:{ titulo:'Turismo, Esporte e Cultura', icone:Music, tom:'vinho', execucao:55, subtitulo:'Identidade cultural, lazer e desenvolvimento turístico do Lago de Sobradinho',
    kpis:[{ label:'Impacto econômico do Forró', valor:'R$ 10 Mi+', trend:'up', delta:'Maior edição' },{ label:'Edição do Forró do Vaqueiro', valor:'21ª', trend:'neutral', delta:'Outubro 2025' },{ label:'Quadras requalificadas', valor:'1', trend:'neutral', delta:'R$ 872 Mil' }],
    destaques:[{ titulo:'21º Forró do Vaqueiro', desc:'Maior edição da história do evento, com mais de R$ 10 milhões injetados na economia local.' },{ titulo:'Quadras Poliesportivas', desc:'Requalificação do espaço Francisco Wellington M. Santos para prática esportiva comunitária.' },{ titulo:'Turismo do Lago de Sobradinho', desc:'Estruturação de roteiros e apoio a empreendedores do turismo náutico e rural.' }],
    responsavel:'Patrick Carvalho — Secretário (SETUC)', contato:'setuc@sobradinho.ba.gov.br' },
  saae:{ titulo:'SAAE — Água e Esgoto', icone:Droplets, tom:'azul', execucao:70, subtitulo:'Abastecimento de água e saneamento básico',
    kpis:[{ label:'Cobertura de abastecimento', valor:'87%', trend:'up', delta:'+3 p.p.' },{ label:'Ligações de esgoto novas', valor:'340', trend:'up', delta:'Em 2025' },{ label:'Redução de perdas', valor:'-6 p.p.', trend:'up', delta:'Macromedição' }],
    destaques:[{ titulo:'Modernização do Abastecimento', desc:'Substituição de redes antigas e instalação de hidrômetros em bairros centrais.' },{ titulo:'Ampliação da Rede de Esgoto', desc:'Extensão da coleta para novos loteamentos e zona de expansão urbana.' },{ titulo:'Combate a Perdas', desc:'Programa de monitoramento de vazamentos com redução já registrada na macromedição.' }],
    responsavel:'Domingos Vieira — Diretor Geral', contato:'saae@sobradinho.ba.gov.br' },
};

/* ── TOOLTIP CUSTOMIZADO ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background:'#1E3A8A', borderRadius:8, padding:'8px 12px', fontSize:11, fontFamily:'DM Mono,monospace', color:'#fff', boxShadow:'0 4px 16px rgba(0,0,0,.25)', border:'none' }}>
      <p style={{ opacity:.7, marginBottom:2 }}>{label}</p>
      <p style={{ fontWeight:600 }}>{payload[0].value}{payload[0].name === 'exec' ? '%' : ''}</p>
    </div>
  );
};

/* ── APP ── */
export default function Gestao360() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modoAdmin, setModoAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busca, setBusca] = useState('');

  const handleSimulateEdit = (tipo) => alert(`SIMULAÇÃO: Formulário para atualizar "${tipo}".`);
  const navFiltrado = useMemo(() => secretariasMenu.filter(i => i.nome.toLowerCase().includes(busca.toLowerCase())), [busca]);
  const itemAtivo = secretariasMenu.find(i => i.id === activeTab);
  const navigateTo = (id) => { setActiveTab(id); setSidebarOpen(false); };

  const AdminBtn = ({ onClick, texto = 'Atualizar informação' }) => {
    if (!modoAdmin) return null;
    return <button onClick={onClick} className="btn-admin"><Edit3 size={12} className="mr-1.5" /> {texto}</button>;
  };

  /* ── DASHBOARD ── */
  const renderDashboard = () => (
    <div className="space-y-5">
      {/* HERO */}
      <div className="hero-card">
        <div className="hero-bg-pattern" aria-hidden="true">
          <div className="hero-circle c1" />
          <div className="hero-circle c2" />
          <div className="hero-accent-line" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
            <div className="flex -space-x-3 shrink-0">
              <div className="avatar-ring w-[72px] h-[72px] z-10 relative">
                <User size={30} />
                <span className="avatar-badge" />
              </div>
              <div className="avatar-ring w-14 h-14 mt-4 opacity-60">
                <User size={24} />
              </div>
            </div>
            <div>
              <p className="eyebrow-label">Gestão Municipal 2025 – 2029</p>
              <h1 className="hero-title">Cleivynho <span className="hero-amp">&</span> Canturil</h1>
              <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                <p className="text-sm text-white/85"><span className="font-semibold text-white">Prefeito</span> — Regis Cleivys Sampaio Bento</p>
                <p className="text-sm text-white/55"><span className="font-semibold text-white/75">Vice-Prefeito</span> — Carlos Jarques Canturil da Silva</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <div className="municipio-chip"><Globe size={13} className="mr-1.5 opacity-60" /> Sobradinho · BA</div>
            <button onClick={() => window.print()} className="btn-hero print:hidden"><Download size={15} className="mr-2" /> Relatório PDF</button>
          </div>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="kpi-strip">
        <KpiCard icon={Calculator} label="Orçamento PPA" valor={`R$ ${kpisGerais.orcamentoPPA}`} sub="2026–2029" acent="#EA580C" />
        <KpiCard icon={BookOpen} label="Investimento Educação" valor={`R$ ${kpisGerais.investimentoEducacao}`} sub="+15% vs 2024" trend="up" acent="#1D7FB0" />
        <KpiCard icon={Music} label="Impacto Econômico" valor={`R$ ${kpisGerais.impactoEconomico}`} sub="Forró do Vaqueiro" trend="up" acent="#7A2E3D" />
        <KpiCard icon={Users} label="Novos Servidores" valor={`${kpisGerais.empregosGerados} vagas`} sub="Concurso público" trend="up" acent="#5C7A4C" />
      </div>

      {/* GRID CENTRAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bloco PPA + Gráfico */}
        <div className="panel lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="panel-title">Avanço do PPA 2026–2029</h3>
              <p className="panel-sub">184 metas · execução geral do plano</p>
            </div>
            <button onClick={() => navigateTo('ppa')} className="btn-ghost-sm">Detalhar <ChevronRight size={13} className="ml-1" /></button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Termometro icon={CheckCircle} tom="verde" label="Concluídas" valor={statusAcoes.concluidas} sub={`${Math.round(statusAcoes.concluidas/statusAcoes.total*100)}% do total`} />
            <Termometro icon={Activity} tom="azul" label="Em Execução" valor={statusAcoes.emExecucao} sub={`${Math.round(statusAcoes.emExecucao/statusAcoes.total*100)}% do total`} />
            <Termometro icon={AlertCircle} tom="alerta" label="Atrasadas" valor={statusAcoes.atrasadas} sub="Requer atenção" />
          </div>
          <div>
            <p className="secao-label mb-3">Execução orçamentária por secretaria</p>
            <ResponsiveContainer width="100%" height={175}>
              <BarChart data={execucaoSecretarias} margin={{ top:0, right:0, left:-28, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,58,138,0.06)" vertical={false} />
                <XAxis dataKey="nome" tick={{ fontSize:10, fontFamily:'DM Mono,monospace', fill:'#8B8576' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fontFamily:'DM Mono,monospace', fill:'#8B8576' }} unit="%" axisLine={false} tickLine={false} domain={[0,100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="exec" radius={[5,5,0,0]}>
                  {execucaoSecretarias.map((entry, i) => (
                    <Cell key={i} fill={entry.exec >= 70 ? '#5C7A4C' : entry.exec >= 50 ? '#1D7FB0' : '#EA580C'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {[['#5C7A4C','≥ 70% — Em dia'],['#1D7FB0','50–69% — Atenção'],['#EA580C','< 50% — Crítico']].map(([cor,txt]) => (
                <div key={txt} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background:cor }} />
                  <span className="text-[10px] font-mono-data text-stone">{txt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="space-y-5">
          <div className="panel">
            <h3 className="panel-title mb-0.5">Distribuição Orçamentária</h3>
            <p className="panel-sub mb-3">R$ 672,5 Mi · PPA 2026–2029</p>
            <ResponsiveContainer width="100%" height={155}>
              <PieChart>
                <Pie data={orcamentoSecretarias} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="valor" paddingAngle={3}>
                  {orcamentoSecretarias.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                </Pie>
                <Tooltip content={({ active, payload }) => active && payload?.length ? (
                  <div style={{ background:'#1E3A8A', borderRadius:8, padding:'7px 11px', fontSize:11, fontFamily:'DM Mono,monospace', color:'#fff' }}>
                    <p style={{ opacity:.7 }}>{payload[0].name}</p>
                    <p style={{ fontWeight:600 }}>R$ {payload[0].value} Mi</p>
                  </div>
                ) : null} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-1">
              {orcamentoSecretarias.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background:s.cor }} />
                  <span className="text-[10px] font-mono-data text-muted truncate">{s.nome}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title flex items-center mb-4"><Clock size={15} className="mr-2 text-stone" /> Feed da Gestão</h3>
            <div className="space-y-4">
              {atividadesRecentes.map((a) => (
                <div key={a.id} className="flex items-start gap-3 group">
                  <div className={`feed-icon tom-${a.tom}`}><a.icone size={14} /></div>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-snug group-hover:text-orange transition-colors">{a.texto}</p>
                    <p className="text-[10px] text-stone mt-0.5 font-mono-data">{a.tempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DADOS DO MUNICÍPIO */}
      <div className="panel">
        <h3 className="panel-title flex items-center mb-4"><Building2 size={16} className="mr-2 text-stone" /> Dados do Município</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[['População',municipio.populacao],['Área territorial',municipio.area],['PIB estimado',municipio.pib],['IDH Municipal',municipio.idh],['Altitude média',municipio.altitude],['Fundação',municipio.fundacao]].map(([l,v],i) => (
            <div key={i} className="municipio-stat">
              <p className="text-[10px] font-mono-data text-stone uppercase tracking-wider">{l}</p>
              <p className="text-base font-bold text-ink font-display mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ALERTA */}
      {statusAcoes.atrasadas > 0 && (
        <div className="alerta-bar">
          <AlertCircle size={15} className="shrink-0" />
          <span><strong>{statusAcoes.atrasadas} ações</strong> do PPA estão com execução atrasada em relação ao cronograma.</span>
          <button onClick={() => navigateTo('ppa')} className="alerta-btn">Ver PPA →</button>
        </div>
      )}
    </div>
  );

  /* ── PPA ── */
  const renderPPA = () => (
    <div className="space-y-5 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="page-title"><Target className="mr-3 text-orange" size={22} /> PPA 2026–2029</h2>
          <p className="text-sm text-muted mt-1">Lei Municipal Nº 712/2025 · 184 metas estratégicas distribuídas em 4 eixos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="badge-verde"><CheckCircle size={11} className="mr-1" /> {statusAcoes.concluidas} concluídas</span>
          <span className="badge-azul"><Activity size={11} className="mr-1" /> {statusAcoes.emExecucao} em execução</span>
          <span className="badge-alerta"><AlertCircle size={11} className="mr-1" /> {statusAcoes.atrasadas} atrasadas</span>
        </div>
      </div>
      <div className="panel">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-bold text-ink">Execução Global — {Math.round(statusAcoes.concluidas/statusAcoes.total*100)}%</p>
          <span className="font-mono-data text-xs text-stone">{statusAcoes.concluidas} de {statusAcoes.total} metas · Jan/2025–Dez/2029</span>
        </div>
        <div className="barra-trilho h-2.5"><div className="barra-fill tom-orange h-2.5 transition-all" style={{ width:`${Math.round(statusAcoes.concluidas/statusAcoes.total*100)}%` }} /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {eixosPPA.map(eixo => {
          const media = Math.round(eixo.metas.reduce((a,m) => a+m.pct,0)/eixo.metas.length);
          return (
            <div key={eixo.id} className="panel">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`eixo-icon tom-${eixo.tom}`}><eixo.icone size={18} /></div>
                  <div>
                    <h3 className="font-bold text-ink font-display text-base">{eixo.nome}</h3>
                    <p className="text-xs text-muted mt-0.5">{eixo.descricao}</p>
                  </div>
                </div>
                <div className={`exec-badge tom-${eixo.tom}`}>{media}%</div>
              </div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <span className="text-[10px] font-mono-data text-stone uppercase tracking-wider">Orçamento do Eixo</span>
                <span className="font-mono-data text-sm font-bold text-ink">{eixo.orcamento}</span>
              </div>
              <div className="space-y-3.5">
                {eixo.metas.map((meta,i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5 gap-2">
                      <span className="text-ink font-medium leading-snug">{meta.nome}</span>
                      <span className={`font-mono-data font-bold shrink-0 ${meta.pct===100?'text-verde':meta.pct<35?'text-alerta':'text-ink'}`}>{meta.pct}%</span>
                    </div>
                    <div className="barra-trilho"><div className={`barra-fill ${meta.pct===100?'tom-verde':meta.pct<35?'tom-alerta':`tom-${eixo.tom}`} transition-all`} style={{ width:`${meta.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ── PORTFÓLIO ── */
  const renderPortfolio = () => (
    <div className="space-y-5 max-w-3xl">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="page-title"><Award className="mr-3 text-orange" size={22} /> Portfólio de Realizações</h2>
          <p className="text-sm text-muted mt-1">Histórico consolidado de entregas — Gestão Cleivynho Sampaio</p>
        </div>
        {modoAdmin && <button onClick={() => handleSimulateEdit('Nova Entrega')} className="btn-gold-solid"><PlusCircle size={14} className="mr-2" /> Registrar Entrega</button>}
      </div>
      <div className="relative border-l-2 border-slate-200 ml-5 space-y-6 pb-10">
        {linhaDoTempo.map((item) => (
          <div key={item.id} className="relative pl-9">
            <div className={`timeline-dot tom-${item.tom}`}><item.icone size={13} /></div>
            <div className="card-flat">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                <h3 className="text-base font-bold text-ink font-display leading-snug">{item.titulo}</h3>
                <span className="tag-data shrink-0"><Clock size={11} className="mr-1" /> {item.data}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              {modoAdmin && <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end"><button onClick={() => handleSimulateEdit(`Editar: ${item.titulo}`)} className="text-xs font-bold text-orange hover:text-ink flex items-center gap-1 transition-colors"><Edit3 size={11} /> Editar</button></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── SECRETARIA ── */
  const renderSecretaria = (id) => {
    const s = secretariasData[id];
    if (!s) return null;
    return (
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-start gap-4">
          <div className={`secao-icon tom-${s.tom}`}><s.icone size={22} /></div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="page-title leading-none">{s.titulo}</h2>
                <p className="text-sm text-muted mt-1">{s.subtitulo}</p>
              </div>
              <div className={`exec-badge tom-${s.tom} text-sm`}>{s.execucao}% executado</div>
            </div>
            <div className="mt-3 barra-trilho h-2"><div className={`barra-fill tom-${s.tom} h-2 transition-all`} style={{ width:`${s.execucao}%` }} /></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {s.kpis.map((k,i) => (
            <div key={i} className={`kpi-mini tom-${s.tom}`}>
              <p className="kpi-mini-label">{k.label}</p>
              <p className="kpi-mini-valor">{k.valor}</p>
              {k.delta && <p className={`text-[10px] font-mono-data mt-1 flex items-center gap-0.5 ${k.trend==='up'?'text-verde':k.trend==='down'?'text-alerta':'text-stone'}`}>{k.trend==='up'&&<ArrowUpRight size={11}/>}{k.trend==='down'&&<ArrowDownRight size={11}/>}{k.delta}</p>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 panel">
            <div className="flex justify-between items-center mb-5">
              <h3 className="panel-title">Destaques e Ações</h3>
              {modoAdmin && <button onClick={() => handleSimulateEdit(`Novo destaque — ${s.titulo}`)} className="btn-ghost-sm"><PlusCircle size={12} className="mr-1" /> Adicionar</button>}
            </div>
            <div className="space-y-3">
              {s.destaques.map((d,i) => (
                <div key={i} className="card-flat-sm">
                  <h4 className="font-bold text-ink font-display text-sm flex items-center"><ChevronRight size={14} className={`mr-1.5 shrink-0 cor-${s.tom}`} /> {d.titulo}</h4>
                  <p className="text-xs text-muted mt-1.5 ml-5 leading-relaxed">{d.desc}</p>
                  {modoAdmin && <div className="mt-2 ml-5 flex justify-end"><button onClick={() => handleSimulateEdit(d.titulo)} className="text-xs font-bold text-orange hover:text-ink flex items-center gap-1 transition-colors"><Edit3 size={11} /> Editar</button></div>}
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3 className="panel-title mb-5">Informações</h3>
            <div className="space-y-4 text-sm">
              <InfoRow icon={Landmark} label="Responsável" valor={s.responsavel} />
              <InfoRow icon={Mail} label="Contato" valor={s.contato} />
              <InfoRow icon={Phone} label="Atendimento" valor="Seg. a sex., 8h às 14h" />
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="secao-label mb-2">Execução orçamentária</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 barra-trilho"><div className={`barra-fill tom-${s.tom}`} style={{ width:`${s.execucao}%` }} /></div>
                <span className={`font-mono-data text-sm font-bold cor-${s.tom}`}>{s.execucao}%</span>
              </div>
            </div>
            <AdminBtn onClick={() => handleSimulateEdit(`Dados — ${s.titulo}`)} texto="Atualizar Informações" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-root">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''} print:hidden`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo-area">
            <div className="brand-emblem"><span className="brand-emblem-letter">S</span></div>
            <div>
              <h1 className="brand-title">Gestão<span className="brand-360">360</span></h1>
              <p className="brand-sub">Prefeitura de Sobradinho · BA</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="sidebar-close md:hidden"><X size={17} /></button>
          </div>
          <div className="search-wrap mt-3">
            <Search size={12} className="search-icon" />
            <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar secretaria…" className="search-input" />
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {busca ? (
            <>
              <p className="nav-group-label">Resultados</p>
              {navFiltrado.map(item => <NavItem key={item.id} item={item} active={activeTab===item.id} onClick={() => navigateTo(item.id)} />)}
              {navFiltrado.length===0 && <p className="nav-empty">Nenhum resultado</p>}
            </>
          ) : (
            <>
              <p className="nav-group-label">Principal</p>
              {secretariasMenu.filter(i=>i.grupo==='principal').map(item => <NavItem key={item.id} item={item} active={activeTab===item.id} onClick={() => navigateTo(item.id)} />)}
              <p className="nav-group-label">Liderança</p>
              {secretariasMenu.filter(i=>i.grupo==='lideranca').map(item => <NavItem key={item.id} item={item} active={activeTab===item.id} onClick={() => navigateTo(item.id)} />)}
              <p className="nav-group-label">Secretarias</p>
              {secretariasMenu.filter(i=>i.grupo==='secretarias').map(item => <NavItem key={item.id} item={item} active={activeTab===item.id} onClick={() => navigateTo(item.id)} />)}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <p className="text-[10px] font-mono-data text-royal/40 text-center">Atualizado em Jun · 2026</p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-area">
        <div className="brand-strip print:hidden" />
        <header className="topbar print:hidden">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="topbar-menu-btn md:hidden"><Menu size={19} /></button>
            <div>
              <h2 className="topbar-title">{itemAtivo?.nome ?? 'Gestão 360'}</h2>
              <p className="topbar-sub">Prefeitura Municipal de Sobradinho-BA · 2025–2029</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {statusAcoes.atrasadas > 0 && (
              <button className="notif-btn" onClick={() => navigateTo('ppa')}>
                <Bell size={15} /><span className="notif-badge">{statusAcoes.atrasadas}</span>
              </button>
            )}
            <div className="mode-toggle">
              <button onClick={() => setModoAdmin(false)} className={`mode-btn ${!modoAdmin?'ativo':''}`}><LayoutDashboard size={12} className="mr-1.5" /> Público</button>
              <button onClick={() => setModoAdmin(true)} className={`mode-btn ${modoAdmin?'ativo-dark':''}`}><Edit3 size={12} className="mr-1.5" /> Admin</button>
            </div>
          </div>
        </header>

        <div className="content-scroll">
          {activeTab==='dashboard' && renderDashboard()}
          {activeTab==='ppa' && renderPPA()}
          {activeTab==='portfolio' && renderPortfolio()}
          {secretariasData[activeTab] && renderSecretaria(activeTab)}
        </div>
      </main>
    </div>
  );
}

/* ── SUB-COMPONENTES ── */
function NavItem({ item, active, onClick }) {
  return (
    <button onClick={onClick} className={`nav-item ${active ? 'ativo' : ''}`}>
      <item.icone size={15} className="nav-icon shrink-0" />
      <span className="nav-label">{item.nome}</span>
    </button>
  );
}

function KpiCard({ icon:Icon, label, valor, sub, trend, acent='#EA580C' }) {
  return (
    <div className="kpi-item" style={{ '--acent': acent }}>
      <div className="kpi-icon-wrap" style={{ background: acent+'18', color: acent }}><Icon size={19} /></div>
      <div className="min-w-0">
        <p className="kpi-label">{label}</p>
        <p className="kpi-valor">{valor}</p>
        {sub && <p className={`flex items-center gap-0.5 text-[10px] font-mono-data mt-0.5 ${trend==='up'?'text-verde':'text-stone'}`}>{trend==='up'&&<ArrowUpRight size={10}/>}{sub}</p>}
      </div>
      <div className="kpi-acent-bar" style={{ background: acent }} />
    </div>
  );
}

function Termometro({ icon:Icon, tom, label, valor, sub }) {
  return (
    <div className={`termometro tom-${tom}`}>
      <div className="flex items-center gap-1.5 mb-1"><Icon size={12}/><p className="termometro-label">{label}</p></div>
      <p className="termometro-valor">{valor}</p>
      {sub && <p className="text-[10px] font-mono-data opacity-65 mt-0.5">{sub}</p>}
    </div>
  );
}

function InfoRow({ icon:Icon, label, valor }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={14} className="mt-0.5 text-stone shrink-0"/>
      <div>
        <p className="text-[10px] font-mono-data uppercase tracking-wider text-stone">{label}</p>
        <p className="text-ink font-semibold text-sm mt-0.5 leading-snug">{valor}</p>
      </div>
    </div>
  );
}

/* ── CSS ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

:root{
  --orange:#EA580C; --orange-dark:#B8430A; --orange-bg:#FFF1EB;
  --royal:#1E3A8A; --royal-2:#2748A6; --royal-bg:#EEF2FF;
  --paper:#F3F0E8; --paper-2:#F9F7F2;
  --verde:#5C7A4C; --terracota:#A8551E; --azul:#1D7FB0; --vinho:#7A2E3D; --alerta:#B23A2E;
  --stone:#8B8576; --muted:#5B6359; --ink:#1C2331;
  --white:#FFFFFF;
}
*,*::before,*::after{box-sizing:border-box;margin:0;}
.font-display{font-family:'Fraunces',serif;}
.font-mono-data{font-family:'DM Mono',monospace;}
.text-muted{color:var(--muted);} .text-stone{color:var(--stone);} .text-ink{color:var(--ink);}
.text-orange{color:var(--orange);} .text-verde{color:var(--verde);} .text-alerta{color:var(--alerta);}
.cor-azul{color:var(--azul);} .cor-terracota{color:var(--terracota);} .cor-verde{color:var(--verde);}
.cor-gold{color:var(--orange-dark);} .cor-vinho{color:var(--vinho);}

/* LAYOUT */
.app-root{min-height:100vh;display:flex;flex-direction:column;background:var(--paper);font-family:'Inter',sans-serif;color:var(--ink);}
@media(min-width:768px){.app-root{flex-direction:row;}}

/* SIDEBAR */
.sidebar{
  width:15.5rem;background:var(--orange);
  display:flex;flex-direction:column;flex-shrink:0;position:relative;z-index:50;
  box-shadow:3px 0 20px rgba(0,0,0,.16);
}
.sidebar::after{content:'';position:absolute;top:0;right:0;width:3px;height:100%;background:var(--royal);}
@media(min-width:768px){.sidebar{height:100vh;position:sticky;top:0;overflow:hidden;}}
@media(max-width:767px){
  .sidebar{position:fixed;top:0;left:0;height:100vh;transform:translateX(-100%);transition:transform .25s cubic-bezier(.4,0,.2,1);overflow-y:auto;}
  .sidebar.open{transform:translateX(0);box-shadow:4px 0 24px rgba(0,0,0,.28);}
}
.sidebar-overlay{position:fixed;inset:0;z-index:40;background:rgba(0,0,0,.45);backdrop-filter:blur(2px);}

.sidebar-brand{padding:1.2rem 1rem 1rem;border-bottom:1px solid rgba(0,0,0,.12);}
.brand-logo-area{display:flex;align-items:center;gap:.7rem;}
.brand-emblem{
  width:36px;height:36px;background:var(--royal);border-radius:.55rem;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  box-shadow:0 2px 8px rgba(30,58,138,.4);
}
.brand-emblem-letter{font-family:'Fraunces',serif;font-size:1.1rem;font-weight:700;color:#fff;}
.brand-title{font-family:'Fraunces',serif;font-size:1.2rem;font-weight:700;letter-spacing:-.02em;color:var(--royal);line-height:1;}
.brand-360{font-weight:400;color:var(--royal);opacity:.65;}
.brand-sub{font-family:'DM Mono',monospace;font-size:.55rem;color:rgba(30,58,138,.65);margin-top:.2rem;text-transform:uppercase;letter-spacing:.1em;}
.sidebar-close{margin-left:auto;padding:.3rem;color:var(--royal);opacity:.6;background:none;border:none;cursor:pointer;border-radius:.4rem;}
.sidebar-close:hover{opacity:1;background:rgba(30,58,138,.1);}

.sidebar-nav{flex:1;padding:.5rem .55rem;display:flex;flex-direction:column;gap:.08rem;overflow-y:auto;scrollbar-width:none;}
.sidebar-nav::-webkit-scrollbar{display:none;}
.sidebar-footer{padding:.75rem;border-top:1px solid rgba(0,0,0,.1);}

.nav-group-label{
  font-family:'DM Mono',monospace;font-size:.57rem;text-transform:uppercase;
  letter-spacing:.13em;color:rgba(30,58,138,.52);font-weight:500;
  padding:.85rem .5rem .3rem;
}
.nav-empty{font-size:.72rem;font-family:'DM Mono',monospace;color:rgba(30,58,138,.4);padding:.5rem .6rem;}
.nav-item{
  display:flex;align-items:center;gap:.6rem;padding:.55rem .65rem;
  border-radius:.5rem;color:rgba(28,35,49,.8);font-weight:600;
  transition:background .12s,color .12s,box-shadow .12s;
  text-align:left;border:none;background:transparent;cursor:pointer;width:100%;
}
.nav-item:hover{background:rgba(30,58,138,.13);color:var(--royal);}
.nav-item.ativo{
  background:var(--royal);color:#fff;
  box-shadow:0 4px 14px -4px rgba(30,58,138,.6);
}
.nav-item.ativo .nav-icon{color:#fff!important;}
.nav-icon{color:var(--royal);}
.nav-label{font-size:.74rem;font-weight:700;line-height:1.2;}

/* SEARCH */
.search-wrap{position:relative;}
.search-icon{position:absolute;left:.6rem;top:50%;transform:translateY(-50%);color:var(--royal);opacity:.45;pointer-events:none;}
.search-input{
  width:100%;background:rgba(30,58,138,.1);border:1px solid rgba(30,58,138,.16);
  border-radius:.5rem;padding:.42rem .6rem .42rem 1.8rem;
  font-size:.7rem;font-family:'DM Mono',monospace;color:var(--royal);outline:none;
}
.search-input::placeholder{color:rgba(30,58,138,.4);}
.search-input:focus{border-color:rgba(30,58,138,.38);background:rgba(30,58,138,.15);}

/* MAIN */
.main-area{flex:1;display:flex;flex-direction:column;min-height:100vh;overflow:hidden;}
@media(max-width:767px){.main-area{min-height:auto;overflow:visible;}}
.brand-strip{height:4px;flex-shrink:0;background:linear-gradient(90deg,var(--orange) 0%,var(--orange) 50%,var(--royal) 50%,var(--royal) 100%);}

.topbar{
  background:var(--white);border-bottom:1px solid rgba(30,58,138,.1);
  padding:.9rem 1.5rem;display:flex;justify-content:space-between;align-items:center;
  gap:1rem;flex-shrink:0;box-shadow:0 1px 0 rgba(30,58,138,.06);
}
.topbar-menu-btn{padding:.4rem;border-radius:.45rem;color:var(--royal);background:var(--royal-bg);border:none;cursor:pointer;display:flex;align-items:center;}
.topbar-title{font-family:'Fraunces',serif;font-size:1.1rem;font-weight:600;color:var(--royal);}
.topbar-sub{font-family:'DM Mono',monospace;font-size:.56rem;color:var(--stone);margin-top:.15rem;text-transform:uppercase;letter-spacing:.09em;}

.mode-toggle{display:flex;background:var(--paper-2);padding:.2rem;border-radius:.6rem;border:1px solid rgba(30,58,138,.12);gap:.1rem;}
.mode-btn{padding:.38rem .75rem;font-size:.63rem;font-family:'DM Mono',monospace;font-weight:500;border-radius:.45rem;display:flex;align-items:center;color:var(--muted);border:none;cursor:pointer;background:transparent;transition:all .12s;}
.mode-btn.ativo{background:var(--white);color:var(--orange-dark);box-shadow:0 1px 4px rgba(0,0,0,.08);}
.mode-btn.ativo-dark{background:var(--royal);color:#fff;}

.notif-btn{position:relative;background:rgba(178,58,46,.1);border:none;border-radius:.5rem;padding:.42rem;cursor:pointer;color:var(--alerta);display:flex;align-items:center;}
.notif-badge{position:absolute;top:-.3rem;right:-.3rem;background:var(--alerta);color:#fff;font-size:.52rem;font-family:'DM Mono',monospace;border-radius:999px;padding:0 .3rem;min-width:.95rem;height:.95rem;display:flex;align-items:center;justify-content:center;}

.content-scroll{flex:1;overflow-y:auto;padding:1.25rem;scrollbar-width:thin;scrollbar-color:rgba(139,133,118,.25) transparent;}
@media(min-width:768px){.content-scroll{padding:1.75rem 2rem;}}

/* HERO */
.hero-card{position:relative;overflow:hidden;background:linear-gradient(150deg,var(--royal) 0%,#0F2266 100%);padding:2rem;border-radius:1.4rem;color:#fff;box-shadow:0 16px 40px -12px rgba(30,58,138,.55);}
.hero-bg-pattern{position:absolute;inset:0;pointer-events:none;}
.hero-circle{position:absolute;border-radius:999px;border:1px solid rgba(255,255,255,.07);}
.c1{width:420px;height:420px;top:-180px;right:-120px;}
.c2{width:260px;height:260px;bottom:-80px;left:-60px;}
.hero-accent-line{position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--orange) 0%,var(--orange) 40%,transparent 100%);}
.eyebrow-label{color:var(--orange);font-family:'DM Mono',monospace;font-size:.63rem;font-weight:500;text-transform:uppercase;letter-spacing:.14em;margin-bottom:.5rem;display:block;}
.hero-title{font-family:'Fraunces',serif;font-size:2rem;font-weight:600;letter-spacing:-.01em;line-height:1.1;}
@media(min-width:768px){.hero-title{font-size:2.35rem;}}
.hero-amp{font-weight:300;font-size:1.4rem;color:rgba(159,180,192,.6);margin:0 .35rem;}
.avatar-ring{background:rgba(255,255,255,.09);border-radius:999px;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,.14);color:rgba(255,255,255,.55);position:relative;}
.avatar-badge{position:absolute;bottom:-.2rem;right:-.2rem;width:.95rem;height:.95rem;background:var(--orange);border-radius:999px;border:2px solid #0F2266;}
.municipio-chip{display:flex;align-items:center;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.8);padding:.42rem .85rem;border-radius:.7rem;font-size:.7rem;font-family:'DM Mono',monospace;}
.btn-hero{display:flex;align-items:center;background:var(--orange);color:#fff;padding:.7rem 1.2rem;border-radius:.8rem;font-weight:700;font-size:.76rem;box-shadow:0 6px 18px -4px rgba(234,88,12,.6);transition:transform .15s,box-shadow .15s;border:none;cursor:pointer;}
.btn-hero:hover{transform:translateY(-2px);box-shadow:0 10px 24px -4px rgba(234,88,12,.65);}

/* KPI STRIP */
.kpi-strip{background:var(--white);border-radius:1.1rem;border:1px solid rgba(30,58,138,.08);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 2px 8px rgba(30,58,138,.05);}
@media(min-width:1024px){.kpi-strip{flex-direction:row;}}
.kpi-item{flex:1;padding:1.1rem 1.3rem;display:flex;align-items:center;gap:.9rem;position:relative;border-bottom:1px solid rgba(30,58,138,.06);}
@media(min-width:1024px){.kpi-item{border-bottom:none;border-right:1px solid rgba(30,58,138,.06);}.kpi-item:last-child{border-right:none;}}
.kpi-acent-bar{position:absolute;bottom:0;left:0;right:0;height:2.5px;}
@media(min-width:1024px){.kpi-acent-bar{top:0;bottom:auto;}}
.kpi-icon-wrap{padding:.6rem;border-radius:.65rem;flex-shrink:0;}
.kpi-label{font-family:'DM Mono',monospace;color:var(--stone);font-size:.59rem;font-weight:500;text-transform:uppercase;letter-spacing:.07em;}
.kpi-valor{font-family:'Fraunces',serif;font-size:1.25rem;font-weight:600;color:var(--ink);margin-top:.05rem;line-height:1.15;}

/* PANEL */
.panel{background:var(--white);padding:1.4rem;border-radius:1.2rem;border:1px solid rgba(30,58,138,.07);box-shadow:0 1px 4px rgba(30,58,138,.04);}
@media(min-width:768px){.panel{padding:1.6rem;}}
.panel-title{font-family:'Fraunces',serif;font-weight:600;font-size:1.1rem;color:var(--ink);}
.panel-sub{font-family:'DM Mono',monospace;font-size:.59rem;color:var(--stone);text-transform:uppercase;letter-spacing:.06em;margin-top:.2rem;}
.page-title{font-family:'Fraunces',serif;font-size:1.4rem;font-weight:600;color:var(--ink);display:flex;align-items:center;line-height:1.2;}
.secao-label{font-family:'DM Mono',monospace;font-size:.59rem;color:var(--stone);text-transform:uppercase;letter-spacing:.08em;}

/* TERMÔMETRO */
.termometro{padding:.8rem 1rem;border-radius:.9rem;border:1px solid;}
.termometro.tom-verde{background:#EEF3EA;border-color:#D6E2CC;color:var(--verde);}
.termometro.tom-azul{background:#E9F1F5;border-color:#CFE0E8;color:var(--azul);}
.termometro.tom-alerta{background:#FEF2F0;border-color:#F5D0CB;color:var(--alerta);}
.termometro-label{font-family:'DM Mono',monospace;font-size:.59rem;font-weight:500;text-transform:uppercase;letter-spacing:.07em;}
.termometro-valor{font-family:'Fraunces',serif;font-size:1.65rem;font-weight:700;margin-top:.1rem;}

/* BARRAS */
.barra-trilho{width:100%;background:#EEE9E0;border-radius:999px;height:.45rem;overflow:hidden;}
.barra-fill{height:100%;border-radius:999px;}
.barra-fill.tom-azul{background:var(--azul);} .barra-fill.tom-verde{background:var(--verde);}
.barra-fill.tom-terracota{background:var(--terracota);} .barra-fill.tom-orange{background:var(--orange);}
.barra-fill.tom-gold{background:var(--orange);} .barra-fill.tom-vinho{background:var(--vinho);}
.barra-fill.tom-alerta{background:var(--alerta);}

/* FEED */
.feed-icon{padding:.45rem;border-radius:.55rem;flex-shrink:0;margin-top:.05rem;}
.feed-icon.tom-azul{background:#E9F1F5;color:var(--azul);} .feed-icon.tom-verde{background:#EEF3EA;color:var(--verde);}
.feed-icon.tom-gold{background:#FFF1EB;color:var(--orange-dark);} .feed-icon.tom-stone{background:#F0EDE6;color:var(--stone);}

/* CARDS */
.card-flat{background:var(--white);padding:1.1rem 1.2rem;border-radius:1rem;border:1px solid rgba(30,58,138,.07);}
.card-flat-sm{background:var(--paper-2);padding:.85rem 1rem;border-radius:.8rem;border:1px solid rgba(30,58,138,.06);}
.tag-data{display:inline-flex;align-items:center;font-family:'DM Mono',monospace;font-size:.6rem;font-weight:500;color:var(--stone);background:var(--paper-2);padding:.25rem .5rem;border-radius:.4rem;}

/* TIMELINE */
.timeline-dot{position:absolute;left:-1rem;top:.3rem;width:1.7rem;height:1.7rem;border-radius:999px;display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 0 0 3px var(--paper);}
.timeline-dot.tom-gold{background:var(--orange-dark);} .timeline-dot.tom-vinho{background:var(--vinho);}
.timeline-dot.tom-verde{background:var(--verde);} .timeline-dot.tom-azul{background:var(--azul);}
.timeline-dot.tom-terracota{background:var(--terracota);}

/* SECRETARIA */
.secao-icon{padding:.8rem;border-radius:.9rem;color:#fff;flex-shrink:0;}
.secao-icon.tom-gold{background:var(--orange-dark);} .secao-icon.tom-verde{background:var(--verde);}
.secao-icon.tom-terracota{background:var(--terracota);} .secao-icon.tom-azul{background:var(--azul);}
.secao-icon.tom-vinho{background:var(--vinho);}
.kpi-mini{background:var(--white);border-radius:.9rem;padding:1rem 1.1rem;border:1px solid rgba(30,58,138,.07);border-left:4px solid;box-shadow:0 1px 3px rgba(30,58,138,.04);}
.kpi-mini.tom-gold{border-left-color:var(--orange);} .kpi-mini.tom-verde{border-left-color:var(--verde);}
.kpi-mini.tom-terracota{border-left-color:var(--terracota);} .kpi-mini.tom-azul{border-left-color:var(--azul);}
.kpi-mini.tom-vinho{border-left-color:var(--vinho);}
.kpi-mini-label{font-family:'DM Mono',monospace;font-size:.59rem;font-weight:500;text-transform:uppercase;letter-spacing:.07em;color:var(--stone);}
.kpi-mini-valor{font-family:'Fraunces',serif;font-size:1.5rem;font-weight:600;color:var(--ink);margin-top:.1rem;line-height:1.1;}

/* PPA */
.eixo-icon{padding:.7rem;border-radius:.8rem;color:#fff;flex-shrink:0;}
.eixo-icon.tom-azul{background:var(--azul);} .eixo-icon.tom-verde{background:var(--verde);}
.eixo-icon.tom-terracota{background:var(--terracota);} .eixo-icon.tom-vinho{background:var(--vinho);}
.exec-badge{font-family:'DM Mono',monospace;font-size:.68rem;font-weight:500;padding:.28rem .62rem;border-radius:.45rem;background:var(--paper-2);color:var(--ink);border:1px solid rgba(30,58,138,.08);white-space:nowrap;}
.exec-badge.tom-azul{background:#E9F1F5;color:var(--azul);border-color:#CFE0E8;}
.exec-badge.tom-verde{background:#EEF3EA;color:var(--verde);border-color:#D6E2CC;}
.exec-badge.tom-terracota{background:#F3E7DC;color:var(--terracota);border-color:#E5CCBF;}
.exec-badge.tom-vinho{background:#F2E6E8;color:var(--vinho);border-color:#DEC7CC;}
.exec-badge.tom-gold{background:#FFF1EB;color:var(--orange-dark);border-color:#FFD0B5;}

/* BADGES */
.badge-verde{display:inline-flex;align-items:center;background:#EEF3EA;color:var(--verde);border:1px solid #D6E2CC;font-family:'DM Mono',monospace;font-size:.59rem;padding:.24rem .55rem;border-radius:.4rem;}
.badge-azul{display:inline-flex;align-items:center;background:#E9F1F5;color:var(--azul);border:1px solid #CFE0E8;font-family:'DM Mono',monospace;font-size:.59rem;padding:.24rem .55rem;border-radius:.4rem;}
.badge-alerta{display:inline-flex;align-items:center;background:#FEF2F0;color:var(--alerta);border:1px solid #F5D0CB;font-family:'DM Mono',monospace;font-size:.59rem;padding:.24rem .55rem;border-radius:.4rem;}

/* ALERTA BAR */
.alerta-bar{display:flex;align-items:center;gap:.75rem;background:#FEF2F0;border:1px solid #F5D0CB;border-left:4px solid var(--alerta);color:var(--alerta);padding:.85rem 1.1rem;border-radius:.9rem;font-size:.8rem;font-weight:500;}
.alerta-btn{margin-left:auto;white-space:nowrap;background:var(--alerta);color:#fff;border:none;padding:.32rem .75rem;border-radius:.4rem;font-size:.68rem;font-family:'DM Mono',monospace;cursor:pointer;}

/* BOTÕES */
.btn-gold-solid{background:var(--orange);color:#fff;padding:.55rem 1rem;border-radius:.65rem;font-weight:700;font-size:.74rem;display:inline-flex;align-items:center;border:none;cursor:pointer;box-shadow:0 3px 10px -3px rgba(234,88,12,.45);}
.btn-ghost-sm{display:inline-flex;align-items:center;font-size:.7rem;background:var(--paper-2);color:var(--orange-dark);padding:.38rem .75rem;border-radius:.5rem;font-weight:700;border:none;cursor:pointer;font-family:'DM Mono',monospace;border:1px solid rgba(234,88,12,.15);}
.btn-admin{margin-top:.75rem;display:flex;align-items:center;justify-content:center;width:100%;background:var(--paper);color:var(--ink);font-size:.63rem;font-family:'DM Mono',monospace;font-weight:500;padding:.52rem;border-radius:.5rem;border:1px solid rgba(30,58,138,.1);cursor:pointer;}
.btn-admin:hover{background:#e3dcc6;}

/* MUNICÍPIO */
.municipio-stat{padding:.75rem 1rem;background:var(--paper-2);border-radius:.75rem;border:1px solid rgba(30,58,138,.06);}

/* PRINT */
@media print{
  .app-root,.main-area,.content-scroll{height:auto!important;overflow:visible!important;background:white!important;}
  .sidebar,.topbar,.brand-strip{display:none!important;}
  .hero-card{background:white!important;border:2px solid #e2e8f0!important;color:black!important;box-shadow:none!important;}
  .panel,.card-flat,.kpi-strip{box-shadow:none!important;border:1px solid #cbd5e1!important;break-inside:avoid;}
}
`;