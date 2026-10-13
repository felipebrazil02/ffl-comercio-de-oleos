import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

// Regressões linguísticas identificadas na revisão de 2026-10-13.
// Não substitui a revisão humana dos próximos artigos.
const cases = [
  ['index.html', 'De que sua operação precisa?', 'O que sua operação precisa?'],
  ['index.html', 'Óleo-base, pacote de aditivos', 'Óleo base, pacote de aditivos'],
  ['contato/index.html', 'Descreva sua necessidade', 'Conte sua necessidade'],
  ['lubrificantes-industriais/oleos-hidraulicos/oleo-hidraulico-aw-68-220/index.html', 'Aplicação principal declarada: sistemas hidráulicos e circulatórios.', 'A aplicação principal declarada é sistemas'],
  ['conteudos/analise-de-oleo-em-tendencia/index.html', 'costumam aparecer juntos.', 'costumam aparecer junto.'],
  ['conteudos/compatibilidade-com-vedacoes-e-tintas/index.html', 'pode resultar em problemas:', 'desfecha em problema'],
  ['conteudos/iso-4406-codigo-de-contaminacao/index.html', 'cerca do dobro', 'cerca de o dobro'],
  ['conteudos/din-51524-hl-hlp-hvlp/index.html', 'o produto declara atender.', 'o produto efetivamente se declara.'],
];
for (const [file, expected, obsolete] of cases) {
  const html = await fs.readFile(`dist/${file}`, 'utf8');
  assert.ok(html.includes(expected), `${file}: correção ausente`);
  assert.ok(!html.includes(obsolete), `${file}: texto anterior reapareceu`);
}
console.log(`${cases.length} verificações de regressão linguística aprovadas.`);
