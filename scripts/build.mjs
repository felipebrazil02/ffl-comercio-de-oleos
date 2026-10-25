import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createPages} from '../src/content.mjs';
import {improveCommercialPages} from '../src/seo.mjs';
import {enrichCatalog} from '../src/catalog-seo.mjs';
import {improveQuoteJourney} from '../src/quote-journey.mjs';
import {render,parseFrontmatter,slugify} from '../src/markdown.mjs';
const company=JSON.parse(await fs.readFile('data/company.json','utf8'));
const previewOrigin='https://ffl-lubrificantes.netlify.app';
const origin=(company.domain||previewOrigin).replace(/\/$/,'');
if(new URL(origin).protocol!=='https:')throw new Error('A origem deve usar HTTPS.');
if(company.whatsapp&&!/^55\d{10,11}$/.test(company.whatsapp))throw new Error('WhatsApp precisa de 55, DDD e número, somente dígitos.');
if(company.formEndpoint&&company.formEndpoint!=='netlify'&&new URL(company.formEndpoint,origin).protocol!=='https:')throw new Error('O formulário deve usar HTTPS.');
if(company.publicIndexing&&(!company.domain||!company.businessType||!company.city||!company.regions.length||!company.products.some(p=>p.confirmed)||(!company.whatsapp&&!company.formEndpoint)))throw new Error('Publicação indexável exige domínio, atuação, cidade, cobertura, catálogo e ao menos um canal de orçamento confirmados.');
for(const c of company.categories.filter(c=>c.confirmed)){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.slug)||!c.name||!c.description||!c.selection)throw new Error('Categoria confirmada incompleta.');}
for(const p of company.products.filter(p=>p.confirmed)){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||!p.name||!p.description||!p.applications||!p.source||!company.categories.some(c=>c.confirmed&&c.slug===p.category))throw new Error('Produto confirmado sem dados, documentação ou categoria.');}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const buildDate=new Date().toISOString().slice(0,10);
const fmtDate=iso=>new Date(iso+'T12:00:00Z').toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric',timeZone:'UTC'});

// ---------------------------------------------------------------------------
// Assets com fingerprint: nome contém o hash do conteúdo, por isso podem ser
// servidos com cache imutável de 1 ano. Precisa rodar antes das páginas para
// que o HTML já referencie os nomes definitivos.
// ---------------------------------------------------------------------------
const hash=buf=>crypto.createHash('sha256').update(buf).digest('hex').slice(0,10);
const assetMap={};
// dist/ inteiro é regenerado. Sem isso, páginas removidas do catálogo ou do
// blog permaneceriam no diretório e seriam publicadas indefinidamente.
await fs.rm('dist',{recursive:true,force:true});
await fs.mkdir('dist/assets',{recursive:true});
const emit=async(name,buf)=>{
  const ext=path.extname(name),base=name.slice(0,-ext.length);
  const hashed=`${base}.${hash(buf)}${ext}`;
  await fs.writeFile(path.join('dist/assets',hashed),buf);
  assetMap[name]=`/assets/${hashed}`;
  return assetMap[name];
};
const passthrough=async(src,name)=>{await fs.copyFile(src,path.join('dist/assets',name));assetMap[name]=`/assets/${name}`;return assetMap[name];};
// Fontes primeiro: o CSS referencia os nomes com hash.
const fontFiles=['manrope-latin.woff2','barlow-condensed-latin.woff2'];
for(const f of fontFiles)await emit(f,await fs.readFile(path.join('src/assets',f)));
for(const f of ['manrope-OFL.txt','barlowcondensed-OFL.txt'])await passthrough(path.join('src/assets',f),f);
for(const f of ['industrial-oil-1536.webp','industrial-oil-960.webp'])await emit(f,await fs.readFile(path.join('src/assets',f)));
await emit('og-default.jpg',await fs.readFile('src/static/og-default.jpg'));
let css=await fs.readFile('src/site.css','utf8');
for(const f of fontFiles)css=css.replaceAll(`/assets/${f}`,assetMap[f]);
await emit('site.css',Buffer.from(css));
await emit('site.js',await fs.readFile('src/site.js'));
await emit('analytics.js',await fs.readFile('src/analytics.js'));
const favicon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#101f31"/><text x="9" y="44" fill="#d8f35c" font-family="Arial,sans-serif" font-weight="900" font-style="italic" font-size="39">ffl</text></svg>';
await passthrough_write('favicon.svg',favicon);
async function passthrough_write(name,content){await fs.writeFile(path.join('dist/assets',name),content);assetMap[name]=`/assets/${name}`;}
const A=n=>assetMap[n];
const ogImage=origin+A('og-default.jpg');

