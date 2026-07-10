// build.mjs - Gerador de site estatico FFL
import fs from 'node:fs';
import site from './src/data/site.mjs';
import { produtos, categorias, produtosDestaque, produtosPorCategoria } from './src/data/products.mjs';

const DIR = 'C:/Users/felip/ffl-site';
const PUBLIC = DIR + '/public';

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function linkAtivo(href, atual) { return atual === href ? ' aria-current="page"' : ''; }

function ld(obj) { return '<script type="application/ld+json">' + JSON.stringify(obj) + '</script>'; }

function header(titulo, desc, canonical, atual) {
  atual = atual || '/';
  var ogImg = site.url + '/imagens/logo-ffl.png';
  return '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n' +
    '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + esc(titulo) + '</title>\n' +
    '<meta name="description" content="' + esc(desc) + '">\n' +
    '<link rel="canonical" href="' + esc(canonical) + '">\n' +
    '<meta property="og:title" content="' + esc(titulo) + '">\n' +
    '<meta property="og:description" content="' + esc(desc) + '">\n' +
    '<meta property="og:url" content="' + esc(canonical) + '">\n' +
    '<meta property="og:type" content="website">\n<meta property="og:locale" content="pt_BR">\n' +
    '<meta property="og:image" content="' + esc(ogImg) + '">\n' +
    '<meta name="twitter:card" content="summary_large_image">\n' +
    '<link rel="icon" type="image/png" href="/imagens/logo-ffl.png">\n' +
    '<link rel="stylesheet" href="/estilo.css">\n</head>\n<body>\n' +
    '<header>\n  <div class="header-inner">\n' +
    '    <a class="logo" href="/">\n' +
    '      <img src="/imagens/logo-ffl.png" alt="FFL" height="48">\n' +
    '      <div><div class="logo-texto">FFL <span>Comercio de Oleos</span></div><span class="logo-sub">Lubrificantes Industriais</span></div>\n' +
    '    </a>\n' +
    '    <button class="menu-toggle" aria-label="Abrir menu" onclick="document.querySelector(\'nav\').classList.toggle(\'aberto\')">&#9776;</button>\n' +
    '    <nav>\n' +
    '      <a href="/"' + linkAtivo('/', atual) + '>Inicio</a>\n' +
    '      <a href="/produtos/"' + linkAtivo('/produtos/', atual) + '>Produtos</a>\n' +
    '      <a href="/categorias/"' + linkAtivo('/categorias/', atual) + '>Categorias</a>\n' +
    '      <a href="/contato/" class="cta"' + linkAtivo('/contato/', atual) + '>Solicitar cotacao</a>\n' +
    '    </nav>\n  </div>\n</header>\n<main>\n';
}

