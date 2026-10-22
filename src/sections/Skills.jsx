import { useRef } from 'react'
import SplitText from '../components/SplitText'
import { useReveal } from '../hooks/useReveal'
import { useTilt } from '../hooks/useTilt'
import { skillGroups } from '../data/skills'

function Chip({ label, i }) {
  const ref = useRef(null)
  useTilt(ref, { max: 14, scale: 1.06 })
  return (
    <li
      ref={ref}
      className="chip"
      data-reveal
      style={{ '--d': `${(i % 5) * -1.1}s`, '--amp': `${6 + (i % 4) * 2}px` }}
    >
      <span className="chip__glow" aria-hidden="true" />
      {label}
    </li>
  )
}

export default function Skills() {
  const root = useRef(null)
  useReveal(root)

  return (
    <section id="skills" className="section skills" ref={root}>
      <div className="section__head section__head--center">
        <p className="eyebrow" data-reveal>
          <span className="eyebrow__line" /> 02 — Skills &amp; technologies
        </p>
        <SplitText as="h2" text="TOOLS I BUILD WITH" className="display" />
      </div>

      <div className="skills__groups">
        {skillGroups.map((g, gi) => (
          <div className="skills__group" key={g.title}>
            <h3 className="skills__title" data-reveal>
              <span>{String(gi + 1).padStart(2, '0')}</span> {g.title}
            </h3>
            <ul className="chips">
              {g.items.map((s, i) => (
                <Chip key={s} label={s} i={i + gi * 3} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
