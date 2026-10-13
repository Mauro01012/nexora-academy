# NEXORA ACADEMY

Plataforma **demonstrativa** de cursos online de tecnologia: vitrine, catálogo com busca e filtros, páginas de curso,
cadastro e login simulados, área do aluno com progresso e painel administrativo (cursos e identidade da marca).

> **Leia antes de apresentar:** é uma demonstração que roda **inteira no navegador**. Não há servidor, banco de dados,
> autenticação segura nem pagamentos. Cursos, instrutores, números e depoimentos são **fictícios**. A seção
> [O que é demonstração e o que exigiria produção](#o-que-é-demonstração-e-o-que-exigiria-produção) detalha cada ponto.

Tecnologias: React 19, TypeScript, Vite 7 e CSS próprio com variáveis (sem biblioteca de componentes).

## Sumário

1. [Requisitos](#requisitos)
2. [Instalação e execução](#instalação-e-execução)
3. [Roteiro de demonstração](#roteiro-de-demonstração)
4. [Funcionalidades](#funcionalidades)
5. [O que é demonstração e o que exigiria produção](#o-que-é-demonstração-e-o-que-exigiria-produção)
6. [Estrutura do projeto](#estrutura-do-projeto)
7. [Personalização](#personalização)
8. [Dados guardados no navegador](#dados-guardados-no-navegador)
9. [Qualidade, acessibilidade e responsividade](#qualidade-acessibilidade-e-responsividade)
10. [Publicação](#publicação)
11. [Limitações conhecidas](#limitações-conhecidas)

## Requisitos

- **Node.js 20.19 ou superior** (ou 22.12 ou superior), exigência do Vite 7. O npm que acompanha o Node basta.
- Um navegador atual (Chrome, Edge, Firefox ou Safari recentes). Os testes automatizados feitos durante o desenvolvimento
  usaram apenas o Chromium; Firefox e Safari não foram testados.
- Acesso à internet é **opcional**: só as fontes (Fraunces e Inter, do Google Fonts) vêm da rede; sem elas o site usa fontes do sistema.

## Instalação e execução

```bash
npm install        # instala as dependências (lê o package-lock.json)
npm run dev        # desenvolvimento, com recarga automática: http://localhost:5173
npm run typecheck  # verificação de tipos (tsc --noEmit)
npm run build      # verificação de tipos + build de produção em dist/
npm run preview    # serve o build de dist/ localmente para conferir antes de publicar
```

- Não existem variáveis de ambiente, chaves nem arquivos `.env`: nada precisa ser configurado.
- A pasta `node_modules/` não deve ser copiada entre sistemas operacionais (ela contém binários específicos de cada um).
  Se o build falhar com a mensagem `Cannot find module @rollup/rollup-...`, apague `node_modules/` e rode `npm install`
  no sistema em que vai compilar.
- Não há testes automatizados no repositório; a validação é descrita em [Qualidade](#qualidade-acessibilidade-e-responsividade).

## Roteiro de demonstração

Sugestão de percurso de 5 a 10 minutos (os endereços abaixo vêm depois de `http://localhost:5173/`):

1. **Página inicial** (`#/`): proposta de valor, vitrine, categorias, instrutoria, depoimentos e chamada final.
2. **Catálogo** (`#/cursos`): digite "python" na busca, filtre por categoria e nível, mude a ordenação. O endereço
   muda junto e pode ser compartilhado (ex.: `#/cursos?q=python&nivel=iniciante`).
3. **Detalhes de um curso:** abra qualquer cartão; veja o painel de valor, os temas, a instrutoria e "Voltar ao catálogo",
   que preserva a busca.
4. **Conta de exemplo:** em `#/entrar`, clique em **"Entrar com a conta de exemplo"** (não pede senha). A área do aluno
   (`#/aluno`) mostra cursos inscritos, progresso e "Simular aula concluída".
5. **Inscrição:** em outro curso, **"Inscrever-se (demonstração)"** → confirmar. Não há cobrança.
   Depois, **"Cancelar inscrição"** pede confirmação.
6. **Cadastro (simulado):** em `#/cadastro`, crie uma conta com nome, e-mail e senha de 8+ caracteres.
   Mostre também os erros de validação enviando o formulário vazio.
7. **Painel administrativo** (`#/admin`): clique em **"Entrar como administrador de demonstração"**. Veja a visão geral,
   cadastre/edite/exclua um curso em `#/admin/cursos` (ele aparece no catálogo na hora) e mude nome e cores em
   `#/admin/marca` para ver o site inteiro mudar.
8. **Restaurar tudo:** "Restaurar cursos iniciais" e "Restaurar identidade original" no painel; "apagar também os dados"
   em `#/sair`.

## Funcionalidades

| Área | Endereço | O que faz |
| --- | --- | --- |
| Início | `#/` | Hero, números ilustrativos, vitrine (6 primeiros cursos do catálogo), categorias com contagem real, benefícios, instrutoria, depoimentos e chamada que muda conforme a sessão |
| Catálogo | `#/cursos` | Grade responsiva, busca (ignora maiúsculas e acentos), filtros por categoria e nível, 6 ordenações, estado "sem resultados", endereço compartilhável |
| Curso | `#/cursos/:slug` | Resumo, temas, instrutoria, painel de valor, cursos relacionados; "Curso não encontrado" para endereço inválido |
| Inscrição | `#/cursos/:slug/inscricao` | Inscrição demonstrativa, sem cobrança, exige sessão |
| Cadastro / Login / Sair | `#/cadastro`, `#/entrar`, `#/sair` | Fluxo simulado com validação por campo, foco no primeiro erro, retorno ao destino original (`?next=`, só caminhos internos) |
| Área do aluno | `#/aluno` | Resumo da conta, cursos inscritos com progresso fictício, sugestões, cancelamento com confirmação |
| Painel: visão geral | `#/admin` | Métricas marcadas como "demo" e resumo do que está guardado neste navegador |
| Painel: cursos | `#/admin/cursos`, `/novo`, `/:id` | Listar, filtrar, cadastrar, editar e excluir cursos, com validação, confirmações e restauração |
| Painel: marca | `#/admin/marca` | Nome, slogan, descrição, e-mail e duas cores, com prévia e verificação de contraste |

Também incluídos: link "Pular para o conteúdo", menu móvel, tela de erro com recuperação, tela de carregamento inicial e aviso
para quem está sem JavaScript.

## O que é demonstração e o que exigiria produção

Tudo o que a pessoa vê funcionando é **simulado no navegador**. Para colocar em uso real seria preciso, no mínimo, o seguinte:

| Funcionalidade | Na demonstração | Para uso real seria necessário |
| --- | --- | --- |
| Cadastro e login | O formulário valida o formato. Nome e e-mail ficam no `localStorage`; **a senha é descartada** e o login só confere se o e-mail foi cadastrado neste navegador | **Backend de autenticação**: senhas com hash forte, sessões ou tokens seguros, recuperação de senha, verificação de e-mail, limite de tentativas, MFA opcional (ou provedor de identidade/OAuth) |
| Proteção de telas do aluno | `RequireAuth` apenas esconde as telas na interface | **Autorização no servidor** em cada requisição. Código no navegador não protege dados |
| Painel administrativo | Qualquer pessoa entra com um botão; o modo dura enquanto a aba estiver aberta | Autenticação forte, perfis e permissões, registro de auditoria |
| Cursos e catálogo | Dados iniciais em `src/data/courses.ts`; edições do painel ficam só no navegador de quem editou | **Banco de dados e API**, envio de imagens, fluxo de revisão e publicação |
| Conteúdo das aulas | Não existe (sem vídeo, material, avaliações ou certificados) | Hospedagem/streaming de vídeo, LMS ou CMS, exercícios, emissão de certificados |
| Inscrição (matrícula) | Registrada no navegador, sem regra de acesso | Matrícula no banco de dados, regras de acesso ao conteúdo, e-mails transacionais |
| **Pagamentos** | **Não existem.** Preços são apenas texto | **Integração com gateway de pagamento** feita no backend (checkout, webhooks, notas fiscais, reembolsos), deixando dados de cartão com o provedor |
| Progresso do aluno | Contador fictício (botão "Simular aula concluída") | Eventos reais de conclusão gravados no servidor |
| Métricas do painel | Calculadas dos dados locais; "receita" é preço × alunos, só ilustrativa | Relatórios sobre dados reais e ferramenta de análise |
| Identidade da marca no painel | Salva no navegador de quem editou; outras pessoas continuam vendo o padrão de `brand.ts` | Persistência no servidor e tema por cliente |
| Busca e filtros | Rodam no navegador sobre o catálogo inteiro | Busca no servidor ou em índice, para catálogos grandes |
| Contato | Link `mailto:` com e-mail fictício | Formulário com backend, proteção contra spam e atendimento |
| Instrutoria, depoimentos, números e benefícios | **Fictícios.** Mentoria, comunidade e certificados citados nos textos de benefícios **não existem** na demonstração | Conteúdo real e autorizado pelas pessoas citadas |
| Dados entre aparelhos | Cada navegador guarda os seus; nada é sincronizado | Persistência central no servidor |
| Privacidade (LGPD) | Não coleta dados reais, não usa cookies nem análise de uso. As fontes vêm do Google Fonts (terceiro) | Política de privacidade, base legal, consentimento quando couber, retenção; considerar hospedar as fontes localmente |

Importante: como o armazenamento é local, **qualquer pessoa com acesso ao navegador pode ler e alterar esses dados**. O
projeto avisa isso na interface (faixas de "demonstração" e cadastro com aceite) e não deve receber dados pessoais reais.

## Estrutura do projeto

```
index.html          Entrada (fontes, tela de carregamento, aviso sem JavaScript)
public/             favicon.svg
vite.config.ts      Plugin React, base relativa e alias "@" para src/
tsconfig.json       TypeScript estrito
src/
  main.tsx, App.tsx Inicialização (aplica a marca) e roteamento
  config/           brand.ts (marca, cores, fontes, logotipo e textos de demonstração) e navigation.ts
  app/              router.tsx (rotas por hash), routes.ts (mapa de rotas), pages.tsx, focus.ts
  data/             courses.ts, categories.ts, instructors.ts, testimonials.ts (dados fictícios iniciais)
  services/         demoStore.ts (contas/progresso), courseStore.ts (catálogo editável), brandStore.ts,
                    adminSession.ts, flash.ts: todos sobre localStorage/sessionStorage
  hooks/            useAuth, useAdmin, useCourses, useBrand, useDocumentTitle, useReveal
  utils/            catalog.ts (busca/filtros/ordem), course.ts, courseForm.ts, validation.ts, progress.ts, color.ts
  components/
    ui/             Button, Input, Field, Card, Badge, Icon, Logo, ConfirmDialog, NoticePage, Flash, ErrorBoundary...
    layout/         Header, Footer, Layout
    home/, courses/, auth/, admin/
  pages/            Home, Courses, CourseDetail, Enroll, Login, Signup, Logout, StudentArea, ComingSoon, admin/
  styles/           tokens.css, base.css, components.css, layout.css, home.css, catalog.css, account.css, admin.css
  types/            Tipos compartilhados
```

## Personalização

- **Marca:** edite `src/config/brand.ts` (nome, slogan, descrição, cores, fontes, logotipo, e-mail e textos de demonstração).
  As cores viram variáveis CSS (`--color-*`) na inicialização; os tokens semânticos (`--bg`, `--text`, `--danger`...) estão em
  `src/styles/tokens.css`. O guia de uso dos tokens e dos estados dos componentes está em [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md). Para testar rapidamente, use `#/admin/marca` (vale só no seu navegador).
- **Cursos, categorias, instrutoria e depoimentos iniciais:** arquivos em `src/data/`. `courses.ts` tem 12 cursos, 2 por
  categoria. O campo `price` é opcional; sem ele o curso aparece como "Gratuito".
- **Nova página:** crie em `src/pages/`, registre em `src/app/pages.tsx` e marque `implemented: true` em `src/app/routes.ts`.
  Os links existentes passam a apontar para ela sem outras mudanças.
- **Decisões técnicas:** CSS próprio com variáveis (sem Tailwind), ícones SVG próprios, capas de curso e monogramas gerados em
  SVG (nenhuma imagem externa), navegação por hash para funcionar em qualquer hospedagem estática.

## Dados guardados no navegador

| Chave | Onde | Conteúdo |
| --- | --- | --- |
| `nexora.demo.v1` | `localStorage` | Contas criadas (nome, e-mail, data), sessão, inscrições e aulas concluídas. **Nunca a senha** |
| `nexora.courses.v1` | `localStorage` | Catálogo editado no painel |
| `nexora.brand.v1` | `localStorage` | Identidade da marca personalizada no painel |
| `nexora.admin.v1` | `sessionStorage` | Modo administrador (some ao fechar a aba) |

Para limpar: "apagar também os dados" em `#/sair`, "Restaurar cursos iniciais" e "Restaurar identidade original" no painel, ou
limpar os dados do site nas configurações do navegador. Se esses dados estiverem corrompidos ou ilegíveis, a aplicação não quebra (o catálogo e a marca voltam ao padrão); se o navegador bloquear o armazenamento (ex.: modo privado restrito), tudo funciona
apenas até a página ser recarregada, **sem aviso na tela**.

## Qualidade, acessibilidade e responsividade

**Verificado durante o desenvolvimento** (testes de navegador em Chromium, scripts que **não** fazem parte do repositório):

- Verificação de tipos com TypeScript 5.9.3 (versão do `package-lock.json`) e também 6.0.3, incluindo `noUnusedLocals` e `noUnusedParameters`.
- Fluxos principais de ponta a ponta: navegação, catálogo e filtros, cadastro, login, inscrição, cancelamento, saída, e as
  operações do painel (criar, editar, excluir, restaurar cursos; salvar e restaurar a marca).
- Formulários: limites de cada campo, e-mails inválidos, senha curta, confirmação diferente, e-mail repetido, slug repetido,
  nome com HTML (exibido como texto, sem injeção) e redirecionamentos `?next=` inseguros (ignorados).
- Armazenamento corrompido, com formato errado, bloqueado ou cheio: a aplicação não quebra.
- Teclado: foco visível em todas as paradas do `Tab` das principais telas, sem `tabindex` positivo, diálogos com foco
  contido e `Esc` para fechar, devolvendo o foco a quem os abriu.
- Estrutura: idioma `pt-BR`, uma região `main` e um `h1` por página, título de aba distinto nas principais telas, link de salto, `aria-live`
  para confirmações, `aria-invalid`/`aria-describedby` nos campos com erro, respeito a `prefers-reduced-motion`.
- Contraste do texto (mínimo de 4,5:1) conferido por script nas telas, **exceto** sobre gradientes e ilustrações.
- Responsividade: de 320 a 1920 px de largura, deslogado e logado, sem rolagem horizontal e sem alvos de toque menores que
  24 px; e com a fonte do navegador ampliada de 100% a 200% em 390, 768 e 1280 px.
- Rede: a demonstração só contata o próprio servidor e o Google Fonts.

**Não verificado:** teste com leitor de tela real; Firefox e Safari; dispositivos físicos; auditoria de vulnerabilidades das
dependências (`npm audit`); desempenho (Lighthouse). O build de produção (`npm run build`) deve ser executado no ambiente de
publicação, pois o conjunto de dependências foi instalado em outro sistema durante o desenvolvimento.

## Publicação

O build gera arquivos estáticos em `dist/` com caminhos relativos (`base: './'`) e rotas por hash (`#/...`). Pode ser
hospedado em qualquer serviço de arquivos estáticos (GitHub Pages, Netlify, Vercel, S3 etc.) sem regras de reescrita.
Lembre-se de que a hospedagem não muda o caráter demonstrativo: não há backend.

## Limitações conhecidas

- Telas de formulário de curso e de marca no painel não avisam sobre alterações não salvas ao sair da página.
- A faixa de números da página inicial ("120 cursos" etc.) é ilustrativa e fixa em `brand.ts`; o catálogo tem 12 cursos.
  A contagem por categoria, ao contrário, vem do catálogo real.
- A vitrine da página inicial mostra sempre os 6 primeiros cursos do catálogo; cursos novos entram no fim.
- O painel administrativo é acessível por um link público no rodapé e os botões de entrada levam o selo "demo", de propósito, para facilitar a apresentação.
- Não há arquivo de licença no repositório: defina a licença conforme o uso comercial pretendido.
