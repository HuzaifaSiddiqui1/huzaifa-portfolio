import { useContext, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import SplitText from '../components/SplitText'
import Button from '../components/Button'
import { ReadyContext } from '../lib/ready'
import { gsap, prefersReduced, scrollToId } from '../lib/motion'
import { site } from '../data/site'

function LocalTime() {
  const [t, setT] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: site.timeZone,
    })
    const tick = () => setT(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="hud hud--time">
      <span className="muted">Local time</span>
      <strong>
        {site.timeZoneLabel} {t}
      </strong>
    </div>
  )
}

export default function Hero() {
  const ready = useContext(ReadyContext)
  const root = useRef(null)

  useEffect(() => {
    if (!ready || prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero [data-in]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.5 })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="hero" className="hero" ref={root}>
      <div className="hero__top">
        <p className="eyebrow" data-in>
          <span className="eyebrow__line" /> Hello, I&rsquo;m
        </p>
      </div>

      <div className="hero__main">
        <h1 className="hero__title" aria-label={site.name}>
          <SplitText as="span" text="HUZAIFA" trigger="load" className="hero__line hero__line--a" />
          <SplitText as="span" text="SIDDIQUI" trigger="load" delay={0.15} className="hero__line hero__line--b" />
        </h1>
        <p className="hero__role" data-in>
          WordPress Developer <i>·</i> CMS Specialist <i>·</i> Frontend Developer
        </p>
        <p className="hero__lead" data-in>
          I build modern, responsive digital experiences that combine clean design, functionality, and performance.
        </p>
        <div className="hero__cta" data-in>
          <Button to="projects" icon={<ArrowDown size={16} />}>
            Explore My Work
          </Button>
          <Button to="contact" variant="ghost" icon={<ArrowUpRight size={16} />}>
            Let&rsquo;s Connect
          </Button>
        </div>
      </div>

      <div className="hero__bar" data-in>
        <div className="hud hud--status">
          <span className="status-dot" aria-hidden="true" />
          <span>
            Open to new projects
            <span className="muted"> · {site.location}</span>
          </span>
        </div>
        <a
          href="#about"
          className="hud hud--scroll"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('about')
          }}
          aria-label="Scroll to About"
        >
          <span className="scroll-line" aria-hidden="true" />
          <span>Scroll</span>
        </a>
        <LocalTime />
      </div>
    </section>
  )
}
