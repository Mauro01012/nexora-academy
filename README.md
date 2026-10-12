# NEXORA ACADEMY — Etapa 4A (integração e acabamento)

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
- **Página inicial:** usa as seis primeiras posições do catálogo atual (`useCourses().slice(0, 6)`; `homeShowcase` em `data/courses.ts` é só a referência dos dados iniciais). Novos cursos devem entrar depois delas.

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

## Conta e área do aluno (Etapa 3A)

Fluxo de autenticação **simulado**, só no navegador. Não há servidor, token, pagamento nem segurança de produção.

- **Telas:** `#/cadastro`, `#/entrar`, `#/sair` (confirmação), `#/aluno` (resumo, cursos inscritos e progresso fictício) e
  `#/cursos/:slug/inscricao` (inscrição demonstrativa, sem cobrança). A conta de exemplo é `demo@nexora.example`.
- **Validação:** nome (2 a 60 caracteres), e-mail em formato válido, senha de 8 a 128 caracteres, confirmação igual e aceite do aviso
  de demonstração. Os erros aparecem por campo e o foco vai ao primeiro inválido.
- **Dados guardados** (`localStorage`, chave `nexora.demo.v1`, em `services/demoStore.ts`): nome, e-mail digitado, data de criação,
  inscrições e contagem de aulas. A senha é validada só quanto ao formato e descartada: nunca é guardada nem enviada.
  O login confere apenas se o e-mail pertence a uma conta criada neste navegador.
- **Proteção de rotas:** `RequireAuth` não renderiza `#/aluno` nem a inscrição sem sessão e leva ao login, que devolve ao destino
  (`?next=`, aceito só para caminhos internos conhecidos). É uma barreira de interface, não proteção de dados.
- **Apagar dados:** em `#/sair`, a opção "apagar também os dados" remove tudo o que a demonstração guardou.

## Painel administrativo (Etapa 3B)

Painel **demonstrativo**, só no navegador. Não há backend, autorização real nem segurança de produção.

- **Acesso:** `#/admin` mostra um aviso e um botão para entrar como administrador de demonstração. Qualquer pessoa pode fazê-lo. O
  modo fica no `sessionStorage` (acaba ao fechar a aba) e é independente da conta de aluno. O painel tem estrutura própria
  (barra escura com selo "Admin · demonstração", menu lateral e faixa de aviso), sem o cabeçalho e o rodapé do site.
- **Visão geral** (`#/admin`): métricas marcadas como "demo", calculadas dos cursos cadastrados, e um bloco separado com o que é local
  deste navegador (contas, inscrições, catálogo editado, marca personalizada).
- **Cursos** (`#/admin/cursos`, `/novo`, `/:id`): listar, filtrar, cadastrar, editar e excluir. Validação por campo (título, slug único,
  resumo, números, valor, temas). Excluir e restaurar pedem confirmação. Cursos novos entram no fim do catálogo, sem alterar a vitrine
  da página inicial.
- **Dados:** `src/data/courses.ts` continua sendo o conjunto inicial e nunca é alterado. As edições ficam no `localStorage`
  (`nexora.courses.v1`, em `services/courseStore.ts`); "Restaurar cursos iniciais" descarta tudo. Catálogo, detalhes, busca e
  página inicial leem dessa mesma fonte (`hooks/useCourses`). Inscrições de alunos em cursos excluídos ficam ocultas e voltam se o curso voltar.
- **Marca** (`#/admin/marca`): nome, complemento, slogan, descrição, e-mail e duas cores, com prévia. Os padrões continuam em
  `src/config/brand.ts`; o que for salvo vai por cima (`services/brandStore.ts`, `nexora.brand.v1`). Limites de tamanho e contraste mínimo
  de 4,5:1 protegem o layout e a legibilidade. "Restaurar identidade original" volta à paleta exata do arquivo.

## Integração e acabamento (Etapa 4A)

Revisão dos fluxos de ponta a ponta (início, catálogo, filtros, detalhes, cadastro, login, área do aluno e painel), sem novas
funcionalidades e sem alterar dados ou a configuração da marca.

- **Build:** `tsconfig.json` sem `baseUrl` (obsoleto no TypeScript 6; `paths` agora usa `./src/*`).
- **Navegação:** "Cursos" no menu limpa busca e filtros; o item do menu fica marcado também nas páginas de detalhe e inscrição;
  a cada troca de rota o foco vai ao título da página (`app/focus.ts`) e o título da aba é atualizado também no 404.
- **Estados:** `ErrorBoundary` evita tela em branco; tela de carregamento e aviso sem JavaScript no `index.html`; confirmação antes
  de cancelar inscrição (o progresso é descartado) e mensagem de confirmação (`ui/Flash`); o foco não se perde depois de inscrever,
  sair da conta, excluir ou entrar no modo admin.
- **Componentes:** `ui/Field` (rótulo, dica e erro) é a base de `Input`, `SelectField` e `TextAreaField`; `ui/NoticePage` substitui o
  markup repetido de "não encontrado", acesso restrito, saída da conta e erro.
- **Cores de erro:** `--danger` (de `danger-600`/`danger-400` em `config/brand.ts`) com contraste mínimo de 4,5:1, independente da cor de destaque.
- **Home:** a contagem de cursos por categoria vem do catálogo atual (antes era um número ilustrativo fixo, que não batia com a lista).
  O campo `courseCount` continua em `data/categories.ts`, sem uso.

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
