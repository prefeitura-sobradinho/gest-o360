import { useState } from 'react';
import { Navigate } from 'react-router';
import { Wrench, Database, CheckCircle } from 'lucide-react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks';
import { metasExemplo, portfolioExemplo } from '@/data/seeds';
import { conveniosIniciais } from '@/data/convenios';
import { secretarias } from '@/data/secretarias';
import { ImportarPortal } from '@/components/ImportarPortal';

type Tarefa = { nome: string; desc: string; run: () => Promise<number> };

/** Ferramentas administrativas — substitui as funções que antes ficavam expostas em `window`. */
export function Admin() {
  const { isAdmin, carregando } = useAuth();
  const [log, setLog] = useState<string[]>([]);
  const [ocupado, setOcupado] = useState(false);

  if (carregando) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  const vazio = async (nome: string) => (await getDocs(collection(db, nome))).empty;

  const tarefas: Tarefa[] = [
    { nome: 'Importar indicadores do PPA', desc: `Cria as ${metasExemplo.length} metas oficiais do PPA 2026–2029 na coleção "metas" (só se estiver vazia).`,
      run: async () => { if (!(await vazio('metas'))) throw new Error('A coleção "metas" já tem dados.'); for (const m of metasExemplo) await addDoc(collection(db, 'metas'), m); return metasExemplo.length; } },
    { nome: 'Importar indicadores das secretarias', desc: 'Cria os KPIs de exemplo na coleção "kpis" (só se estiver vazia).',
      run: async () => { if (!(await vazio('kpis'))) throw new Error('A coleção "kpis" já tem dados.'); let n = 0; for (const s of Object.values(secretarias)) for (const [i, k] of s.kpisExemplo.entries()) { await addDoc(collection(db, 'kpis'), { secretaria_id: s.id, ordem: i, ...k }); n++; } return n; } },
    { nome: 'Importar destaques das secretarias', desc: 'Cria os destaques de exemplo na coleção "destaques" (só se estiver vazia).',
      run: async () => { if (!(await vazio('destaques'))) throw new Error('A coleção "destaques" já tem dados.'); let n = 0; for (const s of Object.values(secretarias)) for (const [i, d] of s.destaquesExemplo.entries()) { await addDoc(collection(db, 'destaques'), { secretaria_id: s.id, titulo: d.titulo, descricao: d.desc, ordem: i }); n++; } return n; } },
    { nome: 'Importar convênios e emendas', desc: `Cria ${conveniosIniciais.length} planos de ação do Transferegov na coleção "convenios" (só se estiver vazia).`,
      run: async () => { if (!(await vazio('convenios'))) throw new Error('A coleção "convenios" já tem dados.'); for (const c of conveniosIniciais) await addDoc(collection(db, 'convenios'), c); return conveniosIniciais.length; } },
    { nome: 'Importar portfólio', desc: 'Cria as entregas de exemplo na coleção "portfolio" (só se estiver vazia).',
      run: async () => { if (!(await vazio('portfolio'))) throw new Error('A coleção "portfolio" já tem dados.'); for (const p of portfolioExemplo) await addDoc(collection(db, 'portfolio'), p); return portfolioExemplo.length; } },
  ];

  const executar = async (t: Tarefa) => {
    setOcupado(true);
    try { const n = await t.run(); setLog(l => [`✔ ${t.nome}: ${n} registros criados.`, ...l]); }
    catch (e) { setLog(l => [`✖ ${t.nome}: ${(e as Error).message}`, ...l]); }
    finally { setOcupado(false); }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div><h2 className="page-title"><Wrench className="mr-3 text-orange" size={22} /> Ferramentas administrativas</h2><p className="text-sm text-muted mt-1">Carga inicial a partir do PPA 2026–2029 (Lei nº 712/2025). Cada importação só roda se a coleção estiver vazia.</p></div>
      <ImportarPortal />

      <div>
        <h3 className="panel-title mb-1">Carga inicial do PPA</h3>
        <p className="text-xs text-muted mb-3">Só é preciso rodar uma vez, quando o banco está vazio.</p>
      </div>
      <div className="grid gap-3">
        {tarefas.map(t => (
          <div key={t.nome} className="panel flex items-center justify-between gap-4">
            <div className="flex items-start gap-3"><Database size={16} className="text-stone mt-0.5 shrink-0" /><div><p className="font-bold text-ink text-sm">{t.nome}</p><p className="text-xs text-muted mt-0.5">{t.desc}</p></div></div>
            <button onClick={() => executar(t)} disabled={ocupado} className="btn-ghost-sm shrink-0">Executar</button>
          </div>
        ))}
      </div>
      {log.length > 0 && (
        <div className="panel"><h3 className="panel-title flex items-center mb-3"><CheckCircle size={15} className="mr-2 text-stone" /> Resultado</h3><ul className="space-y-1 font-mono-data text-xs text-muted">{log.map((l, i) => <li key={i}>{l}</li>)}</ul></div>
      )}
    </div>
  );
}
