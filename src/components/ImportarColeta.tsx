import { useState, type ChangeEvent } from 'react';
import { FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, Users } from 'lucide-react';
import { lerPlanilhaColeta, fmtValor, type LeituraPlanilha } from '@/lib/planilhaColeta';
import { prever, aplicarColeta, type PrevisaoColeta, type ResultadoColeta } from '@/lib/coletaRepo';
import { progresso, fmtNum } from '@/lib/metas';
import { secretarias } from '@/data/secretarias';
import { useAuth, useMetas } from '@/hooks';

type Fase =
  | { etapa: 'parado' }
  | { etapa: 'lendo' }
  | { etapa: 'confere'; leitura: LeituraPlanilha; previsao: PrevisaoColeta; arquivo: string }
  | { etapa: 'gravando' }
  | { etapa: 'pronto'; resultado: ResultadoColeta; avisos: string[] }
  | { etapa: 'erro'; mensagem: string };

/**
 * Importa a planilha de coleta devolvida pelas secretarias.
 * Mostra o que vai mudar antes de gravar — a importação só acontece depois da conferência.
 */
export function ImportarColeta() {
  const { user } = useAuth();
  const { metas, exemplo } = useMetas();
  const [fase, setFase] = useState<Fase>({ etapa: 'parado' });

  const escolher = async (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    e.target.value = '';
    if (!arquivo) return;
    setFase({ etapa: 'lendo' });
    try {
      const leitura = await lerPlanilhaColeta(arquivo);
      const previsao = prever(leitura.ppa, leitura.proprios, metas);
      if (!previsao.atualizar.length && !previsao.proprios.length) {
        setFase({
          etapa: 'erro',
          mensagem: previsao.semMudanca.length
            ? 'A planilha foi lida, mas nenhum valor mudou em relação ao que já está no painel.'
            : 'A planilha foi lida, mas nenhuma secretaria preencheu a coluna "Valor apurado".',
        });
        return;
      }
      setFase({ etapa: 'confere', leitura, previsao, arquivo: arquivo.name });
    } catch (err) {
      setFase({ etapa: 'erro', mensagem: (err as Error).message });
    }
  };

  const gravar = async () => {
    if (fase.etapa !== 'confere') return;
    const { previsao, leitura } = fase;
    setFase({ etapa: 'gravando' });
    try {
      const resultado = await aplicarColeta(previsao, user?.email ?? 'SEPLAN');
      setFase({ etapa: 'pronto', resultado, avisos: leitura.avisos });
    } catch (err) {
      setFase({ etapa: 'erro', mensagem: (err as Error).message });
    }
  };

  return (
    <div className="panel">
      <div className="flex items-start gap-3 mb-3">
        <div className="eixo-icon tom-verde shrink-0"><FileSpreadsheet size={18} /></div>
        <div className="min-w-0">
          <h3 className="panel-title">Importar a planilha das secretarias</h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Abra o arquivo .xlsx que a secretaria devolveu. O painel lê as duas partes: as medições dos
            indicadores do PPA e os indicadores próprios da pasta, que vão para a página dela.
            Nada é gravado antes de você conferir.
          </p>
        </div>
      </div>

      {exemplo && (
        <p className="aviso-exemplo mb-3">
          As metas ainda são as de exemplo. Rode a carga inicial do PPA antes de importar a planilha.
        </p>
      )}

      {(fase.etapa === 'parado' || fase.etapa === 'erro') && (
        <>
          <label className="btn-upload">
            <input type="file" accept=".xlsx" onChange={escolher} hidden disabled={exemplo} />
            <FileSpreadsheet size={14} className="mr-2" /> Escolher planilha (.xlsx)
          </label>
          {fase.etapa === 'erro' && (
            <div className="alerta-bar mt-3">
              <AlertTriangle size={16} className="shrink-0" />
              <span className="font-normal">{fase.mensagem}</span>
            </div>
          )}
        </>
      )}

      {(fase.etapa === 'lendo' || fase.etapa === 'gravando') && (
        <p className="text-sm text-muted flex items-center gap-2">
          <span className="modal-spinner" />
          {fase.etapa === 'lendo' ? 'Lendo a planilha…' : 'Gravando…'}
        </p>
      )}

      {fase.etapa === 'confere' && (
        <Conferencia fase={fase} onConfirmar={gravar} onCancelar={() => setFase({ etapa: 'parado' })} />
      )}

      {fase.etapa === 'pronto' && (
        <div className="space-y-3">
          <div className="resultado-import ok">
            <CheckCircle2 size={16} className="shrink-0" />
            <div>
              <p className="font-bold">Planilha importada.</p>
              <ul className="font-mono-data text-xs mt-1.5 space-y-0.5">
                <li>{fase.resultado.metasAtualizadas} indicadores do PPA atualizados</li>
                {fase.resultado.kpisCriados > 0 && <li>{fase.resultado.kpisCriados} indicadores próprios publicados</li>}
                {fase.resultado.kpisAtualizados > 0 && <li>{fase.resultado.kpisAtualizados} indicadores próprios atualizados</li>}
                {fase.resultado.concluidas.length > 0 && (
                  <li>metas concluídas: {fase.resultado.concluidas.join(', ')}</li>
                )}
              </ul>
            </div>
          </div>
          {fase.resultado.concluidas.length > 0 && (
            <p className="text-xs text-muted">
              As metas concluídas podem ser publicadas no Portfólio de Realizações pela página do indicador.
            </p>
          )}
          <Avisos lista={fase.avisos} />
          <button onClick={() => setFase({ etapa: 'parado' })} className="btn-ghost-sm">Importar outra</button>
        </div>
      )}
    </div>
  );
}

