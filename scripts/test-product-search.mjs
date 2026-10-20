import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const origin = 'https://ffllubrificantes.com.br';
const targets = [
  ['oleos-hidraulicos', 'oleo-hidraulico-68', 'Óleo hidráulico 68 AW'],
  ['oleos-para-compressores', 'oleo-para-compressor-de-ar', 'Óleo para compressor de ar 150'],
  ['graxas-industriais', 'graxa-grafitada', 'Graxa grafitada'],
  ['oleos-de-corte-e-usinagem', 'oleo-de-corte-emulsionavel', 'Óleo de corte emulsionável para usinagem']
];
const read = route => fs.readFile(`dist${route}index.html`, 'utf8');
const sitemap = await fs.readFile('dist/sitemap.xml', 'utf8');
const directory = await read('/lubrificantes-industriais/');

for (const [category, slug, name] of targets) {
  const route = `/lubrificantes-industriais/${category}/${slug}/`;
  const html = await read(route);
  assert.ok(html.includes(`<h1>${name}</h1>`), `${slug}: nome do produto`);
  assert.ok(html.includes(`rel="canonical" href="${origin}${route}"`), `${slug}: canonical`);
  assert.ok(html.includes('name="robots" content="index, follow"'), `${slug}: indexação`);
  assert.ok(sitemap.includes(`<loc>${origin}${route}</loc>`), `${slug}: sitemap`);
  assert.ok(directory.includes(`href="${route}"`), `${slug}: link no catálogo`);
  assert.ok((await read(`/lubrificantes-industriais/${category}/`)).includes(`href="${route}"`), `${slug}: link na categoria`);

  const actions = html.match(/<div class="product-quick-actions">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(actions, `${slug}: ações no início da página`);
  assert.ok(html.indexOf('product-quick-actions') < html.indexOf('product-layout'), `${slug}: orçamento visível antes do conteúdo longo`);
  const links = [...actions.matchAll(/href="([^"]+)"/g)].map(m => new URL(m[1].replaceAll('&amp;', '&'), origin));
  const quote = links.find(url => url.pathname === '/contato/');
  assert.equal(quote?.searchParams.get('produto'), name, `${slug}: contexto do orçamento`);
  assert.equal(quote?.hash, '#orcamento');
  const whatsapp = links.find(url => url.hostname === 'wa.me');
  assert.equal(whatsapp?.pathname, '/5511915011527');
  assert.ok(whatsapp?.searchParams.get('text')?.includes(name), `${slug}: contexto do WhatsApp`);
  assert.ok(/class="[^"]*whatsapp-link/.test(actions), `${slug}: rastreamento do WhatsApp`);
  assert.ok(html.includes('consultada em 20 de outubro de 2026'), `${slug}: data da fonte conferida`);
  assert.ok(!html.includes('a fonte não publica um grau numérico para este produto'), `${slug}: afirmação genérica incorreta`);

  const schema = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
  assert.ok(schema.some(item => item['@type'] === 'Organization'));
  assert.ok(!schema.some(item => item['@type'] === 'Product'), `${slug}: Product incompleto`);
  const crumbs = schema.find(item => item['@type'] === 'BreadcrumbList')?.itemListElement;
  assert.equal(crumbs?.length, 4, `${slug}: hierarquia do catálogo`);
  assert.equal(crumbs.at(-1).item, origin + route);
}

const hydraulicRoute = '/lubrificantes-industriais/oleos-hidraulicos/oleo-hidraulico-68/';
const rangeRoute = '/lubrificantes-industriais/oleos-hidraulicos/oleo-hidraulico-aw-68-220/';
const range = await read(rangeRoute);
assert.ok(range.includes(`rel="canonical" href="${origin}${rangeRoute}"`), 'Preservar a página agrupada e seu canonical');
assert.ok(range.includes(`href="${hydraulicRoute}"`), 'Navegação da linha para a opção 68');
for (const guide of ['como-ler-um-grau-iso-vg', 'din-51524-hl-hlp-hvlp']) {
  assert.ok((await read(`/conteudos/${guide}/`)).includes(`href="${hydraulicRoute}"`), `${guide}: caminho contextual ao novo produto`);
}
const grease = await read('/lubrificantes-industriais/graxas-industriais/graxa-grafitada/');
assert.match(grease, /<dt>Espessante<\/dt><dd>Sabão de cálcio<\/dd>/, 'Separar espessante e composição');
const soluble = await read('/lubrificantes-industriais/oleos-de-corte-e-usinagem/oleo-de-corte-emulsionavel/');
assert.ok(soluble.includes('óleo solúvel') && soluble.includes('magnésio'), 'Intenção de busca e restrição do emulsionável');
console.log(JSON.stringify({commercialPages: targets.length, newProduct: hydraulicRoute, errors: []}));
