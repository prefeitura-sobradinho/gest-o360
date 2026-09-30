import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AuthState {
  user: User | null;
  carregando: boolean;
  isAdmin: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

export function useProvideAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => onAuthStateChanged(auth, u => { setUser(u); setCarregando(false); }), []);

  return {
    user,
    carregando,
    isAdmin: !!user,
    entrar: async (email, senha) => { await signInWithEmailAndPassword(auth, email, senha); },
    sair: async () => { await signOut(auth); },
  };
}

export const AuthContext = createContext<AuthState | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthContext.Provider>');
  return ctx;
};
