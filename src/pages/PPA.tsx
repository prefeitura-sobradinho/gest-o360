import { Link } from 'react-router';
import { Activity, AlertCircle, CheckCircle, Target, ChevronRight } from 'lucide-react';
import { AvisoExemplo, BarraProgresso, Carregando, Fonte, StatusBadge } from '@/components/ui-custom';
import { eixosPPA } from '@/data/eixos';
import { programasDoEixo, recursoDoEixo, recursoTotal } from '@/data/programas';
import { ppa, fmtMi } from '@/data/municipio';
import { useMetas } from '@/hooks';
import { progresso, progressoEsperado, emRisco } from '@/lib/metas';

export function PPA() {
  const { metas, resumo, carregando, exemplo, ultimaAtualizacao } = useMetas();
  const esperado = metas.length ? Math.round(metas.reduce((a, m) => a + progressoEsperado(m), 0) / metas.length) : 0;
  const media = (ids: string[]) => {
    const ms = metas.filter(m => ids.includes(m.programaId ?? ''));
    return ms.length ? Math.round(ms.reduce((a, m) => a + progresso(m), 0) / ms.length) : 0;
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {exemplo && <AvisoExemplo />}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="page-title"><Target className="mr-3 text-orange" size={22} /> PPA {ppa.periodo}</h2>
          <p className="text-sm text-muted mt-1">{ppa.lei} · 7 eixos estruturantes · 13 programas · {resumo.total} indicadores</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="badge-verde"><CheckCircle size={11} className="mr-1" /> {resumo.concluidas} concluídas</span>
          <span className="badge-azul"><Activity size={11} className="mr-1" /> {resumo.emExecucao} em execução</span>
          <span className="badge-alerta"><AlertCircle size={11} className="mr-1" /> {resumo.emRisco} em risco</span>
        </div>
      </div>

      <div className="panel">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-bold text-ink">Execução global — {resumo.progressoMedio}%</p>
          <span className="font-mono-data text-xs text-stone">esperado hoje: {esperado}%</span>
        </div>
        <BarraProgresso pct={resumo.progressoMedio} esperado={esperado} tom="orange" altura={10} />
        <Fonte fonte={ppa.fonte} atualizadoEm={ultimaAtualizacao} className="mt-3" />
      </div>

      {carregando ? <Carregando /> : (
        <div className="space-y-4">
          {eixosPPA.map(eixo => {
            const progs = programasDoEixo(eixo.id);
            const pct = media(progs.map(p => p.id));
            const recurso = recursoDoEixo(eixo.id);
            return (
              <div key={eixo.id} className="panel">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`eixo-icon tom-${eixo.tom}`}><eixo.icone size={18} /></div>
                    <div>
                      <p className="font-mono-data text-[10px] text-stone uppercase tracking-wider">Eixo {eixo.numero}</p>
                      <h3 className="font-bold text-ink font-display text-base leading-tight">{eixo.nomeOficial}</h3>
                      <p className="text-xs text-muted mt-0.5">{eixo.descricao}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`exec-badge tom-${eixo.tom}`}>{pct}%</div>
                    <p className="font-mono-data text-[11px] text-stone mt-1.5">{fmtMi(recurso)}</p>
                    <p className="font-mono-data text-[10px] text-stone">{Math.round(recurso / recursoTotal * 100)}% do PPA</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {progs.map(prog => {
                    const ms = metas.filter(m => m.programaId === prog.id);
                    const pctP = ms.length ? Math.round(ms.reduce((a, m) => a + progresso(m), 0) / ms.length) : 0;
                    const risco = ms.filter(m => emRisco(m)).length;
                    return (
                      <div key={prog.id} className="card-flat-sm">
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0">
                            <h4 className="font-bold text-ink text-sm leading-snug">{prog.nome}</h4>
                            <p className="text-[11px] text-muted mt-0.5">{prog.areaTematica} · {prog.unidadeResponsavel}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-mono-data text-sm font-bold text-ink">{fmtMi(prog.recurso)}</p>
                            <p className="font-mono-data text-[10px] text-stone">{ms.length} indicadores</p>
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center gap-3">
                          <div className="flex-1"><BarraProgresso pct={pctP} tom={pctP === 100 ? 'verde' : risco ? 'alerta' : eixo.tom} altura={6} /></div>
                          <span className="font-mono-data text-xs font-bold text-ink shrink-0">{pctP}%</span>
                          {risco > 0 && <StatusBadge status="atrasada" />}
                        </div>
                        {ms.length > 0 && (
                          <Link to={`/ppa/metas?programa=${prog.id}`} className="text-[11px] font-bold text-orange hover:text-ink inline-flex items-center gap-1 mt-2">
                            Ver indicadores <ChevronRight size={11} />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
