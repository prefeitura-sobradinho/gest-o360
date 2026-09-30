import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function Modal({ titulo, icone: Icon, onClose, children, largo }:
  { titulo: string; icone: LucideIcon; onClose: () => void; children: ReactNode; largo?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={titulo}>
      <div className={`modal-box ${largo ? 'modal-largo' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-emblem"><Icon size={18} /></div>
          <div>
            <h2 className="modal-title">{titulo}</h2>
            <p className="modal-sub">Gestão360 · Prefeitura de Sobradinho-BA</p>
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Fechar"><X size={17} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const Campo = ({ label, children }: { label: string; children: ReactNode }) => (
  <div><label className="modal-label">{label}</label>{children}</div>
);
