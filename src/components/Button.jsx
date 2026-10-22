import { useEffect, useRef } from 'react'
import { gsap, isFinePointer, prefersReduced, scrollToId } from '../lib/motion'

// Magnetic button / link. Pass `to="section-id"` for smooth in-page scrolling.
export default function Button({ to, href, variant = 'solid', children, icon, className = '', onClick, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer() || prefersReduced()) return
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * 0.25)
      y((e.clientY - (r.top + r.height / 2)) * 0.35)
    }
    const leave = () => {
      x(0)
      y(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [])

  const cls = `btn btn--${variant} ${className}`
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {icon ? <span className="btn__icon">{icon}</span> : null}
    </>
  )

  if (to) {
    return (
      <a
        ref={ref}
        href={`#${to}`}
        className={cls}
        onClick={(e) => {
          e.preventDefault()
          scrollToId(to)
          onClick?.(e)
        }}
        {...rest}
      >
        {inner}
      </a>
    )
  }
  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a
        ref={ref}
        href={href}
        className={cls}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={onClick}
        {...rest}
      >
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  )
}
