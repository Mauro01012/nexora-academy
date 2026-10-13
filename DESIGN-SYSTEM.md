# Design system — NEXORA ACADEMY

Guia curto para reutilizar os tokens e componentes nas próximas melhorias. A fonte dos valores é sempre **um destes dois arquivos**:

| O que mudar | Onde |
| --- | --- |
| Cores da paleta, fontes, nome e logotipo da marca | `src/config/brand.ts` (vira variáveis `--color-*` e `--font-*` em `applyBrandTheme()`) |
| Escalas e tokens semânticos | `src/styles/tokens.css` |

## Três camadas de tokens

1. **Paleta** (`--color-ink-*`, `--color-paper-*`, `--color-primary-*`, `--color-accent-*`, `--color-mint-*`, `--color-amber-*`, `--color-danger-*`, `--color-white`): vem de `brand.ts`. **Nunca escreva hex no CSS**; se faltar uma cor, adicione-a em `brand.ts`.
2. **Escalas** (tipografia, espaçamento, raios, sombras, movimento, alturas de controle, foco, camadas z): em `tokens.css`.
3. **Semânticos** (`--bg`, `--surface`, `--text`, `--action`, `--cta`, `--success`...): é a camada que componentes e páginas **devem consumir**. Superfícies escuras (`.surface-dark`) e de marca (`.surface-brand`) redefinem só esta camada, então um componente escrito com tokens semânticos funciona em qualquer fundo.

## Referência rápida

| Necessidade | Token |
| --- | --- |
| Fundo da página / de seção alternada / de cartão | `--bg` / `--bg-alt` / `--surface` |
| Texto / texto secundário / texto sobre fundo escuro | `--text` / `--text-muted` / `--text-on-dark` |
| Bordas | `--border` (visível), `--border-soft` (divisória), `--border-width`, `--border-width-strong` |
| Botão e elementos de ação | `--action`, `--action-hover`, `--action-ink` |
| Chamada de destaque (uma por tela) | `--cta`, `--cta-hover`, `--cta-ink`, `--cta-glow` |
| Feedback | `--danger`/`--danger-bg`, `--success`/`--success-bg`/`--success-ink`, `--warning`/`--warning-bg`/`--warning-ink`, `--info`/`--info-bg`/`--info-ink` |
| Foco | `--focus`, `--ring-width`, `--ring-offset`, `--ring-offset-tight` |
| Tipografia | `--text-2xs … --text-4xl`, `--weight-*`, `--leading-*`, `--tracking-tight/wide/caps` |
| Espaço, raio, sombra | `--space-1 … --space-9`, `--radius-xs … --radius-pill`, `--shadow-sm/md/lg` |
| Movimento | `--ease`, `--dur-fast`, `--dur`, `--dur-slow` |
| Altura de controle | `--control-sm` (38), `--control-md` (44, alvo de toque mínimo), `--control-field` (48), `--control-lg` (54) |
| Camadas | `--z-header`, `--z-overlay`, `--z-skip` |

## Componentes e estados

Todos os componentes ficam em `src/styles/components.css` (e seus equivalentes React em `src/components/ui/`).

- **Botão** (`Button`, `ButtonLink`, `ButtonAnchor`): variantes `primary | accent | secondary | ghost | danger`, tamanhos `md | lg`. Estados: hover, active, `:focus-visible` (anel global de `base.css`), `disabled` / `aria-disabled` e **loading** — `<Button loading>` troca o ícone por um indicador, bloqueia cliques e define `aria-busy`.
- **Campo** (`Input`, `Field`, classe `.input`): hover, focus (anel suave com `--focus`), `aria-invalid` (borda e anel em `--danger`), `readonly` e `disabled`.
- **Badge** (`Badge`): a cor vem de `data-tone`. Tons de categoria: `primary mint accent amber slate`; tons de feedback: `success warning danger info`. Cada tom define `--tone`, `--tone-bg` e `--tone-ink`, um par com contraste mínimo de 4,5:1.
- **Cartão** (`Card`, `.card--interactive`), **etiqueta** (`.tag-soon`, `.tag-demo`), **aviso de sucesso** (`Flash`), **progresso** (`ProgressBar`).

## Como estender sem quebrar a consistência

- **Novo componente:** use apenas tokens semânticos e de escala. Para um botão novo, parta de `.btn`; para um campo novo, de `.input`.
- **Novo tom de badge ou capa:** adicione um bloco `[data-tone='x']` em `tokens.css` com `--tone`, `--tone-bg`, `--tone-ink` e inclua `'x'` no tipo `Tone` (`src/types/index.ts`).
- **Nova cor:** adicione em `brand.ts`, depois consuma por `var(--color-...)` ou, melhor, por um token semântico.
- **Superfície escura ou colorida:** aplique `surface-dark` / `surface-brand` no contêiner; não recolora filhos um a um.
- **Contraste:** texto precisa de 4,5:1 (3:1 para componentes de interface e textos grandes). Ao criar um par `*-bg` / `*-ink`, meça antes (a função `contrast()` de `src/utils/color.ts` serve para isso).
- **Foco:** não remova `outline`. Para ajustar a distância use `outline-offset: var(--ring-offset-tight)`; campos de texto usam o anel suave definido em `.input:focus-visible`.
- **Movimento:** use `--dur-*` e `--ease`. O bloco `prefers-reduced-motion` de `base.css` já neutraliza transições; só o indicador de loading continua girando (lento), porque precisa comunicar progresso.
