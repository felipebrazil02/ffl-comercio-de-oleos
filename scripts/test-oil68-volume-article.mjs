import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const slug='oleo-hidraulico-68-quantidade-embalagem-cotacao';
const route=`/conteudos/${slug}/`,origin='https://ffllubrificantes.com.br';
const html=await fs.readFile(`dist${route}index.html`,'utf8');
assert.ok(html.includes(`rel="canonical" href="${origin}${route}"`));
assert.ok(html.includes('name="robots" content="index, follow"'));
assert.equal((html.match(/<h1\b/g)||[]).length,1);
const schema=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
assert.ok(schema.some(x=>x['@type']==='Article'));
assert.ok(!schema.some(x=>['Offer','Product'].includes(x['@type'])),'Exemplo de embalagens não é oferta');
assert.ok(html.includes('não representam embalagens disponíveis, pedido mínimo ou estoque da FFL'));
const example=html.match(/<caption>Exemplo fictício: necessidade de (\d+) L menos saldo utilizável de (\d+) L = (\d+) L a comprar\.<\/caption>/);
assert.ok(example,'Exemplo numérico identificado e verificável');
const [,need,stock,buy]=example.map(Number);assert.equal(need-stock,buy);
const rows=[...html.matchAll(/<tr><th scope="row">([AB])<\/th><td>(\d+)<\/td><td>(\d+) L<\/td><td>(\d+) L<\/td><td>(\d+) L<\/td><\/tr>/g)];
assert.equal(rows.length,2);
for(const r of rows){assert.equal(Number(r[2])*Number(r[3]),Number(r[4]));assert.equal(Number(r[4])-buy,Number(r[5]));}
const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const links=[...main.matchAll(/<a\b[^>]*href="([^\"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),origin));
assert.ok(links.some(u=>u.pathname.endsWith('/oleo-hidraulico-68/')));
assert.ok(links.some(u=>u.pathname==='/contato/'&&u.searchParams.get('item')==='oleo-hidraulico-68'&&u.searchParams.get('produto')==='Óleo hidráulico 68 AW'&&u.hash==='#orcamento'));
for(const source of ['oleo-hidraulico-68-comparar-orcamentos','troca-de-oleo-hidraulico']){
  const sourceHtml=await fs.readFile(`dist/conteudos/${source}/index.html`,'utf8');
  assert.ok(sourceHtml.includes(`href="${route}"`),'Entrada contextual '+source);
}
assert.ok((await fs.readFile('dist/sitemap.xml','utf8')).includes(`<loc>${origin}${route}</loc>`));
console.log('Artigo de volume: cálculo de compra/saldo, exemplos fictícios, links e SEO aprovados.');
