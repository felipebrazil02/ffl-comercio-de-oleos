# Registro editorial — FFL Lubrificantes

Registro versionado da operação. Uma nova execução deve lê-lo antes de publicar,
para não duplicar artigos e para retomar apenas o que falta.

## Operação

- **Fuso horário:** America/Sao_Paulo (UTC−03:00)
- **Dia 1 do calendário:** 2026-10-13
- **Cadência:** dias 1–5 → 10 artigos/dia · dia 6 em diante → 2 artigos/dia
- **Meta do ciclo de 30 dias:** 100 artigos (último dia: 2026-11-11)
- **Repositório:** `felipebrazil02/ffl-comercio-de-oleos` · branch de produção `master`
- **Netlify:** projeto `ffl-lubrificantes` · site ID `6bec1853-7aec-4d56-b4e7-17def5845ae1`
  · domínio canônico `https://ffllubrificantes.com.br`
- **Mecanismo de deploy:** manual (`netlify deploy --prod --dir dist`). O projeto
  Netlify não tem repositório Git vinculado, então `git push` **não** publica.
- **Indexação do blog:** por artigo, via `indexable: true` no frontmatter.

## Lote 1 — 2026-10-13 (Dia 1)

Planejados: 10 · Aprovados: 10 · Publicados: 10 · Pendentes: 0

| ID | Slug | Status editorial | Indexável | Fontes |
|---|---|---|---|---|
| A01 | indice-de-viscosidade | aprovado | sim | ASTM D2270 · ISO 2909 |
| A02 | iso-4406-codigo-de-contaminacao | aprovado | sim | ISO 4406 · ISO 4407 |
| A03 | ponto-de-fluidez-e-ponto-de-nevoa | aprovado | sim | ASTM D97 · ASTM D2500 |
| A04 | ensaio-de-quatro-esferas | aprovado | sim | ASTM D2783 · D2266 · D2596 |
| A05 | base-da-graxa-litio-calcio-complexo | aprovado | sim | NLGI · ASTM D217 · DIN 51825 |
| A06 | demulsibilidade-e-formacao-de-espuma | aprovado | sim | ASTM D1401 · D892 · ISO 6614 |
| A07 | concentracao-e-ph-do-fluido-de-corte | aprovado | sim | ASTM D4627 · ISO 6743-7 · NIOSH |
| A08 | armazenamento-de-lubrificantes | aprovado | sim | ISO 4406 · NLGI |
| A09 | compatibilidade-com-vedacoes-e-tintas | aprovado | sim | ISO 6072 · ASTM D471 |
| A10 | analise-de-oleo-em-tendencia | aprovado | sim | ASTM D5185 · D6304 · ISO 4406 |

URLs publicadas (canônico `https://ffllubrificantes.com.br`):

```
/conteudos/indice-de-viscosidade/
/conteudos/iso-4406-codigo-de-contaminacao/
/conteudos/ponto-de-fluidez-e-ponto-de-nevoa/
/conteudos/ensaio-de-quatro-esferas/
/conteudos/base-da-graxa-litio-calcio-complexo/
/conteudos/demulsibilidade-e-formacao-de-espuma/
/conteudos/concentracao-e-ph-do-fluido-de-corte/
/conteudos/armazenamento-de-lubrificantes/
/conteudos/compatibilidade-com-vedacoes-e-tintas/
/conteudos/analise-de-oleo-em-tendencia/
```

### Alterações técnicas do lote 1

1. `scripts/build.mjs`: indexação do blog passou a ser **opt-in por artigo**
   (`indexable: true`), em vez do interruptor global `blogPublicIndexing`.
2. `scripts/build.mjs`: `X-Robots-Tag: noindex` passou a ser emitido **por URL**
   em `dist/_headers`, somente para as páginas de `/conteudos/` não indexáveis.
3. `src/content.mjs`: hub de conteúdos e páginas de tema passam a ser indexáveis
   quando reúnem ao menos um artigo aprovado.
4. `editorial/calendario-30-dias.md`: calendário de 100 pautas.
5. Nenhuma URL existente foi alterada. Nenhum produto ou categoria foi tocado.

### Testes do lote 1 (build local)

- `npm run build` → 63 páginas geradas.
- `npm run check` → 0 erros.
- `node scripts/test-form.mjs` → 7 cenários aprovados.
- Sitemap → 53 URLs (33 comerciais + 10 artigos + hub + 9 páginas de tema).
- Canonical, `meta robots`, `Article` e `BreadcrumbList` conferidos nos 10 artigos.
- Links internos: 0 quebrados.

### Publicação do lote 1

- **Commit:** `40d88d0` — "Blog: indexacao por artigo e lote 1 (10 artigos)"
- **Branch:** `seo/blog-lote1-20261013`
- **Deploy de preview (Netlify):** `6ace2dc7e809252dddcfbfa8`
- **Deploy de produção (Netlify):** `6ace2e5eed3e0d79c44d2d51` · `https://ffllubrificantes.com.br`
- **Promovido para produção:** sim, em 2026-10-13

