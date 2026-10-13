# -*- coding: utf-8 -*-
"""Gera categorias e produtos de data/company.json a partir da planilha do catálogo.

Uso:  python scripts/importar-catalogo.py <caminho-da-planilha.xlsx>
      (sem argumento, usa CAMINHO_PADRAO)

Requer openpyxl.  Depois de rodar:  npm run build && npm run check

O que vem da planilha: graus, especificações, base/espessante, observações e a
URL de origem (guardada só para rastreio interno, não publicada).
O que é editorial e vive neste arquivo: slug, nome, designação, resumo,
metaDescription e o texto de aplicações — reescrito em palavras próprias para
não duplicar o conteúdo do site de origem.

Só entram as linhas de foco industrial: Lubrificantes Industriais, Graxas e
Óleos Básicos.
"""
import openpyxl, json, sys, io, re, os
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

CAMINHO_PADRAO = r'C:\Users\felip\Documents\Codex\2026-09-11\que\outputs\falub\FALUB_catalogo_por_aplicacao.xlsx'
XLSX = sys.argv[1] if len(sys.argv) > 1 else CAMINHO_PADRAO
DESTINO = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'company.json')

CATEGORIES = [
    dict(slug='oleos-hidraulicos', name='Óleos hidráulicos e para ferramentas pneumáticas',
         title='Óleos hidráulicos AW e HLP | FFL Lubrificantes',
         description='Fluidos antidesgaste para sistemas hidráulicos e circulatórios, marteletes e perfuratrizes.',
         metaDescription='Óleos hidráulicos AW e HLP para sistemas circulatórios, marteletes e perfuratrizes de rocha. Veja graus e especificações e solicite orçamento à FFL.',
         selection='Parta do grau indicado pelo fabricante do equipamento e das exigências de antidesgaste, demulsibilidade e filtrabilidade. Sistemas com contaminação por água ou temperatura elevada restringem as opções, e a norma DIN 51524 é a referência mais citada nos manuais.',
         faq=[dict(question='Qual a diferença entre um óleo AW e um HLP?',
                   answer='AW indica aditivação antidesgaste. HLP é a designação DIN para óleos hidráulicos com aditivos antioxidantes, anticorrosivos e antidesgaste. Um produto pode atender às duas descrições; confirme na ficha técnica qual norma é declarada.'),
              dict(question='Os números 10, 22, 32, 46, 68, 100, 150 e 220 são graus ISO?',
                   answer='São os graus publicados pelo fabricante para cada família. A documentação de origem nem sempre os identifica expressamente como ISO VG. Confirme a correspondência na ficha técnica antes de substituir o produto em uso.')]),
    dict(slug='oleos-para-engrenagens', name='Óleos para engrenagens e lubrificação industrial geral',
         title='Óleos para engrenagens EP | FFL Lubrificantes',
         description='Óleos de extrema pressão para redutores, mancais planos e circuitos de circulação.',
         metaDescription='Óleos de extrema pressão para redutores, caixas de engrenagem, mancais planos e circuitos de circulação industrial. Veja os graus e peça orçamento à FFL.',
         selection='Cargas elevadas e choque mecânico costumam exigir aditivação de extrema pressão. O grau adequado depende da rotação, da temperatura de operação e do tipo de engrenamento, informação que consta do manual do redutor.',
         faq=[dict(question='Quando um óleo de extrema pressão é necessário?',
                   answer='Quando o contato entre dentes ou superfícies ocorre sob carga alta o suficiente para romper o filme lubrificante. A indicação vem do fabricante do equipamento; usar EP onde não é exigido não traz ganho automático.')]),
    dict(slug='oleos-para-compressores', name='Óleos para compressores de ar',
         title='Óleo para compressor de ar | FFL Lubrificantes',
         description='Lubrificação de compressores de parafuso, palheta e pistão.',
         metaDescription='Óleo para compressores de ar de parafuso, palheta e pistão, com indicação também para circuitos hidráulicos e mancais. Solicite orçamento à FFL.',
         selection='Compressores de parafuso, palheta e pistão trabalham em regimes térmicos distintos. Estabilidade à oxidação e o intervalo de troca recomendado pelo fabricante pesam mais do que a viscosidade isolada.',
         faq=[dict(question='Posso usar um óleo hidráulico no compressor?',
                   answer='Alguns produtos declaram as duas aplicações, mas isso precisa estar na ficha técnica. Compressores expõem o óleo a temperatura e oxidação maiores; a substituição sem confirmação documental pode encurtar o intervalo de troca.')]),
    dict(slug='oleos-de-corte-e-usinagem', name='Óleos de corte, usinagem e estampagem',
         title='Óleos de corte e usinagem | FFL Lubrificantes',
         description='Fluidos integrais e emulsionáveis para usinagem, perfuração, estampagem e conformação.',
         metaDescription='Óleos de corte integrais e emulsionáveis para torneamento, fresamento, furação, estampagem e conformação de metais. Consulte a FFL Lubrificantes.',
         selection='A escolha entre fluido integral e emulsionável depende do material usinado, da severidade da operação e da prioridade entre refrigeração e lubrificação. Requisitos de saúde ocupacional e de descarte da planta também restringem as opções.',
         faq=[dict(question='Qual a diferença entre óleo de corte integral e emulsionável?',
                   answer='O integral é aplicado puro e prioriza lubrificação. O emulsionável é diluído em água e prioriza refrigeração. Operações severas de baixa velocidade tendem ao integral; operações de alta velocidade que geram muito calor tendem ao emulsionável.')]),
    dict(slug='oleos-termicos-e-tratamento-termico', name='Óleos térmicos e para tratamento térmico',
         title='Óleo térmico e de têmpera | FFL Lubrificantes',
         description='Transferência de calor em circuitos fechados e têmpera de ligas de aço.',
         metaDescription='Óleos para transferência de calor em circuitos fechados e para têmpera de ligas de aço. Veja as condições declaradas e solicite orçamento à FFL.',
         selection='Em transferência de calor, a temperatura máxima de filme e o histórico térmico do fluido são determinantes, e a troca costuma seguir análise periódica em vez de prazo fixo. Em têmpera, a velocidade de resfriamento é a característica crítica.',
         faq=[dict(question='Óleo térmico tem prazo de troca fixo?',
                   answer='Normalmente não. A prática usual é acompanhar o fluido por análise periódica, observando degradação e formação de produtos de craqueamento, em vez de trocar por tempo decorrido.')]),
    dict(slug='oleos-de-processo-e-especialidades', name='Óleos de processo e especialidades',
         title='Óleos de processo industrial | FFL Lubrificantes',
         description='Isolamento elétrico, calibração de injetores, formulação, proteção anticorrosiva e manutenção de armamentos.',
         metaDescription='Óleos de processo e especialidades: isolante para transformadores, calibração de injetores, formulação, proteção anticorrosiva e armamentos. Consulte a FFL.',
         selection='São produtos de aplicação específica, em que a indicação publicada descreve o processo antes da viscosidade. Confirme a compatibilidade com o processo e os requisitos internos da planta antes de substituir um produto em uso.',
         faq=[dict(question='Estes produtos têm grau ISO definido?',
                   answer='Em vários deles o número que aparece na designação integra o nome comercial e não é apresentado como grau ISO na documentação de origem. Confirme na ficha técnica antes de tratar o número como viscosidade.')]),
    dict(slug='graxas-industriais', name='Graxas industriais e para chassis',
         title='Graxas industriais | FFL Lubrificantes',
         description='Graxas de lítio, cálcio e grafitadas para rolamentos, mancais, chassis e ambientes com água.',
         metaDescription='Graxas de lítio EP, de cálcio e grafitadas para rolamentos, mancais de deslizamento, pinos de chassis e pontos expostos à água. Peça orçamento à FFL.',
         selection='Além da consistência, importam o tipo de espessante, a faixa de temperatura de trabalho e a compatibilidade com a graxa já presente no ponto. Espessantes diferentes nem sempre são compatíveis entre si.',
         faq=[dict(question='Posso misturar graxas de espessantes diferentes?',
                   answer='Não sem verificação. Misturar espessantes incompatíveis pode amolecer a mistura e provocar perda de lubrificação. Ao trocar de tipo, o procedimento usual é limpar o ponto e purgar a graxa anterior.'),
              dict(question='As graxas têm classificação NLGI declarada?',
                   answer='A documentação de origem não explicita o grau NLGI destes produtos. A consistência precisa ser confirmada na ficha técnica antes de comparar com a graxa atualmente utilizada.')]),
    dict(slug='oleos-basicos', name='Óleos básicos',
         title='Óleos básicos | FFL Lubrificantes',
         description='Óleos básicos disponíveis para consulta, sem aplicação individual detalhada na documentação de origem.',
         metaDescription='Óleos básicos para consulta: Spindle, Neutro Médio e Neutro Pesado. Informe o processo e o requisito técnico para a FFL Lubrificantes avaliar.',
         selection='A documentação de origem nomeia estes óleos básicos em conjunto, sem indicar aplicação ou viscosidade individual. Para uma consulta, descreva o processo e o requisito técnico pretendido.',
         faq=[dict(question='Por que estes produtos não têm página própria?',
                   answer='Porque não há aplicação, viscosidade nem especificação publicadas para cada um deles individualmente. Publicar páginas separadas sem esse conteúdo não ajudaria você nem seria honesto com a informação disponível.')]),
]