function footer() {
  return '</main>\n' +
    '<div class="faixa-cta"><div class="container">\n' +
    '  <h2>Solicite seu orcamento sem compromisso</h2>\n' +
    '  <a class="btn" href="https://wa.me/' + site.whatsapp + '?text=Ola!%20Gostaria%20de%20receber%20uma%20cotacao%20de%20oleos%20industriais.">Falar pelo WhatsApp</a>\n' +
    '</div></div>\n' +
    '<footer>\n  <div class="container">\n' +
    '    <div class="grid grid-4">\n' +
    '      <div><h4>FFL Comercio de Oleos</h4><p style="font-size:.9rem">Lubrificantes industriais, oleos hidraulicos, graxas e fluidos especiais para todo o estado de Sao Paulo.</p></div>\n' +
    '      <div><h4>Produtos</h4>\n' +
    produtosDestaque.slice(0,6).map(function(p) { return '        <a href="/produtos/' + esc(p.slug) + '/">' + esc(p.nome) + '</a>\n'; }).join('') +
    '        <a href="/produtos/">Ver todos &rarr;</a>\n' +
    '      </div>\n' +
    '      <div><h4>Categorias</h4>\n' +
    categorias.map(function(c) { return '        <a href="/categorias/' + esc(c.slug) + '/">' + esc(c.nome) + '</a>\n'; }).join('') +
    '      </div>\n' +
    '      <div><h4>Contato</h4>\n' +
    '        <a href="https://wa.me/' + site.whatsapp + '?text=Ola!%20Gostaria%20de%20uma%20cotacao.">WhatsApp: ' + site.telefone + '</a>\n' +
    '        <a href="mailto:' + site.email + '">' + site.email + '</a>\n' +
    '        <p style="font-size:.85rem;color:#b9c8d6;margin-top:8px">' + site.enderecoCompleto + '</p>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="creditos">&copy; 2026 ' + site.nome + ' &mdash; CNPJ: ' + site.cnpj + ' &mdash; ' + site.endereco.logradouro + ' - ' + site.endereco.cidade + '/' + site.endereco.estado + '</div>\n' +
    '  </div>\n</footer>\n' +
    '<a class="zap-flutuante" href="https://wa.me/' + site.whatsapp + '?text=Ola!%20Gostaria%20de%20uma%20cotacao%20de%20oleos%20industriais." aria-label="Conversar no WhatsApp">\n' +
    '  <svg viewBox="0 0 32 32"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.5c1.2.5 2.5.7 3.8.7 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22.2c-1.2 0-2.4-.2-3.5-.7l-.7-.3-4.9.9 1-4.7-.3-.7c-.9-1.5-1.4-3.2-1.4-4.9 0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.4-9.8 9.4zm5.4-7.1c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"/></svg>\n' +
    '</a>\n</body>\n</html>';
}

function paginaTopo(titulo, resumo) {
  return '<div class="pagina-topo"><div class="container">\n  <h1>' + esc(titulo) + '</h1>\n' +
    (resumo ? '  <p class="resumo">' + esc(resumo) + '</p>\n' : '') +
    '</div></div>\n';
}

