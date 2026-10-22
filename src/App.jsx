import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { gsap, ScrollTrigger, getLenis, prefersReduced, startLenis } from './lib/motion'
import { ReadyContext } from './lib/ready'
import { useIsMobile } from './hooks/useIsMobile'
import { useSceneScroll } from './hooks/useSceneScroll'
import { sceneState } from './three/sceneState'
import ErrorBoundary from './components/ErrorBoundary'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Services from './sections/Services'
import Contact from './sections/Contact'

// Three.js is code-split: the page content renders before the 3D bundle arrives.
const Scene = lazy(() => import('./three/Scene'))

export default function App() {
  const [ready, setReady] = useState(false)
  const mobile = useIsMobile()
  const reduced = prefersReduced()

  // One smooth-scroll system, synced with ScrollTrigger via GSAP's ticker.
  useEffect(() => {
    const stop = startLenis()
    getLenis()?.stop() // hold scrolling during the short intro
    return stop
  }, [])

  const onLoaded = useCallback(() => {
    setReady(true)
    getLenis()?.start()
    gsap.to(sceneState, { intro: 1, duration: reduced ? 0.01 : 1.8, ease: 'power3.out' })
  }, [reduced])

  // Scroll-linked 3D keyframes (created after the sections' own ScrollTriggers/pins)
  useSceneScroll(ready)

  // Recalculate trigger positions once fonts / layout settle
  useEffect(() => {
    if (!ready) return
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [ready])

  return (
    <ReadyContext.Provider value={ready}>
      <a className="skip-link" href="#about">
        Skip to content
      </a>

      <ErrorBoundary>
        <Suspense fallback={null}>
          <Scene mobile={mobile} reduced={reduced} />
        </Suspense>
      </ErrorBoundary>

      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Services />
        <Contact />
      </main>

      {!ready && <Loader onDone={onLoaded} />}
    </ReadyContext.Provider>
  )
}