# linha da planilha -> dados editoriais do produto.
# `applications` é reescrito aqui, em texto próprio, a partir do que a fonte
# declara — não é transcrição.
MAP = {
 45: dict(cat='oleos-hidraulicos', slug='oleo-hidraulico-aw-68-220',
     name='Óleo hidráulico AW 68, 100, 150 e 220', desig='HS 68, 100, 150, 220 AW',
     desc='Óleo hidráulico antidesgaste para sistemas circulatórios sob pressão severa e temperatura moderada.',
     meta='Óleo hidráulico antidesgaste nos graus 68, 100, 150 e 220, para sistemas circulatórios sob pressão severa. Veja as aplicações e peça orçamento à FFL.',
     apps='Indicado para sistemas hidráulicos e circulatórios industriais e veiculares que operam sob pressão severa, em regime de temperatura moderada.'),
 46: dict(cat='oleos-hidraulicos', slug='oleo-hidraulico-aw-10-46',
     name='Óleo hidráulico AW 10, 22, 32 e 46', desig='HS 10, 22, 32, 46 AW',
     desc='Óleo hidráulico antidesgaste para sistemas sob pressão severa e temperatura elevada, com DIN 51524 parte 3 declarada.',
     meta='Óleo hidráulico antidesgaste nos graus 10, 22, 32 e 46, com DIN 51524 parte 3 declarada. Veja as especificações e solicite orçamento à FFL Lubrificantes.',
     apps='Indicado para sistemas hidráulicos e circulatórios industriais e veiculares que operam sob pressão severa e temperatura elevada.'),
 50: dict(cat='oleos-hidraulicos', slug='oleo-para-ferramentas-pneumaticas',
     name='Óleo para ferramentas pneumáticas', desig='FPM 68, 100 e 220',
     desc='Óleo para marteletes, perfuratrizes de rocha e mancais expostos à umidade, com indicação hidráulica HLP.',
     meta='Óleo para ferramentas pneumáticas, marteletes e perfuratrizes de rocha nos graus 68, 100 e 220, com indicação hidráulica HLP. Peça orçamento à FFL.',
     apps='Indicado para ferramentas pneumáticas em geral, marteletes, perfuratrizes de rocha e mancais expostos à umidade. A documentação de origem registra ainda indicação para uso hidráulico do tipo HLP.'),
 47: dict(cat='oleos-para-engrenagens', slug='oleo-ep-lubrificacao-geral-10-32',
     name='Óleo EP para lubrificação geral 10 a 32', desig='LG EP 10, 22 e 32',
     desc='Óleo de extrema pressão para lubrificação geral de máquinas e equipamentos, nos graus leves.',
     meta='Óleo de extrema pressão nos graus 10, 22 e 32, para lubrificação geral de máquinas e equipamentos. Veja as informações técnicas e consulte a FFL.',
     apps='Indicado para a lubrificação geral de máquinas e equipamentos cuja condição de trabalho exija aditivação de extrema pressão.'),
 48: dict(cat='oleos-para-engrenagens', slug='oleo-ep-para-redutores-150-680',
     name='Óleo EP para redutores 150 a 680', desig='LG EP 150, 220, 320, 460 e 680',
     desc='Óleo de extrema pressão para caixas redutoras, mancais planos e circuitos de circulação.',
     meta='Óleo de extrema pressão nos graus 150, 220, 320, 460 e 680, para caixas redutoras, mancais planos e circuitos de circulação. Peça orçamento à FFL.',
     apps='Indicado para caixas redutoras, circuitos de circulação, mancais planos e máquinas que exijam aditivação de extrema pressão.'),
 49: dict(cat='oleos-para-compressores', slug='oleo-para-compressor-de-ar',
     name='Óleo para compressor de ar 150', desig='Compressor HS 150',
     desc='Óleo para compressores de parafuso, palheta e pistão, com indicação também para circuitos hidráulicos e mancais.',
     meta='Óleo 150 para compressores de parafuso, palheta e pistão, com uso declarado também em circuitos hidráulicos e mancais de deslizamento. Peça orçamento.',
     apps='Indicado para compressores de ar dos tipos parafuso, palheta e pistão. A documentação de origem registra ainda uso em circuitos hidráulicos e de circulação, mancais de deslizamento e lubrificação geral sob pressão severa e temperatura moderada, inclusive em equipamentos sujeitos a contaminação por água.'),
 51: dict(cat='oleos-de-corte-e-usinagem', slug='oleo-de-corte-emulsionavel',
     name='Óleo de corte emulsionável', desig='Sol E 37',
     desc='Óleo de corte emulsionável para usinagem em que a prioridade é o resfriamento.',
     meta='Óleo de corte emulsionável para furação, torneamento, fresagem, aplainamento e alargamento, com prioridade de resfriamento. Consulte a FFL Lubrificantes.',
     apps='Indicado para operações de usinagem em que a prioridade é o resfriamento: furação, aplainamento, torneamento, fresagem, corte a frio e alargamento. A documentação de origem registra ainda uso em fibras, couros, sistemas hidráulicos e trocadores de calor, e exclui expressamente a aplicação em magnésio.'),
 52: dict(cat='oleos-de-corte-e-usinagem', slug='oleo-de-corte-integral-2020',
     name='Óleo de corte integral 2020', desig='Cortex 2020',
     desc='Óleo de corte integral para usinagem e perfuração de materiais ferrosos e não ferrosos.',
     meta='Óleo de corte integral para usinagem e perfuração de materiais ferrosos e não ferrosos. Veja as informações publicadas e peça orçamento à FFL.',
     apps='Indicado para operações de usinagem e perfuração em materiais ferrosos e não ferrosos, aplicado puro, sem diluição em água.'),
 53: dict(cat='oleos-de-corte-e-usinagem', slug='oleo-de-corte-integral-32',
     name='Óleo de corte integral 32', desig='Cortex 32',
     desc='Óleo de corte integral para usinagem e perfuração de materiais ferrosos e não ferrosos.',
     meta='Óleo de corte integral 32 para usinagem e perfuração de materiais ferrosos e não ferrosos. Consulte as informações técnicas e fale com a FFL.',
     apps='Indicado para operações de usinagem e perfuração em materiais ferrosos e não ferrosos, aplicado puro, sem diluição em água.'),
 54: dict(cat='oleos-de-corte-e-usinagem', slug='oleo-para-estampagem-e-conformacao',
     name='Óleo para estampagem e conformação 68', desig='Stamp 68',
     desc='Óleo para estampagem, conformação e usinagem de materiais ferrosos e não ferrosos.',
     meta='Óleo para estampagem, conformação e usinagem de materiais ferrosos e não ferrosos. Veja a indicação declarada e solicite orçamento à FFL.',
     apps='Indicado para operações de estampagem, conformação e usinagem em materiais ferrosos e não ferrosos.'),
 55: dict(cat='oleos-termicos-e-tratamento-termico', slug='oleo-termico-circuito-fechado',
     name='Óleo térmico para circuito fechado', desig='Therm-E',
     desc='Fluido de transferência térmica para circuitos fechados, com temperatura máxima declarada de 320 °C.',
     meta='Óleo térmico para circuitos fechados de transferência de calor, com temperatura máxima declarada de 320 °C. Veja as condições e peça orçamento à FFL.',
     apps='Indicado para circuitos fechados de transferência de calor equipados com tanque de expansão selado e atmosfera de gás inerte.'),
 56: dict(cat='oleos-termicos-e-tratamento-termico', slug='oleo-para-tempera-de-aco',
     name='Óleo para têmpera de aço', desig='Temp',
     desc='Óleo de baixa viscosidade para têmpera de ligas de aço.',
     meta='Óleo de baixa viscosidade para têmpera de ligas de aço em tratamento térmico. Veja as informações publicadas e solicite um orçamento à FFL.',
     apps='Indicado para a têmpera de ligas de aço, etapa em que a velocidade de resfriamento é a característica determinante.'),
 57: dict(cat='oleos-de-processo-e-especialidades', slug='oleo-isolante-para-transformadores',
     name='Óleo isolante para transformadores', desig='Transf A',
     desc='Óleo mineral naftênico isolante para transformadores.',
     meta='Óleo mineral naftênico isolante para transformadores elétricos. Consulte as informações técnicas publicadas e fale com a FFL Lubrificantes.',
     apps='Indicado como fluido isolante em transformadores elétricos.'),
 58: dict(cat='oleos-de-processo-e-especialidades', slug='fluido-para-calibracao-de-injetores',
     name='Fluido para calibração de injetores', desig='Calibra 4113',
     desc='Fluido de baixa viscosidade para calibração e armazenamento de injetores de combustível diesel.',
     meta='Fluido de baixa viscosidade para calibração e armazenamento de injetores de combustível diesel. Veja a indicação e solicite orçamento à FFL.',
     apps='Indicado para bancadas de calibração de injetores de combustível diesel e para o armazenamento desses componentes.'),
 59: dict(cat='oleos-de-processo-e-especialidades', slug='oleo-parafinico-de-processo-56',
     name='Óleo parafínico de processo 56', desig='FBX 56',
     desc='Óleo mineral parafínico para as indústrias de borracha, química e têxtil, além de tratamento térmico e formulação.',
     meta='Óleo mineral parafínico de processo para as indústrias de borracha, química e têxtil, tratamento térmico e formulação. Consulte a FFL Lubrificantes.',
     apps='Indicado como óleo de processo nas indústrias de borracha, química e têxtil, em tratamento térmico e na formulação de lubrificantes.'),
 60: dict(cat='oleos-de-processo-e-especialidades', slug='oleo-parafinico-para-formulacao-100',
     name='Óleo parafínico para formulação 100', desig='FB 100',
     desc='Óleo mineral parafínico para formulação de lubrificantes, plastificação de resinas e beneficiamento têxtil.',
     meta='Óleo mineral parafínico para formulação de lubrificantes, plastificação de resinas e borrachas e beneficiamento têxtil. Peça orçamento à FFL.',
     apps='Indicado para a formulação de lubrificantes, a plastificação de resinas, plásticos e borrachas, o beneficiamento têxtil e o tratamento térmico de metais.'),
 61: dict(cat='oleos-de-processo-e-especialidades', slug='protetivo-anticorrosivo-para-chassis',
     name='Protetivo anticorrosivo para chassis', desig='Protetivo',
     desc='Protetivo anticorrosivo para chassis e superfícies metálicas em ambientes úmidos e litorâneos.',
     meta='Protetivo anticorrosivo para chassis e superfícies metálicas, indicado para ambientes úmidos e litorâneos. Veja a aplicação e consulte a FFL.',
     apps='Indicado para a proteção de chassis e outras superfícies metálicas contra corrosão e intempéries, com aplicação direta, sem diluição. A documentação de origem destaca o uso em ambientes úmidos e litorâneos.'),
 62: dict(cat='oleos-de-processo-e-especialidades', slug='oleo-para-limpeza-de-armamentos',
     name='Óleo para limpeza de armamentos', desig='Arm',
     desc='Produto para limpeza, lubrificação e proteção de armamentos e preservação de peças no armazenamento.',
     meta='Produto para limpeza, lubrificação e proteção de armamentos, preservação de peças metálicas e tratamento de couro. Consulte a FFL Lubrificantes.',
     apps='Indicado para a limpeza, a lubrificação e a proteção de armamentos, além da preservação de peças metálicas em armazenamento. A documentação de origem registra ainda uso como tratamento amaciante de couro.'),
 63: dict(cat='graxas-industriais', slug='graxa-de-litio-ep',
     name='Graxa de lítio EP', desig='Graxa Lithium EP1',
     desc='Graxa de sabão de lítio com extrema pressão, para uso contínuo até 130 °C e picos de 150 °C.',
     meta='Graxa de lítio EP para rolamentos, prensas, britadores, guindastes e máquinas agrícolas, até 130 °C contínuos. Peça orçamento à FFL Lubrificantes.',
     apps='Indicada para peças sob pressão elevada e deslizamento pesado, mancais de rolamento, máquinas de papel, prensas, britadores, guindastes e máquinas agrícolas.'),
 65: dict(cat='graxas-industriais', slug='graxa-de-calcio-para-chassis',
     name='Graxa de cálcio para chassis', desig='Graxa Chassis 2',
     desc='Graxa de sabão de cálcio para pinos de chassis e mancais de deslizamento, até 70 °C. Há também a versão vermelha.',
     meta='Graxa de sabão de cálcio para pinos de chassis e mancais de deslizamento, até 70 °C. Há também a versão vermelha. Consulte a FFL Lubrificantes.',
     apps='Indicada para pinos de chassis e mancais de deslizamento que operam em temperatura moderada.',
     variants=['Graxa de cálcio para chassis', 'Graxa de cálcio para chassis — versão vermelha'],
     note='A documentação de origem publica dois cadastros de descrição idêntica, diferenciados pela cor. Grau NLGI não explicitado.'),
 66: dict(cat='graxas-industriais', slug='graxa-grafitada',
     name='Graxa grafitada', desig='Graxa Grafit',
     desc='Graxa grafitada para desgaste intenso e contato com água, com 5%, 10% ou 25% de grafite.',
     meta='Graxa grafitada para pontos de desgaste intenso e contato com água, com teor de grafite de 5%, 10% ou 25%. Solicite orçamento à FFL Lubrificantes.',
     apps='Indicada para pontos sujeitos a desgaste intenso, contato com água ou ambas as condições, sob temperaturas moderadas.'),
}
# Listados apenas na página da categoria: a origem não publica dados individuais.
SEM_PAGINA = {67: 'Óleo Spindle', 68: 'Óleo Neutro Médio', 69: 'Óleo Neutro Pesado'}

