import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { LoginModal } from '@/components/modals';
import { MetasContext, useProvideMetas } from '@/hooks';

export function AppShell() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [login, setLogin] = useState(false);
  const metas = useProvideMetas();
  const { resumo, ultimaAtualizacao } = metas;

  return (
    <MetasContext.Provider value={metas}>
    <div className="app-root">
      {login && <LoginModal onClose={() => setLogin(false)} />}
      <Sidebar aberto={menuAberto} fechar={() => setMenuAberto(false)} ultimaAtualizacao={ultimaAtualizacao} />
      <main className="main-area">
        <div className="brand-strip print:hidden" />
        <Topbar abrirMenu={() => setMenuAberto(true)} abrirLogin={() => setLogin(true)} alertas={resumo.emRisco} />
        <div className="content-scroll"><Outlet /></div>
      </main>
    </div>
    </MetasContext.Provider>
  );
}
