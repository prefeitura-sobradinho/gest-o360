import { useState, type FormEvent } from 'react';
import { Edit3, PlusCircle, X } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Modal, Campo } from './Modal';
import { hojeISO } from '@/lib/metas';
import type { Kpi, Trend } from '@/types';

const UNIDADES = [['', 'Sem unidade (número simples)'], ['R$', 'R$ (Reais)'], ['%', '% (Percentual)'], ['t', 't (Toneladas)'], ['un', 'un (Unidades)'], ['hab', 'hab (Habitantes)'], ['vagas', 'vagas'], ['famílias', 'famílias']];

export function KpiModal({ secretariaId, kpi, onClose }: { secretariaId: string; kpi: Kpi | null; onClose: () => void }) {
  const [label, setLabel] = useState(kpi?.label ?? '');
  const [unidade, setUnidade] = useState(kpi?.unidade ?? '');
  const [fonte, setFonte] = useState(kpi?.fonte ?? '');
  const [historico, setHistorico] = useState<{ periodo: string; valor: number }[]>(
    kpi?.historico?.length ? kpi.historico : [{ periodo: '', valor: Number(String(kpi?.valor ?? '').replace(/[^\d,.-]/g, '').replace(',', '.')) || 0 }],
  );
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const atualizarPonto = (i: number, campo: 'periodo' | 'valor', v: string) =>
    setHistorico(prev => prev.map((p, idx) => (idx === i ? { ...p, [campo]: campo === 'valor' ? Number(v) || 0 : v } : p)));
  const adicionarPonto = () => setHistorico(prev => [...prev, { periodo: '', valor: 0 }]);
  const removerPonto = (i: number) => setHistorico(prev => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const invalido = !label.trim() || historico.some(p => !p.periodo.trim());

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (invalido) return;
    setLoading(true);
    const ultimo = historico[historico.length - 1];
    const penultimo = historico.length > 1 ? historico[historico.length - 2] : null;
    let trend: Trend = 'neutral', delta = '';
    if (penultimo) {
      const diff = ultimo.valor - penultimo.valor;
      trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
      const pct = penultimo.valor !== 0 ? ((diff / Math.abs(penultimo.valor)) * 100).toFixed(1) : null;
      delta = pct !== null ? `${diff > 0 ? '+' : ''}${pct}% vs ${penultimo.periodo}` : `${diff > 0 ? '+' : ''}${diff} vs ${penultimo.periodo}`;
    }
    const valor = unidade === 'R$' ? `R$ ${ultimo.valor.toLocaleString('pt-BR')}` : unidade === '%' ? `${ultimo.valor}%` : unidade ? `${ultimo.valor} ${unidade}` : `${ultimo.valor}`;
    const payload = { label, unidade, fonte, historico, valor, trend, delta, atualizadoEm: hojeISO() };
    try {
      if (kpi) await updateDoc(doc(db, 'kpis', kpi.id), payload);
      else await addDoc(collection(db, 'kpis'), { secretaria_id: secretariaId, ordem: Date.now(), ...payload });
      onClose();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal titulo={kpi ? 'Editar indicador' : 'Novo indicador'} icone={Edit3} onClose={onClose}>
      <form onSubmit={salvar} className="modal-form">
        <Campo label="Nome do indicador"><input value={label} onChange={e => setLabel(e.target.value)} className="modal-input" autoFocus /></Campo>
        <Campo label="Unidade">
          <select value={unidade} onChange={e => setUnidade(e.target.value)} className="modal-input">
            {UNIDADES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        </Campo>
        <Campo label="Fonte do dado"><input value={fonte} onChange={e => setFonte(e.target.value)} placeholder="ex.: e-SUS, SIOPE, relatório interno" className="modal-input" /></Campo>
        <Campo label="Histórico (do mais antigo para o mais recente)">
          <div className="space-y-2">
            {historico.map((p, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input placeholder="Período (ex: Jan/2026)" value={p.periodo} onChange={e => atualizarPonto(i, 'periodo', e.target.value)} className="modal-input" style={{ flex: 2 }} />
                <input type="number" placeholder="Valor" value={p.valor} onChange={e => atualizarPonto(i, 'valor', e.target.value)} className="modal-input" style={{ flex: 1 }} />
                <button type="button" onClick={() => removerPonto(i)} className="text-alerta hover:text-ink px-1" aria-label="Remover ponto"><X size={15} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={adicionarPonto} className="text-xs font-bold text-orange hover:text-ink flex items-center gap-1 mt-2"><PlusCircle size={13} /> Adicionar ponto</button>
        </Campo>
        {historico.length >= 2 && (
          <div style={{ height: 90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historico}><Line type="monotone" dataKey="valor" stroke="#EA580C" strokeWidth={2} dot={{ r: 3 }} /></LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {erro && <p className="modal-erro">{erro}</p>}
        <button type="submit" disabled={invalido || loading} className="modal-btn-submit">{loading ? <span className="modal-spinner" /> : 'Salvar indicador'}</button>
      </form>
    </Modal>
  );
}
