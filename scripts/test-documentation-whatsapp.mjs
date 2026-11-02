import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const company=JSON.parse(await fs.readFile('data/company.json','utf8'));
const base=process.argv[2]?.replace(/\/$/,'');
for(const p of company.products.filter(p=>p.confirmed)){
  const route=`/lubrificantes-industriais/${p.category}/${p.slug}/`;
  const response=base?await fetch(base+route):null;
  if(response)assert.equal(response.status,200,route);
  const html=response?await response.text():await fs.readFile('dist'+route+'index.html','utf8');
  const section=html.match(/<section class="container product-documents">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section?.includes('Peça a ficha técnica pelo WhatsApp'),p.slug);
  const tag=section.match(/<a\b[^>]*href="(https:\/\/wa\.me\/[^\"]+)"[^>]*>/);
  assert.ok(tag,p.slug+': documentação deve abrir WhatsApp');
  const u=new URL(tag[1].replaceAll('&amp;','&'));
  assert.equal(u.pathname,'/'+company.whatsapp);
  assert.ok(u.searchParams.get('text').includes(p.name),p.slug+': produto identificado');
  assert.ok(u.searchParams.get('text').includes('ficha técnica e a ficha de segurança'));
  assert.ok(tag[0].includes('whatsapp-link')&&tag[0].includes('noopener noreferrer'));
  if(p.slug==='oleo-hidraulico-aw-10-46'){
    const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(description&&!description.includes('DIN 51524 parte 3'));
    assert.ok(html.includes('Referências da origem — pendentes de confirmação'));
    assert.ok(html.includes('não é apresentada como atendimento comprovado'));
    assert.ok(!html.includes('A fonte não publica normas de desempenho para este produto'));
  }
}
console.log(`Documentação via WhatsApp: 22 produtos e ressalva AW 10–46 aprovados (${base||'dist'}).`);
