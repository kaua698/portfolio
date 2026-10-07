// Projetos do BUILD LOG. Para adicionar um novo: coloque os prints em public/projects/
// e acrescente um item nesta lista. A ordem da lista é a ordem na página.

export type Shot = { src: string; alt: string };

export type Project = {
  id: string;
  name: string;
  purpose: string;
  stack: string[];
  kind: 'mobile' | 'web';
  what: string;
  why: string;
  how: string;
  result: string;
  links: { label: string; href: string }[];
  // true quando o código não é público
  restricted?: boolean;
  shots: Shot[];
};

const img = (file: string) => `${import.meta.env.BASE_URL}projects/${file}`;

export const projects: Project[] = [
  {
    id: '001',
    name: 'MEDLOCALIZA',
    purpose: 'App + API que mostra onde há remédio na rede pública do Recife, do mais perto ao mais longe.',
    stack: ['React Native', 'Expo', 'TypeScript', 'Node', 'Express', 'Leaflet'],
    kind: 'mobile',
    what: 'Busca de medicamentos com estoque por unidade, lista e mapa.',
    why: 'Saber antes de sair de casa qual farmácia municipal tem o remédio.',
    how: '8 distritos consultados em paralelo, distância por Haversine, login JWT e histórico na API.',
    result: 'Dados abertos da Prefeitura do Recife, atualizados todo dia.',
    links: [
      { label: 'SOURCE · APP', href: 'https://github.com/kaua698/medlocaliza-app' },
      { label: 'SOURCE · API', href: 'https://github.com/kaua698/medlocaliza-api' },
    ],
    shots: [
      { src: img('medlocaliza-busca.webp'), alt: 'Busca por Dipirona com unidades agrupadas por distrito e nível de estoque' },
      { src: img('medlocaliza-inicio.webp'), alt: 'Tela inicial com buscas rápidas e resumo do usuário' },
      { src: img('medlocaliza-perfil.webp'), alt: 'Perfil com distrito mais próximo' },
    ],
  },
  {
    id: '002',
    name: 'VISE',
    purpose: 'Finanças pessoais 100% offline: investimentos, dívidas, metas, orçamento e patrimônio.',
    stack: ['React Native', 'Expo', 'JavaScript', 'SVG'],
    kind: 'mobile',
    what: 'Transações, metas, dívidas com Snowball e Avalanche, carteira e cotações.',
    why: 'Controle sem servidor e sem dado financeiro saindo do celular.',
    how: 'AsyncStorage e SecureStore, gráficos próprios em SVG, cotações com cache e fonte reserva.',
    result: 'Mais de 1.000 testes de regressão e APK gerado com EAS.',
    links: [],
    restricted: true,
    shots: [
      { src: img('vise-inicio.webp'), alt: 'Início do Vise com saldo total, receitas, despesas e saúde financeira' },
      { src: img('vise-visao.webp'), alt: 'Visão geral com distribuição de gastos da semana' },
      { src: img('vise-investimentos.webp'), alt: 'Investimentos com patrimônio investido, evolução e rentabilidade contra o CDI' },
    ],
  },
  {
    id: '003',
    name: 'APPCLIMA',
    purpose: 'A previsão do tempo como a capa de um jornal, com manchete gerada a partir dos dados.',
    stack: ['Expo SDK 57', 'TypeScript', 'Reanimated', 'Open-Meteo'],
    kind: 'mobile',
    what: '48 horas, 7 dias e o mesmo dia nos últimos 5 anos.',
    why: 'Ler o tempo em 3 segundos, sem ícone para decifrar.',
    how: 'Manchete montada a partir da previsão, GPS com reserva por IP, tema claro e escuro.',
    result: 'Funciona sem internet mostrando a última edição salva.',
    links: [{ label: 'SOURCE', href: 'https://github.com/kaua698/App-Clima' }],
    shots: [
      { src: img('appclima-capa.webp'), alt: 'Capa com temperatura gigante e manchete do dia' },
      { src: img('appclima-48h.webp'), alt: 'Faixa de 48 horas e linha do tempo do que muda' },
      { src: img('appclima-arquivo.webp'), alt: 'Arquivo comparando hoje com os últimos 5 anos' },
    ],
  },
  {
    id: '004',
    name: 'CONSELHO DO DIA',
    purpose: 'Uma ideia estoica para refletir e uma ação para praticar, todo dia.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    kind: 'web',
    what: 'Conselho diário com fonte verificada, prática e reflexões salvas.',
    why: 'Filosofia aplicada em 2 minutos, sem cadastro.',
    how: 'Sem framework: dados em JS, progresso guardado no navegador.',
    result: 'Site leve, acessível e responsivo.',
    links: [{ label: 'SOURCE', href: 'https://github.com/kaua698/estoicismobased' }],
    shots: [
      { src: img('conselho-hoje.webp'), alt: 'Página Hoje com a citação de Marco Aurélio e a prática do dia' },
      { src: img('conselho-pratica.webp'), alt: 'Página Prática' },
      { src: img('conselho-mobile.webp'), alt: 'Versão celular' },
    ],
  },
  {
    id: '005',
    name: 'REGISTRO ALIMENTAR',
    purpose: 'PWA fullstack para acompanhar a alimentação dos pets: metas, plano de refeições e estoque de ração.',
    stack: ['React', 'Vite', 'Node', 'Express', 'MongoDB', 'PWA'],
    kind: 'mobile',
    what: 'Dashboard do dia com metas por pet, registro em um toque, histórico em calendário e relatórios com CSV.',
    why: 'Saber quem já comeu, quando é a próxima refeição e quando a ração vai acabar, com mais de um pet em casa.',
    how: 'API REST com Express e Mongoose, meta sugerida pelo peso, clima do Open-Meteo e tema escuro e claro.',
    result: 'Instala no celular e abre offline com os últimos dados (Workbox).',
    links: [{ label: 'SOURCE', href: 'https://github.com/kaua698/registroalimentar' }],
    shots: [
      { src: img('pet-hoje.webp'), alt: 'Tela Hoje com anéis de meta por pet, próxima refeição, água e dias de ração' },
      { src: img('pet-registrar.webp'), alt: 'Registrar refeição em um toque com a quantidade que falta para a meta' },
      { src: img('pet-relatorios.webp'), alt: 'Relatório semanal com consumo diário contra a meta' },
    ],
  },
];

export const teamProjects = ['HARVESTPOINT (PLATAFORMA AGROCLIMÁTICA)', 'COMPLEMENTA+ (HORAS COMPLEMENTARES SENAC)'];
