// Enriquecimento comercial somente com dados confirmados do catálogo.
// Relações editoriais explícitas: um artigo não comprova adequação do produto.
import {productConsultation} from './product-consultation.mjs';
const guides = {
  'oleos-hidraulicos': ['din-51524-hl-hlp-hvlp', 'como-ler-um-grau-iso-vg'],
  'oleos-para-engrenagens': ['como-ler-um-grau-iso-vg', 'ensaio-de-quatro-esferas'],
  'oleos-para-compressores': ['oleo-para-compressor-de-parafuso', 'analise-de-oleo-em-tendencia'],
  'oleos-de-corte-e-usinagem': ['oleo-de-corte-integral-ou-emulsionavel', 'concentracao-e-ph-do-fluido-de-corte'],
  'oleos-termicos-e-tratamento-termico': ['analise-de-oleo-em-tendencia', 'ficha-tecnica-e-ficha-de-seguranca'],
  'oleos-de-processo-e-especialidades': ['ficha-tecnica-e-ficha-de-seguranca', 'compatibilidade-com-vedacoes-e-tintas'],
  'graxas-industriais': ['nlgi-consistencia-de-graxas', 'base-da-graxa-litio-calcio-complexo']
};
const productGuides = {
  'oleo-de-corte-emulsionavel': ['concentracao-e-ph-do-fluido-de-corte', 'fluido-de-corte-espumando'],
  'oleo-de-corte-integral-2020': ['oleo-de-corte-integral-familias', 'oleo-de-corte-integral-ou-emulsionavel'],
  'oleo-de-corte-integral-32': ['oleo-de-corte-integral-familias', 'oleo-de-corte-integral-ou-emulsionavel'],
  'oleo-para-estampagem-e-conformacao': ['ficha-tecnica-e-ficha-de-seguranca', 'informacoes-para-cotar-lubrificante'],
  'protetivo-anticorrosivo-para-chassis': ['ficha-tecnica-e-ficha-de-seguranca', 'informacoes-para-cotar-lubrificante'],
  'oleo-para-limpeza-de-armamentos': ['ficha-tecnica-e-ficha-de-seguranca', 'informacoes-para-cotar-lubrificante'],
  'graxa-grafitada': ['graxa-grafitada-quando-usar', 'nlgi-consistencia-de-graxas'],
  'graxa-de-litio-ep': ['graxa-ep-ou-comum', 'base-da-graxa-litio-calcio-complexo'],
  'graxa-de-calcio-para-chassis': ['base-da-graxa-litio-calcio-complexo', 'nlgi-consistencia-de-graxas']
};
const articleProducts = {
  'como-ler-um-grau-iso-vg': ['oleo-hidraulico-68', 'oleo-hidraulico-aw-10-46', 'oleo-hidraulico-aw-68-220', 'oleo-ep-para-redutores-150-680'],
  'din-51524-hl-hlp-hvlp': ['oleo-hidraulico-68', 'oleo-hidraulico-aw-10-46', 'oleo-hidraulico-aw-68-220'],
  'oleo-hidraulico-hm': ['oleo-hidraulico-aw-10-46'],
  'oleo-de-corte-integral-ou-emulsionavel': ['oleo-de-corte-emulsionavel', 'oleo-de-corte-integral-32'],
  'oleo-de-corte-integral-familias': ['oleo-de-corte-integral-2020', 'oleo-de-corte-integral-32'],
  'concentracao-e-ph-do-fluido-de-corte': ['oleo-de-corte-emulsionavel'],
  'fluido-de-corte-espumando': ['oleo-de-corte-emulsionavel'],
  'emulsao-separando-agua': ['oleo-de-corte-emulsionavel'],
  'graxa-grafitada-quando-usar': ['graxa-grafitada'],
  'graxa-ep-ou-comum': ['graxa-de-litio-ep'],
  'base-da-graxa-litio-calcio-complexo': ['graxa-de-litio-ep', 'graxa-de-calcio-para-chassis'],
  'nlgi-consistencia-de-graxas': ['graxa-de-litio-ep', 'graxa-grafitada'],
  'oleo-para-compressor-de-parafuso': ['oleo-para-compressor-de-ar']
};

