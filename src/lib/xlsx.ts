import { unzipSync, strFromU8 } from 'fflate';

/**
 * Leitor mínimo de arquivos .xlsx, suficiente para ler as planilhas de coleta
 * devolvidas pelas secretarias.
 *
 * Um .xlsx é um zip de arquivos XML. Em vez de trazer uma biblioteca inteira de
 * planilhas para o navegador, descompactamos e lemos só o que interessa: o nome
 * das abas e o valor de cada célula. Nada de fórmulas, estilos ou gráficos.
 *
 * O arquivo pode voltar salvo pelo Excel, pelo LibreOffice ou pelo Google
 * Planilhas, que guardam texto de três formas diferentes — as três são tratadas.
 */

export type ValorCelula = string | number | Date | null;
export interface Aba {
  nome: string;
  /** célula por referência A1, apenas as preenchidas */
  celulas: Map<string, ValorCelula>;
  /** maior número de linha com conteúdo */
  ultimaLinha: number;
}

const texto = (no: Element | null) => (no?.textContent ?? '').trim();

function xml(doc: string) {
  const d = new DOMParser().parseFromString(doc, 'application/xml');
  if (d.getElementsByTagName('parsererror').length) {
    throw new Error('Arquivo corrompido: o XML interno não pôde ser lido.');
  }
  return d;
}

/** O Excel guarda data como número de dias desde 30/12/1899. */
function dataDeSerial(n: number): Date {
  const ms = Math.round((n - 25569) * 86400 * 1000);
  return new Date(ms);
}

/** Formatos de número que representam data — usados para saber se o número é uma data. */
function formatosDeData(doc: Document): Set<number> {
  const embutidos = new Set([14, 15, 16, 17, 22]);          // dd/mm/yyyy e variantes do Excel
  const personalizados = new Map<number, string>();
  for (const f of Array.from(doc.getElementsByTagName('numFmt'))) {
    const id = Number(f.getAttribute('numFmtId'));
    personalizados.set(id, f.getAttribute('formatCode') ?? '');
  }
  const ehData = (codigo: string) => /[dmyhs]/i.test(codigo.replace(/\[[^\]]*\]/g, '').replace(/"[^"]*"/g, ''));

  const estilos = new Set<number>();
  const xf = doc.getElementsByTagName('cellXfs')[0] ?? null;
  if (!xf) return estilos;
  Array.from(xf.getElementsByTagName('xf')).forEach((no, i) => {
    const id = Number(no.getAttribute('numFmtId') ?? 0);
    if (embutidos.has(id) || (personalizados.has(id) && ehData(personalizados.get(id)!))) estilos.add(i);
  });
  return estilos;
}

