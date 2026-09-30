import { useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { Search, X } from 'lucide-react';
import { menu } from '@/data/menu';
import { fmtData } from '@/lib/metas';
import type { ItemMenu } from '@/types';

function NavItem({ item, onClick }: { item: ItemMenu; onClick: () => void }) {
  return (
    <NavLink to={item.rota} end={item.rota === '/' || item.rota === '/ppa'} onClick={onClick} className={({ isActive }) => `nav-item ${isActive ? 'ativo' : ''}`}>
      <item.icone size={15} className="nav-icon shrink-0" />
      <span className="nav-label">{item.nome}</span>
    </NavLink>
  );
}

export function Sidebar({ aberto, fechar, ultimaAtualizacao }: { aberto: boolean; fechar: () => void; ultimaAtualizacao: string | null }) {
  const [busca, setBusca] = useState('');
  const filtrado = useMemo(() => menu.filter(i => i.nome.toLowerCase().includes(busca.toLowerCase())), [busca]);
  const grupo = (g: ItemMenu['grupo']) => menu.filter(i => i.grupo === g);

  return (
    <>
      {aberto && <div className="sidebar-overlay" onClick={fechar} />}
      <aside className={`sidebar ${aberto ? 'open' : ''} print:hidden`}>
        <div className="sidebar-brand">
          <div className="brand-logo-area">
            <div className="brand-emblem"><span className="brand-emblem-letter">S</span></div>
            <div>
              <h1 className="brand-title">Gestão<span className="brand-360">360</span></h1>
              <p className="brand-sub">Prefeitura de Sobradinho · BA</p>
            </div>
            <button onClick={fechar} className="sidebar-close md:hidden" aria-label="Fechar menu"><X size={17} /></button>
          </div>
          <div className="search-wrap mt-3">
            <Search size={12} className="search-icon" />
            <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar página…" className="search-input" aria-label="Buscar página" />
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          {busca ? (
            <>
              <p className="nav-group-label">Resultados</p>
              {filtrado.map(i => <NavItem key={i.id} item={i} onClick={fechar} />)}
              {filtrado.length === 0 && <p className="nav-empty">Nenhum resultado</p>}
            </>
          ) : (
            <>
              <p className="nav-group-label">Principal</p>
              {grupo('principal').map(i => <NavItem key={i.id} item={i} onClick={fechar} />)}
              <p className="nav-group-label">Liderança</p>
              {grupo('lideranca').map(i => <NavItem key={i.id} item={i} onClick={fechar} />)}
              <p className="nav-group-label">Secretarias</p>
              {grupo('secretarias').map(i => <NavItem key={i.id} item={i} onClick={fechar} />)}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <p className="text-[10px] font-mono-data text-royal/40 text-center">
            {ultimaAtualizacao ? `Dados atualizados em ${fmtData(ultimaAtualizacao)}` : 'Sem dados carregados'}
          </p>
        </div>
      </aside>
    </>
  );
}
