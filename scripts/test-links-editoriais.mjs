import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';

// Valida o corpo editorial, sem contar menu, rodapé ou cartões automáticos.
const files = (await fs.readdir('content/blog')).filter(f => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('_'));
const routes = JSON.parse(await fs.readFile('outputs/rotas.json', 'utf8'));
const byUrl = new Map(routes.map(r => [r.url, r]));
const inbound = new Map(files.map(f => [`/conteudos/${f.slice(0, -3)}/`, 0]));
let commercial = 0;
let related = 0;
for (const file of files) {
  const markdown = await fs.readFile(`content/blog/${file}`, 'utf8');
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const ownUrl = `/conteudos/${file.slice(0, -3)}/`;
  const html = await fs.readFile(path.join('dist', ownUrl, 'index.html'), 'utf8');
  const article = html.match(/<article class="article-body">([\s\S]*?)<\/article>/)?.[1];
  assert.ok(article, `${file}: corpo do artigo ausente`);
  const links = [...body.matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g)];
  assert.ok(links.some(([, , url]) => url.startsWith('/lubrificantes-industriais/')), `${file}: falta caminho editorial para o catálogo`);
  assert.ok(links.some(([, , url]) => inbound.has(url) && url !== ownUrl), `${file}: falta artigo complementar`);
  for (const [, label, href] of links) {
    const [url, fragment] = href.split('#');
    const route = byUrl.get(url);
    assert.ok(route && !route.noindex && !route.utility, `${file}: destino inexistente ou não indexável: ${url}`);
    assert.notEqual(url, ownUrl, `${file}: link para si mesmo`);
    assert.ok(label.trim().length > 3, `${file}: texto de link pouco descritivo`);
    assert.ok(article.includes(`href="${href}"`), `${file}: link ausente do HTML: ${href}`);
    if (fragment) {
      const target = await fs.readFile(path.join('dist', url, 'index.html'), 'utf8');
      assert.ok(target.includes(`id="${fragment}"`), `${file}: âncora inexistente: ${href}`);
    }
    if (inbound.has(url)) { inbound.set(url, inbound.get(url) + 1); related++; }
    if (url.startsWith('/lubrificantes-industriais/')) commercial++;
  }
}
for (const [url, count] of inbound) assert.ok(count > 0, `Artigo sem link contextual de outro artigo: ${url}`);
console.log(JSON.stringify({ articles: files.length, commercialLinks: commercial, relatedArticleLinks: related, contextualOrphans: 0, errors: [] }));
