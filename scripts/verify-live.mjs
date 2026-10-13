import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = process.argv[2];
assert.ok(base?.startsWith('https://'), 'Informe a origem HTTPS');
const routes = JSON.parse(await fs.readFile('outputs/rotas.json', 'utf8'));
let checked = 0;
for (let i = 0; i < routes.length; i += 6) {
  await Promise.all(routes.slice(i, i + 6).map(async route => {
    const response = await fetch(base + route.url);
    const html = await response.text();
    const file = route.url === '/404.html' ? '404.html' : route.url.replace(/^\//, '') + 'index.html';
    const local = await fs.readFile('dist/' + file, 'utf8');
    assert.equal(response.status, 200, route.url);
    // Netlify injeta atributos de formularios; compare o texto corrigido e metadados.
    const texts = value => [...value.matchAll(/<(title|h1|h2|h3|p)\b[^>]*>([\s\S]*?)<\/\1>/g)].map(m => m[2]);
    assert.deepEqual(texts(html), texts(local), route.url + ': texto diverge do build');
    assert.ok(html.includes(`name="robots" content="${route.noindex ? 'noindex, nofollow' : 'index, follow'}"`), route.url);
    if (!base.includes('--')) {
      assert.equal((response.headers.get('x-robots-tag') || '').includes('noindex'), route.noindex, route.url + ': header');
    }
    checked++;
  }));
}
for (const name of ['sitemap.xml', 'robots.txt']) {
  const response = await fetch(base + '/' + name);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), await fs.readFile('dist/' + name, 'utf8'), name);
}
assert.equal((await fetch(base + '/revisao-portugues-rota-inexistente/')).status, 404);
assert.equal((await fetch(base + '/index.html', {redirect: 'manual'})).status, 301);
console.log(JSON.stringify({base, checked, errors: [], checkedAt: new Date().toISOString()}, null, 2));
