import { useEffect, useRef } from 'react'
import { gsap, isFinePointer, prefersReduced } from '../lib/motion'

// Custom cursor — desktop / fine pointers only, never on touch or reduced motion.
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'none' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'none' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' })
    const rootEl = ring.current

    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      rootEl.dataset.visible = 'true'
      dot.current.dataset.visible = 'true'
    }
    const over = (e) => {
      const t = e.target.closest?.('a, button, input, textarea, [data-cursor]')
      rootEl.classList.toggle('is-hover', !!t)
      const text = t?.dataset?.cursor
      label.current.textContent = text || ''
      rootEl.classList.toggle('has-label', !!text)
    }
    const leaveDoc = () => {
      rootEl.dataset.visible = 'false'
      dot.current.dataset.visible = 'false'
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leaveDoc)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leaveDoc)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" data-visible="false">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" data-visible="false" />
    </>
  )
}
