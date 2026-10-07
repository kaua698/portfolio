// Dados pessoais e textos fixos do portfólio. Edite aqui, não nos componentes.

export const profile = {
  name: 'KAUÃ',
  fullName: 'Kauã Oliveira Matos Borba',
  role: 'SOFTWARE DEVELOPER',
  course: 'ADS',
  tagline: 'Eu transformo problemas em sistemas que funcionam, no celular e na web.',
  statement: 'Começo pelo problema, desenho a interface e só paro quando funciona no aparelho de verdade.',
  about:
    'Estudante de Análise e Desenvolvimento de Sistemas no SENAC, com foco em web e mobile. Gosto de app que funciona offline, abre rápido e não precisa de manual: finanças, saúde pública, clima.',
  facts: [
    { label: 'FORMAÇÃO', value: 'ADS · SENAC (TADS49)' },
    { label: 'FOCO', value: 'React Native · React · JavaScript' },
    { label: 'BUSCANDO', value: 'Estágio em desenvolvimento', signal: true },
  ],
  // Deixe vazio para esconder o botão de e-mail
  email: '',
  // PDF em public/curriculo.pdf
  cv: `${import.meta.env.BASE_URL}curriculo.pdf`,
  github: 'https://github.com/kaua698',
  linkedin: 'https://www.linkedin.com/in/kau%C3%A3-oliveira-9212153a9/',
};

export const evolution = [
  { year: '2025', state: 'INITIALIZING', text: 'Início da formação em ADS no SENAC. Lógica, HTML, CSS e JavaScript.' },
  { year: '2026', state: 'BUILDING', text: 'React, Node/Express e Firebase em projetos de equipe e próprios.' },
  { year: '2026', state: 'SHIPPING', text: 'Apps mobile de verdade: MedLocaliza e APPCLIMA no GitHub, Vise em APK.' },
  { year: 'NEXT', state: 'INTERNSHIP', text: 'Primeira experiência profissional em um time de produto.', next: true },
];

export const capabilities = [
  { area: 'MOBILE', tech: 'React Native · Expo · TypeScript', text: 'Apps com GPS, mapas, cache offline e animação.' },
  { area: 'FRONT', tech: 'React · Vite · Tailwind', text: 'Interfaces de produto, dashboards e PWA.' },
  { area: 'CORE', tech: 'JavaScript · HTML · CSS', text: 'A base: DOM, eventos, APIs e sites sem framework.' },
  { area: 'BACK', tech: 'Node · Express · MongoDB', text: 'APIs REST com login JWT, histórico e CRUD. Firebase quando o projeto pede.' },
  { area: 'SOURCE', tech: 'Git · GitHub', text: 'Versionamento, README de verdade e histórico limpo.' },
  { area: 'LEARNING', tech: 'GSAP · Python', text: 'Motion na web e ciência de dados nas aulas.' },
];

export const marquee = ['REACT NATIVE', 'EXPO', 'TYPESCRIPT', 'REACT', 'NODE', 'EXPRESS', 'MONGODB', 'FIREBASE', 'GSAP', 'GIT'];
