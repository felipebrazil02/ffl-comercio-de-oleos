// Catálogo de produtos FFL
export const categorias = [
  {
    slug: 'oleos-hidraulicos',
    nome: 'Óleos Hidráulicos',
    descricao: 'Fluidos hidráulicos ISO para sistemas industriais, prensas, injetoras e equipamentos móveis.'
  },
  {
    slug: 'oleos-para-engrenagens',
    nome: 'Óleos para Engrenagens',
    descricao: 'Lubrificantes EP para redutores, caixas de engrenagens e sistemas fechados sob alta carga.'
  },
  {
    slug: 'graxas-industriais',
    nome: 'Graxas Industriais',
    descricao: 'Graxas para rolamentos, mancais, alta temperatura, extrema pressão e uso geral.'
  },
  {
    slug: 'fluidos-de-corte',
    nome: 'Fluidos de Corte',
    descricao: 'Óleos solúveis e sintéticos para usinagem, retificação e processos de corte.'
  },
  {
    slug: 'oleos-protetivos',
    nome: 'Óleos Protetivos e Especiais',
    descricao: 'Anticorrosivos, óleos de proteção temporária e lubrificantes para aplicações especiais.'
  }
];

export const produtos = [
  // ===== ÓLEOS HIDRÁULICOS =====
  {
    slug: 'oleo-hidraulico-iso-32',
    nome: 'Óleo Hidráulico ISO 32',
    categoria: 'oleos-hidraulicos',
    destaque: true,
    tag: 'Mais Vendido',
    resumo: 'Baixa viscosidade para sistemas hidráulicos que operam em baixas temperaturas ou partidas a frio.',
    descricao: `O Óleo Hidráulico ISO 32 é um lubrificante mineral de alta qualidade, formulado com óleos básicos parafínicos e aditivos antioxidante, antidesgaste (AW), anticorrosivo e antiespumante. Indicado para sistemas hidráulicos industriais e móveis que exigem um fluido de baixa viscosidade.`,
    aplicacoes: [
      'Sistemas hidráulicos industriais de baixa e média pressão',
      'Equipamentos móveis em operação em baixas temperaturas',
      'Máquinas-ferramenta, prensas e injetoras',
      'Sistemas de lubrificação centralizada'
    ],
    especs: {
      'Viscosidade ISO': '32',
      'Índice de Viscosidade': '≥ 100',
      'Ponto de Fulgor (°C)': '≥ 210',
      'Ponto de Fluidez (°C)': '≤ -12',
      'Embalagens': 'Balde 20L, Tambor 200L'
    }
  },
  {
    slug: 'oleo-hidraulico-iso-46',
    nome: 'Óleo Hidráulico ISO 46',
    categoria: 'oleos-hidraulicos',
    destaque: true,
    tag: 'Mais Popular',
    resumo: 'O fluido hidráulico mais utilizado na indústria brasileira. Viscosidade média para uso geral.',
    descricao: `O Óleo Hidráulico ISO 46 é o fluido hidráulico mais utilizado na indústria brasileira. Formulado com óleos básicos de alta qualidade e pacote de aditivos AW (antidesgaste), antioxidante, anticorrosivo e demulsificante. Proporciona excelente proteção contra desgaste em bombas de engrenagens, palhetas e pistões.`,
    aplicacoes: [
      'Sistemas hidráulicos industriais em geral',
      'Prensas hidráulicas, injetoras e extrusoras',
      'Empilhadeiras, retroescavadeiras e tratores',
      'Máquinas agrícolas e implementos',
      'Sistemas de lubrificação de máquinas-ferramenta'
    ],
    especs: {
      'Viscosidade ISO': '46',
      'Índice de Viscosidade': '≥ 100',
      'Ponto de Fulgor (°C)': '≥ 220',
      'Ponto de Fluidez (°C)': '≤ -9',
      'Embalagens': 'Balde 20L, Tambor 200L'
    }
  },
  {
    slug: 'oleo-hidraulico-iso-68',
    nome: 'Óleo Hidráulico ISO 68',
    categoria: 'oleos-hidraulicos',
    destaque: true,
    tag: 'Alta Pressão',
    resumo: 'Alta viscosidade para sistemas hidráulicos que operam sob pressões elevadas e altas temperaturas.',
    descricao: `O Óleo Hidráulico ISO 68 é um fluido de alta viscosidade desenvolvido para sistemas hidráulicos que operam sob altas pressões, cargas pesadas ou temperaturas elevadas. Contém pacote de aditivos antidesgaste (AW), antioxidante, inibidor de corrosão e antiespumante.`,
    aplicacoes: [
      'Sistemas hidráulicos de alta pressão (>200 bar)',
      'Prensas hidráulicas pesadas',
      'Máquinas de injeção plástica',
      'Equipamentos de construção civil',
      'Sistemas em ambientes de alta temperatura'
    ],
    especs: {
      'Viscosidade ISO': '68',
      'Índice de Viscosidade': '≥ 100',
      'Ponto de Fulgor (°C)': '≥ 230',
      'Ponto de Fluidez (°C)': '≤ -6',
      'Embalagens': 'Balde 20L, Tambor 200L'
    }
  },
  {
    slug: 'oleo-hidraulico-iso-100',
    nome: 'Óleo Hidráulico ISO 100',
    categoria: 'oleos-hidraulicos',
    destaque: false,
    resumo: 'Viscosidade extra-alta para sistemas antiquados, altas temperaturas ou cargas extremas.',
    descricao: `O Óleo Hidráulico ISO 100 oferece a mais alta viscosidade da linha hidráulica convencional. Recomendado para sistemas antiquados com folgas ampliadas, equipamentos que operam em temperaturas elevadas ou aplicações que exigem filme lubrificante mais espesso.`,
    aplicacoes: [
      'Sistemas hidráulicos antigos com folgas ampliadas',
      'Equipamentos operando em temperaturas > 80°C',
      'Prensas de grande porte',
      'Sistemas de lubrificação de correntes e guias'
    ],
    especs: {
      'Viscosidade ISO': '100',
      'Índice de Viscosidade': '≥ 95',
      'Ponto de Fulgor (°C)': '≥ 240',
      'Ponto de Fluidez (°C)': '≤ -3',
      'Embalagens': 'Balde 20L, Tambor 200L'
    }
  },

  // ===== ÓLEOS PARA ENGRENAGENS =====
  {
    slug: 'oleo-engrenagens-iso-vg-220',
    nome: 'Óleo para Engrenagens ISO VG 220',
    categoria: 'oleos-para-engrenagens',
    destaque: true,
    tag: 'EP',
    resumo: 'Lubrificante EP para redutores e caixas de engrenagens sob médias e altas cargas.',
    descricao: `Óleo para engrenagens ISO VG 220 com aditivação EP (Extrema Pressão), formulado para lubrificação de redutores, caixas de transmissão e engrenagens industriais fechadas. Oferece excelente proteção contra desgaste, corrosão e formação de espuma.`,
    aplicacoes: [
      'Redutores de velocidade',
      'Caixas de engrenagens industriais',
      'Acionamentos de correias transportadoras',
      'Moinhos, britadores e misturadores'
    ],
    especs: {
      'Viscosidade ISO': '220',
      'Índice de Viscosidade': '≥ 95',
      'Ponto de Fulgor (°C)': '≥ 240',
      'Ponto de Fluidez (°C)': '≤ -6',
      'Embalagens': 'Balde 20L, Tambor 200L'
    }
  },
  {
    slug: 'oleo-engrenagens-iso-vg-460',
    nome: 'Óleo para Engrenagens ISO VG 460',
    categoria: 'oleos-para-engrenagens',
    destaque: true,
    tag: 'Carga Pesada',
    resumo: 'Alta viscosidade EP para engrenagens sob cargas muito pesadas e condições severas.',
    descricao: `Óleo para engrenagens ISO VG 460 com aditivação EP de alto desempenho. Desenvolvido para aplicações que exigem filme lubrificante extremamente resistente, como moinhos de bolas, britadores e fornos rotativos.`,
    aplicacoes: [
      'Moinhos de bolas e SAG',
      'Britadores e peneiras vibratórias',
      'Fornos rotativos',
      'Engrenagens abertas de grande porte',
      'Redutores sujeitos a choques de carga'
    ],
    especs: {
      'Viscosidade ISO': '460',
      'Índice de Viscosidade': '≥ 95',
      'Ponto de Fulgor (°C)': '≥ 250',
      'Ponto de Fluidez (°C)': '≤ -3',
      'Embalagens': 'Balde 20L, Tambor 200L'
    }
  },

  // ===== GRAXAS =====
  {
    slug: 'graxa-industrial-mp2',
    nome: 'Graxa Industrial MP2',
    categoria: 'graxas-industriais',
    destaque: true,
    tag: 'Multiuso',
    resumo: 'Graxa multiuso à base de lítio para lubrificação geral de rolamentos, mancais e articulações.',
    descricao: `Graxa industrial MP2 multiuso de alta qualidade, à base de sabão de lítio e óleo mineral. Possui boa resistência à água, estabilidade mecânica e proteção anticorrosiva. Indicada para lubrificação de rolamentos, mancais, articulações e pontos de lubrificação geral.`,
    aplicacoes: [
      'Rolamentos de motores elétricos',
      'Mancais de deslizamento e rolamento',
      'Articulações e pinos',
      'Guias lineares e fusos',
      'Lubrificação geral de máquinas'
    ],
    especs: {
      'Espessante': 'Sabão de Lítio',
      'NLGI': '2',
      'Ponto de Gota (°C)': '≥ 180',
      'Penetração (0,1mm)': '265-295',
      'Embalagens': 'Balde 18kg, Tambor 180kg'
    }
  },
  {
    slug: 'graxa-alta-temperatura',
    nome: 'Graxa para Alta Temperatura',
    categoria: 'graxas-industriais',
    destaque: false,
    tag: 'Sintética',
    resumo: 'Graxa sintética com alto ponto de gota para rolamentos expostos a calor intenso.',
    descricao: `Graxa formulada com espessante de poliureia e óleo sintético, projetada para operar em temperaturas elevadas. Mantém a consistência e a lubricidade mesmo em fornos, estufas e processos térmicos.`,
    aplicacoes: [
      'Rolamentos de fornos e estufas industriais',
      'Secadores rotativos',
      'Ventiladores de alta temperatura',
      'Rolamentos de turbinas e compressores'
    ],
    especs: {
      'Espessante': 'Poliureia',
      'NLGI': '2',
      'Ponto de Gota (°C)': '≥ 250',
      'Faixa Temperatura': '-10°C a +180°C',
      'Embalagens': 'Balde 18kg, Tambor 180kg'
    }
  },
  {
    slug: 'graxa-grafitada',
    nome: 'Graxa Grafitada',
    categoria: 'graxas-industriais',
    destaque: false,
    tag: 'EP Sólido',
    resumo: 'Graxa com grafita coloidal para lubrificação sob cargas extremas e engrenagens abertas.',
    descricao: `Graxa grafitada com grafita coloidal que atua como lubrificante sólido sob condições de extrema pressão. Ideal para lubrificação de equipamentos pesados, engrenagens abertas, cabos de aço e pontos onde a graxa comum não oferece proteção suficiente.`,
    aplicacoes: [
      'Engrenagens abertas',
      'Cabos de aço e correntes',
      'Mancais sujeitos a cargas de choque',
      'Guindastes e pontes rolantes'
    ],
    especs: {
      'Espessante': 'Sabão de Lítio',
      'NLGI': '1-2',
      'Aditivo': 'Grafita Coloidal',
      'Cor': 'Preto',
      'Embalagens': 'Balde 18kg, Tambor 180kg'
    }
  },

  // ===== FLUIDOS DE CORTE =====
  {
    slug: 'oleo-soluvel-para-corte',
    nome: 'Óleo Solúvel para Corte',
    categoria: 'fluidos-de-corte',
    destaque: true,
    tag: 'Emulsionável',
    resumo: 'Fluido de corte emulsionável para usinagem geral, com excelente lubricidade e refrigeração.',
    descricao: `Óleo solúvel formulado com óleos minerais, emulsificantes, aditivos EP e biocidas. Forma emulsão estável com água, proporcionando refrigeração eficiente e lubricidade excepcional. Reduz o desgaste da ferramenta e melhora o acabamento superficial.`,
    aplicacoes: [
      'Torneamento, fresamento e furação',
      'Mandrilhamento e rosqueamento',
      'Retificação de materiais ferrosos',
      'Usinagem de aços carbono, liga e inox'
    ],
    especs: {
      'Aparência': 'Líquido âmbar escuro',
      'Emulsão': '3% a 8%',
      'pH (5%)': '9.0 - 9.5',
      'Proteção anticorrosiva': 'Excelente',
      'Embalagens': 'Balde 20L, Tambor 200L'
    }
  },
  {
    slug: 'fluido-de-corte-sintetico',
    nome: 'Fluido de Corte Sintético',
    categoria: 'fluidos-de-corte',
    destaque: false,
    tag: 'Sem Óleo Mineral',
    resumo: 'Fluido sintético transparente para retificação e usinagem CNC de alta precisão.',
    descricao: `Fluido de corte sintético isento de óleo mineral para operações de retificação e usinagem de alta precisão. Oferece excelente refrigeração, visibilidade total do ponto de corte e controle bacteriológico superior.`,
    aplicacoes: [
      'Retificação plana, cilíndrica e centerless',
      'Usinagem CNC de alta velocidade',
      'Usinagem de alumínio e ligas não-ferrosas'
    ],
    especs: {
      'Aparência': 'Líquido transparente',
      'Diluição': '2% a 6%',
      'pH (5%)': '8.5 - 9.5',
      'Isento de': 'Óleo mineral, nitrito, fenóis',
      'Embalagens': 'Balde 20L, Tambor 200L'
    }
  },

  // ===== ÓLEOS PROTETIVOS =====
  {
    slug: 'oleo-protetivo-anticorrosivo',
    nome: 'Óleo Protetivo Anticorrosivo',
    categoria: 'oleos-protetivos',
    destaque: true,
    tag: 'Proteção',
    resumo: 'Óleo de proteção temporária contra oxidação para armazenamento e transporte de peças.',
    descricao: `Óleo protetivo anticorrosivo com inibidores de corrosão que forma película protetiva sobre superfícies metálicas. Previne oxidação durante armazenamento e transporte. Aplicação por imersão, spray ou pincelamento.`,
    aplicacoes: [
      'Proteção de peças usinadas em estoque',
      'Preservação de matrizes e moldes',
      'Ferramentas e instrumentos armazenados',
      'Proteção entre processos de fabricação'
    ],
    especs: {
      'Aparência': 'Líquido âmbar claro',
      'Película': 'Oleosa, macia ao toque',
      'Proteção interna': '12 a 24 meses',
      'Aplicação': 'Imersão, spray ou pincelamento',
      'Embalagens': 'Balde 20L, Tambor 200L'
    }
  }
];

// Produtos em destaque
export const produtosDestaque = produtos.filter(p => p.destaque);

// Agrupa por categoria
export function produtosPorCategoria() {
  const mapa = {};
  for (const cat of categorias) {
    mapa[cat.slug] = produtos.filter(p => p.categoria === cat.slug);
  }
  return mapa;
}