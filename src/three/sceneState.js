// Shared, mutable scene state. GSAP ScrollTriggers tween these numbers as the
// visitor scrolls; the R3F components read them every frame (no React re-renders).
//
//   gx / gy : centerpiece position as a fraction of half the viewport (-1..1)
//   scale   : centerpiece size       camZ : camera distance
//   spread  : how far satellites orbit from the centerpiece
//   sat     : satellite size multiplier     tilt : roll of the whole group
//   glow    : emissive glow on the centerpiece   particles : particle opacity
//   spin    : extra autonomous rotation speed

export const KEYS = {
  hero:       { gx: 0.55,  gy: -0.02, scale: 0.88, camZ: 7.0, spread: 1.0, sat: 0.8, tilt: 0.0,  glow: 0.0, particles: 0.55, spin: 0.2 },
  about:      { gx: -0.62, gy: 0.05,  scale: 0.95, camZ: 6.2, spread: 1.3, sat: 0.9, tilt: 0.25, glow: 0.1, particles: 0.5,  spin: 0.12 },
  skills:     { gx: 0.88,  gy: -0.5,  scale: 0.5,  camZ: 8.2, spread: 1.45, sat: 1.35, tilt: -0.2, glow: 0.2, particles: 0.7,  spin: 0.3 },
  projects:   { gx: 0.78,  gy: -0.45, scale: 0.5,  camZ: 9.0, spread: 0.7, sat: 0.7, tilt: 0.6,  glow: 0.0, particles: 0.35, spin: 0.5 },
  experience: { gx: -0.92, gy: 0.3,   scale: 0.55, camZ: 8.5, spread: 1.1, sat: 0.6, tilt: -0.4, glow: 0.1, particles: 0.4,  spin: 0.15 },
  services:   { gx: 0.8,   gy: 0.0,   scale: 0.72, camZ: 8.0, spread: 1.5, sat: 1.0, tilt: 0.3,  glow: 0.15, particles: 0.5, spin: 0.2 },
  contact:    { gx: 0.64,  gy: -0.05, scale: 0.78, camZ: 7.0, spread: 0.7, sat: 0.35, tilt: 0.0, glow: 0.6, particles: 0.45, spin: 0.1 },
}

export const SECTION_ORDER = ['hero', 'about', 'skills', 'projects', 'experience', 'services', 'contact']

export const sceneState = {
  ...KEYS.hero,
  intro: 0, // 0 → 1 on first load
  scroll: 0, // page progress 0 → 1
  px: 0, // pointer -1..1
  py: 0,
}
