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

## Catálogo de cursos (Etapa 2A)

A rota `#/cursos` exibe o catálogo: cabeçalho da página e grade responsiva de cartões (1, 2 ou 3 colunas conforme a largura).
Busca, filtros e página de detalhes foram entregues na etapa 2B (abaixo). Login e painéis ficam para as próximas etapas.

- **Dados:** `src/data/courses.ts` (12 cursos fictícios, 2 por categoria). O tipo `Course` está em `src/types/index.ts`; `price` é
  opcional e, quando ausente, o curso é exibido como "Gratuito".
- **Componentes:** `components/courses/CourseCard.tsx` (cartão) e `pages/Courses.tsx` (página). Reaproveitam `Card`, `Badge`,
  `ButtonLink`, `CourseCover`, `Icon`, `Rating` e o `Reveal`; os estilos ficam em `styles/catalog.css`.
- **Utilitários:** `utils/course.ts` (formatação de preço e números, padrão da capa por categoria).
- **Página inicial:** continua usando as seis primeiras posições de `courses` (`homeShowcase`). Novos cursos devem entrar depois delas.

## Busca, filtros e detalhes (Etapa 2B)

- **Busca** (`utils/catalog.ts`): ignora maiúsculas e acentos; todos os termos digitados precisam aparecer em algum destes campos:
  título, resumo, tags, categoria, nível, nome da instrutoria ou "gratuito".
- **Filtros** por categoria e nível, sempre combinados (E) com a busca. O número em cada opção respeita a busca e o outro filtro;
  opções sem resultado ficam desativadas.
- **Ordenação:** destaques (ordem dos dados), nome (A–Z), menor/maior preço (curso gratuito vale 0), melhor avaliação e mais alunos.
  Empates são desfeitos pelo título.
- **Endereço compartilhável:** o estado vai para o hash, ex.: `#/cursos?q=python&categoria=dados&nivel=iniciante&ordem=menor-preco`.
  Valores inválidos são ignorados. Os cards de categoria da página inicial já abrem o catálogo filtrado.
- **Detalhes:** `#/cursos/:slug` (`pages/CourseDetail.tsx`) com resumo, temas, instrutoria, painel de valor, cursos relacionados
  e "Voltar ao catálogo", que preserva a busca. Slug inexistente mostra "Curso não encontrado".
- A matrícula aparece desativada ("Matrícula em breve"): depende das contas de aluno, que não fazem parte desta etapa.

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
