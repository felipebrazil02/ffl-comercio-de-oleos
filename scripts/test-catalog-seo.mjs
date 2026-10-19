import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {productConsultation} from '../src/product-consultation.mjs';
const company = JSON.parse(await fs.readFile('data/company.json', 'utf8'));
const read = route => fs.readFile(`dist${route}index.html`, 'utf8');
let products = 0, articles = 0, contextualProducts = 0;
const directory = await read('/lubrificantes-industriais/');
for (const p of company.products.filter(p => p.confirmed)) {
  const html = await read(`/lubrificantes-industriais/${p.category}/${p.slug}/`);
  for (const marker of ['product-selection', 'catalog-reference', 'Guias relacionados a esta consulta']) assert.ok(html.includes(marker), `${p.slug}: ${marker}`);
  assert.ok(html.includes(encodeURIComponent(p.name)), `${p.slug}: produto não informado no orçamento`);
  assert.ok(!html.includes(p.source), `${p.slug}: referência interna exposta`);
  assert.ok(directory.includes(`href="/lubrificantes-industriais/${p.category}/${p.slug}/"`), `${p.slug}: sem link direto do catálogo`);
  const schema = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1]));
  assert.ok(!schema.some(x => x['@type'] === 'Product'), `${p.slug}: Product sem oferta pública`);
  for (const type of ['Organization', 'BreadcrumbList']) assert.ok(schema.some(x => x['@type'] === type), `${p.slug}: ${type} ausente`);
  if (productConsultation[p.slug]) for (const [q,a] of productConsultation[p.slug]) {
    assert.ok(html.includes(q) && html.includes(a), `${p.slug}: orientação ausente`);
  }
  products++;
}
const routes = JSON.parse(await fs.readFile('outputs/rotas.json', 'utf8'));
for (const route of routes.filter(r => r.url.startsWith('/conteudos/') && !r.url.includes('/tema/') && r.url !== '/conteudos/')) {
  const html = await read(route.url);
  assert.ok(html.includes('article-publisher'), `${route.url}: publicador ausente`);
  if (html.includes('article-catalog')) contextualProducts++;
  // Não sugerir graxa comum como substituta de graxa alimentícia ou poliureia.
  if (/contato-ocasional-alimento|poliureia|dificil-inflamabilidade/.test(route.url)) assert.ok(!html.includes('article-catalog'));
  articles++;
}
assert.equal(contextualProducts, 13);
for (const slug of Object.keys(productConsultation)) assert.ok(company.products.some(p => p.confirmed && p.slug === slug));
const about = await read('/sobre/');
for (const value of ['company-transparency', company.email, 'Não realizamos troca de óleo', '/politica-editorial/', '/privacidade/']) assert.ok(about.includes(value));
console.log(JSON.stringify({products, articles, articlesWithProductLinks: contextualProducts, errors: []}));
