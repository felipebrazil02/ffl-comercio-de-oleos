import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const slugs = ["como-ler-um-grau-iso-vg","din-51524-hl-hlp-hvlp","ficha-tecnica-e-ficha-de-seguranca","informacoes-para-cotar-lubrificante","nlgi-consistencia-de-graxas","oleo-de-corte-integral-ou-emulsionavel","oleo-para-compressor-de-parafuso"];
const base = process.argv[2];
const pairs = [
  ['/blog', '/conteudos/'],
  ['/post/a-importância-da-análise-de-óleo-para-a-manutenção-preditiva-de-equipamentos-industriais', '/conteudos/analise-de-oleo-em-tendencia/'],
];
const absent = [
  '/post/principais-aplicações-do-óleo-industrial-e-automotivo-e-coleta-de-óleo-lubrificante-usado',
  '/post/diferença-entre-óleo-mineral-e-sintético-qual-escolher-para-o-seu-veículo-ou-empresa',
];
const sitemap = base ? await (await fetch(base+'/sitemap.xml')).text() : await fs.readFile('dist/sitemap.xml','utf8');
const headers = await fs.readFile('dist/_headers','utf8');
const redirects = await fs.readFile('dist/_redirects','utf8');
for (const slug of slugs) {
  const path='/conteudos/'+slug+'/';
  const response=base ? await fetch(base+path) : null;
  const html=response ? await response.text() : await fs.readFile('dist'+path+'index.html','utf8');
  assert.ok(html.includes('name="robots" content="index, follow"'), path);
  assert.ok(html.includes('rel="canonical" href="https://ffllubrificantes.com.br'+path+'"'), path);
  assert.ok(sitemap.includes('<loc>https://ffllubrificantes.com.br'+path+'</loc>'), path);
  assert.ok(!headers.includes(path), path+': cabeçalho noindex residual');
  if(response) {
    assert.equal(response.status,200,path);
    if(!base.includes('--')) assert.ok(!(response.headers.get('x-robots-tag')||'').includes('noindex'),path);
  }
}
for(const [oldPath,target] of pairs) {
  for(const suffix of ['', '/']) {
    assert.ok(redirects.includes(oldPath+suffix+' '+target+' 301!'));
    if(base) {
      const response=await fetch(base+oldPath+suffix,{redirect:'manual'});
      assert.equal(response.status,301,oldPath+suffix);
      assert.equal(new URL(response.headers.get('location'),base).pathname,target);
      assert.equal((await fetch(base+oldPath+suffix)).status,200);
    }
  }
}
assert.ok(!redirects.includes('/post/*'));
if(base) for(const path of absent) assert.equal((await fetch(base+path)).status,404,path);
const iso=await fs.readFile('dist/conteudos/como-ler-um-grau-iso-vg/index.html','utf8');
assert.ok(iso.includes('representa o <strong>valor nominal central'));
assert.ok(!iso.includes('é a <strong>valor nominal'));
console.log(JSON.stringify({base:base||'local',released:slugs.length,sitemapUrls:(sitemap.match(/<loc>/g)||[]).length,redirects:pairs.length,errors:[]}));
