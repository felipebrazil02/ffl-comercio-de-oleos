# Edição da FFL Lubrificantes

Edite `company.json`; valores `null` e listas vazias representam pendências reais, não devem ser substituídos por exemplos na publicação.

- `businessType`: atuação confirmada (revenda, distribuição, fabricação etc.).
- `city`, `state`, `regions`, `address`, `hours`: somente localização e cobertura reais.
- `whatsapp`: 55 + DDD + número, apenas dígitos; não use número fictício.
- `email`, `phone`: canais comerciais confirmados.
- `domain`: origem HTTPS definitiva, sem barra final. Na ausência, canonical usa a origem real da revisão privada.
- `history`, `differentials`: fatos documentados. Conteúdo dos diferenciais deve ser incorporado após revisão editorial; não basta preencher a lista.
- `formEndpoint`: URL HTTPS de um receptor aprovado. Contrato detalhado no guia de entrega. Nunca coloque tokens ou credenciais aqui.
- `publicIndexing`: mantenha `false` até o lançamento público e os dados essenciais estarem confirmados.

As páginas são geradas por `node scripts/build.mjs`. O site final fica em `dist/`. O HTML principal não depende de JavaScript. `node scripts/serve.mjs` inicia a prévia de revisão em 127.0.0.1:4173 e sempre emite noindex.

## Catálogo

`categories` aceita objetos com `confirmed`, `slug`, `name`, `description`, `selection`, `metaDescription` e `faq: [{question, answer}]`. Ative `confirmed: true` apenas após confirmar comercialização e revisar as descrições.

`products` aceita objetos com `confirmed`, `slug`, `category` (slug da categoria), `name`, `manufacturer`, `description`, `applications`, `viscosity`, `specifications: []`, `packaging: []`, `source` (referência documental interna obrigatória), `technicalSheet`, `safetySheet` e `metaDescription`. Os documentos devem usar URLs HTTPS oficiais ou arquivos locais publicados em `dist/`. O gerador não cria ofertas, disponibilidade, preços ou avaliações.

Os slugs aceitam apenas letras minúsculas, números e hífens simples. Não reutilize URLs. Produtos e categorias só geram páginas quando confirmados. Não há produtos fictícios de demonstração no catálogo.

Ao remover uma página anteriormente publicada, remova também o HTML correspondente de `dist/` e avalie um redirecionamento 301 documentado. Não redirecione indiscriminadamente produtos retirados para a página inicial.

## Conteúdo e apresentação

`src/content.mjs`: páginas internas, artigos e modelos de catálogo. `scripts/build.mjs`: página inicial, navegação, rodapé, metadados, regras de geração. `src/site.css`: identidade visual e responsividade. `src/site.js`: menu, validação, resumo e eventos.

`dist/assets/`: imagem conceitual em WebP e fontes WOFF2 locais; mantenha os arquivos no controle de versão. A arte não representa instalações ou produtos da empresa. O logotipo tipográfico é uma proposta visual até o recebimento do original.

O JSON-LD Organization usa apenas dados existentes. O catálogo sob orçamento não emite Product: não há ofertas com preços públicos nem avaliações elegíveis. Não invente preços ou avaliações para habilitar resultados enriquecidos. BreadcrumbList permanece nas páginas. LocalBusiness não foi usado. Orientações específicas de consulta ficam em `src/product-consultation.mjs`, com base nos dados confirmados; não representam novas homologações ou equivalências.
