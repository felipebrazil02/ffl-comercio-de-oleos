import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const origin = 'https://ffllubrificantes.com.br';
const product = '/lubrificantes-industriais/oleos-hidraulicos/oleo-hidraulico-68/';
const base = process.argv[2]?.replace(/\/$/,'');
const read = async route => {
  if (!base) return fs.readFile(`dist${route}index.html`, 'utf8');
  const response = await fetch(base+route,{redirect:'manual'});
  assert.equal(response.status,200,`${route}: HTTP 200 direto`);
  if(base===origin)assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag')||''),`${route}: cabeçalho sem bloqueio`);
  return response.text();
};
const anchors = html => [...html.matchAll(/<a\b([^>]*)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g)].map(m => ({tag:m[0],url:new URL(m[2].replaceAll('&amp;', '&'),origin)}));
const main = html => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
const validateQuote = a => {
  assert.equal(a.url.pathname, '/contato/');
  assert.equal(a.url.searchParams.get('produto'), 'Óleo hidráulico 68 AW');
  assert.equal(a.url.searchParams.get('item'), 'oleo-hidraulico-68');
  assert.equal(a.url.hash, '#orcamento');
};

for (const slug of ['como-ler-um-grau-iso-vg','din-51524-hl-hlp-hvlp']) {
  const html = await read(`/conteudos/${slug}/`);
  const bridge = html.match(/<section class="article-product-bridge"[\s\S]*?<\/section>/)?.[0];
  assert.ok(bridge, `${slug}: chamada no fluxo da leitura`);
  assert.equal((html.match(/id="consulta-oleo-68"/g)||[]).length, 1);
  const bodyPosition = html.indexOf('class="article-product-bridge"');
  assert.ok(bodyPosition < html.indexOf('class="post-sources"'), `${slug}: CTA antes das fontes`);
  const article = html.match(/<article class="article-body">([\s\S]*?)<\/article>/)?.[1] || '';
  const before = article.slice(0, article.indexOf('class="article-product-bridge"')).replace(/<nav[\s\S]*?<\/nav>/,'');
  assert.ok(before.replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length < 400, `${slug}: acesso cedo sem depender do fim do texto`);
  const links = anchors(bridge);
  assert.equal(links[0].url.pathname,product);
  assert.ok(links[0].tag.includes('class="button dark-button"'));
  validateQuote(links[1]);
  const aside = html.match(/<aside class="article-callout oil68-article-callout">[\s\S]*?<\/aside>/)?.[0];
  assert.ok(aside, `${slug}: próximo passo específico, não catálogo genérico`);
  assert.equal(anchors(aside)[0].url.pathname,product);
  validateQuote(anchors(aside)[1]);
  assert.ok(aside.includes('Consultar a linha: outros graus'));
  assert.ok(bridge.includes('O mesmo grau não comprova equivalência'));
}
const unrelated = await read('/conteudos/nlgi-consistencia-de-graxas/');
assert.ok(!unrelated.includes('article-product-bridge'), 'Não forçar óleo 68 em intenção não relacionada.');

const oil = await read(product);
for (const a of anchors(main(oil)).filter(a=>a.url.pathname==='/contato/')) {
  assert.equal(a.url.searchParams.get('item'), 'oleo-hidraulico-68', 'Contexto preservado em todo CTA do corpo do produto.');
  assert.ok(a.tag.includes('data-product-id="oleo-hidraulico-68"'));
}
for (const position of ['product_top','product_body','product_sidebar','product_end']) assert.ok(oil.includes(`data-cta-position="${position}"`));
for (const region of [oil.match(/<header[\s\S]*?<\/header>/)?.[0], oil.match(/<footer[\s\S]*?<\/footer>/)?.[0]]) {
  const quote = anchors(region).find(a=>a.url.pathname==='/contato/'&&a.url.hash==='#orcamento');
  validateQuote(quote);
}
assert.ok(oil.includes('class="container product-quote-next"'));
assert.ok(oil.includes(`rel="canonical" href="${origin}${product}"`));
assert.ok(!/pronta entrega|menor preço|entrega garantida/i.test(main(oil)));

const contact = await read('/contato/');
assert.ok(contact.includes('id="quote-product-context" class="quote-product-context" hidden'));
const formTag=contact.match(/<form\b[^>]*\bid=['"]quote-form['"][^>]*>/);
assert.ok(formTag, 'Formulário existente mesmo após normalização de atributos na Netlify.');
assert.ok(contact.indexOf('id="quote-product-context"') < formTag.index);
assert.ok(contact.includes('id="quote-product-name"') && contact.includes('id="quote-heading"'));
if(!base)assert.ok(contact.includes('data-netlify="true"'));
assert.match(formTag[0], /action=['"]\/obrigado\/['"]/);
assert.match(formTag[0], /data-form-mode=['"]netlify['"]/);
assert.ok(contact.includes('name="form-name" value="orcamento"'));
for (const slug of ['usinagem-de-aluminio-fluido','usinagem-de-inox-fluido']) assert.ok((await read(`/conteudos/${slug}/`)).includes('name="robots" content="index, follow"'), 'Preservar os artigos recentes do GitHub.');
console.log(`Percurso aprovado (${base||'dist'}): 2 artigos → óleo 68 ou cotação contextual → formulário; demais intenções e fontes preservadas.`);