### Verificação em produção (2026-10-13)

| Verificação | Resultado |
|---|---|
| 10 artigos do lote | HTTP 200, H1 único, `Article` + `BreadcrumbList` + `citation` |
| `meta robots` dos 10 artigos | `index, follow` |
| `X-Robots-Tag` dos 10 artigos | ausente |
| `meta robots` do hub e das páginas de tema | `index, follow` |
| 7 artigos antigos | `noindex, nofollow` na meta **e** no cabeçalho |
| Sitemap | 53 URLs · 20 de blog · 33 comerciais preservadas |
| Canonical dos 10 artigos | absoluto em `https://ffllubrificantes.com.br` |
| `robots.txt` | `Allow: /` + `Sitemap:` do domínio principal |
| URL inexistente | 404 real |
| `/index.html` | 301 para `/` |
| `www` e `http` | 301 |
| Home, catálogo, categoria, produto, sobre, contato | HTTP 200 |
| Formulário | detectado pelo Netlify Forms (`form-name=orcamento`); nenhum lead fictício enviado |
| WhatsApp | `wa.me/5511915011527` presente |
| E-mail comercial | `contato@ffloleos.com.br` — **não alterado** |

Observação: em deploy de preview o Netlify aplica `X-Robots-Tag: noindex` em todo o
site por padrão. A verificação de indexação acima foi feita no domínio de produção,
onde esse cabeçalho do preview não existe.

## Lotes 2 a 4 (registro consolidado)

Os lotes 2 a 4 foram publicados em commits anteriores. O detalhamento por artigo
não foi transcrito neste registro na época; os commits são a referência:

| Lote | Conteúdo | Artigos | Commit |
|---|---|---|---|
| 2 | Hidráulica industrial (A11–A20) | 10 | `7228673` |
| 3 | Graxas industriais (A21–A30) | 10 | `3d8075e` |
| 4 | Usinagem (A31–A32) e ajuste de links internos | 2 | `1b9c4ad` |

## Lote 5 — 2026-10-19 (Dia 7)

Pendentes no início da execução: 2 na fila (A33, A34). Aprovados e publicados: 2.

| ID | Slug | Fontes | URL |
|---|---|---|---|
| A33 | fluido-de-corte-espumando | ISO 6743-7 · HSE COSHH MW5 · OSHA | `/conteudos/fluido-de-corte-espumando/` |
| A34 | corrosao-pecas-ferro-fundido | ASTM D4627 · ISO 6743-7 · HSE COSHH MW5 | `/conteudos/corrosao-pecas-ferro-fundido/` |

### Testes do lote 5 (build local)

- `npm run build` → 89 páginas geradas.
- `npm run check` → 0 erros · 2.856 links/ativos locais · 246 objetos de schema.
- `node scripts/test-form.mjs` → 7 cenários aprovados.
- Títulos: 55 e 54 caracteres (limite 62).
- Contagem de palavras: 950 e 933 (faixa 600–1200).

### Publicação do lote 5

- **Commit dos artigos:** `6009f09` — "Blog: lote 5 usinagem (A33, A34)"
- **Branch:** `master` (commit direto, push `1b9c4ad..6009f09`)
- **Deploy de preview (Netlify):** `6ad5f9219eb42f2ec96f9e87`
- **Deploy de produção (Netlify):** `6ad5f93419ff12512be171c4`

### Verificação em produção (2026-10-19)

| Verificação | Resultado |
|---|---|
| A33 e A34 | HTTP 200 |
| `meta robots` | `index, follow` nos dois |
| `X-Robots-Tag` | ausente nos dois |
| Canonical | absoluto em `https://ffllubrificantes.com.br` |
| Schema | `Article` + `BreadcrumbList` presentes nos dois |
| Sitemap | 86 URLs · ambos os artigos presentes · 33 URLs não-`/conteudos/` preservadas |
| URL inexistente | 404 real |
| Home, catálogo, sobre, contato, 2 categorias | HTTP 200 |

## Lote 6 — 2026-10-21 (Dia 9)

Observação de fila: o lote do dia 8 (A35, A36) foi redigido por uma execução
anterior que não chegou a validar nem publicar — os dois arquivos estavam na pasta
`content/blog/` sem versionamento e sem deploy. Esta execução retomou e concluiu
**esse** lote. Nenhum artigo além dele foi criado.

Pendentes no início da execução: 2 (A35, A36, redigidos e não publicados).
Aprovados e publicados: 2.

