import { ArrowUpRight, ArrowDownRight, AlertCircle, Inbox, Loader2, Database } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { StatusMeta, Tom, Trend } from '@/types';
import { STATUS_LABEL, STATUS_TOM, fmtData } from '@/lib/metas';
import { useAuth } from '@/hooks';
import { odsInfo } from '@/data/ods';

/* ── KPI grande (faixa do dashboard) ── */
export function KpiCard({ icon: Icon, label, valor, sub, trend, acent = '#EA580C' }:
  { icon: LucideIcon; label: string; valor: string; sub?: string; trend?: Trend; acent?: string }) {
  return (
    <div className="kpi-item">
      <div className="kpi-icon-wrap" style={{ background: acent + '18', color: acent }}><Icon size={19} /></div>
      <div className="min-w-0">
        <p className="kpi-label">{label}</p>
        <p className="kpi-valor">{valor}</p>
        {sub && (
          <p className={`flex items-center gap-0.5 text-[10px] font-mono-data mt-0.5 ${trend === 'up' ? 'text-verde' : trend === 'down' ? 'text-alerta' : 'text-stone'}`}>
            {trend === 'up' && <ArrowUpRight size={10} />}{trend === 'down' && <ArrowDownRight size={10} />}{sub}
          </p>
        )}
      </div>
      <div className="kpi-acent-bar" style={{ background: acent }} />
    </div>
  );
}

/* ── Termômetro (concluídas / em execução / em risco) ── */
export function Termometro({ icon: Icon, tom, label, valor, sub }:
  { icon: LucideIcon; tom: 'verde' | 'azul' | 'alerta' | 'stone'; label: string; valor: number | string; sub?: string }) {
  return (
    <div className={`termometro tom-${tom}`}>
      <div className="flex items-center gap-1.5 mb-1"><Icon size={12} /><p className="termometro-label">{label}</p></div>
      <p className="termometro-valor">{valor}</p>
      {sub && <p className="text-[10px] font-mono-data opacity-65 mt-0.5">{sub}</p>}
    </div>
  );
}

export function InfoRow({ icon: Icon, label, valor }: { icon: LucideIcon; label: string; valor: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={14} className="mt-0.5 text-stone shrink-0" />
      <div>
        <p className="text-[10px] font-mono-data uppercase tracking-wider text-stone">{label}</p>
        <p className="text-ink font-semibold text-sm mt-0.5 leading-snug">{valor}</p>
      </div>
    </div>
  );
}

/* ── Rodapé de fonte/data — toda métrica precisa de um ── */
export function Fonte({ fonte, atualizadoEm, className = '' }: { fonte?: string; atualizadoEm?: string | null; className?: string }) {
  if (!fonte && !atualizadoEm) return null;
  return (
    <p className={`fonte-rodape ${className}`}>
      {fonte && <span>Fonte: {fonte}</span>}
      {fonte && atualizadoEm && <span aria-hidden="true"> · </span>}
      {atualizadoEm && <span>atualizado em {fmtData(atualizadoEm)}</span>}
    </p>
  );
}

/* ── Badge de status de meta ── */
export function StatusBadge({ status }: { status: StatusMeta }) {
  return <span className={`status-badge tom-${STATUS_TOM[status]}`}>{STATUS_LABEL[status]}</span>;
}

/* ── Barra de progresso com marcador de "esperado" ── */
export function BarraProgresso({ pct, esperado, tom = 'orange', altura = 8 }: { pct: number; esperado?: number; tom?: Tom; altura?: number }) {
  return (
    <div className="barra-trilho relative" style={{ height: altura }}>
      <div className={`barra-fill tom-${tom}`} style={{ width: `${pct}%` }} />
      {esperado !== undefined && (
        <span className="barra-marcador" style={{ left: `${esperado}%` }} title={`Esperado hoje: ${esperado}%`} />
      )}
    </div>
  );
}

/* ── Estados: carregando, vazio, erro, dados de exemplo ── */
export function Carregando({ texto = 'Carregando dados…' }: { texto?: string }) {
  return <div className="estado"><Loader2 size={18} className="animate-spin" /><span>{texto}</span></div>;
}

export function Vazio({ titulo, texto, acao }: { titulo: string; texto?: string; acao?: ReactNode }) {
  return (
    <div className="estado estado-vazio">
      <Inbox size={22} />
      <p className="font-bold text-ink">{titulo}</p>
      {texto && <p className="text-xs text-muted max-w-sm">{texto}</p>}
      {acao}
    </div>
  );
}

export function Erro({ mensagem }: { mensagem: string }) {
  return (
    <div className="alerta-bar">
      <AlertCircle size={15} className="shrink-0" />
      <span><strong>Não foi possível carregar os dados.</strong> {mensagem}</span>
    </div>
  );
}

export function AvisoExemplo({ texto = 'Estes são dados de exemplo. A coleção ainda não foi preenchida no Firestore.' }: { texto?: string }) {
  const { isAdmin } = useAuth();
  return (
    <div className="aviso-exemplo">
      <Database size={13} className="shrink-0" />
      <span>{texto}{isAdmin && ' Use a Área administrativa → Ferramentas para importar.'}</span>
    </div>
  );
}

/* ── Botão visível só para admin ── */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : null;
}

/* ── Selos de ODS (Agenda 2030 da ONU, citados no Anexo II do PPA) ── */
export function SelosODS({ codigos }: { codigos: string[] }) {
  if (!codigos.length) return null;
  return (
    <div className="ods-selos">
      {codigos.map(c => {
        const info = odsInfo(c);
        if (!info) return null;
        const n = c.replace(/\D/g, '');
        return (
          <span key={c} className="ods-selo" style={{ background: info.cor }} title={`${c} — ${info.nome}`}>
            {n}
          </span>
        );
      })}
    </div>
  );
}
