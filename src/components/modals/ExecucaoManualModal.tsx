import { useState, type FormEvent } from 'react';
import { Wallet } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Modal, Campo } from './Modal';
import { programas } from '@/data/programas';
import { ppa, fmtReais } from '@/data/municipio';
import { MESES } from '@/lib/execucao';
import { useAuth } from '@/hooks';
import type { ExecucaoAcao } from '@/types';

const ANOS = [2026, 2027, 2028, 2029];

/**
 * Lançamento manual de execução financeira, para unidades com contabilidade própria
 * que não aparecem no Portal da Transparência do Executivo — hoje a Câmara Municipal
 * e o SAAE. O id separa esses registros dos importados, então uma importação do
 * portal nunca sobrescreve um lançamento manual.
 */
export function ExecucaoManualModal({ programaIdPadrao, onClose }: { programaIdPadrao?: string; onClose: () => void }) {
  const { user } = useAuth();
  const hoje = new Date();
  const [f, setF] = useState({
    programaId: programaIdPadrao ?? programas[0].id,
    ano: Math.min(Math.max(hoje.getFullYear(), 2026), 2029),
    mes: hoje.getMonth() + 1,
    empenhado: 0, liquidado: 0, pago: 0, observacao: '',
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF(p => ({ ...p, [k]: v }));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const prog = programas.find(p => p.id === f.programaId);
  const invalido = !prog || (f.empenhado === 0 && f.liquidado === 0 && f.pago === 0);

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (invalido || !prog) return;
    setSalvando(true);
    const id = `${f.ano}-${String(f.mes).padStart(2, '0')}-m-${prog.id}`;
    const registro: ExecucaoAcao = {
      id, ano: f.ano, mes: f.mes,
      cdAcao: 0, dsAcao: `${prog.nome} — lançamento da unidade`,
      programaId: prog.id, secretariaId: prog.secretariaId, funcao: prog.areaTematica,
      empenhado: f.empenhado, liquidado: f.liquidado, pago: f.pago,
      origem: 'manual', lancadoPor: user?.email ?? 'admin', observacao: f.observacao.trim(),
    };
    try {
      await setDoc(doc(db, 'execucao', id), registro, { merge: true });
      onClose();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal titulo="Lançar execução da unidade" icone={Wallet} onClose={onClose} largo>
      <form onSubmit={salvar} className="modal-form">
        <p className="text-xs text-muted">
          Para unidades que prestam contas separadamente e não constam no portal do Executivo.
          Informe o acumulado do mês; reenviar o mesmo mês substitui o valor anterior.
        </p>

        <Campo label="Programa">
          <select value={f.programaId} onChange={e => set('programaId', e.target.value)} className="modal-input">
            {programas.map(p => <option key={p.id} value={p.id}>{p.unidadeResponsavel} — {p.nome}</option>)}
          </select>
        </Campo>

        {prog && <p className="text-[11px] font-mono-data text-stone -mt-2">Previsto no PPA {ppa.periodo}: {fmtReais(prog.recurso)}</p>}

        <div className="grid grid-cols-2 gap-3">
          <Campo label="Ano">
            <select value={f.ano} onChange={e => set('ano', Number(e.target.value))} className="modal-input">
              {ANOS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </Campo>
          <Campo label="Mês">
            <select value={f.mes} onChange={e => set('mes', Number(e.target.value))} className="modal-input">
              {MESES.slice(1).map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </Campo>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Campo label="Empenhado (R$)"><input type="number" step="0.01" value={f.empenhado} onChange={e => set('empenhado', Number(e.target.value))} className="modal-input" /></Campo>
          <Campo label="Liquidado (R$)"><input type="number" step="0.01" value={f.liquidado} onChange={e => set('liquidado', Number(e.target.value))} className="modal-input" /></Campo>
          <Campo label="Pago (R$)"><input type="number" step="0.01" value={f.pago} onChange={e => set('pago', Number(e.target.value))} className="modal-input" /></Campo>
        </div>

        <Campo label="Observação">
          <input value={f.observacao} onChange={e => set('observacao', e.target.value)} placeholder="Ex.: balancete de setembro aprovado pela Mesa Diretora" className="modal-input" />
        </Campo>

        {erro && <p className="modal-erro">{erro}</p>}
        <button type="submit" disabled={invalido || salvando} className="modal-btn-submit">
          {salvando ? <span className="modal-spinner" /> : 'Salvar lançamento'}
        </button>
      </form>
    </Modal>
  );
}
