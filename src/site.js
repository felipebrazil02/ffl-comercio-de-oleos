const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');nav.classList.toggle('is-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){toggle.click();toggle.focus();}});
nav?.addEventListener('click',e=>{if(e.target.closest('a')&&toggle?.getAttribute('aria-expanded')==='true')toggle.click();});
// Only catalog identifiers are used for measurement. Query text and form values
// stay in the form; analytics.js applies consent and its own metadata allowlist.
const oil68={id:'oleo-hidraulico-68',name:'Óleo hidráulico 68 AW',path:'/lubrificantes-industriais/oleos-hidraulicos/oleo-hidraulico-68/'};
const journeyQuery=new URLSearchParams(location.search);
const currentProduct=location.pathname===oil68.path||journeyQuery.get('item')===oil68.id?oil68.id:null;
const articleIds=new Set(['como-ler-um-grau-iso-vg','din-51524-hl-hlp-hvlp']);
const articleCandidate=location.pathname.match(/^\/conteudos\/([^/]+)\/$/)?.[1];
const currentArticle=articleIds.has(articleCandidate)?articleCandidate:null;
const ctaPositions=new Set(['article_body','article_sidebar','article_related','product_top','product_body','product_sidebar','product_end','header']);
const track=(event,metadata={})=>window.dispatchEvent(new CustomEvent('ffl:analytics',{detail:{event,...metadata}}));
const positionFor=link=>{
  if(ctaPositions.has(link.dataset.ctaPosition))return link.dataset.ctaPosition;
  if(link.closest('header'))return 'header';
  if(currentArticle){
    if(link.closest('.article-callout'))return 'article_sidebar';
    if(link.closest('.article-catalog'))return 'article_related';
    if(link.closest('.article-body'))return 'article_body';
  }
  return undefined;
};
document.querySelectorAll('a[href]').forEach(link=>link.addEventListener('click',()=>{
  let destination;
  try{destination=new URL(link.getAttribute('href'),location.origin);}catch{return;}
  const internal=destination.origin===location.origin;
  const knownTarget=internal&&(destination.pathname===oil68.path||destination.pathname==='/contato/'&&destination.searchParams.get('item')===oil68.id);
  const declaredProduct=link.dataset.productId===oil68.id?oil68.id:null;
  const product=knownTarget?oil68.id:currentProduct||declaredProduct;
  const position=positionFor(link);
  const metadata={...(product?{product_slug:product}:{}),...(currentArticle?{article_slug:currentArticle}:{}),...(position?{cta_position:position}:{})};
  if(internal&&destination.pathname===oil68.path&&currentArticle)track('product_link_click',metadata);
  else if(internal&&destination.pathname==='/contato/'&&destination.hash==='#orcamento'&&product)track('quote_cta_click',metadata);
  else if(destination.protocol==='https:'&&destination.hostname==='wa.me')track('whatsapp_click',metadata);
}));
const form=document.querySelector('#quote-form');
if(form){
  const fields=['name','company','contact','product','location'];
  const status=document.querySelector('#form-status');
  const submit=form.querySelector('[type="submit"]');
  const result=document.querySelector('#quote-result');
  let busy=false;
  const named=name=>form.elements.namedItem(name);
  const prefill=journeyQuery.get('produto');
  if(prefill)named('product').value=prefill.slice(0,2500);
  const formMetadata={form_id:'orcamento',...(currentProduct?{product_slug:currentProduct}:{})};
  if(currentProduct===oil68.id){
    const productContext=document.querySelector('#quote-product-context');
    const productName=document.querySelector('#quote-product-name');
    const heading=document.querySelector('#quote-heading');
    if(productContext&&productName){productName.textContent=oil68.name;productContext.hidden=false;}
    if(heading)heading.textContent='Orçamento de óleo hidráulico 68 AW';
    if(!prefill)named('product').value=oil68.name;
  }
  let formStarted=false;
  const context=document.modelContext;
  if(context?.registerTool){
    const lifecycle=new AbortController();
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
    try{Promise.resolve(context.registerTool({
      name:'preencher_produto_para_orcamento',
      title:'Preparar produto para orçamento',
      description:'Preenche apenas produto ou aplicação e quantidade no formulário visível da FFL. Não envia dados, não contata a empresa e não conclui um orçamento.',
      inputSchema:{type:'object',properties:{product:{type:'string',minLength:5,maxLength:2500},quantity:{type:'string',maxLength:120}},required:['product'],additionalProperties:false},
      annotations:{readOnlyHint:false,untrustedContentHint:false},
      execute(input){
        if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['product','quantity'].includes(k))||typeof input.product!=='string'||input.product.trim().length<5||input.product.length>2500||(input.quantity!==undefined&&(typeof input.quantity!=='string'||input.quantity.length>120)))return {status:'invalid',message:'Informe produto ou aplicação com 5 a 2500 caracteres e quantidade opcional de até 120 caracteres.'};
        named('product').value=input.product.trim();named('quantity').value=input.quantity?.trim()||'';
        named('product').dispatchEvent(new Event('input',{bubbles:true}));named('product').focus();
        return {status:'prepared',sent:false,message:'Produto e quantidade preenchidos. Complete os demais campos para preparar a solicitação.'};
      }
    },{signal:lifecycle.signal})).catch(()=>{});}catch{}
  }
  function validateField(name){
    const field=named(name);const value=field.value.trim();let error='';
    if(!value)error='Preencha este campo.';
    else if(name==='contact'&&!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)||(/^[+\d\s().-]+$/.test(value)&&value.replace(/\D/g,'').length>=10&&value.replace(/\D/g,'').length<=13)))error='Informe um e-mail válido ou telefone com DDD.';
    else if(name==='location'&&!/^.{2,}[\s,/-]+(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/i.test(value))error='Informe a cidade e a sigla do estado. Ex.: Campinas / SP.';
    else if(value.length<(field.minLength>0?field.minLength:1))error=`Informe pelo menos ${field.minLength} caracteres.`;
    field.setAttribute('aria-invalid',String(!!error));
    field.setAttribute('aria-describedby',(name==='contact'?'contact-hint ':'')+name+'-error');
    document.getElementById(name+'-error').textContent=error;
    return !error;
  }
  fields.forEach(name=>named(name).addEventListener('blur',()=>{if(named(name).value)validateField(name);}));
  form.addEventListener('input',event=>{
    result.hidden=true;status.textContent='';
    if(!formStarted&&event.isTrusted&&['name','company','contact','product','quantity','location'].includes(event.target?.name)){
      formStarted=true;track('quote_form_start',formMetadata);
    }
  });
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(busy)return;
    if(named('website').value){status.textContent='Não foi possível processar esta solicitação. Recarregue a página e tente novamente.';return;}
    const validity=fields.map(validateField);const first=validity.indexOf(false);
    if(first!==-1){named(fields[first]).focus();status.textContent='Revise os campos indicados antes de continuar.';return;}
    const data=Object.fromEntries(['name','company','contact','product','quantity','location'].map(name=>[name,named(name).value.trim()]));
    const summary=`Olá! Gostaria de solicitar um orçamento à FFL Lubrificantes.\n\nNome: ${data.name}\nEmpresa: ${data.company}\nContato para retorno: ${data.contact}\nProduto ou aplicação: ${data.product}\nQuantidade estimada: ${data.quantity||'Não informada'}\nCidade / UF: ${data.location}\n\nAguardo a confirmação de disponibilidade e condições.`;
    const endpoint=form.dataset.endpoint;
    if(!endpoint){
      document.querySelector('#quote-summary').value=summary;
      const wa=document.querySelector('#send-whatsapp');if(wa)wa.href=`https://wa.me/${wa.dataset.number}?text=${encodeURIComponent(summary)}`;
      result.hidden=false;document.querySelector('#result-title').focus();status.textContent='Solicitação preparada. Nenhum dado foi enviado à FFL.';return;
    }
    busy=true;submit.disabled=true;submit.setAttribute('aria-busy','true');status.textContent='Enviando sua solicitação…';
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
    try{
      const netlify=form.dataset.formMode==='netlify';
      const response=await fetch(endpoint,netlify
        ?{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({'form-name':form.getAttribute('name'),...data,website:'',source:'ffl-site'}).toString(),signal:controller.signal}
        :{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,website:'',source:'ffl-site'}),signal:controller.signal});
      if(!response.ok)throw new Error('not_accepted');
      if(netlify){
        const receipt=await response.text();
        if(!receipt.includes('data-form-receipt="orcamento"'))throw new Error('not_accepted');
      }else{
        const accepted=await response.json().catch(()=>null);
        if(accepted?.accepted!==true)throw new Error('not_accepted');
      }
      status.textContent='Sua solicitação foi recebida. Aguarde o retorno pelo contato informado.';
      track('quote_accepted',formMetadata);form.reset();
      if(currentProduct===oil68.id)named('product').value=oil68.name;
    }catch(error){status.textContent=error.name==='AbortError'?'Não foi possível confirmar o recebimento no tempo esperado. Confira com o atendimento antes de reenviar.':'O recebimento não foi confirmado. Seus dados foram mantidos; tente novamente mais tarde.';}
    finally{clearTimeout(timeout);busy=false;submit.disabled=false;submit.removeAttribute('aria-busy');}
  });
  document.querySelector('#copy-quote').addEventListener('click',async()=>{
    const summary=document.querySelector('#quote-summary');const copyStatus=document.querySelector('#copy-status');
    try{await navigator.clipboard.writeText(summary.value);copyStatus.textContent='Solicitação copiada. Ela ainda não foi enviada à FFL.';}
    catch{summary.focus();summary.select();copyStatus.textContent='Selecione e copie o texto acima. O acesso automático à área de transferência não está disponível.';}
  });
}