function homePage() {
  var html = header(
    site.nome + ' — Oleos Hidraulicos, Lubrificantes e Graxas Industriais em SP',
    site.descricao,
    site.url,
    '/'
  );

  html += '<div class="hero"><div class="container">\n';
  html += '  <h1>' + esc(site.slogan) + '</h1>\n';
  html += '  <p>' + esc(site.descricao) + '</p>\n';
  html += '  <div class="botoes">\n';
  html += '    <a class="btn btn-destaque" href="https://wa.me/' + site.whatsapp + '?text=Ola!%20Gostaria%20de%20receber%20uma%20cotacao%20de%20oleos%20industriais.">Solicitar cotacao no WhatsApp</a>\n';
  html += '    <a class="btn btn-vazado" href="/produtos/">Ver todos os produtos</a>\n';
  html += '  </div>\n</div></div>\n';

  html += '<section><div class="container">\n';
  html += '  <h2 class="secao">Produtos em destaque</h2>\n';
  html += '  <p class="secao-sub">Linha completa de lubrificantes industriais com procedencia e suporte tecnico.</p>\n';
  html += '  <div class="grid grid-3" style="margin-bottom:8px">\n';
  produtosDestaque.forEach(function(p) {
    var cat = categorias.find(function(c) { return c.slug === p.categoria; });
    html += '    <div class="card produto-card">\n';
    if (p.tag) html += '      <span class="tag">' + esc(p.tag) + '</span>\n';
    html += '      <h3>' + esc(p.nome) + '</h3>\n';
    html += '      <p>' + esc(p.resumo) + '</p>\n';
    html += '      <span style="font-size:.82rem;color:var(--texto-suave);margin:6px 0 10px;display:block">' + esc(cat ? cat.nome : '') + '</span>\n';
    html += '      <a class="saiba" href="/produtos/' + esc(p.slug) + '/">Ver detalhes &rarr;</a>\n';
    html += '    </div>\n';
  });
  html += '  </div>\n';
  html += '  <p style="text-align:center;margin-top:16px"><a class="saiba" href="/produtos/" style="font-size:1.05rem">Ver catalogo completo de produtos &rarr;</a></p>\n';
  html += '</div></section>\n';

  html += '<section class="alt"><div class="container">\n';
  html += '  <h2 class="secao">Categorias</h2>\n';
  html += '  <p class="secao-sub">Solucoes completas para manutencao industrial e lubrificacao de equipamentos.</p>\n';
  html += '  <div class="grid grid-3">\n';
  categorias.forEach(function(c) {
    var icon = { 'oleos-hidraulicos': '\uD83D\uDD27', 'oleos-para-engrenagens': '\u2699\uFE0F', 'graxas-industriais': '\uD83E\uDDF4', 'fluidos-de-corte': '\uD83D\uDD29', 'oleos-protetivos': '\uD83D\uDEE1\uFE0F' }[c.slug] || '\uD83D\uDCE6';
    html += '    <div class="card" style="text-align:center">\n';
    html += '      <div class="icone">' + icon + '</div>\n';
    html += '      <h3>' + esc(c.nome) + '</h3>\n';
    html += '      <p>' + esc(c.descricao) + '</p>\n';
    html += '      <a class="saiba" href="/categorias/' + esc(c.slug) + '/">Ver produtos &rarr;</a>\n';
    html += '    </div>\n';
  });
  html += '  </div>\n</div></section>\n';

  html += '<section><div class="container">\n';
  html += '  <h2 class="secao">Por que a FFL?</h2>\n';
  html += '  <p class="secao-sub">Sua maquina nao pode parar por falta de lubrificante certo. A FFL garante o fornecimento.</p>\n';
  html += '  <div class="grid grid-4">\n';
  html += '    <div class="diferencial"><div class="icone">\uD83D\uDCCD</div><h3>Entrega em todo SP</h3><p style="color:var(--texto-suave);font-size:.92rem">Frota propria e logistica eficiente para entregar onde voce precisar.</p></div>\n';
  html += '    <div class="diferencial"><div class="icone">\u2699\uFE0F</div><h3>Produto certo</h3><p style="color:var(--texto-suave);font-size:.92rem">Suporte tecnico para escolher a viscosidade e especificacao ideais.</p></div>\n';
  html += '    <div class="diferencial"><div class="icone">\uD83D\uDCE6</div><h3>Embalagens flexiveis</h3><p style="color:var(--texto-suave);font-size:.92rem">De baldes de 20L a tambores de 200L. Volume que atende sua operacao.</p></div>\n';
  html += '    <div class="diferencial"><div class="icone">\uD83D\uDCB0</div><h3>Preco competitivo</h3><p style="color:var(--texto-suave);font-size:.92rem">Qualidade industrial com custo justo para sua manutencao.</p></div>\n';
  html += '  </div>\n</div></section>\n';

  html += '<section class="alt"><div class="container" style="text-align:center">\n';
  html += '  <h2 class="secao">Atendemos todo o estado de Sao Paulo</h2>\n';
  html += '  <p class="secao-sub" style="max-width:600px;margin:0 auto">Baseados em Salto/SP, entregamos para toda a regiao metropolitana de Campinas, Sorocaba, Jundiai, Piracicaba, Ribeirao Preto, Sao Jose dos Campos e Grande Sao Paulo.</p>\n';
  html += '</div></section>\n';

  html += ld({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.nome,
    description: site.descricao,
    url: site.url,
    logo: site.url + '/imagens/logo-ffl.png',
    telephone: '+55-' + site.whatsapp,
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: site.endereco.logradouro, addressLocality: site.endereco.cidade, addressRegion: site.endereco.estado, postalCode: site.endereco.cep, addressCountry: site.endereco.pais },
    vatID: site.cnpj
  });

  html += ld({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Produtos ' + site.nome,
    description: 'Oleos hidraulicos, lubrificantes industriais, graxas e fluidos especiais',
    url: site.url + '/produtos/',
    itemListElement: produtos.map(function(p, i) {
      return { '@type': 'ListItem', position: i + 1, item: { '@type': 'Product', name: p.nome, url: site.url + '/produtos/' + p.slug + '/' } };
    })
  });

  html += footer();
  return html;
}