| ID | Slug | Fontes | URL |
|---|---|---|---|
| A35 | usinagem-de-aluminio-fluido | ISO 6743-7 · HSE COSHH MW5 · FUCHS Cutting Fluids Manual · Rhenus Lub | `/conteudos/usinagem-de-aluminio-fluido/` |
| A36 | usinagem-de-inox-fluido | ISO 6743-7 · HSE COSHH MW5 · FUCHS Cutting Fluids Manual · Outokumpu (via Penn Stainless) | `/conteudos/usinagem-de-inox-fluido/` |

### Alterações do lote 6

1. `published` dos dois artigos ajustado para 2026-10-21 (data efetiva de
   publicação); `consulted` mantido em 2026-10-20, quando o conteúdo foi apurado.
2. `content/blog/oleo-de-corte-integral-ou-emulsionavel.md`: parágrafo novo com link
   contextual para os dois artigos. O teste de links editoriais exige pelo menos um
   link de entrada para cada artigo, e sem esse ajuste os dois novos ficariam órfãos.
3. Nenhuma URL existente foi alterada, nenhum produto ou categoria foi tocado.

Nota: `origin/master` estava 10 commits à frente (trabalho comercial paralelo:
páginas de produto, busca e links contextuais). A sincronização foi feita por
`git pull --ff-only` antes do lote, sem conflito.

### Testes do lote 6 (build local)

- `npm run build` → 94 páginas geradas.
- `npm run check` → 0 erros · 3.482 links/ativos locais.
- `node scripts/test-form.mjs` → 7 cenários aprovados.
- `node scripts/test-links-editoriais.mjs` → OK (0 artigos órfãos).
- `test-growth`, `test-catalog-seo`, `test-product-search`, `test-specialty-links`,
  `test-hydraulic-68`, `test-hs-aw-sheet` → OK, 0 erros.
- Títulos: 54 e 53 caracteres (limite 62). Palavras: 1.113 e 1.119 (faixa 600–1200).
- Fontes externas verificadas por HTTP: HSE MW5, FUCHS e Rhenus Lub (200);
  Penn Stainless/Outokumpu (200, `application/pdf`); ISO 13216 responde 403 a
  requisições automatizadas, mas a página existe.

### Publicação do lote 6

- **Commit dos artigos:** `6555d57` — "Blog: lote 6 usinagem (A35, A36) e link contextual de material"
- **Branch:** `master` (commit direto, push `a1d4832..6555d57`)
- **Deploy de preview (Netlify):** `6ad89c718e3dc0ef36bd02c4`
- **Deploy de produção (Netlify):** `6ad89c8f5d60b3138a7d2c29`

### Verificação em produção (2026-10-21)

| Verificação | Resultado |
|---|---|
| A35 e A36 | HTTP 200 |
| `meta robots` | `index, follow` nos dois |
| `X-Robots-Tag` | ausente nos dois |
| Canonical | absoluto em `https://ffllubrificantes.com.br` |
| Schema | `Article` + `BreadcrumbList` presentes nos dois |
| Sitemap | 91 URLs · ambos os artigos presentes · nenhuma URL que já estava publicada saiu do sitemap |
| URLs comerciais | 36 não-`/conteudos/` (as 33 anteriores preservadas + 3 páginas comerciais novas do trabalho paralelo) |
| URL inexistente | 404 real |
| Home, catálogo, sobre, contato, 2 categorias | HTTP 200 |

Observação: em deploy de preview o Netlify aplica `X-Robots-Tag: noindex` em todo o
site (confirmado no preview `6ad89c718e3dc0ef36bd02c4`). A verificação de indexação
acima foi feita no domínio de produção, onde esse cabeçalho não existe.

## Pendências

1. **Artigos anteriores a 2026-10-13.** O registro e o README descrevem 7 artigos
   como noindex. Na verificação de 2026-10-21 em produção, os 7 (`como-ler-um-grau-iso-vg`,
   `din-51524-hl-hlp-hvlp`, `ficha-tecnica-e-ficha-de-seguranca`,
   `informacoes-para-cotar-lubrificante`, `nlgi-consistencia-de-graxas`,
   `oleo-de-corte-integral-ou-emulsionavel`, `oleo-para-compressor-de-parafuso`)
   respondem `index, follow` e constam do sitemap — foram liberados por commit
   anterior (`0894062`), não por esta execução. A documentação precisa ser
   reconciliada com esse estado.
2. **Agendamento.** O Hermes só executa cron com o aplicativo aberto; com ele
   fechado, o dia é pulado. Alternativa durável: Windows Task Scheduler.
3. **Integração GitHub ↔ Netlify não configurada** (deploy manual). Configurar
   exigiria alterar ajustes do projeto Netlify — não feito nesta execução.
4. **Search Console** não verificado nesta execução; nenhum dado de impressões,
   cliques ou indexação foi lido.
5. **A37 a A100** planejados no calendário, ainda não escritos (64 pautas pendentes).
   Publicados até 2026-10-21: A01–A36.
