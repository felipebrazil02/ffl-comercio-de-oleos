import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

// A ficha é interna. O caminho do PDF é opcional para conferir o hash no ambiente
// que possui o original: node scripts/test-hs-aw-sheet.mjs --pdf "C:/...pdf".
// Validação da publicação: npm run test:sheet -- --base https://host
const args = process.argv.slice(2);
const getArg = name => args.includes(name) ? args[args.indexOf(name) + 1] : null;
const base = getArg('--base')?.replace(/\/$/, '');
const source = JSON.parse(await fs.readFile('data/technical-sources/hs-aw-004-20150610.json', 'utf8'));
const company = JSON.parse(await fs.readFile('data/company.json', 'utf8'));
const products = ['oleo-hidraulico-68', 'oleo-hidraulico-aw-68-220'].map(slug => company.products.find(p => p.slug === slug));
const esc = text => String(text).replaceAll('>', '&gt;').replaceAll('<', '&lt;');
const num = value => value.toLocaleString('pt-BR', {maximumFractionDigits: 1});
async function read(route) {
  if (!base) return fs.readFile(`dist${route}index.html`, 'utf8');
  const response = await fetch(base + route, {redirect: 'manual'});
  assert.equal(response.status, 200, route);
  return response.text();
}
assert.equal(source.revisionDate, '2015-06-10');
assert.equal(source.revision, '004');
assert.equal(source.ownerConfirmation.validForSuppliedProduct, true);
if (getArg('--pdf')) {
  const file = await fs.readFile(getArg('--pdf'));
  assert.equal(crypto.createHash('sha256').update(file).digest('hex').toUpperCase(), source.sha256, 'Documento original não corresponde à fonte conferida');
}
const htmlBySlug = new Map();
for (const p of products) {
  assert.equal(p.sourceDocument, source.id);
  const html = await read(`/lubrificantes-industriais/${p.category}/${p.slug}/`);
  htmlBySlug.set(p.slug, html);
  for (const text of ['ISO VG 68', 'ISO-HM', 'DIN 51524 parte 2 H-LP', 'revisão 004 de 10/06/2015', 'não é uma homologação', 'versão ofertada']) assert.ok(html.includes(text), `${p.slug}: ${text}`);
  for (const stale of ['O texto não identifica expressamente os números como graus ISO.', 'O cadastro não explicita a classificação ISO desses números', 'Confirme a classificação ISO VG na ficha técnica antes da compra.']) assert.ok(!html.includes(stale), `${p.slug}: ressalva superada`);
  for (const privateText of [source.filename, source.sha256, source.id, '4023-6339', 'ISO 9001:2008']) assert.ok(!html.includes(privateText), `${p.slug}: dado interno ou selo do fornecedor exposto`);
  assert.ok(!html.includes('Min-6'), `${p.slug}: ponto de fluidez ambíguo não deve virar limite público`);
}
const oil68 = products[0];
const rows = new Map(oil68.specRows);
assert.equal(rows.get('Graus publicados'), 'ISO VG 68');
assert.equal(rows.get('Viscosidade a 40 °C — ASTM D445'), '61,2 a 74,8 cSt');
assert.equal(rows.get('Viscosidade a 100 °C — ASTM D445'), 'Mínimo 6,5 cSt');
assert.equal(rows.get('Índice de viscosidade — ASTM D2270'), 'Maior que 80');
assert.equal(rows.get('Ponto de fulgor, vaso aberto — ASTM D92'), 'Maior que 170 °C');
assert.equal(rows.get('Corrosividade ao cobre — ASTM D130'), '1A, após 3 h a 100 °C');
const oilHtml = htmlBySlug.get(oil68.slug);
for (const [label, value] of oil68.specRows) assert.ok(oilHtml.includes(`<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`), `Dados 68 ausentes: ${label}`);
assert.ok(oilHtml.includes('O ponto de fulgor não define a temperatura máxima de trabalho'));
const family = products[1];
const table = family.technicalTable;
assert.deepEqual(table.columns, ['Propriedade e método', 'ISO VG 68', 'ISO VG 100', 'ISO VG 150', 'ISO VG 220']);
for (const [index, grade] of Object.keys(source.grades).entries()) {
  const data = source.grades[grade];
  assert.equal(table.rows[0][index + 1], `${num(data.kinematic40C.min)} a ${num(data.kinematic40C.max)}`, `Coluna ${grade}: faixa a 40 °C`);
  assert.equal(table.rows[1][index + 1], `Mínimo ${data.kinematic100C.min.toLocaleString('pt-BR', {minimumFractionDigits: 1})}`, `Coluna ${grade}: mínimo a 100 °C`);
  assert.equal(table.rows[2][index + 1], 'Maior que 80', `Coluna ${grade}: IV`);
}
const familyHtml = htmlBySlug.get(family.slug);
assert.ok(familyHtml.includes('class="product-table-scroll" role="region"') && familyHtml.includes('tabindex="0"'));
assert.equal([...familyHtml.matchAll(/<th scope="col">/g)].length, 5);
for (const row of table.rows) for (const value of row) assert.ok(familyHtml.includes(esc(value)));
const category = await read('/lubrificantes-industriais/oleos-hidraulicos/');
assert.ok(category.includes('não se estende automaticamente à família 10, 22, 32 e 46'));
const lowerGrades = company.products.find(p => p.slug === 'oleo-hidraulico-aw-10-46');
assert.equal(lowerGrades.sourceDocument, undefined, 'Não extrapolar a ficha para graus não contemplados');
const css = await fs.readFile('src/site.css', 'utf8');
assert.ok(css.includes('.product-layout>.article-body{min-width:0}') && css.includes('overflow-x:auto'));
for (const slug of ['como-ler-um-grau-iso-vg', 'din-51524-hl-hlp-hvlp', 'oleo-hidraulico-hm', 'troca-de-oleo-hidraulico']) {
  const html = await read(`/conteudos/${slug}/`);
  assert.ok(html.includes('10/06/2015') && html.includes('ISO VG 68') && html.includes('ISO-HM') && html.includes('DIN 51524 parte 2 H-LP'), `${slug}: ficha reconhecida`);
}
console.log(JSON.stringify({base: base || 'dist', sourceRevision: source.revision, sourceRevisionDate: source.revisionDate, ownerConfirmedValid: true, productPages: products.length, comparativeColumns: Object.keys(source.grades).length, supportingArticles: 4, errors: []}, null, 2));