function produtosPage() {
  var html = header(
    'Produtos — ' + site.nome + ' | Oleos Hidraulicos, Graxas e Lubrificantes',
    'Catalogo completo de lubrificantes industriais: oleos hidraulicos ISO 32, 46, 68, graxas MP2, fluidos de corte e mais. Solicite cotacao.',
    site.url + '/produtos/',
    '/produtos/'
  );
  html += paginaTopo('Produtos', 'Catalogo completo de lubrificantes industriais. Consulte nossa equipe para recomendar o produto ideal para sua aplicacao.');

  categorias.forEach(function(cat) {
    var prods = produtos.filter(function(p) { return p.categoria === cat.slug; });
    if (prods.length === 0) return;
    html += '\n<div class="pagina-topo" style="padding:32px 0;margin-bottom:24px"><div class="container">\n';
    html += '  <h2 style="color:var(--branco);font-size:1.5rem">' + esc(cat.nome) + '</h2>\n';
    html += '  <p style="color:#b9c8d6;margin-top:4px">' + esc(cat.descricao) + '</p>\n';
    html += '</div></div>\n';
    html += '<div class="container"><div class="grid grid-3" style="margin-bottom:40px">\n';
    prods.forEach(function(p) {
      html += '  <div class="card produto-card">\n';
      if (p.tag) html += '    <span class="tag">' + esc(p.tag) + '</span>\n';
      html += '    <h3>' + esc(p.nome) + '</h3>\n';
      html += '    <p>' + esc(p.resumo) + '</p>\n';
      html += '    <a class="saiba" href="/produtos/' + esc(p.slug) + '/">Ver detalhes &rarr;</a>\n';
      html += '  </div>\n';
    });
    html += '</div></div>\n';
  });

  html += ld({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Produtos ' + site.nome,
    itemListElement: produtos.map(function(p, i) {
      return { '@type': 'ListItem', position: i + 1, item: { '@type': 'Product', name: p.nome, url: site.url + '/produtos/' + p.slug + '/' } };
    })
  });
  html += footer();
  return html;
}

function produtoPage(prod) {
  var cat = categorias.find(function(c) { return c.slug === prod.categoria; });
  var html = header(
    esc(prod.nome) + ' — ' + site.nome,
    esc(prod.nome) + ': ' + esc(prod.resumo) + ' Fornecemos para toda SP. Balde 20L e tambor 200L.',
    site.url + '/produtos/' + prod.slug + '/',
    '/produtos/'
  );

  html += '<div class="pagina-topo"><div class="container">\n';
  html += '  <div class="breadcrumb"><a href="/">Inicio</a> &rsaquo; <a href="/produtos/">Produtos</a>';
  if (cat) html += ' &rsaquo; <a href="/categorias/' + esc(cat.slug) + '/">' + esc(cat.nome) + '</a>';
  html += ' &rsaquo; ' + esc(prod.nome) + '</div>\n';
  html += '  <h1>' + esc(prod.nome) + '</h1>\n';
  html += '  <p class="resumo">' + esc(prod.resumo) + '</p>\n';
  html += '</div></div>\n';

  html += '<div class="container"><div class="conteudo">\n';
  if (prod.tag) html += '  <span class="tag">' + esc(prod.tag) + '</span>\n';

  html += '  <h2>Descricao</h2>\n  <p>' + esc(prod.descricao) + '</p>\n';

  if (prod.aplicacoes && prod.aplicacoes.length) {
    html += '  <h3>Aplicacoes tipicas</h3>\n  <ul>\n';
    prod.aplicacoes.forEach(function(a) { html += '    <li>' + esc(a) + '</li>\n'; });
    html += '  </ul>\n';
  }

  html += '  <h3>Especificacoes tecnicas</h3>\n  <table class="specs">\n';
  Object.keys(prod.especs).forEach(function(k) {
    html += '    <tr><td>' + esc(k) + '</td><td>' + esc(prod.especs[k]) + '</td></tr>\n';
  });
  html += '  </table>\n';

  html += '  <div style="background:var(--cinza-fundo);border-radius:12px;padding:24px;margin-top:28px;text-align:center">\n';
  html += '    <h3 style="margin:0 0 10px">Solicite cotacao</h3>\n';
  html += '    <p style="margin-bottom:16px">Consulte preco, disponibilidade e prazo de entrega para ' + esc(prod.nome) + '.</p>\n';
  html += '    <a class="btn btn-destaque" href="https://wa.me/' + site.whatsapp + '?text=Ola!%20Gostaria%20de%20uma%20cotacao%20de%20' + encodeURIComponent(prod.nome) + '.">Falar no WhatsApp</a>\n';
  html += '  </div>\n';

  var relacionados = produtos.filter(function(p) { return p.categoria === prod.categoria && p.slug !== prod.slug; }).slice(0, 3);
  if (relacionados.length) {
    html += '  <h2 style="margin-top:40px">Produtos relacionados</h2>\n  <div class="grid grid-3" style="margin-top:12px">\n';
    relacionados.forEach(function(r) {
      html += '    <div class="card"><h3>' + esc(r.nome) + '</h3><p>' + esc(r.resumo) + '</p><a class="saiba" href="/produtos/' + esc(r.slug) + '/">Ver detalhes &rarr;</a></div>\n';
    });
    html += '  </div>\n';
  }

  html += '</div></div>\n';

  html += ld({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: prod.nome,
    description: prod.resumo,
    category: cat ? cat.nome : 'Lubrificantes Industriais',
    brand: { '@type': 'Brand', name: 'FFL' },
    offers: { '@type': 'Offer', priceCurrency: 'BRL', availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: site.nome, url: site.url } }
  });

  html += footer();
  return html;
}

