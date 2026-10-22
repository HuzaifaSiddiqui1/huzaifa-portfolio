import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ImageOff } from 'lucide-react'
import SplitText from '../components/SplitText'
import { useTilt } from '../hooks/useTilt'
import { gsap, ScrollTrigger } from '../lib/motion'
import { projects } from '../data/projects'

// Preview source chain: your own file → live screenshot service → clean placeholder.
const sources = (p) => [
  `/screenshots/${p.slug}.jpg`,
  `https://s0.wp.com/mshots/v1/${encodeURIComponent(p.url)}?w=1280&h=800`,
]

function Shot({ project }) {
  const [step, setStep] = useState(0)
  const list = sources(project)
  if (step >= list.length) {
    return (
      <div className="shot shot--empty" role="img" aria-label={`${project.title} preview placeholder`}>
        <ImageOff size={28} aria-hidden="true" />
        <p>
          Add a screenshot at
          <br />
          <code>public/screenshots/{project.slug}.jpg</code>
        </p>
      </div>
    )
  }
  return (
    <img
      className="shot"
      src={list[step]}
      alt={`Screenshot of ${project.title} website`}
      loading="lazy"
      decoding="async"
      width="1280"
      height="800"
      onError={() => setStep((s) => s + 1)}
    />
  )
}

function Card({ project, index }) {
  const media = useRef(null)
  useTilt(media, { max: 4, scale: 1.01 })
  return (
    <article className="project">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="project__link"
        data-cursor="View"
        aria-label={`View project: ${project.title} (opens in a new tab)`}
      >
        <div className="project__media" ref={media}>
          <Shot project={project} />
          <div className="project__overlay">
            <span>
              View Project <ArrowUpRight size={18} />
            </span>
          </div>
        </div>
        <div className="project__meta">
          <span className="project__num">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="project__title">{project.title}</h3>
            <p className="project__cat">
              {project.category} <span className="muted">· {project.host}</span>
            </p>
          </div>
        </div>
      </a>
    </article>
  )
}

export default function Projects() {
  const pin = useRef(null)
  const track = useRef(null)
  const counter = useRef(null)
  const fill = useRef(null)

  useEffect(() => {
    // Desktop: pinned horizontal showcase. Mobile / reduced motion: plain vertical list.
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const getDist = () => Math.max(0, track.current.scrollWidth - window.innerWidth)
      const tween = gsap.to(track.current, { x: () => -getDist(), ease: 'none' })
      ScrollTrigger.create({
        trigger: pin.current,
        start: 'top top',
        end: () => `+=${getDist()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tween,
        onUpdate: (self) => {
          const n = projects.length
          const idx = Math.min(n, Math.floor(self.progress * n) + 1)
          if (counter.current) counter.current.textContent = String(idx).padStart(2, '0')
          if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`
        },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="projects" className="projects">
      <div className="projects__pin" ref={pin}>
        <div className="projects__head">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__line" /> 03 — Selected work
            </p>
            <SplitText as="h2" text="FEATURED PROJECTS" className="display" />
          </div>
          <div className="projects__count" aria-hidden="true">
            <span ref={counter}>01</span>
            <i>/</i>
            <span>{String(projects.length).padStart(2, '0')}</span>
            <div className="projects__bar">
              <span ref={fill} />
            </div>
          </div>
        </div>

        <div className="projects__track" ref={track}>
          {projects.map((p, i) => (
            <Card key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
