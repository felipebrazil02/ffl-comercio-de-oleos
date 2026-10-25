import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {parseFrontmatter} from '../src/markdown.mjs';

const audit = JSON.parse(await fs.readFile('editorial/revisao-tecnica-restante-20261013.json', 'utf8'));
const checks = {
  'analise-de-oleo-em-tendencia': ['limites aplicáveis', 'Ferro baixo não exclui'],
  'base-da-graxa-litio-calcio-complexo': ['Não equivale à temperatura máxima', 'Ter o mesmo espessante não garante'],
  'compatibilidade-com-vedacoes-e-tintas': ['Nem toda ficha técnica contém', 'produto atual e o candidato'],
  'ensaio-de-quatro-esferas': ['ASTM D4172', 'ASTM D2266', 'ASTM D2783', 'ASTM D2596', 'índice carga-desgaste'],
  'indice-de-viscosidade': ['Valores acima de 100', 'não extrapole apenas o IV'],
  'iso-4406-codigo-de-contaminacao': ['4 µm(c)', '6 µm(c)', '14 µm(c)', 'contagens são cumulativas', '79716.html'],
  'ponto-de-fluidez-e-ponto-de-nevoa': ['Não é simplesmente a temperatura', 'requisitos de transparência'],
  'din-51524-hl-hlp-hvlp': ['não uma receita única', 'não é necessariamente uma aprovação'],
  'oleo-de-corte-integral-ou-emulsionavel': ['Não há concentração universal', 'pH não substitui avaliação microbiológica'],
  'oleo-para-compressor-de-parafuso': ['Viscosidade e desempenho são essenciais', 'Não complete com outro produto sem confirmação'],
  'como-ler-um-grau-iso-vg': ['valor nominal central', 'SAE J306', '8774.html', 'deixa intervalos'],
  'nlgi-consistencia-de-graxas': ['Mesmo espessantes iguais não garantem', 'Bombeabilidade não pode ser deduzida'],
  'ficha-tecnica-e-ficha-de-seguranca': ['aprovações e documentos continuam vigentes'],
  'informacoes-para-cotar-lubrificante': ['não é, por si, uma autorização de substituição'],
};
assert.equal(audit.artigos.length, 14);
assert.equal(new Set(audit.artigos.map(x => x.slug)).size, 14);
for (const {slug} of audit.artigos) {
  const source = await fs.readFile('content/blog/' + slug + '.md', 'utf8');
  const html = await fs.readFile('dist/conteudos/' + slug + '/index.html', 'utf8');
  const {meta}=parseFrontmatter(source);
  assert.match(meta.updated, /^\d{4}-\d{2}-\d{2}$/, `${slug}: data de atualização válida`);
  assert.ok(meta.updated >= '2026-10-13', `${slug}: preservar a revisão e aceitar atualizações posteriores`);
  assert.ok(html.includes(`datetime="${meta.updated}"`), `${slug}: data publicada coerente com a fonte`);
  assert.ok(html.includes('Revisão técnica — 13/10/2026'), slug);
  const indexable = /^indexable: true$/m.test(source);
  assert.ok(html.includes('name="robots" content="' + (indexable ? 'index, follow' : 'noindex, nofollow') + '"'), slug);
  assert.ok((source.match(/^source:/gm) || []).length >= 1, slug);
  for (const text of checks[slug]) assert.ok(html.includes(text), slug + ': falta ' + text);
}
console.log('14 artigos restantes: fontes, correções, datas e indexação verificadas.');