function categoriaPage(cat) {
  var prods = produtos.filter(function(p) { return p.categoria === cat.slug; });
  var html = header(
    esc(cat.nome) + ' — ' + site.nome,
    esc(cat.descricao) + ' Fornecemos para industrias em todo estado de SP.',
    site.url + '/categorias/' + cat.slug + '/',
    '/categorias/'
  );

  html += '<div class="pagina-topo"><div class="container">\n';
  html += '  <div class="breadcrumb"><a href="/">Inicio</a> &rsaquo; <a href="/categorias/">Categorias</a> &rsaquo; ' + esc(cat.nome) + '</div>\n';
  html += '  <h1>' + esc(cat.nome) + '</h1>\n';
  html += '  <p class="resumo">' + esc(cat.descricao) + '</p>\n';
  html += '</div></div>\n';

  html += '<div class="container"><div class="grid grid-3" style="padding:44px 0">\n';
  prods.forEach(function(p) {
    html += '  <div class="card produto-card">\n';
    if (p.tag) html += '    <span class="tag">' + esc(p.tag) + '</span>\n';
    html += '    <h3>' + esc(p.nome) + '</h3>\n';
    html += '    <p>' + esc(p.resumo) + '</p>\n';
    html += '    <a class="saiba" href="/produtos/' + esc(p.slug) + '/">Ver detalhes &rarr;</a>\n';
    html += '  </div>\n';
  });
  html += '</div></div>\n';

  html += footer();
  return html;
}

function categoriasPage() {
  var html = header(
    'Categorias — ' + site.nome,
    'Navegue por categorias de lubrificantes industriais: oleos hidraulicos, graxas, fluidos de corte e mais.',
    site.url + '/categorias/',
    '/categorias/'
  );
  html += paginaTopo('Categorias', 'Encontre o lubrificante ideal para sua aplicacao.');
  html += '<div class="container"><div class="grid grid-3" style="padding:44px 0">\n';

  var icons = { 'oleos-hidraulicos': '\uD83D\uDD27', 'oleos-para-engrenagens': '\u2699\uFE0F', 'graxas-industriais': '\uD83E\uDDF4', 'fluidos-de-corte': '\uD83D\uDD29', 'oleos-protetivos': '\uD83D\uDEE1\uFE0F' };
  categorias.forEach(function(c) {
    var count = produtos.filter(function(p) { return p.categoria === c.slug; }).length;
    html += '  <div class="card" style="text-align:center">\n';
    html += '    <div class="icone">' + (icons[c.slug] || '\uD83D\uDCE6') + '</div>\n';
    html += '    <h3>' + esc(c.nome) + '</h3>\n';
    html += '    <p>' + esc(c.descricao) + '</p>\n';
    html += '    <p style="color:var(--destaque-escuro);font-size:.85rem;margin:8px 0">' + count + ' produto' + (count !== 1 ? 's' : '') + '</p>\n';
    html += '    <a class="saiba" href="/categorias/' + esc(c.slug) + '/">Explorar &rarr;</a>\n';
    html += '  </div>\n';
  });
  html += '</div></div>\n';
  html += footer();
  return html;
}

