import fs from 'node:fs/promises';
import path from 'node:path';
const routes=JSON.parse(await fs.readFile('outputs/rotas.json','utf8'));
const company=JSON.parse(await fs.readFile('data/company.json','utf8'));
const origin=(company.domain||'https://ffl-lubrificantes.netlify.app').replace(/\/$/,'');
const indexable=!!company.publicIndexing;
const errors=[];const titles=new Set();const descriptions=new Set();let links=0;let schemas=0;const files=[];
const seenTypes=new Set();
for(const route of routes){
  const file=route.url==='/404.html'?'dist/404.html':path.join('dist',route.url,'index.html');
  const html=await fs.readFile(file,'utf8');files.push({route:route.url,bytes:Buffer.byteLength(html)});
  if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(file+': H1');
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
  if(!title||titles.has(title))errors.push(file+': title');titles.add(title);
  if(title&&(title.length<25||title.length>62))errors.push(file+`: title length (${title.length})`);
  const desc=html.match(/<meta name="description" content="(.*?)"/s)?.[1];
  if(!desc||descriptions.has(desc))errors.push(file+': description');descriptions.add(desc);
  if(desc&&(desc.length<70||desc.length>160))errors.push(file+`: description length (${desc.length})`);
  if(!html.includes('lang="pt-BR"'))errors.push(file+': metadata');
  // Indexação: noindex enquanto o site está em revisão, index quando liberado.
  const isPrivatePage=route.utility;
  const expectRobots=indexable&&!route.noindex?'index, follow':'noindex, nofollow';
  if(!html.includes(`name="robots" content="${expectRobots}"`))errors.push(file+`: robots deveria ser "${expectRobots}"`);
  if(!isPrivatePage&&!html.includes(`rel="canonical" href="${origin+route.url}"`))errors.push(file+': canonical');
  // Open Graph / Twitter
  for(const tag of ['og:title','og:description','og:url','og:image','og:type','og:locale'])if(!html.includes(`property="${tag}"`))errors.push(file+': falta '+tag);
  if(!html.includes('name="twitter:card" content="summary_large_image"'))errors.push(file+': twitter:card');
  if(!/<meta property="og:image" content="https:\/\//.test(html))errors.push(file+': og:image precisa ser URL absoluta');
  // Fontes pré-carregadas
  if((html.match(/rel="preload"[^>]+as="font"/g)||[]).length!==2)errors.push(file+': preload de fontes');
  for(const [,raw]of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){
    try{const data=JSON.parse(raw);for(const item of data){schemas++;seenTypes.add(item['@type']);
      if(!item['@type'])errors.push(file+': schema type');
      if(item['@type']==='BreadcrumbList'&&item.itemListElement.some((l,i)=>l.position!==i+1||!l.item.startsWith('https://')))errors.push(file+': breadcrumb schema');
      if(item['@type']==='FAQPage'&&!(item.mainEntity?.length>=1))errors.push(file+': FAQPage precisa de perguntas');
      if(item['@type']==='Article'){
        for(const k of ['headline','datePublished','author','publisher','image'])if(!item[k])errors.push(file+`: Article sem ${k}`);
        if(item.datePublished&&!/^\d{4}-\d{2}-\d{2}$/.test(item.datePublished))errors.push(file+': Article datePublished inválida');
      }
    }}catch{errors.push(file+': JSON-LD');}
  }
  for(const [,href]of html.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)){
    if(!href.startsWith('/'))continue;links++;
    let target=path.join('dist',decodeURIComponent(href));
    if(href.endsWith('/'))target=path.join(target,'index.html');
    try{await fs.access(target);}catch{errors.push(file+': broken '+href);}
  }
  for(const [img]of html.matchAll(/<img\b[^>]+>/g))if(!/alt="[^"]*"/.test(img)||!/width="\d+"/.test(img)||!/height="\d+"/.test(img))errors.push(file+': image metadata');
}
for(const t of ['Organization','LocalBusiness','WebSite','BreadcrumbList','FAQPage','Article'])if(!seenTypes.has(t)&&!(t==='LocalBusiness'||t==='Organization'))errors.push('Schema ausente no site: '+t);
// Assets levam hash no nome; resolve pelo prefixo.
const assetDir=await fs.readdir('dist/assets');
const resolve=base=>{const ext=path.extname(base),stem=base.slice(0,-ext.length);
  const hit=assetDir.find(f=>f===base||new RegExp(`^${stem}\\.[0-9a-f]{10}${ext.replace('.','\\.')}$`).test(f));
  if(!hit)errors.push('Asset ausente: '+base);return hit;};
