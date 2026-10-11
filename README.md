# NEXORA ACADEMY — Etapa 1/4

Plataforma demonstrativa de cursos online (React + TypeScript + Vite). Esta etapa entrega a fundação técnica,
o sistema visual e a página inicial. Todo o conteúdo (cursos, instrutores, números, depoimentos) é fictício.

## Como iniciar

```bash
npm install
npm run dev        # desenvolvimento: http://localhost:5173
npm run build      # verificação de tipos + build de produção em dist/
npm run preview    # serve o build localmente
```

Requer Node.js 18 ou superior. A navegação usa hash (`#/rota`), então o build funciona em qualquer hospedagem estática,
sem regras de reescrita.

## Estrutura

```
src/
  config/      brand.ts (marca, cores, fontes, logotipo, dados demonstrativos) e navigation.ts
  styles/      tokens.css (escala, espaçamento, raios, sombras, tokens semânticos), base.css,
               components.css (botões, campos, cards, badges), layout.css (cabeçalho/rodapé), home.css
  app/         router.tsx (roteador por hash), routes.ts (mapa de rotas), pages.tsx (páginas registradas)
  components/  ui/ (Button, Input, Card, Badge, Icon, Logo...), layout/ (Header, Footer, Layout), home/ (seções)
  data/        courses.ts, categories.ts, instructors.ts, testimonials.ts
  pages/       Home.tsx, ComingSoon.tsx
  types/       tipos compartilhados
```

## Personalização da marca

Edite `src/config/brand.ts`. As cores viram variáveis CSS (`--color-*`) em tempo de execução por `applyBrandTheme()`;
os tokens semânticos (`--bg`, `--text`, `--border`...) ficam em `src/styles/tokens.css`.

## Como a etapa 2 se encaixa

1. Crie a página em `src/pages/`.
2. Registre-a em `src/app/pages.tsx`.
3. Em `src/app/routes.ts`, troque `implemented` para `true`.

Os links já existentes (cabeçalho, rodapé, cards de curso, categorias) passam a apontar para a página real sem alterações.
Rotas planejadas e ainda não implementadas exibem a página `ComingSoon`.

## Decisões técnicas

- **CSS próprio com variáveis**, sem Tailwind: a identidade fica centralizada em `brand.ts` e nos tokens.
- **Ícones SVG próprios** (`components/ui/Icon.tsx`), sem dependência extra.
- **Sem imagens externas**: capas de curso e monogramas de instrutores são SVG gerados, e a composição do hero é feita em HTML/SVG.
- **Fontes**: Fraunces (títulos) e Inter (texto) via Google Fonts, com fallbacks do sistema.
- **Acessibilidade**: link de salto, foco visível, navegação por teclado, `aria-expanded` no menu, `aria-current`, `prefers-reduced-motion`.
