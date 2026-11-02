# Red Madero — web

Landing pública de Red Madero: qué es la app, para quién es y cómo empezar a usarla. 100 % front, estática, sin backend ni login. Pensada para presentar la app en un stand: se recorre sección por sección y termina en un QR para descargarla. Ticket: [lab3-madero#629](https://github.com/FacultadDeIngenieria/lab3-madero/issues/629).

## Qué muestra

| Sección (id)                     | Qué hay                                                                                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portada (`#top`)                 | Claim, gradiente animado y dos iPhone 3D con la bienvenida y el inicio de la app. La tarjeta se achica al salir.                                            |
| Cómo funciona (`#como-funciona`) | Seis pasos del particular, uno por pantalla. Un iPhone 3D queda fijo y su pantalla cambia con cada paso (asistente, zona, perfil, presupuesto, chat, pago). |
| Oficios (`#oficios`)             | Los siete oficios del Instituto Madero (CFP N.° 405) que siembra el backend y el panel de verificación (identidad, título, revisión, habilitado).           |
| Profesionales (`#profesionales`) | Dos iPhone 3D que alternan solicitudes, armado de presupuesto, agenda y billetera.                                                                          |
| Confianza (`#confianza`)         | Verificación, reportar y bloquear, datos y pagos.                                                                                                           |
| Descargar (`#descargar`)         | El QR grande, los botones de tiendas y el pie de página.                                                                                                    |

Las pantallas de la app **no son capturas**: se dibujan en canvas (`src/screens/`) con los tokens, la tipografía, los íconos (lucide) y las ilustraciones de la app, y se usan como textura de los teléfonos 3D y de los teléfonos planos de la versión móvil. Cuando la app cambie, se actualizan ahí.

## Stack

| Capa          | Herramienta                                   | Para qué                                                |
| ------------- | --------------------------------------------- | ------------------------------------------------------- |
| Build         | Vite 8 + TypeScript                           | dev server, HMR de shaders, bundle chico                |
| UI            | React 19                                      | capa DOM: textos, navegación, secciones                 |
| 3D            | `three` + `@react-three/fiber`                | Three.js declarativo, integrado al árbol de React       |
| Helpers 3D    | `@react-three/drei`                           | `View`, `useGLTF`, `Environment`, `shaderMaterial`      |
| Estado        | `zustand`                                     | puente DOM ↔ canvas sin re-renders por frame            |
| Scroll        | `lenis`                                       | smooth scroll; publica `scrollProgress` (0..1) al store |
| Animación DOM | `gsap` + `@gsap/react`                        | timelines y `ScrollTrigger` sincronizado con Lenis      |
| Estilos       | Tailwind v4 (`@tailwindcss/vite`)             | tokens en `src/styles/index.css` (`@theme`)             |
| Íconos        | `lucide-react` (DOM) y `lucide` (canvas)      | la misma librería que la app y el backoffice            |
| QR            | `qrcode`                                      | genera los módulos; el SVG se dibuja a mano             |
| Shaders       | `vite-plugin-glsl`                            | importar `.vert` / `.frag` / `.glsl` con `#include`     |
| Calidad       | `oxlint`, `prettier`, `husky` + `lint-staged` | lint y formato en cada commit, y en CI                  |

## Scripts

```bash
npm install          # .npmrc ya trae legacy-peer-deps (drei + npm 10.8)
npm run dev          # http://localhost:5173 (o el puerto libre siguiente)
npm run build        # tsc -b && vite build → dist/
npm run preview      # sirve dist/
npm run lint         # oxlint
npm run format       # prettier --write
npm run typecheck    # tsc -b
```

Node 20.19 o superior (`.nvmrc`).

## Configuración

Todo es opcional y va en `.env` (ver `.env.example`):

| Variable              | Qué hace                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `VITE_DOWNLOAD_URL`   | Lo que codifica el QR. Sin definir, apunta a este mismo sitio (`#descargar`), que en un teléfono muestra las tiendas. |
| `VITE_APP_STORE_URL`  | Link del App Store. Sin definir, el botón dice «Pronto en App Store».                                                 |
| `VITE_PLAY_STORE_URL` | Link de Google Play. Ídem.                                                                                            |
| `VITE_PRIVACY_URL`    | Política de privacidad (la publica el backoffice, lab3-madero#522). Sin definir, el link no aparece.                  |
| `VITE_TERMS_URL`      | Términos y condiciones. Ídem.                                                                                         |

## Estructura

```
src/
  main.tsx              # bootstrap
  App.tsx               # loader, Experience (canvas) + <main> (DOM)
  canvas/               # todo lo que corre dentro de <Canvas>
    Experience.tsx      # el único <Canvas>, fixed full-screen; una <View> por escenario
    scenes/             # HeroPhoneScene (2 teléfonos), FlowPhoneScene (1), ProPhonesScene (2)
    materials/          # PhoneScreenMaterial (barrido entre pantallas), HeroMaterial, useScreenTextures
    shaders/            # .vert / .frag
    phoneRig.ts         # clona el GLB, reemplaza la pantalla por el shader
  screens/              # las pantallas de la app dibujadas en canvas (particular.ts, professional.ts)
  ui/                   # todo lo que es DOM
    sections/           # Hero, Flow, Trades, Pro, Trust, Download
    components/         # Nav, Loader, SectionDots, PhoneFrame (teléfono plano), PhonePair, QrCode, FloatingCta
  store/useAppStore.ts  # Zustand: scroll, lenis, viewports y estado de cada escenario
  hooks/                # useSmoothScroll, useSectionDock (una sección por gesto), useTravel, useIsMobile, ...
  lib/                  # content.ts (todos los textos), links.ts (env)
  styles/index.css      # Tailwind + @theme (tokens) + estilos de componentes
public/
  models/iphone-17-pro.glb   # comprimido con gltf-transform (Draco + WebP), 1.4 MB
  draco/                     # decoder de Draco, servido desde acá
  brand/ mascota/ avatars/ app/ ilustraciones/   # assets de la app en WebP
```

Reglas que mantienen esto sano:

1. **Un solo `<Canvas>`**, fijo y por encima del DOM con `pointer-events: none`. Cada escena se recorta a un div de la página con `<View track>`; el DOM solo deja el hueco.
2. **`canvas/` y `ui/` no se importan entre sí.** Se comunican por el store (viewport, visible, paso activo).
3. **Dentro de `useFrame` se mutan refs, no estado de React.** El store se lee con `getState()`.
4. **Scroll por secciones** (`useSectionDock`): cada sección de pantalla completa se ancla arriba y el siguiente gesto viaja a la vecina. En móvil el scroll es libre y no hay 3D: los teléfonos son `PhoneFrame` (CSS + canvas).
5. **Las pantallas se pintan una vez** (`useScreenTextures`) y se comparten entre teléfonos.

## Diseño

Los tokens de `src/styles/index.css` copian los de la app (`front/lab3-madero/styles/`): azul primario `#2E4A95` y su escala, superficies, grises de texto, paletas de etiquetas e info cards, radios. La tipografía es **Plus Jakarta Sans**, cargada desde Google Fonts en `index.html`. Nada de colores ni medidas sueltas en los componentes. Los tokens de espaciado con nombre (`md`, `lg`, `xl`) no se definen a propósito: en Tailwind v4 pisan a `max-w-md` y compañía.

Toda animación respeta `prefers-reduced-motion`: `useSmoothScroll` desactiva el smooth, `useReducedMotion` apaga lo demás.

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
- Links a las tiendas (lab3-madero#569) y a los textos legales del backoffice (variables de arriba).
- El modelo del iPhone viene de Sketchfab; confirmar su licencia y agregar la atribución que pida antes de publicar.
