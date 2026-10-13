---
title: "ISO 4406: como ler o código de contaminação de um óleo"
description: O que os três números do código ISO 4406 contam, como se relacionam com a limpeza exigida pelo equipamento e por que medir não é o mesmo que filtrar.
eyebrow: CONTAMINAÇÃO
summary: Três números que descrevem partículas em três faixas de tamanho — e o que eles não dizem.
published: 2026-10-13
tags: contaminação, fundamentos
source: ISO 4406 — nível de contaminação por partículas sólidas | https://www.iso.org/standard/71981.html
source: ISO 4407 — contagem de partículas por microscopia óptica | https://www.iso.org/standard/50325.html
consulted: 2026-10-13
indexable: true
---

O código ISO 4406 é uma forma padronizada de escrever quanta partícula sólida existe em uma amostra de óleo. Ele aparece como três números separados por barra, no formato `18/16/13`. Cada número descreve uma faixa de tamanho diferente, e é essa separação que dá utilidade ao código: um óleo pode estar limpo em partículas grandes e sujo em partículas pequenas, ou o contrário.

## O que os três números contam

O código clássico usa três faixas de tamanho: partículas maiores ou iguais a 4 µm, maiores ou iguais a 6 µm e maiores ou iguais a 14 µm. Os números são apresentados nessa ordem, sempre da menor para a maior faixa.

Isso significa que `18/16/13` não é uma contagem de partículas totais. É a leitura de três filtros diferentes aplicados ao mesmo volume de óleo:

- o primeiro número refere-se ao que é maior ou igual a 4 µm;
- o segundo, ao que é maior ou igual a 6 µm;
- o terceiro, ao que é maior ou igual a 14 µm.

Como toda partícula que passa pelo critério de 14 µm também é maior que 6 µm e maior que 4 µm, os números são naturalmente decrescentes ou iguais. Um código em que o último número é maior que o primeiro indica erro de leitura ou de digitação.

A leitura mais direta de um código como `18/16/13` é esta: existe mais partícula pequena do que partícula grande, o que é o esperado em qualquer sistema real. O que chama atenção em uma análise não é a relação entre os números, mas a comparação do conjunto com o histórico daquele mesmo ponto de coleta.

## Por que o número é um degrau, não uma contagem

Cada número do código é o expoente de uma escala logarítmica, não um número de partículas. O código ISO 4406 atribui degraus de 1 a 28 e mais, e cada degrau representa cerca de o dobro de partículas do degrau anterior.

Na prática, isso quer dizer que subir de 18 para 19 é aproximadamente dobrar a quantidade de partículas naquela faixa. Subir de 16 para 20 é um salto muito maior do que a diferença de quatro unidades sugere à primeira vista. Ler o código como se fosse uma contagem linear leva a conclusões erradas sobre a gravidade da mudança.

> **Escala logarítmica.** Cada degrau do código corresponde a cerca de o dobro de partículas. Uma diferença de dois números é uma diferença de aproximadamente quatro vezes, não de duas unidades.

É por isso que um laudo de análise deve ser lido em conjunto com o número anterior do mesmo ponto. "16/14/11" isolado não diz se o sistema piorou ou melhorou. A mesma leitura, comparada à amostra anterior daquele equipamento, diz.

## O que o código não vê

O código ISO 4406 descreve exclusivamente partículas sólidas contadas. Ele não informa:

- **Água.** Emulsão, água livre e umidade dissolvida têm ensaios próprios. Um óleo pode ter código baixo e ainda carregar água suficiente para comprometer lubrificação e acelerar corrosão.
- **Acidez e oxidação.** O número de acidez e a variação de viscosidade indicam degradação química, que a contagem de partículas não capta.
- **Aditivos.** O código não diz nada sobre o nível de aditivação nem sobre o consumo de aditivos ao longo da vida do óleo.
- **Metais de desgaste.** Partículas de desgaste detectadas por espectrometria descrevem outra dimensão do problema, ainda que todas as partículas contadas sejam, em parte, desgaste.

Além disso, o método de contagem altera o resultado. A contagem por microscopia óptica (ISO 4407) e os contadores automáticos de partículas não são intercambiáveis sem ressalva: os dois métodos tratam partículas próximas do limite de detecção de forma diferente. A amostragem também pesa — o ponto de coleta, a profundidade da coleta e o momento em que ela é feita mudam a leitura, mesmo em um sistema estável.

> **Método muda o número.** Antes de comparar dois laudos, confirme que ambos usaram o mesmo método de contagem e o mesmo ponto de amostragem. Comparar números obtidos de formas diferentes não é válido.

## Como usar no dia a dia

O número do código só ganha sentido quando confrontado com duas referências: o que o fabricante do equipamento exige e o histórico daquele componente.

O fabricante do componente define o código de limpeza aceitável para o sistema. Esse é o alvo. Um valor lido sem esse requisito não permite dizer se o óleo está adequado ou não, porque a exigência varia bastante entre um sistema hidráulico sensível e um redutor robusto. Sistemas hidráulicos costumam aparecer entre os mais sensíveis a partícula, o que explica por que a limpeza é tratada com tanto cuidado nessa família — vale conhecer os [óleos hidráulicos e suas aplicações](/lubrificantes-industriais/oleos-hidraulicos/).

O segundo pilar é a tendência. A leitura faz sentido quando comparada à amostra anterior do mesmo ponto. É essa comparação que revela piora ou estabilidade, e é exatamente o raciocínio de acompanhar o [laudo de análise em tendência](/conteudos/analise-de-oleo-em-tendencia/).

Por último, vale separar diagnóstico de solução. Medir não limpa nada. Atingir o código exigido depende de filtração, vedação do sistema e manuseio do lubrificante antes de ele chegar ao reservatório. Se o código piora a cada amostra, o problema costuma estar na entrada de contaminante — respiradouros, vedações, vedação de cilindros, abastecimento — e não na troca de óleo em si. Boa parte da contaminação entra antes do equipamento, no armazenamento e na transferência, tema tratado em [boas práticas de armazenamento de lubrificantes](/conteudos/armazenamento-de-lubrificantes/).

Um limite importante: o código não indica, sozinho, quando trocar o óleo. Ele é um dos dados. A decisão depende do conjunto dos ensaios, do requisito do fabricante e do histórico do equipamento.

## O próximo passo

Se você precisa atingir um código de limpeza exigido pelo seu equipamento, o caminho começa pela especificação. Informe o componente, o óleo em uso, o código de contaminação exigido pelo fabricante e a quantidade envolvida para [preparar sua solicitação](/contato/#orcamento).
