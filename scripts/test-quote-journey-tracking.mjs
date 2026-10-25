import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

// Both browser scripts run together with a local DOM/fetch simulation. This
// suite never loads Google, submits a real form or opens a WhatsApp URL.
const site=await fs.readFile('src/site.js','utf8');
const analytics=await fs.readFile('src/analytics.js','utf8');
const origin='https://ffllubrificantes.com.br';
const productPath='/lubrificantes-industriais/oleos-hidraulicos/oleo-hidraulico-68/';
const item='oleo-hidraulico-68';
const name='Óleo hidráulico 68 AW';
const article='como-ler-um-grau-iso-vg';
const quote=`/contato/?item=${item}&produto=${encodeURIComponent(name)}#orcamento`;
const clean=value=>JSON.parse(JSON.stringify(value));

function element(extra={}){
  const handlers=new Map();
  return {value:'',textContent:'',hidden:true,dataset:{},attributes:{},...extra,
    addEventListener(type,handler){handlers.set(type,[...(handlers.get(type)||[]),handler]);},
    dispatchEvent(event){
      for(const handler of handlers.get(event.type)||[])handler({...event,target:event.target||this});
      if(event.bubbles&&this.parent)this.parent.dispatchEvent({...event,target:event.target||this});
      return true;
    },
    async fire(type,event={}){for(const handler of handlers.get(type)||[])await handler({type,target:this,...event});},
    setAttribute(key,value){this.attributes[key]=value;},
    removeAttribute(key){delete this.attributes[key];},
    getAttribute(key){return this.attributes[key]??null;},
    focus(){},select(){},closest(){return null;}
  };
}
function anchor(href,dataset={},ancestors=[]){
  const node=element({dataset,attributes:{href}});
  node.closest=selector=>ancestors.includes(selector)?{}:null;
  return node;
}
function boot({url=origin+productPath,consent='granted',links=[],withForm=false,endpoint='/obrigado/',response={},hold=false,model=false}={}){
  const current=new URL(url),scripts=[],nodes=[],requests=[],rawEvents=[],store=new Map(consent?[['ffl-analytics-consent-v1',consent]]:[]);
  const ids=Object.fromEntries(['form-status','quote-result','copy-quote','quote-summary','result-title','copy-status','quote-product-context','quote-product-name','quote-heading',...['name','company','contact','product','location'].map(field=>field+'-error')].map(id=>[id,element()]));
  ids['quote-heading'].textContent='Descreva sua necessidade';
  const fields=Object.fromEntries(Object.entries({name:'Pessoa privada',company:'Empresa privada',contact:'private@example.invalid',product:'Produto de consulta privada',quantity:'20 L',location:'Salto / SP',website:''}).map(([field,value])=>[field,element({name:field,value})]));
  const submit=element();let resets=0,release,tool;
  const form=element({dataset:{endpoint,formMode:'netlify'},elements:{namedItem:field=>fields[field]},querySelector:()=>submit,attributes:{name:'orcamento'},reset(){resets++;for(const field of Object.values(fields))field.value='';}});
  for(const field of Object.values(fields))field.parent=form;
  const sendWhatsApp=anchor('https://wa.me/5511915011527');sendWhatsApp.dataset.number='5511915011527';ids['send-whatsapp']=sendWhatsApp;
  const allLinks=withForm?[...links,sendWhatsApp]:links;
  const buttons=['granted','denied'].map(value=>element({dataset:{consent:value}}));
  const document={
    referrer:origin+'/conteudos/'+article+'/?contact=private@example.invalid#private',cookie:'',
    head:{append:node=>scripts.push(node)},body:{append:node=>nodes.push(node)},
    modelContext:model?{registerTool(candidate){tool=candidate;}}:null,
    querySelector(selector){if(selector==='#quote-form')return withForm?form:null;return ids[selector.slice(1)]||null;},
    querySelectorAll(selector){if(selector==='a[href]')return allLinks;return [];},
    getElementById:id=>ids[id],addEventListener(){},
    createElement(){return element({querySelectorAll:()=>buttons,querySelector:()=>buttons[0]});}
  };
  const window=element(),eventWindow=element();window.addEventListener=eventWindow.addEventListener;window.dispatchEvent=event=>{rawEvents.push(event);return eventWindow.dispatchEvent(event);};
  const location={hostname:current.hostname,origin:current.origin,href:current.href,pathname:current.pathname,search:current.search,reload(){}};
  const ctx=vm.createContext({document,window,location,URL,URLSearchParams,AbortController,
    localStorage:{getItem:key=>store.get(key),setItem:(key,value)=>store.set(key,value)},
    CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},
    Event:class{constructor(type,options){this.type=type;Object.assign(this,options);}},
    navigator:{clipboard:{writeText:async()=>{}}},setTimeout:()=>1,clearTimeout(){},
    fetch:async(url,options)=>{
      requests.push({url,...options});
      if(hold)await new Promise(resolve=>{release=resolve;});
      if(response.abort)throw Object.assign(new Error('abort'),{name:'AbortError'});
      if(response.network)throw new Error('network');
      return {ok:response.ok??true,text:async()=>response.body??'<section data-form-receipt="orcamento">',json:async()=>({accepted:true})};
    }
  });
  vm.runInContext(site,ctx);vm.runInContext(analytics,ctx);
  return {ids,fields,form,submit,scripts,nodes,requests,rawEvents,buttons,tool,
    events:()=>Array.from(window.dataLayer).filter(args=>args[0]==='event'),data:()=>JSON.stringify(window.dataLayer),
    resets:()=>resets,release:()=>release(),submitForm:()=>form.fire('submit',{preventDefault(){}})};
}

