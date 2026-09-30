import { useState, type FormEvent } from 'react';
import { Edit3, Eye, EyeOff, Shield } from 'lucide-react';
import { Modal, Campo } from './Modal';
import { useAuth } from '@/hooks';

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const tentar = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await entrar(email, senha);
      onClose();
    } catch {
      setErro('E-mail ou senha incorretos. Tente novamente.');
      setSenha('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal titulo="Acesso administrativo" icone={Edit3} onClose={onClose}>
      <form onSubmit={tentar} className="modal-form">
        <Campo label="E-mail">
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErro(null); }} placeholder="seu@email.com" className="modal-input" autoFocus autoComplete="username" />
        </Campo>
        <Campo label="Senha">
          <div className="modal-input-wrap">
            <input type={mostrar ? 'text' : 'password'} value={senha} onChange={e => { setSenha(e.target.value); setErro(null); }}
              placeholder="Digite a senha" className={`modal-input ${erro ? 'erro' : ''}`} autoComplete="current-password" />
            <button type="button" onClick={() => setMostrar(v => !v)} className="modal-eye" aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}>
              {mostrar ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {erro && <p className="modal-erro">{erro}</p>}
        </Campo>
        <button type="submit" disabled={!email || !senha || loading} className="modal-btn-submit">
          {loading ? <span className="modal-spinner" /> : <><Shield size={14} className="mr-2" /> Entrar</>}
        </button>
        <p className="modal-hint">Apenas secretários e gestores autorizados têm acesso.</p>
      </form>
    </Modal>
  );
}
