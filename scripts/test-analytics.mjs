import vm from 'node:vm';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const source=await fs.readFile('src/analytics.js','utf8');
function boot(saved,host='ffllubrificantes.com.br'){
  const handlers={},scripts=[],nodes=[],store=new Map(saved?[['ffl-analytics-consent-v1',saved]]:[]);
  const buttons=['granted','denied'].map(consent=>({dataset:{consent},addEventListener(_,fn){this.click=fn},focus(){}}));
  const document={referrer:'https://www.google.com/search?q=private',cookie:'',head:{append(node){scripts.push(node)}},body:{append(node){nodes.push(node)}},querySelector(){return null},querySelectorAll(){return []},createElement(){return {setAttribute(){},querySelectorAll(){return buttons},querySelector(){return buttons[0]},addEventListener(_,fn){this.click=fn}}}};
  const window={addEventListener(name,fn){handlers[name]=fn}};
  vm.runInNewContext(source,{window,document,location:{hostname:host,href:'https://'+host+'/contato/?produto=private#private',reload(){}},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},URL,Date,CustomEvent:class {}});
  const send=event=>handlers['ffl:analytics']({detail:{event,name:'DO NOT SEND',contact:'private@example.com'}});
  return {window,scripts,nodes,buttons,send};
}
const fresh=boot();assert.equal(fresh.scripts.length,0);fresh.send('quote_accepted');assert.equal(fresh.window.dataLayer.length,0);
fresh.buttons[1].click();assert.equal(fresh.scripts.length,0);
fresh.buttons[0].click();assert.equal(fresh.scripts.length,1);
fresh.buttons[0].click();assert.equal(fresh.scripts.length,1);
fresh.send('quote_accepted');fresh.send('whatsapp_click');fresh.send('unknown');
const events=fresh.window.dataLayer.filter(args=>args[0]==='event');
assert.deepEqual(Array.from(events,x=>x[1]),['generate_lead','whatsapp_click']);
assert.ok(!JSON.stringify(fresh.window.dataLayer).includes('private'));
assert.equal(boot('denied').scripts.length,0);assert.equal(boot('granted').scripts.length,1);
assert.equal(boot('granted','preview.netlify.app').scripts.length,0);
console.log('Analytics: consentimento, recusa, persistência, domínio, eventos e ausência de PII aprovados.');
