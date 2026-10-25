// Encaminhamento comercial explícito: não recomenda o grau 68 a todo leitor.
// O conteúdo técnico, suas datas/fontes e os demais produtos são preservados.
export function improveQuoteJourney(pages, {company, esc, arrow}) {
  const productId = 'oleo-hidraulico-68';
  const product = company.products.find(p => p.confirmed && p.slug === productId);
  if (!product) throw new Error('O percurso de cotação exige o óleo 68 confirmado.');
  const productUrl = `/lubrificantes-industriais/${product.category}/${product.slug}/`;
  const quoteUrl = `/contato/?produto=${encodeURIComponent(product.name)}&item=${productId}#orcamento`;
  const categoryUrl = `/lubrificantes-industriais/${product.category}/`;
  const articles = new Set(['como-ler-um-grau-iso-vg', 'din-51524-hl-hlp-hvlp']);
  const link = (label, href, position, primary = true) => `<a class="${primary ? 'button dark-button' : 'text-link'}" href="${esc(href)}" data-product-id="${productId}" data-cta-position="${position}">${esc(label)} ${arrow}</a>`;
  const bridge = `<section class="article-product-bridge" aria-labelledby="consulta-oleo-68"><span class="small-label">DA ESPECIFICAÇÃO À COTAÇÃO</span><h3 id="consulta-oleo-68">Precisa de óleo hidráulico 68?</h3><p>Se o manual exige ISO VG 68, confira os dados antes de cotar. Já confirmou a especificação? O formulário abre com o produto preenchido.</p><div class="journey-actions">${link('Ver dados do óleo 68 AW', productUrl, 'article_body')}${link('Já sei o produto: pedir cotação', quoteUrl, 'article_body', false)}</div><p class="journey-note">O mesmo grau não comprova equivalência. Disponibilidade e embalagens são confirmadas na proposta.</p></section>`;
  for (const page of pages) {
    if (page.article && articles.has(page.article.slug)) {
      const body = page.article.html;
      // Depois da primeira seção explicativa; aparece no fluxo de leitura móvel,
      // sem depender de uma barra fixa ou de chegar às fontes no fim do artigo.
      const headings = [...body.matchAll(/<h2\b/g)];
      if (headings.length < 2 || !page.content.includes(body)) throw new Error(`Não foi possível inserir o percurso em ${page.article.slug}.`);
      const index = headings[1].index;
      page.content = page.content.replace(body, body.slice(0, index) + bridge + body.slice(index));
      page.content = page.content.replace(/<aside class="article-callout">[\s\S]*?<\/aside>/, `<aside class="article-callout oil68-article-callout"><span class="small-label">PRÓXIMO PASSO</span><h3>Da leitura à consulta do óleo 68</h3><p>Se o requisito é ISO VG 68, confira os dados do produto antes de solicitar preço. Não escolha o grau somente por este artigo.</p>${link('Ver óleo hidráulico 68 AW', productUrl, 'article_sidebar')}${link('Pedir cotação do óleo 68', quoteUrl, 'article_sidebar', false)}<a class="text-link journey-alternative" href="${categoryUrl}">Consultar a linha: outros graus ${arrow}</a></aside>`);
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
