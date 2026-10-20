import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {parseFrontmatter} from '../src/markdown.mjs';

// Regressão dos links contextuais: cartões automáticos, menu e rodapé não
// substituem os quatro novos caminhos no corpo editorial/de aplicação.
const origin = 'https://ffllubrificantes.com.br';
const category = '/lubrificantes-industriais/oleos-de-processo-e-especialidades/';
const quoteGuide = '/conteudos/informacoes-para-cotar-lubrificante/';
const documentsGuide = '/conteudos/ficha-tecnica-e-ficha-de-seguranca/';
const calciumGrease = '/lubrificantes-industriais/graxas-industriais/graxa-de-calcio-para-chassis/';
const targets = [
  {
    slug: 'protetivo-anticorrosivo-para-chassis',
    anchor: /protetivo.*chassis/i,
    contextualSources: [quoteGuide, calciumGrease]
  },
  {
    slug: 'oleo-para-limpeza-de-armamentos',
    anchor: /[oó]leo.*limpeza.*armamentos/i,
    contextualSources: [quoteGuide, documentsGuide]
  }
].map(target => ({...target, url: `${category}${target.slug}/`}));
const read = url => fs.readFile(url.endsWith('.html') ? `dist${url}` : `dist${url}index.html`, 'utf8');
const routes = JSON.parse(await fs.readFile('outputs/rotas.json', 'utf8'));
const routeMap = new Map(routes.map(route => [route.url, route]));
const text = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const attributes = html => Object.fromEntries(
  [...html.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
    .map(([, key, double, single]) => [key.toLowerCase(), double ?? single])
);
const links = html => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
  .map(([, attrs, label]) => ({...attributes(attrs), label: text(label)}));
const main = html => {
  const body = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  assert.ok(body, 'HTML gerado sem corpo main');
  return body;
};
const localPath = href => {
  if (!href) return undefined;
  try {
    const url = new URL(href.replaceAll('&amp;', '&'), origin);
    return url.origin === origin ? url.pathname : undefined;
  } catch { return undefined; }
};
const requireLink = (html, target, label) => {
  const found = links(html).filter(link => localPath(link.href) === target.url);
  assert.ok(found.length, `${label}: link contextual ausente para ${target.slug}`);
  for (const link of found) {
    assert.match(link.label, target.anchor, `${label}: âncora pouco descritiva: ${link.label}`);
    assert.ok(!/(?:^|\s)(?:nofollow|ugc|sponsored)(?:\s|$)/i.test(link.rel || ''), `${label}: link não deve ter restrição editorial`);
  }
  return found.length;
};

const pages = new Map();
for (const route of routes) pages.set(route.url, await read(route.url));
let newContextualLinks = 0;
for (const guide of [quoteGuide, documentsGuide]) {
  const slug = guide.split('/').filter(Boolean).at(-1);
  const {meta} = parseFrontmatter(await fs.readFile(`content/blog/${slug}.md`, 'utf8'));
  assert.equal(meta.updated, '2026-10-20', `${slug}: registrar revisão editorial real`);
  assert.equal(meta.consulted, '2026-10-13', `${slug}: não alterar a data da consulta técnica`);
  const html = pages.get(guide);
  const article = main(html).match(/<article\b[^>]*class="article-body"[^>]*>([\s\S]*?)<\/article>/i)?.[1];
  assert.ok(article, `${slug}: corpo editorial ausente`);
  // Apenas parágrafos do artigo, não blocos de produtos ou listas automáticas.
  const paragraphs = [...article.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(match => match[1]).join('\n');
  for (const target of targets.filter(target => target.contextualSources.includes(guide))) {
    newContextualLinks += requireLink(paragraphs, target, slug);
  }
}

const greaseMain = main(pages.get(calciumGrease));
const applicationNote = greaseMain.match(/<div\b[^>]*class="[^"]*\bproduct-application-navigation\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
assert.ok(applicationNote, 'Graxa de cálcio: nota contextual de aplicações ausente');
assert.ok(greaseMain.indexOf('product-application-navigation') < greaseMain.indexOf('product-documents'), 'Nota deve estar no corpo da aplicação, antes dos blocos complementares');
const distinction = text(applicationNote);
assert.match(distinction, /graxa/i, 'Nota deve identificar a função da graxa');
assert.match(distinction, /protetivo/i, 'Nota deve identificar a função do protetivo');
assert.match(distinction, /n[ãa]o\s+(?:[\p{L}]+\s+){0,5}substitu/iu, 'Nota deve negar substituição automática entre os produtos');
newContextualLinks += requireLink(applicationNote, targets[0], 'Graxa de cálcio');
assert.equal(newContextualLinks, 4, 'Quatro links contextuais novos esperados');

const sitemap = await fs.readFile('dist/sitemap.xml', 'utf8');
const results = [];
for (const target of targets) {
  const route = routeMap.get(target.url);
  assert.ok(route && !route.noindex && !route.utility, `${target.slug}: destino deve ser página pública indexável`);
  const html = pages.get(target.url);
  assert.ok(html, `${target.slug}: arquivo de destino ausente`);
  assert.ok(html.includes(`rel="canonical" href="${origin}${target.url}"`), `${target.slug}: canonical autorreferente`);
  assert.ok(html.includes('name="robots" content="index, follow"'), `${target.slug}: indexação permitida`);
  assert.ok(sitemap.includes(`<loc>${origin}${target.url}</loc>`), `${target.slug}: sitemap`);
  const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
  for (const type of ['Organization', 'BreadcrumbList']) assert.ok(schema.some(node => node['@type'] === type), `${target.slug}: ${type}`);
  assert.ok(!schema.some(node => node['@type'] === 'Product'), `${target.slug}: não adicionar Product fictício/incompleto`);
  const selection = main(html).match(/<section\b[^>]*class="[^"]*\bproduct-selection\b[^"]*"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
  assert.ok(selection, `${target.slug}: guias para consulta ausentes`);
  const guidePaths = links(selection).map(link => localPath(link.href));
  for (const guide of [quoteGuide, documentsGuide]) assert.ok(guidePaths.includes(guide), `${target.slug}: guia pertinente ausente: ${guide}`);
  assert.ok(!guidePaths.includes('/conteudos/compatibilidade-com-vedacoes-e-tintas/'), `${target.slug}: não herdar guia hidráulico genérico`);

  // Um documento conta uma vez, mesmo com cartões e links repetidos no main.
  // Só origens públicas e indexáveis contam; não contar menu/rodapé ou self-link.
  const inboundSources = [...pages.entries()].filter(([url, source]) => {
    const sourceRoute = routeMap.get(url);
    return url !== target.url && !sourceRoute.noindex && !sourceRoute.utility &&
      links(main(source)).some(link => localPath(link.href) === target.url && !/(?:^|\s)nofollow(?:\s|$)/i.test(link.rel || ''));
  }).map(([url]) => url).sort();
  const expected = ['/lubrificantes-industriais/', category, ...target.contextualSources];
  for (const url of expected) assert.ok(inboundSources.includes(url), `${target.slug}: origem ausente: ${url}`);
  assert.ok(inboundSources.length >= 4, `${target.slug}: pelo menos quatro origens únicas no main`);
  results.push({product: target.slug, destination: target.url, uniqueInboundPages: inboundSources.length, inboundSources, contextualSources: target.contextualSources});
}

console.log(JSON.stringify({newContextualLinks, localDestinationFiles: targets.length, products: results, errors: []}, null, 2));
