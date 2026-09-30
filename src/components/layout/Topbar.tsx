import { Link, useLocation } from 'react-router';
import { Bell, Edit3, LogOut, Menu, Shield, Wrench } from 'lucide-react';
import { menu } from '@/data/menu';
import { useAuth } from '@/hooks';
import { gestao } from '@/data/municipio';

export function Topbar({ abrirMenu, abrirLogin, alertas }: { abrirMenu: () => void; abrirLogin: () => void; alertas: number }) {
  const { isAdmin, sair, user } = useAuth();
  const { pathname } = useLocation();
  const item = menu.find(i => i.rota === pathname) ?? menu.find(i => i.rota !== '/' && pathname.startsWith(i.rota));
  const titulo = pathname === '/admin' ? 'Ferramentas administrativas' : pathname.startsWith('/ppa/metas/') ? 'Detalhe da meta' : item?.nome ?? 'Gestão 360';

  return (
    <header className="topbar print:hidden">
      <div className="flex items-center gap-3">
        <button onClick={abrirMenu} className="topbar-menu-btn md:hidden" aria-label="Abrir menu"><Menu size={19} /></button>
        <div>
          <h2 className="topbar-title">{titulo}</h2>
          <p className="topbar-sub">Prefeitura Municipal de Sobradinho-BA · {gestao.periodo}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        {alertas > 0 && (
          <Link className="notif-btn" to="/ppa/metas?filtro=risco" aria-label={`${alertas} metas em risco`}>
            <Bell size={15} /><span className="notif-badge">{alertas}</span>
          </Link>
        )}
        {isAdmin ? (
          <div className="admin-session">
            <span className="admin-badge" title={user?.email ?? ''}><Shield size={11} className="mr-1" /> Admin</span>
            <Link to="/admin" className="btn-logout" title="Ferramentas"><Wrench size={13} /></Link>
            <button onClick={sair} className="btn-logout"><LogOut size={13} className="mr-1.5" /> Sair</button>
          </div>
        ) : (
          <button onClick={abrirLogin} className="btn-entrar-admin"><Edit3 size={13} className="mr-1.5" /> Área administrativa</button>
        )}
      </div>
    </header>
  );
}