function Conferencia({ fase, onConfirmar, onCancelar }: {
  fase: Extract<Fase, { etapa: 'confere' }>;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  const { leitura, previsao, arquivo } = fase;
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted font-mono-data">
        {arquivo} · {leitura.abasLidas.length} {leitura.abasLidas.length === 1 ? 'secretaria' : 'secretarias'}
        {leitura.abasIgnoradas.length > 0 && ` · ${leitura.abasIgnoradas.length} abas ignoradas`}
      </p>

      {leitura.responsaveis.filter(r => r.quem).length > 0 && (
        <div className="card-flat-sm">
          <p className="secao-label mb-1.5"><Users size={11} className="inline mr-1 -mt-0.5" /> Quem respondeu</p>
          <ul className="text-xs text-muted space-y-0.5">
            {leitura.responsaveis.filter(r => r.quem).map(r => (
              <li key={r.aba}>
                <strong className="text-ink">{secretarias[r.secretariaId]?.titulo ?? r.aba}</strong> · {r.quem}
                {r.enviadoEm && ` · ${r.enviadoEm.split('-').reverse().join('/')}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {previsao.atualizar.length > 0 && (
        <div>
          <p className="secao-label mb-2">
            {previsao.atualizar.length} {previsao.atualizar.length === 1 ? 'indicador do PPA' : 'indicadores do PPA'} serão atualizados
          </p>
          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {previsao.atualizar.map(({ meta, linha, valorAntes }) => {
              const antes = progresso(meta);
              const depois = progresso({ ...meta, valorAtual: linha.valor });
              return (
                <div key={meta.id} className="previa-linha">
                  <div className="min-w-0">
                    <p className="previa-titulo">
                      <span className="font-mono-data text-stone mr-1.5">{meta.codigo}</span>{meta.titulo}
                    </p>
                    <p className="previa-num">
                      {fmtNum(valorAntes)} → <strong className="text-ink">{fmtValor(linha.valor, meta.unidade)}</strong>
                      {linha.data && ` · apurado em ${linha.data.split('-').reverse().join('/')}`}
                    </p>
                  </div>
                  <span className="previa-pct">
                    {antes}% <ArrowRight size={11} className="inline mx-0.5 text-stone" />
                    <strong className={depois >= 100 ? 'text-verde' : 'text-ink'}>{depois}%</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {previsao.proprios.length > 0 && (
        <div>
          <p className="secao-label mb-2">
            {previsao.proprios.length} {previsao.proprios.length === 1 ? 'indicador próprio' : 'indicadores próprios'} das secretarias
          </p>
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {previsao.proprios.map((p, i) => (
              <div key={`${p.secretariaId}-${i}`} className="previa-linha">
                <div className="min-w-0">
                  <p className="previa-titulo">{p.label}</p>
                  <p className="previa-num">{secretarias[p.secretariaId]?.titulo ?? p.secretariaId}</p>
                </div>
                <span className="previa-pct"><strong className="text-ink">{fmtValor(p.valor, p.unidade)}</strong></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {previsao.semMudanca.length > 0 && (
        <p className="text-xs text-muted">
          {previsao.semMudanca.length} {previsao.semMudanca.length === 1 ? 'indicador veio' : 'indicadores vieram'} com
          o mesmo valor que já está no painel e {previsao.semMudanca.length === 1 ? 'será mantido' : 'serão mantidos'} como está.
        </p>
      )}

      {previsao.desconhecidas.length > 0 && (
        <div className="alerta-bar">
          <AlertTriangle size={16} className="shrink-0" />
          <span className="font-normal">
            Não reconheci {previsao.desconhecidas.length === 1 ? 'o código' : 'os códigos'}{' '}
            {previsao.desconhecidas.map(d => d.codigo).join(', ')} — {previsao.desconhecidas.length === 1 ? 'essa linha será ignorada' : 'essas linhas serão ignoradas'}.
          </span>
        </div>
      )}

      <Avisos lista={leitura.avisos} />

      <div className="flex gap-2">
        <button onClick={onConfirmar} className="btn-gold-solid">
          <CheckCircle2 size={13} className="mr-1.5" /> Confirmar e gravar
        </button>
        <button onClick={onCancelar} className="btn-ghost-sm">Cancelar</button>
      </div>
    </div>
  );
}

function Avisos({ lista }: { lista: string[] }) {
  if (!lista.length) return null;
  return (
    <div className="card-flat-sm">
      <p className="secao-label mb-1.5">
        <AlertTriangle size={11} className="inline mr-1 -mt-0.5" /> {lista.length} {lista.length === 1 ? 'ponto de atenção' : 'pontos de atenção'}
      </p>
      <ul className="text-xs text-muted space-y-0.5">
        {lista.map((a, i) => <li key={i}>{a}</li>)}
      </ul>
    </div>
  );
}
