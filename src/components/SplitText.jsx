import { useContext, useEffect, useRef } from 'react'
import { gsap, prefersReduced } from '../lib/motion'
import { ReadyContext } from '../lib/ready'

// Masked, staggered character / word reveal.
//   trigger="load"   → plays once the loader has finished (hero)
//   trigger="scroll" → plays when scrolled into view
export default function SplitText({
  text,
  as: Tag = 'span',
  mode = 'chars',
  trigger = 'scroll',
  delay = 0,
  className = '',
}) {
  const ref = useRef(null)
  const ready = useContext(ReadyContext)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const items = el.querySelectorAll('.split-inner')
    if (prefersReduced()) {
      gsap.set(items, { yPercent: 0, y: 0 })
      return
    }
    if (trigger === 'load' && !ready) return
    // Explicit from/to (with y:0) so GSAP doesn't inherit the CSS pre-hide offset as pixels.
    const from = { yPercent: 115, y: 0 }
    const vars = {
      yPercent: 0,
      y: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: mode === 'chars' ? 0.03 : 0.07,
      delay,
    }
    const ctx = gsap.context(() => {
      if (trigger === 'load') gsap.fromTo(items, from, vars)
      else gsap.fromTo(items, from, { ...vars, scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [ready, trigger, mode, delay, text])

  const words = text.split(' ')
  return (
    <Tag ref={ref} className={`split ${className}`} aria-label={text}>
      {words.map((word, wi) => (
        <span className="split-word" aria-hidden="true" key={wi}>
          {mode === 'chars' ? (
            [...word].map((ch, ci) => (
              <span className="split-mask" key={ci}>
                <span className="split-inner">{ch}</span>
              </span>
            ))
          ) : (
            <span className="split-mask">
              <span className="split-inner">{word}</span>
            </span>
          )}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
