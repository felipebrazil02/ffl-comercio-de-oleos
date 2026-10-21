// Orientações de consulta, sem criar equivalências, homologações ou dados de ensaio.
// Fatos de produto conferidos nas fontes internas do cadastro em 2026-10-19.
import {productSearchContent} from './product-search-content.mjs';

export const productConsultation = {
  'oleo-hidraulico-aw-10-46': [
    ['Como comparar 32 e 46 na cotação?', 'Envie o grau exigido no manual e a identificação do óleo em uso. A lista 10, 22, 32 e 46 apresenta opções do cadastro, não uma autorização para substituir um grau por outro.'],
    ['O que confirmar sobre as especificações?', 'Solicite a ficha técnica da versão ofertada. A relação publicada reúne códigos e nomes de fabricantes, mas não apresenta certificados de aprovação de cada equipamento. A referência DIN deve ser conferida no documento atualizado antes de afirmar equivalência.']
  ],
  'oleo-hidraulico-aw-68-220': [
    ['Como informar o grau desejado?', 'A ficha técnica da linha HS AW, revisão 004 de 10/06/2015, identifica ISO VG 68, 100, 150 e 220. Informe qual desses graus e qual especificação o manual exige. A tabela compara as faixas de viscosidade publicadas; ela não autoriza substituir um grau por outro.'],
    ['Quais dados ajudam a avaliar a aplicação?', 'Informe modelo do equipamento, requisito do manual, condições de operação e óleo atual. Não escolha esta linha apenas porque o número da denominação é maior que o de outra linha hidráulica.']
  ],
  'oleo-ep-para-redutores-150-680': [
    ['O que informar sobre o redutor?', 'Envie fabricante, modelo, especificação do manual e grau solicitado. As opções publicadas são 150, 220, 320, 460 e 680; a seleção não deve partir somente do nome óleo EP.'],
    ['É equivalente a qualquer óleo para engrenagens?', 'Esta página não comprova equivalência com outro produto. Solicite a ficha técnica da opção cotada e confira os requisitos do equipamento antes de trocar ou completar o lubrificante.']
  ],
  'oleo-de-corte-emulsionavel': [
    ['Quais informações enviar sobre a usinagem?', 'Informe o metal e sua liga, a operação, a máquina e o fluido atual. A documentação exclui a aplicação em magnésio; não considere a descrição geral uma aprovação para qualquer material.'],
    ['Qual concentração devo usar?', 'O cadastro não publica uma faixa de diluição nem um fator de refratômetro. Solicite esses dados e as condições de preparo na documentação atual do produto; não use um percentual de outro fluido como referência automática.']
  ],
  'oleo-de-corte-integral-2020': [
    ['2020 indica a viscosidade?', 'Não: 2020 integra a denominação comercial. O cadastro não informa a viscosidade. Peça a ficha técnica e identifique a operação e o material antes de comparar com o integral 32.'],
    ['Como preparar a consulta?', 'Envie o nome do fluido utilizado, a liga usinada, a operação e os requisitos da máquina. Solicite confirmação de compatibilidade para a aplicação específica, sem presumir que descrições semelhantes tornam dois produtos intercambiáveis.']
  ],
  'oleo-de-corte-integral-32': [
    ['O número 32 confirma ISO VG 32?', 'O número está na denominação, mas a referência disponível não explicita essa classificação. Confirme viscosidade e classificação na ficha técnica da versão ofertada.'],
    ['Como comparar com o integral 2020?', 'Peça os documentos das duas opções e informe o processo. A descrição de aplicação, isoladamente, não permite afirmar qual oferece melhor resultado nem autoriza substituição.']
  ],
  'graxa-de-litio-ep': [
    ['EP1 confirma a consistência NLGI?', 'A denominação do cadastro não substitui a confirmação do grau NLGI: esse dado não está explicitado na referência disponível. Informe a consistência exigida pelo equipamento na consulta.'],
    ['Como avaliar a condição térmica?', 'Diferencie temperatura contínua de ocorrência de picos ao descrever o trabalho. Solicite os limites e as condições de uso na ficha técnica; um limite publicado não define sozinho o intervalo de relubrificação.']
  ],
  'graxa-de-calcio-para-chassis': [
    ['O que muda na versão vermelha?', 'O cadastro diferencia as versões pela cor, sem publicar uma diferença de desempenho. Informe a versão desejada e solicite a ficha técnica, em vez de selecionar apenas pela aparência.'],
    ['Quais dados enviar?', 'Identifique o ponto de aplicação, a temperatura de trabalho e a graxa atual. Confirme a consistência requerida: o número da denominação não é tratado aqui como comprovação de NLGI.']
  ],
  'graxa-grafitada': [
    ['Como escolher o teor de grafite?', 'Informe o ponto de aplicação e o requisito do equipamento ao consultar as opções de 5%, 10% e 25%. Maior teor não deve ser interpretado como melhor opção para todo uso.'],
    ['Ela é indicada para alta temperatura?', 'O cadastro não quantifica um limite térmico. Não use a presença de grafite como comprovação de aptidão para alta temperatura; solicite limites de operação e consistência na documentação atual.']
  ]
};

// As páginas comerciais prioritárias combinam dúvidas de busca e de aplicação.
// Preserva as orientações específicas já revisadas, como diluição e refratômetro.
for (const [slug, content] of Object.entries(productSearchContent)) {
  productConsultation[slug] = [...content.questions, ...(productConsultation[slug] || [])];
}