const cssName=resolve('site.css');
if(cssName){
  const css=await fs.readFile('dist/assets/'+cssName,'utf8');
  for(const [,asset]of css.matchAll(/url\(['"]?(\/[^)'" ]+)/g))try{await fs.access(path.join('dist',asset));}catch{errors.push('CSS asset '+asset);}
}
for(const name of ['manrope-latin.woff2','barlow-condensed-latin.woff2']){const hit=resolve(name);if(hit){const bytes=await fs.readFile('dist/assets/'+hit);if(bytes.subarray(0,4).toString()!=='wOF2')errors.push('Invalid WOFF2 '+name);}}
const og=resolve('og-default.jpg');
if(og){const bytes=await fs.readFile('dist/assets/'+og);if(bytes[0]!==0xff||bytes[1]!==0xd8)errors.push('og-default.jpg não é um JPEG válido');}
// Blog: feed, temas e consistência dos posts.
const postFiles=(await fs.readdir('content/blog')).filter(f=>f.endsWith('.md')&&!f.startsWith('_')&&f!=='README.md');
const feed=await fs.readFile('dist/conteudos/feed.xml','utf8');
const itens=(feed.match(/<item>/g)||[]).length;
if(itens!==postFiles.length)errors.push(`feed.xml tem ${itens} itens para ${postFiles.length} posts`);
if(!feed.includes(`<link>${origin}/conteudos/</link>`))errors.push('feed.xml sem link do canal');
if(/<link>(?!https:\/\/)/.test(feed))errors.push('feed.xml com link relativo');
for(const f of postFiles){
  const slug=f.replace(/\.md$/,'');
  const file=`dist/conteudos/${slug}/index.html`;
  let html;try{html=await fs.readFile(file,'utf8');}catch{errors.push('Post sem página publicada: '+slug);continue;}
  if(!html.includes('rel="alternate" type="application/rss+xml"'))errors.push(file+': sem autodiscovery do RSS');
  if(!/<time datetime="\d{4}-\d{2}-\d{2}"/.test(html))errors.push(file+': sem data legível por máquina');
  const art=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .flatMap(m=>JSON.parse(m[1])).find(x=>x['@type']==='Article');
  if(!art)errors.push(file+': sem schema Article');
  else if(!(art.wordCount>0))errors.push(file+': Article sem wordCount');
  // Cada âncora do sumário precisa existir no corpo.
  for(const [,id]of html.matchAll(/<nav class="post-toc"[\s\S]*?<\/nav>/g).next().value?.[0]?.matchAll(/href="#([^"]+)"/g)||[])
    if(!html.includes(`id="${id}"`))errors.push(file+': sumário aponta para âncora inexistente #'+id);
}
// O nome do fornecedor não deve aparecer em nada que vá ao ar.
const PROIBIDO=/falub/i;
for(const route of routes){
  const file=route.url==='/404.html'?'dist/404.html':path.join('dist',route.url,'index.html');
  const html=await fs.readFile(file,'utf8');
  if(PROIBIDO.test(html))errors.push(file+': contém o nome do fornecedor');
}
for(const extra of ['dist/sitemap.xml','dist/robots.txt','dist/conteudos/feed.xml'])
  if(PROIBIDO.test(await fs.readFile(extra,'utf8')))errors.push(extra+': contém o nome do fornecedor');
// Sitemap e robots acompanham o estado de indexação.
const sitemap=await fs.readFile('dist/sitemap.xml','utf8');
const locs=(sitemap.match(/<loc>/g)||[]).length;
if(indexable&&locs!==routes.filter(r=>!r.noindex).length)errors.push(`Sitemap deveria listar as páginas indexáveis (tem ${locs})`);
if(!indexable&&locs)errors.push('Preview sitemap must have no indexable URLs');
const robots=await fs.readFile('dist/robots.txt','utf8');
if(indexable&&!robots.includes(`Sitemap: ${origin}/sitemap.xml`))errors.push('robots.txt sem Sitemap');
// Formulário: estado indisponível quando não há destino, marcação Netlify quando há.
const form=await fs.readFile('dist/contato/index.html','utf8');
if(!company.formEndpoint){
  if(!form.includes('data-endpoint=""')||!form.includes('Nenhum dado será enviado'))errors.push('Missing unavailable destination state');
}else if(company.formEndpoint==='netlify'){
  for(const needle of ['data-netlify="true"','name="form-name"','data-netlify-honeypot="website"','data-form-mode="netlify"'])if(!form.includes(needle))errors.push('Netlify Forms: falta '+needle);
}
for(const c of company.categories)if(!c.confirmed)errors.push('Categoria não confirmada: '+(c.slug||'(sem slug)'));
for(const p of company.products)if(!p.confirmed)errors.push('Produto não confirmado: '+(p.slug||'(sem slug)'));
const result={checkedAt:new Date().toISOString(),origin,indexable,pages:routes.length,localLinksAndAssets:links,structuredObjects:schemas,schemaTypes:[...seenTypes].sort(),errors,files};
await fs.writeFile('outputs/validacao-tecnica.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
if(errors.length)process.exitCode=1;