function contatoPage() {
  var html = header(
    'Contato — ' + site.nome + ' | Orcamento de Oleos Industriais',
    'Solicite cotacao de oleos hidraulicos, graxas e lubrificantes. WhatsApp: ' + site.telefone + '. Atendemos toda SP.',
    site.url + '/contato/',
    '/contato/'
  );
  html += paginaTopo('Fale com a FFL', 'Atendimento rapido. Orcamento sem compromisso.');

  html += '<div class="container"><div class="conteudo">\n';
  html += '  <form onsubmit="enviarZap(event)">\n';
  html += '    <div><label>Nome*<input required name="nome"></label></div>\n';
  html += '    <div><label>Empresa<input name="empresa"></label></div>\n';
  html += '    <div><label>Telefone / WhatsApp*<input required name="fone"></label></div>\n';
  html += '    <div><label>Produto de interesse*<select name="produto">\n';
  html += '      <option value="">Selecione...</option>\n';
  produtos.forEach(function(p) { html += '      <option value="' + esc(p.nome) + '">' + esc(p.nome) + '</option>\n'; });
  html += '      <option value="Outro">Outro produto</option>\n';
  html += '    </select></label></div>\n';
  html += '    <div><label>Volume / Embalagem<select name="embalagem">\n';
  html += '      <option value="">Indiferente</option>\n';
  html += '      <option value="Balde 20L">Balde 20L</option>\n';
  html += '      <option value="Tambor 200L">Tambor 200L</option>\n';
  html += '      <option value="IBC 1000L">IBC 1000L</option>\n';
  html += '      <option value="Granel">Granel</option>\n';
  html += '    </select></label></div>\n';
  html += '    <div><label>Mensagem<textarea name="msg" placeholder="Especifique sua aplicacao, volume mensal estimado e prazo de entrega desejado."></textarea></label></div>\n';
  html += '    <button class="btn btn-destaque" type="submit">Enviar pelo WhatsApp</button>\n';
  html += '  </form>\n';

  html += '  <script>\n';
  html += '  function enviarZap(e) {\n';
  html += '    e.preventDefault();\n';
  html += '    var f = e.target;\n';
  html += "    var texto = 'Ola! Meu nome eh ' + f.nome.value;\n";
  html += '    if (f.empresa.value) texto += ", da empresa " + f.empresa.value;\n';
  html += "    texto += '. Produto: ' + (f.produto.value || 'nao especificado');\n";
  html += "    if (f.embalagem.value && f.embalagem.value !== 'Indiferente' && f.embalagem.value !== '') { texto += '. Embalagem: ' + f.embalagem.value; }\n";
  html += "    texto += '. Contato: ' + f.fone.value;\n";
  html += "    if (f.msg.value) texto += '. ' + f.msg.value;\n";
  html += "    window.open('https://wa.me/" + site.whatsapp + "?text=' + encodeURIComponent(texto), '_blank');\n";
  html += '  }\n  </script>\n';

  html += '  <div class="contato-direto">\n';
  html += '    <h2>Contato direto</h2>\n';
  html += '    <p><strong>WhatsApp:</strong> <a href="https://wa.me/' + site.whatsapp + '">' + site.telefone + '</a></p>\n';
  html += '    <p><strong>E-mail:</strong> <a href="mailto:' + site.email + '">' + site.email + '</a></p>\n';
  html += '    <p><strong>Endereco:</strong> ' + site.enderecoCompleto + '</p>\n';
  html += '    <p><strong>CNPJ:</strong> ' + site.cnpj + '</p>\n';
  html += '  </div>\n</div></div>\n';

  html += ld({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.nome,
    url: site.url,
    telephone: '+55-' + site.whatsapp,
    email: site.email,
    address: { '@type': 'PostalAddress', streetAddress: site.endereco.logradouro, addressLocality: site.endereco.cidade, addressRegion: site.endereco.estado, postalCode: site.endereco.cep, addressCountry: site.endereco.pais },
    vatID: site.cnpj
  });

  html += footer();
  return html;
}

