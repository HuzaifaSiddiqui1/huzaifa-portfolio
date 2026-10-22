import { useEffect } from 'react'
import { gsap, isFinePointer, prefersReduced } from '../lib/motion'

// Subtle 3D tilt that follows the pointer (desktop / fine pointers only).
export function useTilt(ref, { max = 6, scale = 1 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer() || prefersReduced()) return
    gsap.set(el, { transformPerspective: 900 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })
    const sc = gsap.quickTo(el, 'scale', { duration: 0.5, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      ry(x * max * 2)
      rx(-y * max * 2)
      sc(scale)
      el.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
      el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
    }
    const leave = () => {
      rx(0)
      ry(0)
      sc(1)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [ref, max, scale])
}
