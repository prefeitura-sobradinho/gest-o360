import { useState, type FormEvent } from 'react';
import { Activity, Award } from 'lucide-react';
import { Modal, Campo } from './Modal';
import { BarraProgresso } from '@/components/ui-custom';
import { registrarAtualizacao } from '@/lib/metasRepo';
import { publicarConclusao, periodoAtual } from '@/lib/portfolioRepo';
import { STATUS_LABEL, progresso, progressoEsperado, fmtNum } from '@/lib/metas';
import { useAuth } from '@/hooks';
import type { Meta, StatusMeta } from '@/types';

/**
 * Registrar o andamento de uma meta: novo valor, status e o que foi feito.
 * Quando o valor conclui a meta, oferece publicar a entrega no Portfólio de Realizações.
 */
export function ProgressoModal({ meta, onClose, somenteLeitura }: { meta: Meta; onClose: () => void; somenteLeitura?: boolean }) {
  const { user } = useAuth();
  const [valor, setValor] = useState(String(meta.valorAtual));
  const [status, setStatus] = useState<StatusMeta | ''>('');
  const [observacao, setObservacao] = useState('');
  const [publicar, setPublicar] = useState(true);
  const [periodo, setPeriodo] = useState(periodoAtual());
  const [tituloEntrega, setTituloEntrega] = useState(meta.titulo);
  const [descEntrega, setDescEntrega] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const numero = Number(valor.replace(',', '.'));
  const valido = valor.trim() !== '' && !Number.isNaN(numero) && numero >= 0;
  const pctNovo = valido ? progresso({ valorMeta: meta.valorMeta, valorAtual: numero }) : progresso(meta);
  const esperado = progressoEsperado(meta);

  /** A meta está sendo concluída agora e ainda não foi publicada no portfólio. */
  const concluiAgora = (status === 'concluida' || (status === '' && valido && numero >= meta.valorMeta)) && !meta.portfolioId;

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (!valido || somenteLeitura) return;
    setSalvando(true);
    try {
      await registrarAtualizacao(meta, { valor: numero, status, observacao, autor: user?.email ?? 'admin' });
      if (concluiAgora && publicar && tituloEntrega.trim()) {
        await publicarConclusao(meta, {
          data: periodo.trim() || periodoAtual(),
          titulo: tituloEntrega.trim(),
          desc: descEntrega.trim() || observacao.trim() || meta.descricao || `Meta ${meta.codigo} do PPA concluída: ${meta.indicador} atingiu ${fmtNum(numero)} ${meta.unidade}.`,
        });
      }
      onClose();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal titulo="Registrar andamento" icone={Activity} onClose={onClose}>
      <form onSubmit={salvar} className="modal-form">
        <div className="card-flat-sm">
          <p className="font-mono-data text-[10px] text-stone">{meta.codigo}</p>
          <p className="font-bold text-ink text-sm leading-snug">{meta.titulo}</p>
          <p className="text-xs text-muted mt-1">{meta.indicador} · meta de {fmtNum(meta.valorMeta)} {meta.unidade} até {meta.prazo.slice(0, 4)}</p>
        </div>

        {somenteLeitura && <p className="aviso-exemplo">Esta é uma meta de exemplo. Importe as metas na área administrativa para poder atualizar.</p>}

        <Campo label={`Quanto já foi realizado (${meta.unidade})`}>
          <input value={valor} onChange={e => setValor(e.target.value)} inputMode="decimal" className="modal-input" autoFocus disabled={somenteLeitura} />
        </Campo>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted">Progresso após salvar</span>
            <span className="font-mono-data font-bold text-ink">{pctNovo}% <span className="text-stone font-normal">/ {esperado}% esperado</span></span>
          </div>
          <BarraProgresso pct={pctNovo} esperado={esperado} tom={pctNovo >= 100 ? 'verde' : pctNovo < esperado - 15 ? 'alerta' : 'azul'} altura={8} />
        </div>

        <Campo label="Situação">
          <select value={status} onChange={e => setStatus(e.target.value as StatusMeta | '')} className="modal-input" disabled={somenteLeitura}>
            <option value="">Definir automaticamente pelo valor</option>
            {(Object.keys(STATUS_LABEL) as StatusMeta[]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </Campo>

        <Campo label="O que foi feito">
          <textarea value={observacao} onChange={e => setObservacao(e.target.value)} rows={3} className="modal-input"
            placeholder="Ex.: 3ª etapa da obra concluída; nº do processo; documento de referência" disabled={somenteLeitura} />
        </Campo>

        {concluiAgora && !somenteLeitura && (
          <div className="bloco-entrega">
            <label className="entrega-check">
              <input type="checkbox" checked={publicar} onChange={e => setPublicar(e.target.checked)} />
              <span><Award size={13} className="inline mr-1.5 -mt-0.5" />Esta meta será concluída. Publicar no Portfólio de Realizações?</span>
            </label>
            {publicar && (
              <div className="entrega-campos">
                <Campo label="Período"><input value={periodo} onChange={e => setPeriodo(e.target.value)} className="modal-input" /></Campo>
                <Campo label="Título da entrega"><input value={tituloEntrega} onChange={e => setTituloEntrega(e.target.value)} className="modal-input" /></Campo>
                <Campo label="Descrição">
                  <textarea value={descEntrega} onChange={e => setDescEntrega(e.target.value)} rows={2} className="modal-input"
                    placeholder="Em branco, usa o texto de “O que foi feito”." />
                </Campo>
              </div>
            )}
          </div>
        )}

        {erro && <p className="modal-erro">{erro}</p>}
        <button type="submit" disabled={!valido || salvando || somenteLeitura} className="modal-btn-submit">
          {salvando ? <span className="modal-spinner" /> : concluiAgora && publicar ? 'Concluir e publicar entrega' : 'Salvar andamento'}
        </button>
      </form>
    </Modal>
  );
}
