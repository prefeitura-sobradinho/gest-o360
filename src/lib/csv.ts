/**
 * Geração de CSV para abrir direto no Excel em português:
 * separador ponto e vírgula, decimal com vírgula e BOM UTF-8 para os acentos.
 */

type Celula = string | number | null | undefined;

const formatarCelula = (v: Celula) => {
  if (v == null) return '""';
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return '""';
    // vírgula decimal, sem separador de milhar (o Excel aplica o dele)
    return `"${v.toFixed(Number.isInteger(v) ? 0 : 2).replace('.', ',')}"`;
  }
  return `"${String(v).replace(/"/g, '""')}"`;
};

export function baixarCSV(nomeBase: string, cabecalhos: string[], linhas: Celula[][]) {
  const conteudo = [
    cabecalhos.map(formatarCelula).join(';'),
    ...linhas.map(l => l.map(formatarCelula).join(';')),
  ].join('\r\n');

  const blob = new Blob(['﻿' + conteudo], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${nomeBase}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