const productLink=anchor(productPath,{},['.article-body']);
const quoteLink=anchor(quote,{productId:item,ctaPosition:'article_sidebar'});
const whatsappLink=anchor('https://wa.me/5511915011527?text=private@example.invalid',{productId:item,ctaPosition:'article_body'});
const articleVisit=boot({url:origin+'/conteudos/'+article+'/',links:[productLink,quoteLink,whatsappLink]});
for(const link of [productLink,quoteLink,whatsappLink])await link.fire('click');
assert.deepEqual(articleVisit.events().map(args=>args[1]),['product_link_click','quote_cta_click','whatsapp_click']);
assert.deepEqual(clean(articleVisit.events()[0][2]),{page_location:origin+'/conteudos/'+article+'/',product_slug:item,cta_position:'article_body',article_slug:article});
assert.equal(articleVisit.events().filter(args=>args[1]==='generate_lead').length,0,'Clicks are not leads');
assert.ok(!articleVisit.data().includes('private'),'Never measure link text, query, hash or message');

const dinLink=anchor(productPath,{},['.article-catalog']);
const din=boot({url:origin+'/conteudos/din-51524-hl-hlp-hvlp/',links:[dinLink]});await dinLink.fire('click');
assert.equal(din.events()[0][2].article_slug,'din-51524-hl-hlp-hvlp');assert.equal(din.events()[0][2].cta_position,'article_related');

const badLink=anchor('/contato/?item=private&produto=private#orcamento',{productId:'private',ctaPosition:'private'});
const bad=boot({url:origin+'/conteudos/private/',links:[badLink],withForm:true});await badLink.fire('click');
assert.equal(bad.events().length,0);assert.equal(bad.ids['quote-product-context'].hidden,true);assert.equal(bad.ids['quote-heading'].textContent,'Descreva sua necessidade');
const unknownPosition=anchor(quote,{ctaPosition:'private'}),external=anchor('https://example.invalid'+productPath,{productId:item,ctaPosition:'header'});
const sanitised=boot({url:origin+'/conteudos/private/',links:[unknownPosition,external]});await unknownPosition.fire('click');await external.fire('click');
assert.equal(sanitised.events().length,1);assert.equal(sanitised.events()[0][2].product_slug,item);assert.equal(sanitised.events()[0][2].cta_position,undefined);assert.equal(sanitised.events()[0][2].article_slug,undefined);

