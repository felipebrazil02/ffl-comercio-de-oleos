// Encaminhamento comercial explícito: não recomenda o grau 68 a todo leitor.
// O conteúdo técnico, suas datas/fontes e os demais produtos são preservados.
export function improveQuoteJourney(pages, {company, esc, arrow}) {
  const productId = 'oleo-hidraulico-68';
  const product = company.products.find(p => p.confirmed && p.slug === productId);
  if (!product) throw new Error('O percurso de cotação exige o óleo 68 confirmado.');
  const productUrl = `/lubrificantes-industriais/${product.category}/${product.slug}/`;
  const quoteUrl = `/contato/?produto=${encodeURIComponent(product.name)}&item=${productId}#orcamento`;
  const categoryUrl = `/lubrificantes-industriais/${product.category}/`;
  const articles = new Map([
    ['como-ler-um-grau-iso-vg', {heading:'O manual do seu equipamento pede ISO VG 68?', text:'Consulte o óleo hidráulico 68 AW com faixa de viscosidade documentada e confira também a especificação de desempenho. Se já confirmou esses requisitos, siga para o orçamento.', early:true}],
    ['din-51524-hl-hlp-hvlp', {heading:'Procura óleo hidráulico 68 com declaração HLP?', text:'A ficha do HS 68 AW declara ISO VG 68, ISO-HM e DIN 51524 parte 2 H-LP. Confira os dados e a revisão na página do produto antes de comparar com o manual.', early:true}],
    ['oleo-hidraulico-hm', {heading:'Precisa cotar óleo hidráulico HM no grau 68?', text:'Consulte a referência HS 68 AW, cuja ficha declara ISO VG 68 e ISO-HM. Compare a declaração documental com a especificação completa do equipamento antes de solicitar uma alternativa.'}],
    ['troca-de-oleo-hidraulico', {heading:'Já definiu o óleo e a quantidade para a reposição?', text:'Se a especificação conferida é a do óleo hidráulico 68 AW, consulte os dados do produto e envie a quantidade e a cidade de destino. A FFL comercializa lubrificantes; não executa a troca nem a manutenção do equipamento.'}]
  ]);
  const link = (label, href, position, primary = true) => `<a class="${primary ? 'button dark-button' : 'text-link'}" href="${esc(href)}" data-product-id="${productId}" data-cta-position="${position}">${esc(label)} ${arrow}</a>`;
  const bridge = context => `<section class="article-product-bridge" aria-labelledby="consulta-oleo-68"><span class="small-label">DA ESPECIFICAÇÃO À COTAÇÃO</span><h3 id="consulta-oleo-68">${esc(context.heading)}</h3><p>${esc(context.text)}</p><div class="journey-actions">${link('Ver dados do óleo 68 AW', productUrl, 'article_body')}${link('Já confirmei o produto: solicitar orçamento', quoteUrl, 'article_body', false)}</div><p class="journey-note">O mesmo grau não comprova equivalência. O formulário abre com o produto preenchido; a quantidade pode ser estimada. Disponibilidade e embalagens são confirmadas na proposta.</p></section>`;
  for (const page of pages) {
    if (page.article?.slug === 'oleo-hidraulico-68-comparar-orcamentos') {
      page.content = page.content.replace(/<aside class="article-callout">[\s\S]*?<\/aside>/, `<aside class="article-callout oil68-article-callout"><span class="small-label">SUA PROPOSTA</span><h3>Cote óleo hidráulico 68 AW</h3><p>Consulte os dados do produto e informe quantidade e cidade de destino. As condições são confirmadas na proposta.</p>${link('Ver óleo hidráulico 68 AW', productUrl, 'article_sidebar')}${link('Solicitar cotação do óleo 68', quoteUrl, 'article_sidebar', false)}</aside>`);
    }
    if (page.article && articles.has(page.article.slug)) {
      const body = page.article.html;
      // ISO/DIN: depois da primeira explicação. HM/troca: junto da preparação
      // da consulta, após os critérios técnicos, sem oferecer manutenção.
      const headings = [...body.matchAll(/<h2\b/g)];
      if (headings.length < 2 || !page.content.includes(body)) throw new Error(`Não foi possível inserir o percurso em ${page.article.slug}.`);
      const context = articles.get(page.article.slug);
      const index = context.early ? headings[1].index : headings.at(-1).index;
      page.content = page.content.replace(body, body.slice(0, index) + bridge(context) + body.slice(index));
      page.content = page.content.replace(/<aside class="article-callout">[\s\S]*?<\/aside>/, `<aside class="article-callout oil68-article-callout"><span class="small-label">PRÓXIMO PASSO</span><h3>Consultar o óleo 68 AW</h3><p>Veja aplicação, faixa de viscosidade e especificações declaradas. Para o orçamento, informe quantidade e cidade de destino.</p>${link('Ver óleo hidráulico 68 AW', productUrl, 'article_sidebar')}${link('Pedir cotação do óleo 68', quoteUrl, 'article_sidebar', false)}<a class="text-link journey-alternative" href="${categoryUrl}">Consultar a linha: outros graus ${arrow}</a></aside>`);
    }
    if (page.product?.slug === productId) {
      page.quoteContext = {id:productId, url:quoteUrl};
      const oldQuote = `/contato/?produto=${encodeURIComponent(product.name)}#orcamento`;
      const oldAction = `<ul><li><a href="${oldQuote}">Pedir preço e condições para óleo hidráulico 68 AW</a></li></ul>`;
      if (!page.content.includes(oldAction)) throw new Error('CTA da seção de cotação do óleo 68 não encontrado.');
      page.content = page.content.replace(oldAction, `<div class="journey-actions">${link('Pedir cotação do óleo 68', quoteUrl, 'product_body')}</div><p class="journey-note">O formulário já abre com o produto identificado. A quantidade pode ser estimada; o pedido não é uma confirmação de compra.</p>`);
      // Mantém todos os pedidos (inclusive documentação) ligados ao contexto do
      // produto, sem transportar nenhum dado pessoal nem o texto do formulário.
      page.content = page.content.replace(/<a\b[^>]*>/g, tag => {
        const match = tag.match(/href="(\/contato\/\?[^\"]+)"/);
        if (!match) return tag;
        const original = match[1];
        const href = /(?:&|&amp;)item=/.test(original) ? original : original.replace('#orcamento', `&amp;item=${productId}#orcamento`);
        const updated = tag.replace(`href="${original}"`, `href="${href}"`);
        return updated.includes('data-product-id=') ? updated : updated.replace(/>$/, ` data-product-id="${productId}" data-cta-position="product_body">`);
      });
      for (const [pattern, position] of [[/<div class="product-quick-actions">[\s\S]*?<\/div>/, 'product_top'], [/<aside class="article-callout">[\s\S]*?<\/aside>/, 'product_sidebar']]) {
        page.content = page.content.replace(pattern, block => block.replaceAll('data-cta-position="product_body"', `data-cta-position="${position}"`).replace(/<a\b([^>]*href="https:\/\/wa\.me\/[^>]+)>/g, (tag) => tag.includes('data-product-id=') ? tag : tag.replace(/>$/, ` data-product-id="${productId}" data-cta-position="${position}">`)));
      }
      const whatsapp = company.whatsapp ? `<a class="text-link whatsapp-link" href="https://wa.me/${esc(company.whatsapp)}?text=${encodeURIComponent(`Olá! Gostaria de solicitar uma cotação de ${product.name}. Vou informar quantidade e cidade de entrega.`)}" target="_blank" rel="noopener noreferrer" data-product-id="${productId}" data-cta-position="product_end">Preferir atendimento pelo WhatsApp ${arrow}</a>` : '';
      page.content += `<section class="container product-quote-next" aria-labelledby="cotacao-oleo-68"><div><span class="small-label">CONTINUE SUA CONSULTA</span><h2 id="cotacao-oleo-68">Já conferiu os requisitos do óleo 68?</h2><p>Envie quantidade, cidade de entrega e os requisitos do equipamento para consultar disponibilidade e condições com a FFL.</p></div><div class="journey-actions">${link('Solicitar orçamento do óleo 68', quoteUrl, 'product_end')}${whatsapp}</div></section>`;
    }
    if (page.url === '/contato/') {
      const context = `<div id="quote-product-context" class="quote-product-context" hidden><span class="small-label">PRODUTO DA CONSULTA</span><strong id="quote-product-name"></strong><p>O produto já foi preenchido abaixo. Você pode ajustar a aplicação e acrescentar os requisitos do equipamento; a quantidade pode ser estimada.</p><a href="${productUrl}">Voltar aos dados do óleo 68 AW</a></div>`;
      page.content = page.content.replace('<div class="form-heading">', context + '<div class="form-heading">').replace('<h2>Descreva sua necessidade</h2>', '<h2 id="quote-heading">Descreva sua necessidade</h2>');
    }
  }
  return pages;
}
