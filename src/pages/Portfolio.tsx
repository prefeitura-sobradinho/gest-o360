import { useState } from 'react';
import { Link } from 'react-router';
import { Award, Clock, Edit3, PlusCircle, FileText, Music, Leaf, Users, Trophy, CheckCircle, Briefcase,
  Calculator, Map, FileSignature, BookOpen, HardHat, HeartPulse, Droplets, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { excluirEntrega } from '@/lib/portfolioRepo';
import { AdminOnly, AvisoExemplo, Carregando, Erro } from '@/components/ui-custom';
import { PortfolioModal } from '@/components/modals';
import { portfolioExemplo } from '@/data/seeds';
import { gestao } from '@/data/municipio';
import { useCollection } from '@/hooks';
import type { ItemPortfolio } from '@/types';

const ICONES: Record<string, LucideIcon> = {
  FileText, Music, Leaf, Users, Trophy, CheckCircle, Briefcase, Award,
  Calculator, Map, FileSignature, BookOpen, HardHat, HeartPulse, Droplets, Target,
};

export function Portfolio() {
  const { data, carregando, erro } = useCollection<ItemPortfolio>('portfolio');
  const [modal, setModal] = useState<ItemPortfolio | null | 'novo'>(null);
  const exemplo = !carregando && !erro && data.length === 0;
  const lista: ItemPortfolio[] = exemplo ? portfolioExemplo.map((i, n) => ({ ...i, id: `ex-${n}` })) : data;

  const excluir = async (item: ItemPortfolio) => {
    if (!confirm('Excluir esta entrega?')) return;
    await excluirEntrega(item);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {modal !== null && <PortfolioModal item={modal === 'novo' ? null : modal} onClose={() => setModal(null)} />}
      {exemplo && <AvisoExemplo />}
      {erro && <Erro mensagem={erro} />}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="page-title"><Award className="mr-3 text-orange" size={22} /> Portfólio de realizações</h2>
          <p className="text-sm text-muted mt-1">Entregas consolidadas da gestão {gestao.slogan}</p>
        </div>
        <AdminOnly><button onClick={() => setModal('novo')} className="btn-gold-solid"><PlusCircle size={14} className="mr-2" /> Registrar entrega</button></AdminOnly>
      </div>
      {carregando ? <Carregando /> : (
        <div className="relative border-l-2 border-slate-200 ml-5 space-y-6 pb-10">
          {lista.map(item => {
            const Icone = ICONES[item.icone] ?? Award;
            return (
              <div key={item.id} className="relative pl-9">
                <div className={`timeline-dot tom-${item.tom}`}><Icone size={13} /></div>
                <div className="card-flat">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                    <h3 className="text-base font-bold text-ink font-display leading-snug">{item.titulo}</h3>
                    <span className="tag-data shrink-0"><Clock size={11} className="mr-1" /> {item.data}</span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                  {item.metaId && (
                    <Link to={`/ppa/metas/${item.metaId}`} className="tag-meta">
                      <Target size={11} className="mr-1" /> Meta {item.metaCodigo ?? ''} do PPA
                    </Link>
                  )}
                  {!exemplo && (
                    <AdminOnly>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end gap-3">
                        <button onClick={() => setModal(item)} className="text-xs font-bold text-orange hover:text-ink flex items-center gap-1"><Edit3 size={11} /> Editar</button>
                        <button onClick={() => excluir(item)} className="text-xs font-bold text-alerta hover:text-ink">Excluir</button>
                      </div>
                    </AdminOnly>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