const formUrl=origin+`/contato/?item=${item}&produto=${encodeURIComponent('private@example.invalid <b>private</b>')}#private`;
const targeted=boot({url:formUrl,withForm:true,model:true});
assert.equal(targeted.fields.product.value,'private@example.invalid <b>private</b>','Preserve the ordinary text prefill');
assert.equal(targeted.ids['quote-product-name'].textContent,name,'Context uses the catalog name, never query HTML');assert.equal(targeted.ids['quote-product-context'].hidden,false);
assert.equal(targeted.ids['quote-heading'].textContent,'Orçamento de óleo hidráulico 68 AW');assert.equal(targeted.events().length,0,'Prefill is not a form start');
targeted.tool.execute({product:'private application',quantity:'20 L'});assert.equal(targeted.events().length,0,'Programmatic filling is not a form start');
await targeted.form.fire('input',{isTrusted:false,target:targeted.fields.product});
await targeted.form.fire('input',{isTrusted:true,target:targeted.fields.website});
assert.equal(targeted.events().length,0,'Ignore scripts and honeypot');
await targeted.form.fire('input',{isTrusted:true,target:targeted.fields.name});await targeted.form.fire('input',{isTrusted:true,target:targeted.fields.company});
assert.deepEqual(targeted.events().map(args=>args[1]),['quote_form_start'],'Only one human form start per page');
await targeted.submitForm();assert.equal(targeted.resets(),1);assert.equal(targeted.requests.length,1);
assert.equal(targeted.fields.product.value,name,'Keep the fixed product consistent with the visible context after reset');
for(const field of ['name','company','contact','quantity','location','website'])assert.equal(targeted.fields[field].value,'',`Do not restore ${field} after success`);
const lead=targeted.events().filter(args=>args[1]==='generate_lead');assert.equal(lead.length,1);assert.deepEqual(clean(lead[0][2]),{page_location:origin+'/contato/',contact_method:'form',product_slug:item,form_id:'orcamento'});
assert.ok(!targeted.data().includes('private'),'Do not measure form values or session query');

for(const response of [{ok:false},{body:'<html>ordinary fallback</html>'},{network:true},{abort:true}]){
  const rejected=boot({url:origin+quote,withForm:true,response});await rejected.submitForm();
  assert.equal(rejected.events().filter(args=>args[1]==='generate_lead').length,0);assert.equal(rejected.resets(),0);assert.equal(rejected.submit.disabled,false);
}
const invalid=boot({url:origin+quote,withForm:true});invalid.fields.name.value='';await invalid.submitForm();assert.equal(invalid.requests.length,0);assert.equal(invalid.events().length,0);
const fallback=boot({url:origin+quote,withForm:true,endpoint:''});await fallback.submitForm();assert.equal(fallback.requests.length,0);assert.equal(fallback.events().length,0);assert.equal(fallback.ids['quote-result'].hidden,false);
const duplicate=boot({url:origin+quote,withForm:true,hold:true});const first=duplicate.submitForm();await duplicate.submitForm();assert.equal(duplicate.requests.length,1,'Busy guard prevents duplicate requests');duplicate.release();await first;assert.equal(duplicate.events().filter(args=>args[1]==='generate_lead').length,1);

for(const options of [{consent:null},{consent:'denied'},{url:'https://preview.netlify.app'+quote}]){
  const localQuote=anchor(quote,{productId:item,ctaPosition:'product_top'});
  const unmeasured=boot({url:origin+quote,withForm:true,links:[localQuote],...options});
  await localQuote.fire('click');await unmeasured.form.fire('input',{isTrusted:true,target:unmeasured.fields.name});await unmeasured.submitForm();
  assert.equal(unmeasured.scripts.length,0);assert.equal(unmeasured.events().length,0);assert.equal(unmeasured.data(),'[]','Do not queue raw or retroactive events without consent');assert.equal(unmeasured.resets(),1,'Consent does not block the form');
}
const thanks=boot({url:origin+'/obrigado/'});assert.equal(thanks.events().length,0,'A visit to the receipt URL is not a lead');
console.log('Jornada de orçamento: cliques, contexto seguro, início humano, consentimento, aceite real, falhas e duplicidade aprovados sem acesso externo.');
