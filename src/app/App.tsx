import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { AuthContext, useProvideAuth } from '@/hooks';
import { AppShell } from '@/components/layout/AppShell';
import { Dashboard, PPA, Metas, MetaDetalhe, Portfolio, Secretaria, Admin, Execucao, Convenios } from '@/pages';

export default function App() {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="ppa" element={<PPA />} />
            <Route path="ppa/metas" element={<Metas />} />
            <Route path="ppa/metas/:id" element={<MetaDetalhe />} />
            <Route path="execucao" element={<Execucao />} />
            <Route path="convenios" element={<Convenios />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="secretarias/:id" element={<Secretaria />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
