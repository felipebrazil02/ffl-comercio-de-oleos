import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

// Local: npm run test:oil68. Publicado: npm run test:oil68 -- https://host
// Valida publicação e navegação, não o estado do índice do Google.
const origin = 'https://ffllubrificantes.com.br';
const base = process.argv[2]?.replace(/\/$/, '');
const product = '/lubrificantes-industriais/oleos-hidraulicos/oleo-hidraulico-68/';
const family = '/lubrificantes-industriais/oleos-hidraulicos/oleo-hidraulico-aw-68-220/';
const cache = new Map();
async function read(route) {
  if (!cache.has(route)) {
    if (base) {
      const response = await fetch(base + route, {redirect: 'manual'});
      assert.equal(response.status, 200, `${route}: HTTP 200 direto`);
      if (base === origin) assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), `${route}: cabeçalho indexável`);
      cache.set(route, await response.text());
    } else cache.set(route, await fs.readFile(`dist${route}index.html`, 'utf8'));
  }
  return cache.get(route);
}
const main = html => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
const sources = ['/', '/lubrificantes-industriais/oleos-hidraulicos/', '/conteudos/como-ler-um-grau-iso-vg/', '/conteudos/din-51524-hl-hlp-hvlp/', '/conteudos/oleo-hidraulico-hm/', '/conteudos/troca-de-oleo-hidraulico/'];
for (const route of sources) {
  const html = await read(route);
  assert.ok(main(html).includes(`href="${product}"`), `${route}: link HTML direto para o 68`);
  assert.ok(html.includes('name="robots" content="index, follow"'), `${route}: indexável`);
}
for (const route of [product, family]) {
  const html = await read(route);
  assert.ok(html.includes(`rel="canonical" href="${origin}${route}"`), `${route}: canonical próprio`);
  assert.ok(html.includes('name="robots" content="index, follow"'), `${route}: indexável`);
}
const html = await read(product);
assert.equal([...main(html).matchAll(/<h1\b/g)].length, 1, 'H1 único');
assert.ok(html.includes('<h1>Óleo hidráulico 68 AW</h1>'));
assert.ok(html.includes('<title>Óleo hidráulico 68 AW ISO VG 68: cotação em SP | FFL</title>'));
for (const id of ['aplicacao', 'viscosidade', 'comparacao', 'cotacao']) {
  assert.ok(html.includes(`href="#${id}"`) && html.includes(`id="${id}"`), `Navegação para ${id}`);
}
for (const phrase of ['Qual a diferença entre óleo hidráulico 46 e 68?', 'Qual é o preço do óleo hidráulico 68?', 'Quais embalagens posso cotar?', 'não um limite de operação', 'DIN 51524 parte 2 H-LP', 'ISO-HM', 'revisão 004 de 10/06/2015', '61,2 a 74,8 cSt']) assert.ok(html.includes(phrase), `Informação necessária: ${phrase}`);
const actions = html.match(/<div class="product-quick-actions">([\s\S]*?)<\/div>/)?.[1] || '';
assert.ok(html.indexOf('product-quick-actions') < html.indexOf('product-layout'), 'Contato antes do conteúdo longo');
const links = [...actions.matchAll(/href="([^"]+)"/g)].map(m => new URL(m[1].replaceAll('&amp;', '&'), origin));
assert.equal(links.find(u => u.pathname === '/contato/')?.searchParams.get('produto'), 'Óleo hidráulico 68 AW');
assert.ok(links.find(u => u.hostname === 'wa.me')?.searchParams.get('text').includes('Óleo hidráulico 68 AW'));
assert.ok(actions.includes('whatsapp-link'), 'WhatsApp rastreável');
assert.ok(!/<(?:script)[^>]*application\/ld\+json[^>]*>[\s\S]*?"@type":"(?:Product|Offer)"/.test(html), 'Sem oferta fictícia');
assert.ok(!/pronta entrega|menor preço|homologado pela/i.test(main(html)), 'Sem promessas comerciais não documentadas');
const sitemap = base ? await (await fetch(base + '/sitemap.xml')).text() : await fs.readFile('dist/sitemap.xml', 'utf8');
for (const route of [product, family]) assert.ok(sitemap.includes(`<loc>${origin}${route}</loc>`));
for (const route of ['/conteudos/hidraulico-aquecendo-demais/', '/conteudos/troca-de-oleo-hidraulico/']) {
  const text = main(await read(route));
  assert.ok(!text.includes('define a curva') && !text.includes('não contém a maior parte'), `${route}: generalizações removidas`);
}
const hm = main(await read('/conteudos/oleo-hidraulico-hm/'));
assert.ok(hm.includes('ISO 11158') && hm.includes('retirada em 2003'), 'Classificação e desempenho separados; método histórico identificado');
console.log(JSON.stringify({base: base || 'dist', pages: cache.size, homeToProductDepth: 1, directIncomingSourcesChecked: sources.length, errors: []}, null, 2));
