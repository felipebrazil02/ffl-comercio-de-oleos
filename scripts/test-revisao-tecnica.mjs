import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const cases = [
  ['concentracao-e-ph-do-fluido-de-corte', ['leitura em Brix × fator do produto', 'soluções de sacarose em água', 'não substitui o teste microbiológico'], ['leitura bruta dividida', 'calibrada para emulsões à base de óleo mineral', 'Vinte e oito dias de registros dizem']],
  ['demulsibilidade-e-formacao-de-espuma', ['ASTM D3427', '0,2% em volume', '24 °C e 93,5 °C'], ['três sequências conduzidas a temperaturas diferentes', 'a espuma descreve o quanto o óleo retém ar']],
  ['armazenamento-de-lubrificantes', ['reduzir partículas', 'não substitui cobertura', 'não autoriza usar produto vencido'], ['Nenhuma etapa posterior devolve a limpeza', 'nenhum filtro compensa']],
];
for (const [slug, expected, removed] of cases) {
  const html = await fs.readFile(`dist/conteudos/${slug}/index.html`, 'utf8');
  for (const text of expected) assert.ok(html.includes(text), `${slug}: falta ${text}`);
  for (const text of removed) assert.ok(!html.includes(text), `${slug}: regressão ${text}`);
  assert.ok(html.includes('Correção técnica em 13/10/2026'));
  assert.ok(html.includes('name="robots" content="index, follow"'));
}
console.log('3 artigos: correções técnicas, avisos e indexação verificados.');
