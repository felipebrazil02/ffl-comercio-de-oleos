import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const slug='oleo-hidraulico-68-comparar-orcamentos';
const route=`/conteudos/${slug}/`,origin='https://ffllubrificantes.com.br';
const html=await fs.readFile(`dist${route}index.html`,'utf8');
assert.ok(html.includes(`rel="canonical" href="${origin}${route}"`));
assert.ok(html.includes('name="robots" content="index, follow"'));
assert.equal((html.match(/<h1\b/g)||[]).length,1);
const schema=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
assert.ok(schema.some(x=>x['@type']==='Article'));
assert.ok(!schema.some(x=>['Product','Offer'].includes(x['@type'])),'Exemplo não vira oferta estruturada');
assert.ok(html.includes('não são preços da FFL'));
const example=html.match(/<table class="product-technical-table">([\s\S]*?)<\/table>/)[1];
const row=label=>[...example.matchAll(/<tr><th scope="row">([^<]+)<\/th><td>([^<]+)<\/td><td>([^<]+)<\/td><\/tr>/g)].find(m=>m[1]===label).slice(2);
const num=s=>Number(s.replace('R$','').replace(/\/L| L/g,'').trim().replaceAll('.','').replace(',','.'));
for(let i=0;i<2;i++){
  const volume=num(row('Volume total')[i]),products=num(row('Valor dos produtos')[i]),freight=num(row('Frete cobrado à parte')[i]);
  assert.equal(num(row('Total da compra')[i]),products+freight);
  assert.equal(num(row('Preço dos produtos por litro')[i]),products/volume);
  assert.equal(num(row('Custo da compra por litro com frete')[i]),(products+freight)/volume);
}
const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
const urls=[...main.matchAll(/<a\b[^>]*href="([^\"]+)"/g)].map(m=>new URL(m[1].replaceAll('&amp;','&'),origin));
assert.ok(urls.some(u=>u.pathname.endsWith('/oleo-hidraulico-68/')));
assert.ok(urls.some(u=>u.pathname==='/contato/'&&u.searchParams.get('item')==='oleo-hidraulico-68'&&u.searchParams.get('produto')==='Óleo hidráulico 68 AW'&&u.hash==='#orcamento'));
assert.ok((await fs.readFile('dist/conteudos/informacoes-para-cotar-lubrificante/index.html','utf8')).includes(`href="${route}"`),'Link contextual de entrada');
assert.ok((await fs.readFile('dist/sitemap.xml','utf8')).includes(`<loc>${origin}${route}</loc>`));
console.log('Artigo de comparação: cálculo, exemplo fictício, SEO e percurso comercial aprovados.');
