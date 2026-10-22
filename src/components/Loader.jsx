import { useEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../lib/motion'
import { site } from '../data/site'

// Short (~1.4s), skippable intro. Click, Esc, Enter or the Skip button speeds it up.
export default function Loader({ onDone }) {
  const root = useRef(null)
  const num = useRef(null)
  const bar = useRef(null)
  const tl = useRef(null)

  useEffect(() => {
    const reduced = prefersReduced()
    const counter = { v: 0 }
    const t = gsap.timeline({ onComplete: onDone })
    tl.current = t
    t.to(counter, {
      v: 100,
      duration: reduced ? 0.2 : 1.3,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.v)
        if (num.current) num.current.textContent = String(v).padStart(3, '0')
        if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`
      },
    })
    t.to('.loader__center', { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' })
    t.to(root.current, { yPercent: -100, duration: reduced ? 0.01 : 0.8, ease: 'expo.inOut' })

    const skip = (e) => {
      if (e.type === 'keydown' && !['Escape', 'Enter', ' '].includes(e.key)) return
      t.timeScale(6)
    }
    window.addEventListener('keydown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      t.kill()
    }
  }, [onDone])

  return (
    <div className="loader" ref={root} role="status" aria-live="polite" onClick={() => tl.current?.timeScale(6)}>
      <div className="loader__top">
        <span>{site.name}</span>
        <button type="button" className="loader__skip" onClick={(e) => { e.stopPropagation(); tl.current?.timeScale(6) }}>
          Skip intro
        </button>
      </div>
      <div className="loader__center">
        <div className="loader__mono">{site.monogram}</div>
        <div className="loader__count">
          <span ref={num}>000</span>
        </div>
      </div>
      <div className="loader__bar">
        <span ref={bar} />
      </div>
    </div>
  )
}
