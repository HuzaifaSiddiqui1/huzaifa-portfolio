import { useEffect } from 'react'
import { gsap, ScrollTrigger, prefersReduced } from '../lib/motion'

// Fades/lifts every [data-reveal] element inside `ref` as it scrolls into view.
export function useReveal(ref, selector = '[data-reveal]') {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return
    const items = el.querySelectorAll(selector)
    if (!items.length) return
    const triggers = ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
    })
    return () => {
      triggers.forEach((t) => t.kill())
      gsap.set(items, { clearProps: 'all' })
    }
  }, [ref, selector])
}