export function enrichCatalog(pages, {company, esc}) {
  const products = company.products.filter(p => p.confirmed);
  const bySlug = new Map(products.map(p => [p.slug, p]));
  const articles = new Map(pages.filter(p => p.article && p.blogIndexable).map(p => [p.article.slug, p]));
  const url = p => `/lubrificantes-industriais/${p.category}/${p.slug}/`;
  const row = (p, label) => p.specRows?.find(([key]) => key === label)?.[1];
  for (const page of pages) {
    if (page.url === '/lubrificantes-industriais/') {
      const groups = company.categories.filter(c => c.confirmed).map(c => {
        const items = products.filter(p => p.category === c.slug);
        return `<div><h3><a href="/lubrificantes-industriais/${esc(c.slug)}/">${esc(c.name)}</a></h3>${items.length ? `<ul>${items.map(p => `<li><a href="${url(p)}">${esc(p.name)}</a></li>`).join('')}</ul>` : '<p>Consulte as referências disponíveis na página desta linha.</p>'}</div>`;
      }).join('');
      page.content += `<section class="container section article-body catalog-directory"><h2>Encontre o produto pelo nome</h2><p>Já conhece a referência? Acesse os dados de cada produto abaixo. Para escolher pela aplicação, consulte a respectiva linha; a presença no catálogo não confirma estoque nem compatibilidade com seu equipamento.</p><div class="catalog-grid">${groups}</div></section>`;
    }
    if (page.category) {
      for (const p of products.filter(p => p.category === page.category.slug)) {
        const details = ['Graus publicados', 'Base'].map(label => {
          const value = row(p, label);
          return value ? `<span class="catalog-fact"><strong>${esc(label)}:</strong> ${esc(value)}</span>` : '';
        }).join('');
        page.content = page.content.replace(`<p>${esc(p.description)}</p><span class="text-link">Ver produto`, `<p>${esc(p.description)}</p>${details}<span class="text-link">Ver produto`);
      }
    }
    if (page.product) {
      const p = page.product;
      if (p.technicalTable) {
        const table = p.technicalTable;
        const headingId = `dados-${p.slug}`;
        const comparison = `<section class="product-technical-comparison"><h2 id="${esc(headingId)}">${esc(table.heading)}</h2><p class="table-scroll-help">No celular, deslize a tabela para comparar os quatro graus.</p><div class="product-table-scroll" role="region" aria-labelledby="${esc(headingId)}" tabindex="0"><table class="product-technical-table"><caption>${esc(table.caption)}</caption><thead><tr>${table.columns.map(label => `<th scope="col">${esc(label)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map((value, i) => i === 0 ? `<th scope="row">${esc(value)}</th>` : `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
        page.content = page.content.replace('<h2>Como especificar na sua solicitação</h2>', comparison + '<h2>Como especificar na sua solicitação</h2>');
      }
      if (p.slug === 'graxa-de-calcio-para-chassis') {
        const distinction = '<div class="reading-note product-application-navigation"><strong>Proteção da superfície ou lubrificação do ponto?</strong><p>Esta graxa é apresentada para pinos de chassis e mancais de deslizamento. Se a sua necessidade é proteger chassis e superfícies metálicas contra corrosão, consulte o <a href="/lubrificantes-industriais/oleos-de-processo-e-especialidades/protetivo-anticorrosivo-para-chassis/">protetivo anticorrosivo para chassis</a> e confira a aplicação na documentação.</p><p>São finalidades distintas: não trate o protetivo como substituto automático da graxa em um ponto de lubrificação.</p></div>';
        page.content = page.content.replace('<h2>Aplicações declaradas</h2>', distinction + '<h2>Aplicações declaradas</h2>');
      }
      if (p.slug === 'oleo-hidraulico-aw-68-220') {
        const link = '<div class="reading-note product-range-navigation"><strong>Procura especificamente o óleo hidráulico 68?</strong><p>Consulte a <a href="/lubrificantes-industriais/oleos-hidraulicos/oleo-hidraulico-68/">página do óleo hidráulico 68 AW</a>, com critérios de seleção e dados para orçamento. Esta página reúne a linha com as opções 68, 100, 150 e 220.</p></div>';
        page.content = page.content.replace('<h2>Aplicações declaradas</h2>', link + '<h2>Aplicações declaradas</h2>');
      }
      const questions = productConsultation[p.slug];
      if (questions) {
        const detail = `<section class="product-questions"><h2>Dúvidas para especificar este produto</h2>${questions.map(([q,a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>`;
        page.content = page.content.replace('<h2>Como especificar na sua solicitação</h2>', detail + '<h2>Como especificar na sua solicitação</h2>');
      }
      const links = (productGuides[p.slug] || guides[p.category] || []).map(slug => {
        const article = articles.get(slug);
        if (!article) throw new Error(`Guia inexistente ou não indexável: ${slug}`);
        return `<li><a href="${article.url}">${esc(article.article.title)}</a></li>`;
      }).join('');
      // A fonte fica no cadastro interno, conforme a política comercial do projeto.
      const reference = `<div class="reading-note catalog-reference"><h3>O que conferir na documentação</h3><p>Confira nome e grau do produto, revisão do documento, aplicações e especificações declaradas. Esta página comercial não substitui a ficha técnica nem a ficha de segurança atualizadas.</p><p>A FFL comercializa e distribui lubrificantes. As informações do catálogo não representam uma declaração de fabricação própria ou de distribuição exclusiva.</p></div>`;
      page.content = page.content.replace('<h2>Documentação para sua consulta</h2>', '<h2>Documentação para sua consulta</h2>' + reference);
      page.content += `<section class="container section article-body product-selection"><h2>Antes de cotar ${esc(p.name)}</h2><ul><li>Informe o nome completo e ${row(p, 'Graus publicados') ? 'o grau desejado entre os publicados: ' + esc(row(p, 'Graus publicados')) : 'a versão desejada, quando aplicável'}.</li><li>Inclua o equipamento ou processo, o produto em uso e a especificação exigida no manual.</li><li>Informe quantidade, unidade, embalagem desejada e cidade de destino. Embalagens, estoque e prazo serão confirmados na proposta.</li></ul><h2>Guias relacionados a esta consulta</h2><ul>${links}</ul><p>Os guias explicam critérios de seleção; não comprovam a adequação deste produto ao seu equipamento.</p></section>`;
    }
    if (page.url === '/sobre/') {
      page.content += `<section class="container section article-body company-transparency"><h2>Quem atende sua solicitação</h2><p>A ${esc(company.name)} atua no comércio e na distribuição de óleos e lubrificantes industriais. Estamos em ${esc(company.city)}/${esc(company.state)}, com atendimento ao ${esc(company.regions.join(', '))}. Não realizamos troca de óleo nem manutenção de equipamentos.</p><h3>Canais comerciais da FFL</h3><ul><li>E-mail: <a href="mailto:${esc(company.email)}">${esc(company.email)}</a></li><li>Telefone: <a href="tel:${esc(company.phone)}">(11) 91501-1527</a></li><li><a href="/contato/#orcamento">Formulário de orçamento</a> para registrar produto, aplicação e destino.</li></ul><h3>Transparência na consulta</h3><p>O catálogo apresenta referências para consulta, não uma confirmação de estoque. A documentação do produto e as condições de fornecimento devem ser conferidas antes da compra.</p><p>Consulte nossa <a href="/politica-editorial/">política editorial</a> para conhecer os critérios dos conteúdos e o canal de correções. Saiba também <a href="/privacidade/">como tratamos os dados enviados no orçamento</a>.</p><p><a href="/lubrificantes-industriais/">Conheça as linhas de lubrificantes</a> ou confira o <a href="/lubrificantes-industriais-em-sao-paulo/">atendimento no estado de São Paulo</a>.</p></section>`;
    }
    if (page.article) {
      const publisher = `<p class="article-publisher">Publicado por <a href="/sobre/">FFL Lubrificantes</a> · <a href="/politica-editorial/">Fontes e critérios editoriais</a></p>`;
      page.content = page.content.replace('<p class="article-meta">', publisher + '<p class="article-meta">');
      const selected = articleProducts[page.article.slug];
      if (selected) {
        const items = selected.map(slug => {
          const p = bySlug.get(slug);
          if (!p) throw new Error(`Produto não confirmado: ${slug}`);
          return `<li><a href="${url(p)}">${esc(p.name)}</a> — ${esc(p.description)}</li>`;
        }).join('');
        const section = `<section class="article-catalog"><h2>Do guia à consulta de produtos</h2><p>Para reunir dados para uma cotação, consulte estas referências do catálogo. A relação com o tema não significa equivalência nem recomendação automática para sua aplicação.</p><ul>${items}</ul><p>Confirme o grau, as especificações e a documentação atual antes de escolher.</p></section>`;
        page.content = page.content.replace('<a class="text-link article-back"', section + '<a class="text-link article-back"');
      }
    }
  }
  return pages;
}
