import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const origin='https://ffllubrificantes.com.br';
const company=JSON.parse(await fs.readFile('data/company.json','utf8'));
const slugs=['oleos-hidraulicos','graxas-industriais','oleos-de-corte-e-usinagem'];
for(const slug of slugs){
  const url=`/lubrificantes-industriais/${slug}/`;
  const html=await fs.readFile(`dist${url}index.html`,'utf8');
  const category=company.categories.find(c=>c.slug===slug);
  assert.ok(html.includes(`<title>${category.title}</title>`));
  assert.ok(html.includes(`name="description" content="${category.metaDescription}"`));
  assert.ok(html.includes(`rel="canonical" href="${origin}${url}"`));
  assert.ok(html.includes('name="robots" content="index, follow"'));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.equal((html.match(/id="consulta-categoria"/g)||[]).length,1);
  assert.ok(html.includes('Salto/SP'));
  assert.ok(html.includes('Solicitar cotação desta linha'));
  assert.ok(html.includes(`https://wa.me/${company.whatsapp}?text=`));
  const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m=>JSON.parse(m[1]));
  const faq=blocks.find(b=>b['@type']==='FAQPage');
  assert.deepEqual(faq.mainEntity.map(q=>q.acceptedAnswer.text),category.faq.map(f=>f.answer));
}
const iso=await fs.readFile('dist/conteudos/como-ler-um-grau-iso-vg/index.html','utf8');
assert.ok(iso.includes('ISO VG: o que significa e como comparar 32, 46 e 68'));
for(const value of ['28,8 a 35,2','41,4 a 50,6','61,2 a 74,8','Posso trocar ISO VG 32 por 46 ou 68?']) assert.ok(iso.includes(value));
assert.ok(iso.includes('href="/conteudos/din-51524-hl-hlp-hvlp/"'));
assert.ok(iso.includes(`rel="canonical" href="${origin}/conteudos/como-ler-um-grau-iso-vg/"`));
console.log(JSON.stringify({categories:3,articles:1,errors:[]}));
