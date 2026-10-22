# Huzaifa Siddiqui — 3D Portfolio

React + Vite, Three.js (React Three Fiber + Drei), GSAP ScrollTrigger and Lenis.

## Run locally (VS Code terminal)

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build: `npm run build` then `npm run preview`.
Requires Node 18+.

## Fill in your real details

Nothing below was invented — anything unknown is a visible placeholder.

| What | Where |
| --- | --- |
| Email, LinkedIn, GitHub, WhatsApp | `src/data/site.js` (empty = shows an "add in site.js" placeholder) |
| Experience (roles, dates, bullets) | `src/data/experience.js` — **the CV was not received**, so only the company names are filled in. Replace each `placeholder: true` entry with your CV details. |
| Project list / categories | `src/data/projects.js` |
| Skills / services | `src/data/skills.js`, `src/data/services.js` |
| Colours | CSS variables at the top of `src/styles/global.css` (`--accent` is the yellow) |

## Project screenshots

Each card tries, in order:

1. `public/screenshots/<slug>.jpg` — **your own screenshot (recommended)**
2. a live preview from WordPress's `s0.wp.com/mshots` service (loaded in the visitor's browser)
3. a clean placeholder that tells you the exact filename to add

Slugs: `total-medical-az`, `zced-dubai`, `five-pearls`, `ibg-middle-east`, `orontes`,
`manjaros-restaurant`, `bvf-builds`, `wood-supply-uae`. Use ~1280×800 JPGs.

## Contact form

Until you connect a service the form validates but shows an honest "not sent" message.
To receive messages, copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT`
(Formspree: `https://formspree.io/f/xxxx`, or Web3Forms plus `VITE_WEB3FORMS_KEY`).
Restart `npm run dev` afterwards.

## How the 3D scroll works

- `src/three/sceneState.js` holds one keyframe per section (position, scale, camera distance,
  satellite spread, glow…). Edit the numbers to re-choreograph the scene.
- `src/hooks/useSceneScroll.js` scrubs between keyframes with ScrollTrigger as each section enters.
- `src/three/Scene.jsx` reads that state every frame (no React re-renders).
- Lenis drives scrolling through GSAP's ticker, so there is only one smooth-scroll system.

## Structure

```
src/
  components/  Navbar, Loader, Cursor, Button (magnetic), SplitText, ErrorBoundary
  sections/    Hero, About, Skills, Projects, Experience, Services, Contact
  three/       Scene.jsx, sceneState.js
  hooks/       useSceneScroll, useReveal, useTilt, useIsMobile
  data/        site, projects, skills, experience, services
  lib/         motion.js (GSAP + Lenis setup), ready.js
  styles/      global.css
```

## Notes

- Mobile: fewer particles and satellites, lower pixel ratio, no custom cursor, no pinned horizontal
  scroll (projects become a vertical list).
- `prefers-reduced-motion`: no smooth-scroll, no pinning, no autonomous 3D motion or parallax.
- If WebGL is unavailable the 3D layer is skipped and the rest of the site still works.
- Fonts (Bebas Neue, Instrument Serif, JetBrains Mono) load from Google Fonts; fallbacks are set.
