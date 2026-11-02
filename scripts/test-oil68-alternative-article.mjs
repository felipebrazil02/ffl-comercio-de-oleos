import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const slug='oleo-hidraulico-68-avaliar-alternativa';
const route=`/conteudos/${slug}/`, origin='https://ffllubrificantes.com.br';
const html=await fs.readFile(`dist${route}index.html`,'utf8');
const sheet=JSON.parse(await fs.readFile('data/technical-sources/hs-aw-004-20150610.json','utf8'));
const grade=sheet.grades['68'];
const decimal=n=>String(n).replace('.',',');
assert.ok(html.includes(`rel="canonical" href="${origin}${route}"`));
assert.ok(html.includes('name="robots" content="index, follow"'));
assert.equal((html.match(/<h1\b/g)||[]).length,1);
const schema=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
assert.ok(schema.some(x=>x['@type']==='Article'));
assert.ok(!schema.some(x=>['Offer','Product'].includes(x['@type'])),'Comparação documental não é uma oferta ou equivalência homologada');
assert.ok(html.includes(`${decimal(grade.kinematic40C.min)} a ${decimal(grade.kinematic40C.max)} cSt`));
assert.ok(html.includes(`Mínimo ${decimal(grade.kinematic100C.min)} cSt`),'Preservar o operador mínimo, sem inventar valor medido');
assert.equal(sheet.sharedProperties.viscosityIndex.operator,'>');
assert.ok(html.includes(`Maior que ${sheet.sharedProperties.viscosityIndex.value}`));
assert.ok(html.includes(`revisão ${sheet.revision} de 10/06/2015`));
assert.ok(html.includes('A ficha não identifica a edição dessas referências.'));
assert.ok(html.includes('Não comprovada pelo material consultado.'));
assert.ok(html.includes('não é um certificado de análise de cada lote'));
assert.ok(!html.includes('WHATSAPP_DOCS_URL'));
const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const links=[...main.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),origin));
assert.ok(links.some(u=>u.pathname.endsWith('/oleo-hidraulico-68/')));
assert.ok(links.some(u=>u.pathname==='/contato/'&&u.searchParams.get('item')==='oleo-hidraulico-68'&&u.searchParams.get('produto')==='Óleo hidráulico 68 AW'&&u.hash==='#orcamento'));
const docs=links.find(u=>u.hostname==='wa.me'&&u.searchParams.get('text')?.includes('ficha de segurança'));
assert.ok(docs,'Solicitação de documentos com produto identificável');
assert.equal(docs.pathname,'/5511915011527');
assert.ok(docs.searchParams.get('text').includes('óleo hidráulico 68 AW'));
for(const source of ['oleo-hidraulico-68-comparar-orcamentos','compatibilidade-com-vedacoes-e-tintas']){
  const sourceHtml=await fs.readFile(`dist/conteudos/${source}/index.html`,'utf8');
  assert.ok(sourceHtml.includes(`href="${route}"`),'Entrada contextual '+source);
}
assert.ok((await fs.readFile('dist/sitemap.xml','utf8')).includes(`<loc>${origin}${route}</loc>`));
console.log('Artigo de alternativa: dados e limites documentais, contexto de orçamento, WhatsApp, entradas e SEO aprovados.');