const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const logo='<span class="wordmark">ffl<span class="logo-slash" aria-hidden="true"></span></span><span class="logo-caption">LUBRIFICANTES</span>';
const nav=[['/','Início'],['/lubrificantes-industriais/','Produtos'],['/sobre/','Sobre'],['/conteudos/','Conteúdos'],['/contato/','Contato']];
const button=(label,url,kind='primary')=>`<a class="button ${kind}" href="${url}">${label}${arrow}</a>`;
const header=active=>`<a class="skip-link" href="#conteudo">Pular para o conteúdo</a><header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="FFL Lubrificantes — início">${logo}</a><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Abrir menu"><span></span><span></span></button><nav id="main-nav" aria-label="Menu principal">${nav.map(([u,t])=>`<a href="${u}" ${active===u?'aria-current="page"':''}>${t}</a>`).join('')}</nav><a class="button header-cta" href="/contato/#orcamento">Solicitar orçamento${arrow}</a></div></header>`;
const footer=`<footer class="site-footer"><div class="container footer-main"><div><a class="brand inverse" href="/" aria-label="FFL Lubrificantes — início">${logo}</a><p>Informação para escolher.<br>Clareza para cotar.</p></div><div class="footer-links"><span>Explore</span>${nav.slice(1).map(([u,t])=>`<a href="${u}">${t}</a>`).join('')}<a href="/lubrificantes-industriais-em-sao-paulo/">Atendimento em SP</a><a href="/politica-editorial/">Política editorial</a></div><div class="footer-note"><span>Sua próxima cotação</span><p>Tenha em mãos a aplicação, a especificação e a quantidade desejada.</p><a class="text-link" href="/contato/#orcamento">Preparar solicitação ${arrow}</a></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} FFL Lubrificantes</span><span>Óleos e lubrificantes industriais</span></div></footer>`;
const faq=[['Quais informações preciso enviar para um orçamento?','Informe a aplicação ou o produto desejado, a especificação do fabricante do equipamento, a quantidade estimada e a cidade de destino. Se tiver, consulte também o manual e a ficha técnica do produto atualmente utilizado.'],['Posso escolher o lubrificante somente pela viscosidade?','Não. A viscosidade é um dos critérios. A seleção também precisa considerar a aplicação, as condições de operação e as especificações exigidas pelo fabricante do equipamento.'],['Não sei o nome do produto. Como preparar a solicitação?','Descreva o equipamento, a aplicação e a necessidade. Inclua o fabricante e o modelo, quando conhecidos. Evite assumir equivalências entre produtos sem documentação técnica.'],['Qual a diferença entre a ficha técnica e a ficha de segurança?','A ficha técnica descreve características, propriedades e aplicações declaradas pelo fabricante. A ficha de segurança reúne perigos, medidas de prevenção e cuidados de manuseio e armazenamento. Os documentos se complementam e nenhum substitui o outro.'],['Dois óleos com a mesma viscosidade são equivalentes?','Não necessariamente. Óleo-base, pacote de aditivos, aplicação e especificações atendidas também diferenciam os produtos. A equivalência precisa ser confirmada na documentação técnica de ambos.']];
let home=`<section class="hero"><div class="hero-image" aria-hidden="true"></div><div class="container hero-inner"><div class="eyebrow"><span></span> FFL LUBRIFICANTES</div><h1>Óleos e<br>lubrificantes<br><em>industriais.</em></h1><p>Encontre o caminho para a lubrificação da sua operação. Informe a aplicação, a especificação e a quantidade para solicitar uma cotação.</p><div class="hero-actions">${button('Solicitar orçamento','/contato/#orcamento')}${button('Conhecer produtos','/lubrificantes-industriais/','outline')}</div><div class="hero-footnote"><span>PRECISÃO EM CADA ESCOLHA</span><span class="image-caption">Imagem conceitual de lubrificação.</span></div></div></section><div class="spec-strip"><div class="container"><span>Uma boa cotação começa aqui</span><span>Aplicação <i>+</i> Especificação <i>+</i> Quantidade</span>${arrow}</div></div><section class="section container"><div class="section-heading"><div><div class="eyebrow dark">DA NECESSIDADE À COTAÇÃO</div><h2>Informação certa.<br>Próximo passo mais simples.</h2></div><p>Organize as informações de que sua operação precisa e prepare uma solicitação com os detalhes que fazem diferença.</p></div><div class="steps">${[['01','Identifique a aplicação','Informe o equipamento e as condições de uso. O manual do fabricante é o ponto de partida.'],['02','Reúna as especificações','Separe o produto de referência, a viscosidade e as exigências técnicas documentadas.'],['03','Prepare o orçamento','Acrescente a quantidade, a embalagem desejada e a cidade de destino.']].map(([n,t,p])=>`<article><span class="step-number">${n}</span><h3>${t}</h3><p>${p}</p></article>`).join('')}</div></section><section class="technical-band"><div class="container"><span class="eyebrow">CRITÉRIOS TÉCNICOS</span><h2>A escolha começa<br>pelo equipamento.</h2><div><p>Viscosidade, aplicação e especificação precisam ser consideradas em conjunto. Use a documentação técnica como referência para sua solicitação.</p>${button('Explorar orientações','/conteudos/','outline')}</div></div></section><section class="section container faq-section"><div><div class="eyebrow dark">DÚVIDAS FREQUENTES</div><h2>Antes de <br>solicitar.</h2><p>Respostas para preparar<br>uma cotação mais completa.</p></div><div class="faq-list">${faq.map(([q,a])=>`<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('')}</div></section><section class="contact-banner"><div class="container"><div class="eyebrow dark">VAMOS AO PRÓXIMO PASSO</div><div><h2>De que sua operação precisa?</h2>${button('Preparar meu orçamento','/contato/#orcamento','dark-button')}</div><p>Informe o produto ou a aplicação. Comece pelas informações que você já tem.</p></div></section>`;
home=home.replace('<div class="hero-image" aria-hidden="true"></div>',`<div class="hero-image"><picture><source media="(max-width: 700px)" srcset="${A('industrial-oil-960.webp')}"><img src="${A('industrial-oil-1536.webp')}" width="1536" height="1024" alt="Ilustração conceitual de óleo âmbar sobre uma engrenagem de aço." fetchpriority="high" decoding="async"></picture></div>`);
// ---------------------------------------------------------------------------
// Blog: um arquivo Markdown por post em content/blog/.
// ---------------------------------------------------------------------------
const OBRIGATORIOS=['title','description','summary','eyebrow','published'];
// README.md e arquivos iniciados por _ são documentação da pasta, não posts.
const ehPost=f=>f.endsWith('.md')&&!f.startsWith('_')&&f!=='README.md';
const postFiles=(await fs.readdir('content/blog')).filter(ehPost).sort();
const posts=[];
for(const file of postFiles){
  const slug=file.replace(/\.md$/,'');
  const {meta,body}=parseFrontmatter(await fs.readFile(path.join('content/blog',file),'utf8'));
  for(const k of OBRIGATORIOS)if(!meta[k])throw new Error(`${file}: frontmatter sem "${k}"`);
  for(const k of ['published','updated','consulted'])if(meta[k]&&!/^\d{4}-\d{2}-\d{2}$/.test(meta[k]))throw new Error(`${file}: ${k} precisa do formato AAAA-MM-DD`);
  if(meta.description.length<70||meta.description.length>160)throw new Error(`${file}: description com ${meta.description.length} caracteres (use 70 a 160)`);
  const {html,headings,words}=render(body);
  // A indexação do blog é opt-in por artigo. Só o post que declarar
  // `indexable: true` no frontmatter (e passar pela revisão editorial) sai do
  // noindex e entra no sitemap. Os demais continuam fora da indexação, para não
  // liberar automaticamente conteúdo antigo ou rascunho.
  const indexable=/^(true|sim|1)$/i.test(String(meta.indexable||''));
  posts.push({...meta,indexable,slug,url:`/conteudos/${slug}/`,html,headings,words,
    tags:(meta.tags||[]).map(t=>({name:t,slug:slugify(t),url:`/conteudos/tema/${slugify(t)}/`})),
    // 200 palavras por minuto, arredondado para cima, mínimo de 1.
    read:`${Math.max(1,Math.round(words/200))} min de leitura`});
}
if(!posts.length)throw new Error('Nenhum post encontrado em content/blog/.');
if(new Set(posts.map(p=>p.slug)).size!==posts.length)throw new Error('Slugs de post duplicados.');
posts.sort((a,b)=>(b.updated||b.published).localeCompare(a.updated||a.published)||b.published.localeCompare(a.published));
// Um tema só vira página quando reúne 2+ posts: arquivo com um item só seria
// uma página fina quase idêntica ao post. Conforme o blog cresce, os temas
// passam do limiar e as páginas aparecem sozinhas.
const MIN_POSTS_POR_TEMA=2;
const contagem=new Map();
for(const t of posts.flatMap(p=>p.tags))contagem.set(t.slug,(contagem.get(t.slug)||0)+1);
const tags=[...new Map(posts.flatMap(p=>p.tags).map(t=>[t.slug,t])).values()]
  .filter(t=>contagem.get(t.slug)>=MIN_POSTS_POR_TEMA)
  .sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
// p.tags continua completo (relacionados e keywords do schema); só a exibição
// em chips usa tagLinks, que traz apenas os temas que têm página.
const temasComPagina=new Set(tags.map(t=>t.slug));
for(const p of posts)p.tagLinks=p.tags.filter(t=>temasComPagina.has(t.slug));

const pages=improveQuoteJourney(enrichCatalog(improveCommercialPages(createPages({company,esc,arrow,button,home,posts,tags,fmtDate}),{company,esc,arrow,button}),{company,esc}),{company,esc,arrow});
const canIndex=page=>company.publicIndexing&&!page.noindex&&(!page.url.startsWith('/conteudos/')||page.blogIndexable===true);
if(new Set(pages.map(p=>p.url)).size!==pages.length)throw new Error('URLs duplicadas no catálogo.');

// ---------------------------------------------------------------------------
// Dados estruturados reaproveitados por todas as páginas.
// ---------------------------------------------------------------------------
const postalAddress=company.address||company.city?{'@type':'PostalAddress',...(company.address?{streetAddress:company.address}:{}),...(company.city?{addressLocality:company.city}:{}),...(company.state?{addressRegion:company.state}:{}),addressCountry:'BR'}:null;
const organization={'@context':'https://schema.org','@type':'Organization','@id':origin+'/#organization',name:company.name,url:origin,
  logo:{'@type':'ImageObject',url:origin+A('favicon.svg')},image:ogImage,
  description:'Óleos e lubrificantes industriais: orientação técnica e pedidos de orçamento.',
  ...(company.email?{email:company.email}:{}),...(company.phone?{telephone:company.phone}:{}),
  ...(postalAddress?{address:postalAddress}:{}),
  ...(company.hours?{openingHours:company.hours}:{}),
  ...(company.regions.length?{areaServed:company.regions.map(r=>({'@type':'AdministrativeArea',name:r}))}:{}),
  ...(company.sameAs?.length?{sameAs:company.sameAs}:{}),
  ...(company.email||company.phone||company.whatsapp?{contactPoint:[{'@type':'ContactPoint',contactType:'sales',availableLanguage:['pt-BR'],...(company.email?{email:company.email}:{}),...(company.phone||company.whatsapp?{telephone:company.phone||'+'+company.whatsapp}:{})}]}:{})};
const website={'@context':'https://schema.org','@type':'WebSite','@id':origin+'/#website',url:origin,name:company.name,inLanguage:'pt-BR',publisher:{'@id':origin+'/#organization'}};

for(const page of pages){
  const crumbs=[['/','Início'],...(page.product?[['/lubrificantes-industriais/','Produtos']]:[]),...(page.parent?[page.parent]:[]),...(page.url!=='/'?[[page.url,page.label]]:[])];
  const breadcrumb=page.url==='/'||page.noindex?'':`<div class="breadcrumb-bar"><nav class="container breadcrumb" aria-label="Caminho da página">${crumbs.map(([url,label],i)=>i===crumbs.length-1?`<span aria-current="page">${esc(label)}</span>`:`<a href="${url}">${esc(label)}</a><span aria-hidden="true">/</span>`).join('')}</nav></div>`;
  const structured=[organization,...(page.url==='/'?[website]:[]),...(page.url!=='/'&&!page.noindex?[{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map(([u,n],i)=>({'@type':'ListItem',position:i+1,name:n,item:origin+u}))}]:[])];
  // FAQPage: as mesmas perguntas que aparecem em <details> na home.
  if(page.url==='/')structured.push({'@context':'https://schema.org','@type':'FAQPage','@id':origin+'/#faq',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
  // Article: páginas editoriais sob /conteudos/.
  if(page.article){
    const a=page.article;
    structured.push({'@context':'https://schema.org','@type':'Article',headline:a.title,description:page.description,image:ogImage,
      datePublished:a.published,dateModified:a.updated||a.published,
      author:{'@id':origin+'/#organization'},publisher:{'@id':origin+'/#organization'},
      inLanguage:'pt-BR',wordCount:a.words,
      ...(a.tags?.length?{keywords:a.tags.map(t=>t.name).join(', '),articleSection:a.tags[0].name}:{}),
      ...(a.sources?.length?{citation:a.sources.map(s=>({'@type':'CreativeWork',name:s.label,url:s.url}))}:{}),
      mainEntityOfPage:{'@type':'WebPage','@id':origin+page.url}});
  }
  // Catálogo sob orçamento, sem ofertas públicas nem avaliações de produto.
  // Não emitir Product incompleto para snippets nem inventar preço/avaliação.
  // Organization, WebSite e BreadcrumbList continuam descrevendo estas páginas.
  // FAQ sem promessa de elegibilidade para resultados enriquecidos.
  if(page.category?.faq?.length)structured.push({'@context':'https://schema.org','@type':'FAQPage','@id':origin+page.url+'#faq',mainEntity:page.category.faq.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))});
  if(page.serviceArea){
    structured.push({'@context':'https://schema.org','@type':'Service','@id':origin+page.url+'#service',name:'Comércio e distribuição de lubrificantes industriais em São Paulo',serviceType:'Comércio e distribuição de óleos e lubrificantes industriais',provider:{'@id':origin+'/#organization'},areaServed:{'@type':'AdministrativeArea',name:'Estado de São Paulo'},availableChannel:{'@type':'ServiceChannel',serviceUrl:origin+'/contato/',servicePhone:company.phone}});
    structured.push({'@context':'https://schema.org','@type':'FAQPage','@id':origin+page.url+'#faq',mainEntity:page.serviceFaq.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))});
  }
  const metaRobots=canIndex(page)?'index, follow':'noindex, nofollow';
  const isArticle=!!page.article;
  let actualFooter=footer;
  if(!page.url.startsWith('/conteudos/'))actualFooter=actualFooter.replace('<span>Sua próxima cotação</span>',`<span>Atendimento FFL</span><p>Salto/SP · Todo o estado de São Paulo</p><p><a href="tel:${esc(company.phone)}">(11) 91501-1527</a><br><a href="mailto:${esc(company.email)}">${esc(company.email)}</a></p>`);
  if(company.whatsapp)actualFooter=actualFooter.replace('</div></div><div class="container footer-bottom">',`<a class="text-link whatsapp-link" target="_blank" rel="noopener noreferrer" href="https://wa.me/${esc(company.whatsapp)}?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento à FFL Lubrificantes.')}">WhatsApp comercial ${arrow}</a></div></div><div class="container footer-bottom">`);
  const head=[
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    `<meta name="robots" content="${metaRobots}">`,
    !page.noindex?`<link rel="canonical" href="${origin+page.url}">`:'',
    '<meta name="theme-color" content="#101f31">',
    // Fontes descobertas cedo: evita a troca visível de fonte depois do CSS.
    ...fontFiles.map(f=>`<link rel="preload" href="${A(f)}" as="font" type="font/woff2" crossorigin>`),
    `<meta property="og:type" content="${isArticle?'article':'website'}">`,
    '<meta property="og:locale" content="pt_BR">',
    '<meta property="og:site_name" content="FFL Lubrificantes">',
    `<meta property="og:url" content="${origin+page.url}">`,
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:image" content="${ogImage}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:type" content="image/jpeg">',
    '<meta property="og:image:alt" content="FFL Lubrificantes — óleos e lubrificantes industriais.">',
    isArticle?`<meta property="article:published_time" content="${page.article.published}">`:'',
    isArticle?`<meta property="article:modified_time" content="${page.article.updated||page.article.published}">`:'',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(page.title)}">`,
    `<meta name="twitter:description" content="${esc(page.description)}">`,
    `<meta name="twitter:image" content="${ogImage}">`,
    '<meta name="twitter:image:alt" content="FFL Lubrificantes — óleos e lubrificantes industriais.">',
    `<link rel="alternate" type="application/rss+xml" title="Conteúdos — FFL Lubrificantes" href="${origin}/conteudos/feed.xml">`,
    `<link rel="icon" href="${A('favicon.svg')}" type="image/svg+xml">`,
    `<link rel="stylesheet" href="${A('site.css')}">`,
    `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g,'\\u003c')}</script>`,
    `<script src="${A('site.js')}" defer></script>`,
    `<script src="${A('analytics.js')}" defer></script>`,
  ].filter(Boolean).join('');
  let actualHeader=header(page.url);
  if(page.quoteContext){
    const contextAttrs=`href="${esc(page.quoteContext.url)}" data-product-id="${esc(page.quoteContext.id)}" data-cta-position="header"`;
    actualHeader=actualHeader.replace('href="/contato/#orcamento"',contextAttrs);
    actualFooter=actualFooter.replace('href="/contato/#orcamento"',contextAttrs.replace('"header"','"product_end"'));
  }
  const html=`<!doctype html><html lang="pt-BR"><head>${head}</head><body>${actualHeader}<main id="conteudo">${breadcrumb}${page.content}</main>${actualFooter}</body></html>`;
  const file=page.url==='/404.html'?'dist/404.html':path.join('dist',page.url,'index.html');await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,html);
}
// Feed RSS dos posts. Publicado sempre; anunciado no <head> só quando indexável.
const rfc822=iso=>new Date(iso+'T12:00:00Z').toUTCString();
await fs.writeFile('dist/conteudos/feed.xml',`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Conteúdos — FFL Lubrificantes</title>
<link>${origin}/conteudos/</link>
<description>Orientações técnicas sobre óleos e lubrificantes industriais: seleção, documentação e preparação de cotações.</description>
<language>pt-BR</language>
<lastBuildDate>${rfc822(posts[0].updated||posts[0].published)}</lastBuildDate>
<atom:link href="${origin}/conteudos/feed.xml" rel="self" type="application/rss+xml"/>
${posts.map(p=>`<item><title>${esc(p.title)}</title><link>${origin+p.url}</link><guid isPermaLink="true">${origin+p.url}</guid><pubDate>${rfc822(p.published)}</pubDate><description>${esc(p.summary)}</description>${p.tags.map(t=>`<category>${esc(t.name)}</category>`).join('')}</item>`).join('\n')}
</channel>
</rss>
`);
const indexable=pages.filter(canIndex);
// Blog: o noindex por cabeçalho passa a ser por URL. Só os artigos aprovados
// (e os índices que os reúnem) deixam de receber X-Robots-Tag; o restante
// continua bloqueado também no HTTP, além do <meta name="robots">.
const blogNoindexUrls=pages.filter(p=>p.url.startsWith('/conteudos/')&&!canIndex(p)).map(p=>p.url);
const blogNoindexRules=blogNoindexUrls.flatMap(u=>[u,'  X-Robots-Tag: noindex, nofollow',u+'*','  X-Robots-Tag: noindex, nofollow']);
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable.map(p=>`<url><loc>${esc(origin+p.url)}</loc></url>`).join('')}</urlset>`);
await fs.writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n${company.publicIndexing?`\nSitemap: ${origin}/sitemap.xml\n`:'# Ambiente de revisão: todas as páginas têm noindex; nenhum sitemap público é anunciado.\n'}`);
// Assets com hash no nome podem ser imutáveis; favicon e licenças não têm hash.
await fs.writeFile('dist/_headers',['/*','  X-Content-Type-Options: nosniff','  Referrer-Policy: strict-origin-when-cross-origin','  Permissions-Policy: camera=(), microphone=(), geolocation=()',...(!company.publicIndexing?['  X-Robots-Tag: noindex, nofollow']:[]),'/404.html','  X-Robots-Tag: noindex','/obrigado/*','  X-Robots-Tag: noindex, nofollow','/privacidade/*','  X-Robots-Tag: noindex, nofollow',...blogNoindexRules,'/assets/*','  Cache-Control: public, max-age=31536000, immutable','/assets/favicon.svg','  Cache-Control: public, max-age=86400'].join(String.fromCharCode(10))+String.fromCharCode(10));
// URLs antigas (quando os produtos levavam o nome do fornecedor no slug).
// Preserve links compartilhados para produtos da arquitetura anterior.
const LEGADO={
  'falub-hs-68-220-aw':'oleo-hidraulico-aw-68-220/oleos-hidraulicos',
  'falub-hs-10-46-aw':'oleo-hidraulico-aw-10-46/oleos-hidraulicos',
  'falub-fpm':'oleo-para-ferramentas-pneumaticas/oleos-hidraulicos',
  'falub-lg-ep-10-32':'oleo-ep-lubrificacao-geral-10-32/oleos-para-engrenagens',
  'falub-lg-ep-150-680':'oleo-ep-para-redutores-150-680/oleos-para-engrenagens',
  'falub-compressor-hs-150':'oleo-para-compressor-de-ar/oleos-para-compressores',
  'falub-sol-e-37':'oleo-de-corte-emulsionavel/oleos-de-corte-e-usinagem',
  'falub-cortex-2020':'oleo-de-corte-integral-2020/oleos-de-corte-e-usinagem',
  'falub-cortex-32':'oleo-de-corte-integral-32/oleos-de-corte-e-usinagem',
  'falub-stamp-68':'oleo-para-estampagem-e-conformacao/oleos-de-corte-e-usinagem',
  'falub-therm-e':'oleo-termico-circuito-fechado/oleos-termicos-e-tratamento-termico',
  'falub-temp':'oleo-para-tempera-de-aco/oleos-termicos-e-tratamento-termico',
  'falub-transf-a':'oleo-isolante-para-transformadores/oleos-de-processo-e-especialidades',
  'falub-calibra-4113':'fluido-para-calibracao-de-injetores/oleos-de-processo-e-especialidades',
  'falub-fbx-56':'oleo-parafinico-de-processo-56/oleos-de-processo-e-especialidades',
  'falub-fb-100':'oleo-parafinico-para-formulacao-100/oleos-de-processo-e-especialidades',
  'falub-protetivo':'protetivo-anticorrosivo-para-chassis/oleos-de-processo-e-especialidades',
  'falub-arm':'oleo-para-limpeza-de-armamentos/oleos-de-processo-e-especialidades',
  'falub-graxa-lithium-ep1':'graxa-de-litio-ep/graxas-industriais',
  'falub-graxa-chassis-2':'graxa-de-calcio-para-chassis/graxas-industriais',
  'falub-graxa-grafit':'graxa-grafitada/graxas-industriais',
};
const redirects=Object.entries(LEGADO).map(([antigo,novo])=>{
  const [slug,cat]=novo.split('/');
  return `/lubrificantes-industriais/${cat}/${antigo}/  /lubrificantes-industriais/${cat}/${slug}/  301`;
}).join('\n');
// Somente URLs com conteúdo equivalente: não redirecionar todo /post/*.
const editorialRedirects = [
  ['/blog', '/conteudos/'],
  ['/post/a-importância-da-análise-de-óleo-para-a-manutenção-preditiva-de-equipamentos-industriais', '/conteudos/analise-de-oleo-em-tendencia/'],
].flatMap(([oldPath, target]) => [...new Set([oldPath, encodeURI(oldPath)])]
  .flatMap(path => [`${path} ${target} 301!`, `${path}/ ${target} 301!`])).join('\n');
await fs.writeFile('dist/_redirects',`https://ffl-lubrificantes.netlify.app/* ${origin}/:splat 301!\nhttp://ffl-lubrificantes.netlify.app/* ${origin}/:splat 301!\n/index.html / 301!\n# Conteúdo editorial equivalente da arquitetura anterior.\n${editorialRedirects}\n# Slugs antigos, de quando o nome do fornecedor compunha a URL.\n${redirects}\n`);
await fs.mkdir('outputs',{recursive:true});
await fs.writeFile('outputs/mapa-seo.csv','\ufeffURL;Palavra-chave (hipótese);Title;Meta description;Indexação\n'+indexable.map(p=>[p.url,p.keyword,p.title,p.description,company.publicIndexing?'indexável':'noindex — revisão privada'].map(s=>'"'+String(s).replace(/"/g,'""')+'"').join(';')).join('\n'));
await fs.writeFile('outputs/rotas.json',JSON.stringify(pages.map(p=>({url:p.url,title:p.title,description:p.description,noindex:!canIndex(p),utility:!!p.noindex})),null,2));
console.log(`Generated ${pages.length} pages. Indexável: ${company.publicIndexing?'sim':'não'}. Origem: ${origin}`);
