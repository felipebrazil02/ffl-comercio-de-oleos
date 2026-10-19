import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const company=JSON.parse(await fs.readFile('data/company.json','utf8'));
for(const category of company.categories.filter(item=>item.confirmed)){
  const html=await fs.readFile(`dist/lubrificantes-industriais/${category.slug}/index.html`,'utf8');
  assert.ok(html.includes('id="consulta-categoria"'),`${category.slug}: guia comercial ausente`);
  assert.ok(html.includes('Solicitar cotação desta linha'),`${category.slug}: CTA ausente`);
  assert.ok(html.includes('Guias para preparar sua consulta'),`${category.slug}: links editoriais ausentes`);
}

const blogFiles=(await fs.readdir('content/blog')).filter(file=>file.endsWith('.md')&&file!=='README.md'&&!file.startsWith('_'));
for(const file of blogFiles){
  const slug=file.replace(/\.md$/,'');
  const html=await fs.readFile(`dist/conteudos/${slug}/index.html`,'utf8');
  assert.ok(html.includes('PRÓXIMO PASSO'),`${slug}: CTA contextual ausente`);
  assert.ok(html.includes('Consultar a linha'),`${slug}: destino comercial ausente`);
}

const local=await fs.readFile('dist/lubrificantes-industriais-em-sao-paulo/index.html','utf8');
for(const text of ['Comércio e distribuição de lubrificantes industriais','não realiza troca de óleo','Estado de São Paulo'])assert.ok(local.includes(text),`página regional: falta ${text}`);
const schemas=[...local.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match=>JSON.parse(match[1]));
assert.ok(schemas.some(item=>item['@type']==='Service'),'página regional: schema Service ausente');
assert.ok(schemas.some(item=>item['@type']==='FAQPage'),'página regional: schema FAQPage ausente');

const contact=await fs.readFile('dist/contato/index.html','utf8');
for(const text of ['Pedido registrado no atendimento da FFL','Sem compromisso de compra','Como sua solicitação é tratada'])assert.ok(contact.includes(text),`contato: falta ${text}`);

const policy=await fs.readFile('dist/politica-editorial/index.html','utf8');
for(const text of ['Fontes e revisão','Separação entre conteúdo e oferta comercial','Atualizações e correções'])assert.ok(policy.includes(text),`política editorial: falta ${text}`);

const analytics=await fs.readFile('src/analytics.js','utf8');
assert.ok(analytics.includes("email_click:'email_click'"),'evento email_click ausente');
console.log(JSON.stringify({categories:company.categories.filter(item=>item.confirmed).length,articles:blogFiles.length,newPages:2,errors:[]}));
