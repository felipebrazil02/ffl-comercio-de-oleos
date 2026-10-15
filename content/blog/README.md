# Como publicar um post

Crie um arquivo `.md` nesta pasta. O **nome do arquivo vira a URL**:
`din-51524-hl-hlp-hvlp.md` → `/conteudos/din-51524-hl-hlp-hvlp/`.

Depois rode:

```
npm run build
npm run check
npm run test:editorial-links
```

O `check` falha se algo estiver fora do padrão. Só publique com ele passando.

## Frontmatter

Vai entre `---` no topo do arquivo.

| Campo | Obrigatório | Observação |
|---|---|---|
| `title` | sim | Aparece como H1 e no `<title>`. Use aspas se contiver `:` |
| `description` | sim | Meta description. **Entre 70 e 160 caracteres** — o build recusa fora disso |
| `summary` | sim | Frase curta dos cartões de listagem |
| `eyebrow` | sim | Rótulo em maiúsculas acima do título (ex.: `NORMAS`) |
| `published` | sim | `AAAA-MM-DD` |
| `updated` | não | `AAAA-MM-DD`. Preencha ao revisar um post já publicado |
| `indexable` | não | `true` somente após revisão editorial. Sem isso, o artigo recebe noindex e fica fora do sitemap |
| `tags` | não | Separadas por vírgula |
| `source` | não | `Rótulo | URL`. Pode repetir a linha para várias fontes |
| `consulted` | não | `AAAA-MM-DD` da consulta às fontes |

Exemplo:

```
---
title: "NLGI: como ler a consistência de uma graxa"
description: O que os graus NLGI 000 a 6 medem, por que NLGI 2 é o mais comum e como isso difere de viscosidade.
eyebrow: FUNDAMENTOS
summary: A escala que classifica graxas, e o que ela não diz sobre o produto.
published: 2026-10-15
tags: graxas, seleção
source: NLGI — Lubricating Grease Guide | https://www.nlgi.org/
consulted: 2026-10-15
---
```

## Markdown suportado

`## ` e `### ` (viram âncoras automáticas), parágrafos, listas `- ` e `1. `,
`**negrito**`, `*itálico*`, `` `código` ``, `[link](url)`, `---` e HTML cru.

Uma citação `> ` vira caixa de destaque. Se começar com negrito, o negrito
vira o título da caixa:

```
> **A temperatura de referência é sempre 40 °C.** Um óleo não tem "um" valor
> de viscosidade: ele tem uma curva que cai conforme esquenta.
```

O **primeiro parágrafo** recebe destaque visual automaticamente — escreva-o
como abertura, não como introdução genérica.

## O que o build faz sozinho

- Tempo de leitura, a partir da contagem de palavras.
- Sumário, quando o post tem 3 ou mais seções `##`.
- Posts relacionados, por tema compartilhado.
- Bloco de fontes consultadas, a partir das linhas `source`.
- Schema `Article` com `datePublished`, `dateModified`, `wordCount` e `keywords`.
- Entrada no `sitemap.xml` e no `feed.xml`.

## Temas

Um tema só ganha página própria a partir de **2 posts**. Com um post só, a
página seria fina e quase idêntica ao próprio post — o que prejudica o SEO em
vez de ajudar. Marque os temas normalmente: quando o segundo post chegar, a
página aparece sozinha.

## Dicas de SEO

- **Link para as páginas de produto.** É o que transforma leitura em cotação.
  Veja como os posts de ISO VG e DIN 51524 fazem isso no fim do texto.
- **Link entre posts.** Ajuda o Google a entender que os textos formam um
  conjunto sobre lubrificação.
- **Um assunto por post.** Dois assuntos num texto só competem entre si.
- **Cite a fonte.** É o padrão editorial do site e sustenta a credibilidade
  técnica das páginas.

## Links editoriais

- Use links no corpo do texto para a categoria comercial pertinente. Em artigos gerais, prefira o catálogo; não force uma categoria sem relação com o assunto.
- Inclua artigos complementares quando ajudarem a leitura. Use textos de link descritivos e contexto, sem encadear palavras-chave ou repetir o mesmo destino desnecessariamente.
- Vincule também o artigo novo a partir de um texto existente e relacionado, para que ele não dependa apenas da listagem e dos cartões automáticos.
- Não apresente um link comercial como recomendação técnica, prova de equivalência ou garantia de estoque. Marcas citadas nas fontes não são necessariamente comercializadas pela FFL.
- Preserve URLs publicadas. Atualize `updated` ao alterar o conteúdo; só altere `consulted` se consultar novamente as fontes técnicas.
- Depois do build, `test:editorial-links` verifica os destinos, âncoras, links renderizados e caminhos contextuais entre os artigos e o catálogo.
