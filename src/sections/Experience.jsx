import { useEffect, useRef } from 'react'
import SplitText from '../components/SplitText'
import { useReveal } from '../hooks/useReveal'
import { gsap, ScrollTrigger, prefersReduced } from '../lib/motion'
import { experience } from '../data/experience'

export default function Experience() {
  const root = useRef(null)
  const line = useRef(null)
  useReveal(root)

  // Timeline line draws itself as you scroll through the list
  useEffect(() => {
    if (prefersReduced()) {
      gsap.set(line.current, { scaleY: 1 })
      return
    }
    const tween = gsap.fromTo(
      line.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
      }
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section id="experience" className="section experience" ref={root}>
      <div className="section__head">
        <p className="eyebrow" data-reveal>
          <span className="eyebrow__line" /> 04 — Experience
        </p>
        <SplitText as="h2" text="WHERE I'VE WORKED" className="display" />
      </div>

      <ol className="timeline">
        <span className="timeline__line" ref={line} aria-hidden="true" />
        {experience.map((job, i) => (
          <li className={`job ${job.placeholder ? 'is-placeholder' : ''}`} key={job.company} data-reveal>
            <span className="job__node" aria-hidden="true" />
            <div className="job__period">{job.period}</div>
            <div className="job__body">
              <h3 className="job__company">{job.company}</h3>
              <p className="job__role">{job.role}</p>
              <ul className="job__points">
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {job.placeholder && (
                <p className="job__note">Placeholder — edit src/data/experience.js with details from the CV.</p>
              )}
            </div>
            <span className="job__index" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
