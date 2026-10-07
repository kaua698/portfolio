# KAUÃ / ARCHIVE

Portfólio de **Kauã Oliveira Matos Borba**, desenvolvedor web e mobile em formação (ADS · SENAC).

Estética industrial de vigilância: preto quase puro, vermelho só como sinal, tipografia pesada e uma espiral em forma de lente de câmera no fundo. Os projetos aparecem como arquivos de um sistema.

## Rodar

Pré-requisito: Node.js 20.19 ou superior.

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Para ver no celular na mesma rede, use o endereço "Network" que aparece no terminal.

```bash
npm run build     # gera a pasta dist/ para publicar
npm run preview   # serve o build localmente
```

## Onde mudar

| O quê | Arquivo |
|---|---|
| Nome, textos, e-mail, links, linha do tempo, tecnologias | `src/data/profile.ts` |
| Projetos do Build Log | `src/data/projects.ts` |
| Prints dos projetos | `public/projects/` (WebP, 3 por projeto) |
| Cores e fontes | topo de `src/styles/global.css` (`:root`) |

**Adicionar um projeto:** coloque os prints em `public/projects/` e acrescente um item em `src/data/projects.ts`. A moldura, o número da câmera e o case abrem sozinhos.

**E-mail:** preencha `email` em `src/data/profile.ts`; enquanto estiver vazio, o botão de e-mail não aparece.

## Animações

Feitas com **GSAP** (ScrollTrigger, SplitText, ScrambleText, DrawSVG) e **Lenis** para a rolagem suave.

- Abertura com contador até 100% e mensagens de sistema (uma vez por visita)
- Nome montado letra por letra; status do sistema "decodificando"
- Espiral que se desenha do centro para fora, gira, segue o mouse e aproxima com a rolagem
- Olho no centro da espiral que segue o cursor (ou o toque), pisca a cada 4 segundos, olha em volta quando a pessoa para e dilata a pupila sobre links; o feixe do radar aponta para onde o olho olha
- Células de Capabilities que vêm para frente no hover
- Gravação "REC" com o tempo na página e barra de progresso de leitura
- Rótulos que decodificam, títulos que sobem linha por linha
- Linha do tempo com a linha vermelha descendo com a rolagem
- Faixa de tecnologias que acelera e inverte com a rolagem
- Projetos em molduras de câmera com paralaxe entre as telas
- Case em tela cheia com cortina vermelha e "ACCESSING FILE"
- Cursor de mira com a ação (VIEW, SOURCE) e botões magnéticos no desktop

Quem ativa "reduzir movimento" no sistema recebe a página sem abertura, sem paralaxe e sem rolagem suave.

## Estrutura

```
src/
├── App.tsx
├── components/   Header, Hero, Spiral, Profile, Evolution, Marquee, Capabilities,
│                 BuildLog, ProjectPreview, CaseDialog, Contact, Cursor, Preloader
├── data/         profile.ts e projects.ts (todo o conteúdo)
├── lib/          motion.ts (GSAP + Lenis), useReveal.ts, spiral.ts
└── styles/       global.css
```

Fontes (Anton, IBM Plex Mono, Manrope) vêm do npm via Fontsource: o site funciona sem depender do Google Fonts.
