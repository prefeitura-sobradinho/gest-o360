# Gestão 360 — Prefeitura de Sobradinho-BA

Painel de monitoramento do PPA 2026–2029 (Lei Municipal nº 712, de 11/12/2025),
da execução financeira e dos convênios captados pelo município.

React 18 + Vite + Tailwind 4, com Firebase (Auth + Firestore).

## Rodando localmente

```bash
cp .env.example .env      # preencha com as chaves do projeto Firebase
npm install
npm run dev
```

## O que o painel acompanha

| Página | Conteúdo | Origem dos dados |
|---|---|---|
| Visão Geral | avanço do plano, metas em risco, orçamento por eixo | calculado das metas |
| PPA 2026–2029 | 7 eixos → 13 programas → 64 indicadores | Lei 712/2025, Anexo II |
| Metas e Indicadores | lista filtrável, exportação CSV, registro de andamento | Firestore |
| Execução Financeira | empenhado, liquidado e pago por programa | Portal da Transparência |
| Convênios e Emendas | captação por parlamentar, vigência, valores | Transferegov |
| Portfólio | linha do tempo de entregas | Firestore |
| Secretarias | programas, indicadores, convênios e gasto da pasta | consolidado |

## Estrutura

```
src/
  app/App.tsx          rotas
  components/
    layout/            Sidebar, Topbar, AppShell
    modals/            Login, Meta, Progresso, Kpi, Destaque, Portfólio, Convênio
    charts/            gráficos leves (SVG/CSS)
    ui-custom/         cards, badges, estados, rodapé de fonte
    ImportarPortal.tsx importação dos JSON do Portal da Transparência
  data/                eixos, programas, ações, secretarias, convênios, seeds
  hooks/               useAuth, useCollection, useMetas, useExecucao
  lib/                 firebase, metas, execucao, convenios, repositórios
  pages/               Dashboard, PPA, Metas, MetaDetalhe, Execucao, Convenios, Portfolio, Secretaria, Admin
```

## Coleções no Firestore

| Coleção | Conteúdo |
|---|---|
| `metas` | indicadores do PPA, com linha de base, meta, histórico e responsável |
| `kpis` | indicadores próprios de cada secretaria |
| `destaques` | destaques e ações por secretaria |
| `portfolio` | entregas concluídas |
| `execucao` | despesa agregada por ano, mês e ação orçamentária |
| `receitas` | previsão da LOA e arrecadação por mês |
| `convenios` | planos de ação do Transferegov e convênios |

Regras em `firestore.rules`: leitura pública, escrita apenas autenticada.

## Regras de negócio

- **Progresso da meta** = (valor atual − linha de base) ÷ (meta − linha de base). Funciona
  para indicadores que sobem e para os que precisam cair (óbitos maternos, defasagem escolar).
- **Esperado hoje** = avanço linear entre o início do PPA e o prazo da meta.
- **Em risco** = 15 p.p. abaixo do esperado, ou prazo vencido.
- **Execução do PPA** = liquidado de 2026 a 2029 ÷ recurso previsto no programa.
- **Vigência em risco** (convênio) = vence em menos de 180 dias e não foi concluído.

## Atualização mensal (rotina sugerida)

1. Portal da Transparência → Despesas → ano e mês → exportar **JSON**.
2. Área administrativa → **Importar do Portal da Transparência** → enviar o arquivo.
3. Repetir para Receitas.
4. Cada secretaria registra o andamento das suas metas em *Atualizar andamento*.

## Deploy

```bash
npm run build          # gera dist/
firebase deploy        # ou publique dist/ na Vercel
```

`vercel.json` já traz o rewrite necessário para as rotas internas funcionarem.
