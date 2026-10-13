// Melhorias comerciais; textos e política de revisão do blog permanecem separados.
export function improveCommercialPages(pages,{company,esc,arrow,button}){
  const categories=company.categories.filter(c=>c.confirmed);
  const contact=`<p><a href="tel:${esc(company.phone)}">(11) 91501-1527</a> · <a href="mailto:${esc(company.email)}">${esc(company.email)}</a></p><p>Salto/SP · Atendimento em todo o estado de São Paulo.</p>`;
  for(const page of pages){
    if(page.url.startsWith('/conteudos/'))continue;
    if(page.url==='/'){
      page.title='Lubrificantes industriais em São Paulo | FFL';
      page.description='Óleos hidráulicos, graxas e lubrificantes industriais. FFL em Salto/SP, com atendimento em todo o estado de São Paulo. Consulte as linhas e peça orçamento.';
      page.content=page.content.replace('Encontre o caminho para a lubrificação da sua operação. Informe a aplicação, a especificação e a quantidade para solicitar uma cotação.','Óleos hidráulicos, graxas e lubrificantes para a sua operação. Estamos em Salto/SP e atendemos todo o estado de São Paulo. Consulte as linhas e solicite uma cotação.');
      const lines=`<section class="section container home-catalog" aria-labelledby="linhas-title"><div class="section-heading"><div><div class="eyebrow dark">CATÁLOGO INDUSTRIAL</div><h2 id="linhas-title">Encontre a linha<br>para sua aplicação.</h2></div><p>Consulte aplicações e especificações. Preço, disponibilidade e embalagens são confirmados no orçamento.</p></div><div class="catalog-grid">${categories.map(c=>`<a class="catalog-card" href="/lubrificantes-industriais/${esc(c.slug)}/"><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><span class="text-link">Consultar linha ${arrow}</span></a>`).join('')}</div></section>`;
      page.content=page.content.replace('<section class="section container">',lines+'<section class="section container">');
    }
    if(page.url==='/sobre/'){
      page.title='Sobre a FFL | Lubrificantes industriais em SP';
      page.description='Conheça a FFL Lubrificantes, em Salto/SP. Comércio de óleos e lubrificantes industriais com atendimento em todo o estado de São Paulo.';
      page.content=page.content.replace('Este é o espaço da FFL Lubrificantes para organizar consultas sobre óleos e lubrificantes industriais. Use as orientações do site para identificar a necessidade e reunir os dados do equipamento.','A FFL atua no comércio de óleos e lubrificantes industriais, em Salto/SP, com atendimento em todo o estado de São Paulo. O catálogo reúne linhas para sistemas hidráulicos, redutores, compressores, usinagem e outras aplicações industriais.');
    }
    if(page.url==='/contato/'){
      page.content=page.content.replace('Sua necessidade.<br>O início da cotação.','Solicite orçamento de<br>lubrificantes industriais.');
      page.content=page.content.replace('action="/contato/"','action="/obrigado/"').replace('data-endpoint="/contato/"','data-endpoint="/obrigado/"');
      page.content=page.content.replace('Não inclua informações confidenciais.</p>','Não inclua informações confidenciais. <a href="/privacidade/">Saiba como os dados da solicitação são tratados.</a></p>');
    }
    if(page.category?.slug==='oleos-basicos'){
      page.content=page.content.replaceAll('Incluído em bloco coletivo e repetido no modal; sem cartão individual. A linha informa produtos próprios e fabricação para terceiros.','Consulte disponibilidade e informe a aplicação, a viscosidade exigida e a quantidade desejada.');
      page.content=page.content.replace('Porque não há aplicação, viscosidade nem especificação publicadas para cada um deles individualmente. Publicar páginas separadas sem esse conteúdo não ajudaria você nem seria honesto com a informação disponível.','Os óleos básicos estão reunidos nesta linha. Informe o processo e os requisitos técnicos para confirmar as características e a disponibilidade do produto na cotação.');
      page.category.faq=page.category.faq.map(f=>({...f,answer:f.question==='Por que estes produtos não têm página própria?'?'Os óleos básicos estão reunidos nesta linha. Informe o processo e os requisitos técnicos para confirmar as características e a disponibilidade do produto na cotação.':f.answer}));
    }
    if(page.product){
      const p=page.product;
      const related=company.products.filter(r=>r.confirmed&&r.category===p.category&&r.slug!==p.slug).slice(0,3);
      const documents=`<section class="container product-documents"><h2>Documentação para sua consulta</h2><p>Solicite a ficha técnica e a ficha de segurança correspondentes ao produto e ao grau desejados. Confirme os requisitos do equipamento antes de substituir um lubrificante.</p>${button('Solicitar documentação',`/contato/?produto=${encodeURIComponent('Solicito ficha técnica e ficha de segurança: '+p.name)}#orcamento`,'dark-button')}</section>`;
      page.content+=documents+(related.length?`<section class="section container"><h2>Outros produtos desta linha</h2><p>Consulte a aplicação de cada produto; pertencer à mesma linha não indica equivalência.</p><div class="catalog-grid">${related.map(r=>`<a class="catalog-card" href="/lubrificantes-industriais/${r.category}/${r.slug}/"><h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><span class="text-link">Consultar produto ${arrow}</span></a>`).join('')}</div></section>`:'');
    }
  }
  pages.push({url:'/obrigado/',label:'Solicitação recebida',title:'Solicitação recebida | FFL Lubrificantes',description:'Recebemos sua solicitação de orçamento de lubrificantes industriais. A FFL dará continuidade pelo contato informado no pedido.',noindex:true,content:`<section class="container section" data-form-receipt="orcamento"><h1>Solicitação recebida.</h1><p>Aguarde o retorno pelo contato informado no pedido.</p>${contact}${button('Consultar produtos','/lubrificantes-industriais/','dark-button')}</section>`});
  pages.push({url:'/privacidade/',label:'Dados da solicitação',title:'Dados da solicitação | FFL Lubrificantes',description:'Entenda quais dados são solicitados no orçamento da FFL, a finalidade do formulário e como entrar em contato sobre sua solicitação.',noindex:true,content:`<section class="container section article-body"><h1>Dados da sua solicitação</h1><p>O formulário solicita nome, empresa, contato, produto ou aplicação, quantidade opcional e cidade/UF. Essas informações permitem à FFL compreender e responder ao pedido de orçamento.</p><h2>Recebimento do formulário</h2><p>A hospedagem e o processamento técnico do formulário utilizam a Netlify. A solicitação é encaminhada ao ambiente de formulários da FFL nesse serviço. Não envie documentos pessoais, senhas ou informações confidenciais no campo de aplicação.</p><h2>Contato sobre seus dados</h2><p>Para dúvidas ou solicitações relacionadas aos dados enviados, entre em contato com a FFL e identifique o pedido.</p>${contact}<p><a href="/contato/">Voltar ao contato</a></p></section>`});
  return pages;
}