function robotsTxt() {
  return 'User-agent: *\nAllow: /\nSitemap: ' + site.url + '/sitemap.xml\n';
}

function sitemapXml() {
  var urls = [
    { loc: '/', priority: 1.0, freq: 'weekly' },
    { loc: '/produtos/', priority: 0.9, freq: 'weekly' },
    { loc: '/categorias/', priority: 0.8, freq: 'monthly' },
    { loc: '/contato/', priority: 0.7, freq: 'monthly' }
  ];
  categorias.forEach(function(c) { urls.push({ loc: '/categorias/' + c.slug + '/', priority: 0.8, freq: 'monthly' }); });
  produtos.forEach(function(p) { urls.push({ loc: '/produtos/' + p.slug + '/', priority: 0.9, freq: 'monthly' }); });

  var today = new Date().toISOString().split('T')[0];
  var xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  urls.forEach(function(u) {
    xml += '  <url>\n    <loc>' + site.url + u.loc + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>' + u.freq + '</changefreq>\n    <priority>' + u.priority.toFixed(1) + '</priority>\n  </url>\n';
  });
  xml += '</urlset>';
  return xml;
}

function build() {
  console.log('Gerando site FFL Comercio de Oleos...\n');

  if (!fs.existsSync(PUBLIC)) fs.mkdirSync(PUBLIC, { recursive: true });
  for (var item of fs.readdirSync(PUBLIC)) {
    if (item !== 'imagens') {
      fs.rmSync(PUBLIC + '/' + item, { recursive: true, force: true });
    }
  }

  console.log('  . Index...');
  fs.writeFileSync(PUBLIC + '/index.html', homePage(), 'utf-8');

  console.log('  . Produtos...');
  if (!fs.existsSync(PUBLIC + '/produtos')) fs.mkdirSync(PUBLIC + '/produtos', { recursive: true });
  fs.writeFileSync(PUBLIC + '/produtos/index.html', produtosPage(), 'utf-8');
  produtos.forEach(function(p) {
    var dir = PUBLIC + '/produtos/' + p.slug;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dir + '/index.html', produtoPage(p), 'utf-8');
    console.log('    - ' + p.nome);
  });

  console.log('  . Categorias...');
  if (!fs.existsSync(PUBLIC + '/categorias')) fs.mkdirSync(PUBLIC + '/categorias', { recursive: true });
  fs.writeFileSync(PUBLIC + '/categorias/index.html', categoriasPage(), 'utf-8');
  categorias.forEach(function(c) {
    var dir = PUBLIC + '/categorias/' + c.slug;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dir + '/index.html', categoriaPage(c), 'utf-8');
    console.log('    - ' + c.nome);
  });

  console.log('  . Contato...');
  if (!fs.existsSync(PUBLIC + '/contato')) fs.mkdirSync(PUBLIC + '/contato', { recursive: true });
  fs.writeFileSync(PUBLIC + '/contato/index.html', contatoPage(), 'utf-8');

  console.log('  . robots.txt e sitemap.xml...');
  fs.writeFileSync(PUBLIC + '/robots.txt', robotsTxt(), 'utf-8');
  fs.writeFileSync(PUBLIC + '/sitemap.xml', sitemapXml(), 'utf-8');

  console.log('\nBuild concluido!');
  console.log('  Paginas geradas: ' + (4 + categorias.length + produtos.length + 2));
  console.log('  Diretorio: ' + PUBLIC);
}

build();