# Red Madero — web

Landing pública de Red Madero: qué es la app, para quién es y cómo empezar a usarla. 100 % front, estática, sin backend ni login. Ticket: [lab3-madero#629](https://github.com/FacultadDeIngenieria/lab3-madero/issues/629).

El sitio es inmersivo, con la misma base que [Synq](https://github.com/biancacomotto): React + Three.js (React Three Fiber) con el canvas 3D fijo detrás del DOM y el contenido scrolleando por encima con Lenis y GSAP.

## Stack

| Capa          | Herramienta                                   | Para qué                                                |
| ------------- | --------------------------------------------- | ------------------------------------------------------- |
| Build         | Vite 8 + TypeScript                           | dev server, HMR de shaders, bundle chico                |
| UI            | React 19                                      | capa DOM: textos, navegación, secciones                 |
| 3D            | `three` + `@react-three/fiber`                | Three.js declarativo, integrado al árbol de React       |
| Helpers 3D    | `@react-three/drei`                           | `View`, `useGLTF`, `Environment`, `Preload`, controles  |
| Post-proceso  | `@react-three/postprocessing`                 | bloom, DOF, vignette                                    |
| Estado        | `zustand`                                     | puente DOM ↔ canvas sin re-renders por frame            |
| Scroll        | `lenis`                                       | smooth scroll; publica `scrollProgress` (0..1) al store |
| Animación DOM | `gsap` + `@gsap/react`                        | timelines y `ScrollTrigger` sincronizado con Lenis      |
| Estilos       | Tailwind v4 (`@tailwindcss/vite`)             | tokens en `src/styles/index.css` (`@theme`)             |
| Íconos        | `lucide-react`                                | la misma librería que la app y el backoffice            |
| Shaders       | `vite-plugin-glsl`                            | importar `.vert` / `.frag` / `.glsl` con `#include`     |
| Calidad       | `oxlint`, `prettier`, `husky` + `lint-staged` | lint y formato en cada commit, y en CI                  |
| Dev           | `r3f-perf`, `leva`                            | FPS en pantalla; panel para tunear uniforms             |

## Scripts

```bash
npm install          # .npmrc ya trae legacy-peer-deps (drei + npm 10.8)
npm run dev          # http://localhost:5173
npm run build        # tsc -b && vite build → dist/
npm run preview      # sirve dist/
npm run lint         # oxlint
npm run format       # prettier --write
npm run typecheck    # tsc -b
```

Node 20.19 o superior (`.nvmrc`).

## Estructura

```
src/
  main.tsx              # bootstrap
  App.tsx               # compone Experience (canvas) + <main> (DOM)
  canvas/               # todo lo que corre dentro de <Canvas>
    Experience.tsx      # el único <Canvas>, fixed full-screen, z-0
    scenes/             # una escena por sección (HeroScene, ...)
    shaders/            # .vert / .frag
  ui/                   # todo lo que es DOM
    sections/           # secciones de la landing (Hero, Funciones, ...)
    components/         # navbar, botones, cards, mockup de celular
  store/useAppStore.ts  # Zustand: scrollProgress, lenis
  hooks/                # useSmoothScroll, useReducedMotion, useIsMobile
  lib/                  # utils puros
  styles/index.css      # Tailwind + @theme (tokens)
public/                 # logo, favicon, robots.txt, og-image
```

## Diseño

Los tokens de `src/styles/index.css` copian los de la app (`front/lab3-madero/styles/`): azul primario `#2E4A95` y su escala, superficies, grises de texto, paletas de etiquetas, radios y espaciados con nombre. La tipografía es **Plus Jakarta Sans**, cargada desde Google Fonts en `index.html`. Nada de colores ni medidas sueltas en los componentes.

Toda animación respeta `prefers-reduced-motion`: `useSmoothScroll` desactiva el smooth, `useReducedMotion` sirve para apagar lo demás.

## Deploy

Firebase Hosting (`firebase.json` apunta a `dist/`, con cache larga para assets). El proyecto de Firebase y el dominio los define [lab3-madero#476](https://github.com/FacultadDeIngenieria/lab3-madero/issues/476); cuando existan:

```bash
npx firebase-tools login
npx firebase-tools use <proyecto>   # crea .firebaserc
npm run build && npx firebase-tools deploy --only hosting
```

## Pendientes de configuración

- `public/og-image.png` (1200×630) y la URL final en los `og:` de `index.html`.
- `sitemap.xml` cuando el dominio esté definido.
- Links a las tiendas (lab3-madero#569) y a los textos legales del backoffice.
