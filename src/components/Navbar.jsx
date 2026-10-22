import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { gsap, ScrollTrigger, scrollToId, getLenis } from '../lib/motion'
import { nav, site } from '../data/site'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const bar = useRef(null)
  const menu = useRef(null)

  // Active section indicator
  useEffect(() => {
    const ids = ['hero', ...nav.map((n) => n.id), 'services']
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Scroll progress bar
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
    })
    return () => st.kill()
  }, [])

  // Animated mobile menu + scroll lock + Escape to close
  useEffect(() => {
    const lenis = getLenis()
    if (open) {
      lenis?.stop()
      document.body.style.overflow = 'hidden'
      gsap.fromTo(menu.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.out' })
      gsap.fromTo('.menu__link', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: 'power3.out', delay: 0.15 })
    } else {
      lenis?.start()
      document.body.style.overflow = ''
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id) => {
    setOpen(false)
    // wait a tick so scrolling is re-enabled before we scroll
    setTimeout(() => scrollToId(id), 30)
  }

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span ref={bar} />
      </div>
      <header className="nav">
        <a
          href="#hero"
          className="nav__logo"
          aria-label={`${site.name} — back to top`}
          onClick={(e) => {
            e.preventDefault()
            go('hero')
          }}
        >
          {site.monogram}
        </a>

        <nav className="nav__links" aria-label="Primary">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`nav__link ${active === n.id ? 'is-active' : ''}`}
              aria-current={active === n.id ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault()
                go(n.id)
              }}
            >
              <span className="nav__dot" />
              {n.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {open && (
        <div className="menu" id="mobile-menu" ref={menu}>
          <nav aria-label="Mobile">
            {nav.map((n, i) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="menu__link"
                onClick={(e) => {
                  e.preventDefault()
                  go(n.id)
                }}
              >
                <small>{String(i + 1).padStart(2, '0')}</small>
                {n.label}
              </a>
            ))}
          </nav>
          <p className="menu__foot">{site.location}</p>
        </div>
      )}
    </>
  )
}