NARRATIVA = re.compile(r'\.\s*(?:O site declara|O desempenho também cita|O desempenho cita)\s*')
SO_TEXTO = re.compile(r'^(?:O site|O texto|O modal|O cartão|Cartão:|Modal:|conforme o nome)', re.I)


def parse_graus(text):
    """Separa o campo publicado em (primeiro item, [demais itens])."""
    if not text or text.startswith('Não informad'):
        return (None, [])
    itens = [s.strip(' .') for s in re.split(r';\s*', NARRATIVA.sub('; ', text)) if s.strip(' .')]
    if not itens:
        return (None, [])
    return (itens[0], [s for s in itens[1:] if not SO_TEXTO.match(s)])


def limpar(texto):
    """Remove o nome do fornecedor de textos vindos da planilha."""
    return re.sub(r'\bFALUB\b\s*', '', texto or '', flags=re.I).strip()


wb = openpyxl.load_workbook(XLSX, data_only=True)
rows = {i: [str(c).strip() if c is not None else '' for c in r]
        for i, r in enumerate(wb['Catálogo'].iter_rows(values_only=True), 1)}

produtos = []
for row, m in MAP.items():
    r = rows[row]
    aplicacao, graus, base, obs, fonte = r[0], r[3], r[4], r[6], r[7]
    primeiro, demais = parse_graus(graus)
    e_grau = bool(primeiro and re.match(r'^(SAE\s*)?[\d\s,./eE]+(AW|EP)?$', primeiro))

    spec_rows = [['Designação', m['desig']]]
    if e_grau:
        spec_rows.append(['Graus publicados', primeiro])
        if demais:
            spec_rows.append(['Especificações declaradas', limpar('; '.join(demais))])
    elif primeiro:
        # Sem grau numérico, o campo inteiro descreve características, não normas.
        spec_rows.append(['Características publicadas', limpar('; '.join([primeiro] + demais))])
    if base and not base.startswith('Não informad'):
        rotulo = 'Espessante' if 'sabão' in base.lower() else 'Base'
        spec_rows.append([rotulo, base.rstrip('.')])
    spec_rows.append(['Aplicação principal', aplicacao])

    p = dict(slug=m['slug'], name=m['name'], category=m['cat'],
             description=m['desc'], metaDescription=m['meta'],
             applications=m['apps'], application=aplicacao,
             specRows=spec_rows,
             specifications=[limpar(s) for s in demais] if e_grau else [],
             note=m.get('note') or limpar(obs) or None,
             variants=m.get('variants'),
             source=fonte,          # rastreio interno; não é publicado
             confirmed=True)
    produtos.append({k: v for k, v in p.items() if v not in (None, [], '')})

