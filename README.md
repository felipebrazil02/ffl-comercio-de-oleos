# FFL Lubrificantes

Codigo-fonte da versao publicada em https://ffllubrificantes.com.br/.

## Base verificada em 2026-10-13

Esta revisao substitui a arquitetura antiga do repositorio pela fonte do site em producao, preservando o historico Git. Os 62 arquivos do build local anterior foram comparados por SHA-1 com os arquivos do deploy Netlify `6ac98896dd77beb354fc60ec`, sem divergencias.

- Repositorio: `felipebrazil02/ffl-comercio-de-oleos`
- Branch principal: `master`
- Netlify site: `ffl-lubrificantes`
- Netlify site ID: `6bec1853-7aec-4d56-b4e7-17def5845ae1`
- Dominio canonico: `https://ffllubrificantes.com.br`
- Versao antiga recuperavel pela tag `backup/pre-seo-sync-20261013`.

## Desenvolvimento e validacao

Use Node.js 20, conforme `netlify.toml`. O projeto nao possui dependencias npm externas.

```sh
npm run build
npm run check
node scripts/test-form.mjs
npm run dev
```

O build gera `dist/` e relatorios em `outputs/`, ambos ignorados pelo Git. O servidor local roda em `127.0.0.1:4173` e envia noindex intencionalmente. Nao publique o servidor de desenvolvimento.

## Arquivos principais

- `data/company.json`: dados comerciais, catalogo, dominio e controles de indexacao.
- `content/blog/*.md`: artigos existentes.
- `scripts/build.mjs`: build, templates, metadados, sitemap, headers e redirects.
- `src/content.mjs`: paginas e templates de conteudo.
- `src/seo.mjs`: melhorias das paginas comerciais e links internos.
- `src/catalog-seo.mjs`: dados resumidos dos produtos, transparência comercial e relações explícitas entre guias e produtos. Valide com `npm run test:catalog`.
- Os caminhos contextuais para o protetivo de chassis e o óleo para limpeza de armamentos são verificados com `npm run test:specialty-links`: links no corpo dos artigos, distinção de aplicações e destinos indexáveis.
- `src/product-search-content.mjs`: conteúdo e metadados das páginas comerciais prioritárias. Valide URLs, hierarquia e contexto dos pedidos com `npm run test:products`.
- O óleo hidráulico 68 é prioridade comercial. Preserve a intenção própria dessa página e os limites documentais registrados em `editorial/oleo-68-prioridade-20261020.json`. Valide os caminhos, metadados e contatos com `npm run test:oil68` (ou `npm run test:oil68 -- https://ffllubrificantes.com.br` para o site publicado).
- `data/technical-sources/hs-aw-004-20150610.json`: rastreabilidade interna da ficha HS AW, revisão 004 de 10/06/2015, cuja validade para o produto foi confirmada pelo responsável em 20/10/2026. `npm run test:sheet` confere as quatro colunas e a publicação; use `-- --base https://ffllubrificantes.com.br` para validar em produção. Não publique o PDF, contatos ou selos do fornecedor como informações da FFL.
- `src/site.js`: interacoes e formulario.
- `src/quote-journey.mjs`: percurso contextual dos artigos ISO VG e DIN 51524 para o óleo 68 e orçamento, sem recomendar o produto automaticamente a todos os leitores. `npm run test:journey` valida navegação, prefill, consentimento e eventos usando simulações locais, sem enviar orçamentos reais.
- `src/site.css`: estilos.
- `src/assets/` e `src/static/`: arquivos originais dos assets.
- `data/README.md`: orientacoes adicionais de edicao.

## Estado do SEO e blog

A base gera 63 paginas. Sao indexaveis 53: as 33 comerciais, o indice de conteudos,
as 9 paginas de tema e os 10 artigos aprovados no lote 1. As paginas utilitarias
(404, /obrigado/, /privacidade/) permanecem noindex.

A indexacao do blog e **por artigo**, definida no frontmatter:

- `indexable: true` no artigo: sai do noindex e entra no sitemap.
- Campo ausente: permanece noindex, fora do sitemap, sem depender de interruptor global.
- O antigo `blogPublicIndexing` deixou de ser o controle, porque liberava o blog
  inteiro de uma vez. Ele permanece em `data/company.json` apenas por
  compatibilidade e nao tem mais efeito no build.

O noindex por cabecalho tambem passou a ser por URL: `dist/_headers` gera uma regra
`X-Robots-Tag` apenas para cada pagina sob `/conteudos/` que nao seja indexavel.

Os 7 artigos anteriores a 2026-10-13 continuam noindex por decisao editorial: nao
foram liberados automaticamente. Promover qualquer um deles exige revisao e
`indexable: true` no frontmatter.

Nao habilite indexacao global do blog. A publicacao seletiva esta implementada; o
agendamento continua dependendo de execucao.

## Operacao editorial

- `editorial/calendario-30-dias.md`: 100 pautas com data, intencao de busca,
  palavra-chave, pagina comercial relacionada, fontes previstas e slug.
- `editorial/registro.md`: registro versionado do que foi efetivamente publicado,
  com commit, deploy e resultado dos testes.

Dia 1 do calendario: 2026-10-13. Dias 1 a 5: 10 artigos por dia. Do dia 6 ao 30:
2 artigos por dia. Total do ciclo: 100 artigos.

Preserve dominio canonico, dados comerciais confirmados, links internos, formulario e tratamento de falhas, fontes locais, imagens otimizadas, schema sem ofertas ficticias e respostas 404 reais.

## Publicacao Netlify

Na verificacao desta sincronizacao, o site usa deploy manual e a API retornou `build_settings: {}`. Portanto, um push no GitHub nao deve ser considerado um deploy automatico confirmado. Esta sincronizacao nao altera o site publicado nem configura integracao continua.

Antes de qualquer deploy, confirme novamente o site ID e o mecanismo ativo. Gere `dist/`, execute os testes e publique uma previa. Apos validar a previa, publique os mesmos arquivos no site correto e verifique o dominio de producao. Use autenticacao local segura; nunca inclua tokens no codigo ou em URLs Git.

Se configurar integracao Git posteriormente, selecione este repositorio, branch `master`, comando `npm run build` e diretorio `dist`, conforme `netlify.toml`. Confirme o resultado do deploy antes de declarar sucesso.

## Agente editorial

Comece desta branch atualizada, nao da tag antiga nem de copias locais antigas. Antes de editar, execute `git status`, compare com o remoto e preserve mudancas existentes. Nao publique rascunhos automaticamente. O calendario editorial, as fontes tecnicas, a revisao e a rotina de publicacao devem seguir a solicitacao especifica do usuario.
