import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const code=await fs.readFile('src/site.js','utf8');
async function run({mode='netlify',ok=true,body='<section data-form-receipt="orcamento">',json={accepted:true},invalid=false,network=false}={}){
  const make=()=>({value:'',textContent:'',hidden:true,attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v;},removeAttribute(k){delete this.attributes[k];},focus(){}});
  const ids=Object.fromEntries(['form-status','quote-result','copy-quote','quote-summary','result-title','copy-status',...['name','company','contact','product','location'].map(n=>n+'-error')].map(n=>[n,make()]));
  const fields=Object.fromEntries(Object.entries({name:invalid?'':'Teste técnico',company:'Validação FFL',contact:'qa@example.invalid',product:'Verificação técnica sem cotação',quantity:'',location:'Salto / SP',website:''}).map(([k,value])=>[k,{...make(),value}]));
  const submit=make(); let handle,request,resets=0;
  const form={dataset:{endpoint:'/obrigado/',formMode:mode},elements:{namedItem:n=>fields[n]},querySelector:()=>submit,getAttribute:()=> 'orcamento',addEventListener:(type,fn)=>{if(type==='submit')handle=fn;},reset:()=>{resets++;}};
  const document={querySelector:s=>s==='#quote-form'?form:ids[s.slice(1)]||null,querySelectorAll:()=>[],getElementById:id=>ids[id],addEventListener(){},modelContext:null};
  const events=[];
  vm.runInNewContext(code,{document,window:{dispatchEvent:e=>events.push(e),dataLayer:[],addEventListener(){}},location:{search:'',pathname:'/contato/'},URLSearchParams,AbortController,CustomEvent:class {constructor(type,options){this.type=type;this.detail=options.detail;}},setTimeout:()=>1,clearTimeout(){},fetch:async(url,options)=>{request={url,...options};if(network)throw new Error('network');return {ok,text:async()=>body,json:async()=>json};}});
  await handle({preventDefault(){}});
  return {message:ids['form-status'].textContent,request,resets,events,submit};
}
const success=await run();assert.match(success.message,/recebida/);assert.equal(success.resets,1);assert.match(success.request.body,/form-name=orcamento/);assert.equal(success.request.headers['Content-Type'],'application/x-www-form-urlencoded');assert.equal(success.events.length,1);
for(const options of [{ok:false},{body:'<html>404 fallback</html>'},{network:true},{mode:'api',json:{accepted:false}}]){const r=await run(options);assert.match(r.message,/não foi confirmado/);assert.equal(r.resets,0);assert.equal(r.events.length,0);assert.equal(r.submit.disabled,false);}
assert.match((await run({mode:'api'})).message,/recebida/);
const invalid=await run({invalid:true});assert.equal(invalid.request,undefined);assert.match(invalid.message,/Revise/);
console.log('7 cenários de formulário aprovados: Netlify, API, HTTP, fallback, rede, rejeição e validação.');