/** Abre o .xlsx e devolve as abas na ordem em que aparecem no arquivo. */
export async function lerXlsx(arquivo: File): Promise<Aba[]> {
  let zip: Record<string, Uint8Array>;
  try {
    zip = unzipSync(new Uint8Array(await arquivo.arrayBuffer()));
  } catch {
    throw new Error('Não consegui abrir o arquivo. Ele precisa ser uma planilha .xlsx — '
      + 'se estiver em .xls ou .ods, abra e salve como "Pasta de Trabalho do Excel (.xlsx)".');
  }
  const ler = (caminho: string) => (zip[caminho] ? strFromU8(zip[caminho]) : null);

  const livro = ler('xl/workbook.xml');
  if (!livro) throw new Error('Isto não parece ser uma planilha do Excel.');
  const docLivro = xml(livro);

  // relação id → arquivo da aba
  const rels = new Map<string, string>();
  const docRels = ler('xl/_rels/workbook.xml.rels');
  if (docRels) {
    for (const r of Array.from(xml(docRels).getElementsByTagName('Relationship'))) {
      const alvo = r.getAttribute('Target') ?? '';
      rels.set(r.getAttribute('Id') ?? '', alvo.startsWith('/') ? alvo.slice(1) : `xl/${alvo.replace(/^\.\//, '')}`);
    }
  }

  // textos compartilhados
  const compartilhados: string[] = [];
  const docStr = ler('xl/sharedStrings.xml');
  if (docStr) {
    for (const si of Array.from(xml(docStr).getElementsByTagName('si'))) {
      const partes = Array.from(si.getElementsByTagName('t')).map(t => t.textContent ?? '');
      compartilhados.push(partes.join(''));
    }
  }

  const docEstilos = ler('xl/styles.xml');
  const estilosData = docEstilos ? formatosDeData(xml(docEstilos)) : new Set<number>();

  const abas: Aba[] = [];
  const nos = Array.from(docLivro.getElementsByTagName('sheet'));
  for (const [i, no] of nos.entries()) {
    const nome = no.getAttribute('name') ?? `Planilha ${i + 1}`;
    const rid = no.getAttribute('r:id') ?? no.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id') ?? '';
    const caminho = rels.get(rid) ?? `xl/worksheets/sheet${i + 1}.xml`;
    const conteudo = ler(caminho);
    if (!conteudo) continue;

    const celulas = new Map<string, ValorCelula>();
    let ultimaLinha = 0;
    for (const c of Array.from(xml(conteudo).getElementsByTagName('c'))) {
      const ref = c.getAttribute('r');
      if (!ref) continue;
      const tipo = c.getAttribute('t');
      let valor: ValorCelula = null;

      if (tipo === 'inlineStr') {
        valor = Array.from(c.getElementsByTagName('t')).map(t => t.textContent ?? '').join('').trim();
      } else {
        const v = texto(c.getElementsByTagName('v')[0] ?? null);
        if (v === '') { valor = null; }
        else if (tipo === 's') { valor = compartilhados[Number(v)] ?? ''; }
        else if (tipo === 'str' || tipo === 'e') { valor = v; }
        else if (tipo === 'b') { valor = v === '1' ? 'sim' : 'não'; }
        else {
          const n = Number(v);
          if (Number.isNaN(n)) valor = v;
          else valor = estilosData.has(Number(c.getAttribute('s') ?? -1)) ? dataDeSerial(n) : n;
        }
      }
      if (valor === null || valor === '') continue;
      celulas.set(ref, valor);
      ultimaLinha = Math.max(ultimaLinha, Number(ref.replace(/\D/g, '')));
    }
    abas.push({ nome, celulas, ultimaLinha });
  }
  if (abas.length === 0) throw new Error('A planilha não tem nenhuma aba com conteúdo.');
  return abas;
}

/* ── Leitura de células ── */

export const cel = (aba: Aba, coluna: string, linha: number) => aba.celulas.get(`${coluna}${linha}`) ?? null;

export function texto_(v: ValorCelula): string {
  if (v === null) return '';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim();
}

/** Converte o que a secretaria digitou em número: aceita "1.250,5", "1250.5", "45%" e "R$ 1.200". */
export function numero(v: ValorCelula): number | null {
  if (v === null) return null;
  if (typeof v === 'number') return v;
  if (v instanceof Date) return null;
  let s = String(v).trim().replace(/^R\$\s*/i, '').replace(/\s|%$|un$/gi, '');
  if (!s) return null;
  const temVirgula = s.includes(',');
  const temPonto = s.includes('.');
  if (temVirgula && temPonto) s = s.replace(/\./g, '').replace(',', '.');   // 1.250,5
  else if (temVirgula) s = s.replace(',', '.');                            // 1250,5
  else if (temPonto && /\.\d{3}$/.test(s)) s = s.replace(/\./g, '');       // 1.250 (milhar)
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Converte a célula em data ISO (yyyy-mm-dd). Aceita data do Excel e texto dd/mm/aaaa. */
export function dataISO(v: ValorCelula): string | null {
  if (v === null) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'number') return dataDeSerial(v).toISOString().slice(0, 10);
  const s = String(v).trim();
  const br = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (br) {
    const [, d, m, a] = br;
    const ano = a.length === 2 ? `20${a}` : a;
    return `${ano}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return null;
}
