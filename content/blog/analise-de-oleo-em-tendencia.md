---
title: "Análise de óleo: como interpretar a tendência dos laudos"
description: Um resultado de análise de óleo ganha sentido quando comparado ao histórico do mesmo equipamento. Veja o que os ensaios mais comuns indicam.
eyebrow: MANUTENÇÃO
summary: O valor absoluto diz pouco; a variação ao longo do tempo é que orienta a decisão.
published: 2026-10-13
tags: ensaios, manutenção
source: ASTM D5185 — metais de desgaste e contaminantes por ICP | https://www.astm.org/d5185-18.html
source: ASTM D6304 — água em óleos por titulação Karl Fischer | https://www.astm.org/d6304-20.html
source: ISO 4406 — nível de contaminação por partículas sólidas | https://www.iso.org/standard/71981.html
consulted: 2026-10-13
indexable: true
---

Um laudo de análise de óleo não decide nada sozinho. Um número de ferro, de água ou de acidez só vira informação útil quando é comparado com as amostras anteriores **do mesmo equipamento**, coletadas no mesmo ponto. O que orienta a manutenção é a variação — a tendência —, não o valor destacado em uma única folha.

## Por que o valor isolado engana

Todo ensaio de análise de óleo devolve um número finito. O problema é que esse número não traz, embutido, a referência de comparação. Sem linha de base, o leitor fica diante de duas perguntas sem resposta: esse valor é normal para este equipamento, com este óleo, com este tempo de uso? E ele está subindo ou caindo em relação à última coleta?

Equipamentos diferentes, óleos diferentes e regimes de operação diferentes produzem faixas distintas. Um valor que chama atenção em uma prensa pode ser rotina em um redutor. Por isso a leitura útil não é "o ferro está em tal nível", e sim "o ferro subiu em relação às três últimas amostras, e na mesma taxa".

> **Tendência antes de limite.** Duas ou três amostras no mesmo ponto de coleta já permitem enxergar direção. Uma única amostra, sem histórico, serve para registrar uma condição inicial — não para concluir diagnóstico.

Há ainda uma dependência externa que o laudo não resolve: o **requisito do fabricante do equipamento**. É o manual que define o óleo especificado, os pontos de coleta e, quando aplicável, os critérios de condenação. O laboratório descreve a condição do fluido; ele não substitui essa referência.

## O que cada grupo de ensaios indica

Os ensaios de um laudo respondem a perguntas diferentes. Vale ler cada bloco pelo que ele indica — não pelo que ele "prova".

### Metais de desgaste

Ferro, cobre, chumbo, alumínio, cromo e estanho costumam aparecer juntos. Lidos em conjunto com o histórico, ajudam a apontar **qual componente** está contribuindo: cobre e chumbo, por exemplo, remetem a materiais de bronze, buchas ou mancais; ferro, a engrenagens, cilindros e superfícies de aço.

Existe um limite conhecido do método: a espectrometria de emissão, típica do ensaio de metais (ASTM D5185), enxerga bem **partículas pequenas**. Fragmento grande, lasca ou cavaco podem escapar da leitura. Um ferro baixo, portanto, não exclui desgaste severo — apenas indica que ele não está chegando ao laboratório em forma fina.

### Silício

Silício costuma indicar entrada de poeira pelo sistema, ou resíduo de vedação e de material de reparo. A leitura depende do contexto: em ambiente muito poeirento, um patamar estável pode ser esperado; um salto entre coletas aponta para entrada nova de contaminante.

### Viscosidade a 40 °C

É um dos ensaios mais informativos do laudo porque resume alterações de várias origens. Viscosidade **subindo** sugere oxidação, acúmulo de fuligem ou contaminação por um produto mais viscoso. Viscosidade **caindo** sugere diluição por combustível, solvente ou óleo mais leve. Nos dois casos, o que importa é a mudança em relação ao valor da mesma carga, não o número absoluto.

### Água

A água entra por condensação, por lavagem externa ou por vazamento em trocador de calor. O ensaio de referência é a titulação Karl Fischer (ASTM D6304); em campo, usam-se também métodos de triagem, mais rápidos e menos exatos. Água em excesso prejudica a lubrificação e acelera corrosão — e a capacidade do óleo de soltar essa água tem ensaio próprio, tratado em [demulsibilidade e formação de espuma](/conteudos/demulsibilidade-e-formacao-de-espuma/).

### Acidez e basicidade

O número de acidez e o número de basicidade mostram, respectivamente, o avanço da oxidação e o consumo da reserva alcalina. Ler os dois juntos conta melhor a história do que qualquer um deles isolado: um óleo pode manter a acidez controlada enquanto a reserva alcalina se esgota.

### Contagem de partículas

A contagem por faixas de tamanho, reportada no código ISO 4406, entra no mesmo laudo e responde a uma pergunta diferente das anteriores: quantas partículas sólidas circulam e quais são seus tamanhos. O código não fala de água, de acidez nem de aditivos — é um recorte específico, explicado em [como ler o código de contaminação ISO 4406](/conteudos/iso-4406-codigo-de-contaminacao/).

## A coleta decide a qualidade do laudo

Nenhum ensaio corrige uma amostra mal tirada. A prática segura é padronizar o procedimento e repeti-lo sempre do mesmo jeito:

1. Coletar no **mesmo ponto**, definido no manual ou na documentação do equipamento.
2. Manter a **mesma profundidade** e o mesmo momento do ciclo de operação.
3. Coletar com o sistema **em funcionamento**, quando o procedimento do fabricante permitir, para obter fluido em circulação.
4. Evitar o fundo do reservatório, onde se deposita sedimento, e a superfície, que concentra espuma e ar.
5. Identificar frasco, data, horas de operação do óleo e ponto de coleta. Sem esse registro, o histórico perde valor.

Amostra retirada do fundo ou de um ponto diferente a cada vez gera variação que não é do óleo — é do procedimento. E aí a leitura de tendência se desfaz, porque o que mudou não foi a máquina.

## Como usar o laudo na manutenção

O caminho prático é tratá-lo como **um dos insumos** do plano de manutenção, junto com a inspeção visual, o acompanhamento de vazamentos, a leitura do manual e o histórico de intervenções.

- Registre cada laudo na mesma planilha, por equipamento e por ponto, para que a série fique visível.
- Olhe primeiro a **direção** dos valores entre coletas e depois o quanto se afastaram do patamar anterior.
- Cruze sinais que apontam para a mesma causa: água em alta junto com viscosidade em queda e acidez subindo, por exemplo, indicam um problema, não três.
- Confira sempre se a conduta está de acordo com a especificação do produto, registrada na [ficha técnica e ficha de segurança](/conteudos/ficha-tecnica-e-ficha-de-seguranca/), e com o requisito do fabricante do equipamento.

> **Um número não é um diagnóstico.** O laudo descreve a condição do óleo no instante da coleta. Transformá-lo em conclusão sobre a máquina exige histórico, contexto de operação e a referência de quem fabricou o equipamento.

Quando o histórico não existe, o primeiro passo é construí-lo: coletar nas mesmas condições e registrar. É esse conjunto — e não a folha isolada — que sustenta a decisão de trocar o óleo, filtrar, investigar um componente ou apenas continuar monitorando.

## O próximo passo

Se você quer montar ou revisar um programa de análise de óleo em tendência, o ponto de partida é definir os pontos de coleta, a periodicidade e o óleo especificado para cada equipamento. Informe a aplicação, a especificação exigida e a quantidade para [preparar sua solicitação](/contato/#orcamento).
