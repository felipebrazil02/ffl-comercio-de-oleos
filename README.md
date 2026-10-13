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
- `src/site.js`: interacoes e formulario.
- `src/site.css`: estilos.
- `src/assets/` e `src/static/`: arquivos originais dos assets.
- `data/README.md`: orientacoes adicionais de edicao.

## Estado do SEO e blog

A base gera 47 paginas, das quais 33 comerciais entram no sitemap. O blog existente permanece noindex e fora do sitemap por decisao editorial. As paginas utilitarias tambem permanecem noindex.

Nao habilite `blogPublicIndexing` globalmente sem revisar todos os artigos existentes. A publicacao seletiva e o agendamento ainda precisam ser implementados: o calendario solicitado pelo usuario nao esta automatizado nesta sincronizacao.

Preserve dominio canonico, dados comerciais confirmados, links internos, formulario e tratamento de falhas, fontes locais, imagens otimizadas, schema sem ofertas ficticias e respostas 404 reais.

## Publicacao Netlify

Na verificacao desta sincronizacao, o site usa deploy manual e a API retornou `build_settings: {}`. Portanto, um push no GitHub nao deve ser considerado um deploy automatico confirmado. Esta sincronizacao nao altera o site publicado nem configura integracao continua.

Antes de qualquer deploy, confirme novamente o site ID e o mecanismo ativo. Gere `dist/`, execute os testes e publique uma previa. Apos validar a previa, publique os mesmos arquivos no site correto e verifique o dominio de producao. Use autenticacao local segura; nunca inclua tokens no codigo ou em URLs Git.

Se configurar integracao Git posteriormente, selecione este repositorio, branch `master`, comando `npm run build` e diretorio `dist`, conforme `netlify.toml`. Confirme o resultado do deploy antes de declarar sucesso.

## Agente editorial

Comece desta branch atualizada, nao da tag antiga nem de copias locais antigas. Antes de editar, execute `git status`, compare com o remoto e preserve mudancas existentes. Nao publique rascunhos automaticamente. O calendario editorial, as fontes tecnicas, a revisao e a rotina de publicacao devem seguir a solicitacao especifica do usuario.
