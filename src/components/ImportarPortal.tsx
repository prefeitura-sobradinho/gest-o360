import { useState, type ChangeEvent } from 'react';
import { Upload, FileJson, CheckCircle2, AlertTriangle } from 'lucide-react';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { agregarDespesas, agregarReceitas, MESES } from '@/lib/execucao';
import { fmtReais } from '@/data/municipio';

type Estado = { tipo: 'ok' | 'erro'; texto: string; detalhe?: string[] } | null;

/** Grava em lotes de 400 — o Firestore aceita até 500 operações por lote. */
async function gravarEmLotes<T extends { id: string }>(nomeColecao: string, itens: T[]) {
  for (let i = 0; i < itens.length; i += 400) {
    const lote = writeBatch(db);
    for (const item of itens.slice(i, i + 400)) {
      lote.set(doc(collection(db, nomeColecao), item.id), item as Record<string, unknown>, { merge: true });
    }
    await lote.commit();
  }
}

/**
 * Importa os arquivos JSON exportados no Portal da Transparência:
 * /despesas → execução por ação · /receitas → previsão e arrecadação.
 * Cada importação substitui o mesmo período, então reimportar o mês corrigido é seguro.
 */
export function ImportarPortal() {
  const [ocupado, setOcupado] = useState(false);
  const [estado, setEstado] = useState<Estado>(null);

  const importar = async (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setOcupado(true);
    setEstado(null);
    try {
      const linhas = JSON.parse(await arquivo.text());
      if (!Array.isArray(linhas) || linhas.length === 0) throw new Error('O arquivo não é uma lista de registros.');

      const primeira = linhas[0];
      if ('TP_ARRECADAO' in primeira) {
        const itens = agregarReceitas(linhas);
        await gravarEmLotes('receitas', itens);
        const t = itens.reduce((a, r) => ({ previsto: a.previsto + r.previsto, arrecadado: a.arrecadado + r.arrecadado }), { previsto: 0, arrecadado: 0 });
        setEstado({
          tipo: 'ok',
          texto: `Receitas importadas: ${itens.length} ${itens.length === 1 ? 'mês' : 'meses'}.`,
          detalhe: [
            `Previsão da LOA: ${fmtReais(t.previsto)}`,
            `Arrecadado: ${fmtReais(t.arrecadado)}`,
            `Períodos: ${itens.map(r => `${MESES[r.mes]}/${r.ano}`).join(', ')}`,
          ],
        });
      } else if ('FASE' in primeira) {
        const { itens, resumo } = agregarDespesas(linhas);
        await gravarEmLotes('execucao', itens);
        const detalhe = [
          `${resumo.registros} lançamentos agrupados em ${itens.length} ações`,
          `Período: ${resumo.meses.map(m => MESES[m]).join(', ')}/${resumo.ano}`,
          `Empenhado ${fmtReais(resumo.empenhado)} · Liquidado ${fmtReais(resumo.liquidado)} · Pago ${fmtReais(resumo.pago)}`,
        ];
        if (resumo.semAcao > 0) detalhe.push(`${resumo.semAcao} lançamentos sem ação orçamentária foram ignorados (retenções e transferências).`);
        if (resumo.acoesDesconhecidas.length > 0) detalhe.push(`Ações fora do mapa, sem programa vinculado: ${resumo.acoesDesconhecidas.join(', ')}.`);
        setEstado({ tipo: 'ok', texto: 'Despesas importadas.', detalhe });
      } else {
        throw new Error('Arquivo não reconhecido. Exporte em JSON pelas páginas de Despesas ou Receitas do portal.');
      }
    } catch (err) {
      setEstado({ tipo: 'erro', texto: (err as Error).message });
    } finally {
      setOcupado(false);
      e.target.value = '';
    }
  };

  return (
    <div className="panel">
      <div className="flex items-start gap-3 mb-3">
        <FileJson size={16} className="text-stone mt-0.5 shrink-0" />
        <div>
          <p className="font-bold text-ink text-sm">Importar do Portal da Transparência</p>
          <p className="text-xs text-muted mt-0.5">
            No portal, abra <strong>Despesas</strong> ou <strong>Receitas</strong>, escolha o ano e o mês, clique em <strong>JSON</strong> e envie o arquivo aqui.
            O sistema identifica sozinho qual é qual. Reimportar o mesmo mês apenas atualiza os valores.
          </p>
        </div>
      </div>

      <label className={`btn-upload ${ocupado ? 'ocupado' : ''}`}>
        <input type="file" accept="application/json,.json" onChange={importar} disabled={ocupado} hidden />
        {ocupado ? <><span className="modal-spinner" /> Importando…</> : <><Upload size={14} /> Escolher arquivo JSON</>}
      </label>

      {estado && (
        <div className={`resultado-import ${estado.tipo}`}>
          {estado.tipo === 'ok' ? <CheckCircle2 size={15} className="shrink-0 mt-0.5" /> : <AlertTriangle size={15} className="shrink-0 mt-0.5" />}
          <div>
            <p className="font-bold">{estado.texto}</p>
            {estado.detalhe?.map((d, i) => <p key={i} className="text-xs mt-0.5 opacity-90">{d}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}