basicos = [dict(name=SEM_PAGINA[i], note=limpar(rows[i][6])) for i in sorted(SEM_PAGINA)]
for c in CATEGORIES:
    c['confirmed'] = True
    if c['slug'] == 'oleos-basicos':
        c['listOnly'] = basicos

company = json.load(io.open(DESTINO, encoding='utf-8'))
company['categories'] = CATEGORIES
company['products'] = produtos
with io.open(DESTINO, 'w', encoding='utf-8') as f:
    json.dump(company, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f'categorias: {len(CATEGORIES)}  produtos: {len(produtos)}  listados sem página: {len(basicos)}')
problemas = 0
for item in produtos + CATEGORIES:
    L = len(item['metaDescription'])
    if not (70 <= L <= 160):
        print(f'  !! {item["slug"]} metaDescription {L} caracteres'); problemas += 1
for c in CATEGORIES:
    if not (25 <= len(c['title']) <= 62):
        print(f'  !! {c["slug"]} title {len(c["title"])} caracteres'); problemas += 1
for p in produtos:
    L = len(f'{p["name"]} | FFL Lubrificantes')
    if not (25 <= L <= 62):
        print(f'  !! {p["slug"]} title {L} caracteres'); problemas += 1
restante = [p['slug'] for p in produtos if 'falub' in json.dumps(p, ensure_ascii=False).lower()
            and 'falub' not in p.get('source', '').lower()]
if restante:
    print('  !! ainda há "FALUB" em:', restante); problemas += 1
print('problemas:', problemas)
