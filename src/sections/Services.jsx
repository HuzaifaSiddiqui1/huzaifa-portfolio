import { useRef } from 'react'
import SplitText from '../components/SplitText'
import { useReveal } from '../hooks/useReveal'
import { useTilt } from '../hooks/useTilt'
import { services } from '../data/services'

function ServiceCard({ s, i }) {
  const ref = useRef(null)
  useTilt(ref, { max: 5 })
  const Icon = s.icon
  return (
    <li className="service" ref={ref} data-reveal>
      <span className="service__num">{String(i + 1).padStart(2, '0')}</span>
      <span className="service__icon" aria-hidden="true">
        <Icon size={26} strokeWidth={1.5} />
      </span>
      <h3 className="service__title">{s.title}</h3>
      <p className="service__text">{s.text}</p>
    </li>
  )
}

export default function Services() {
  const root = useRef(null)
  useReveal(root)
  return (
    <section id="services" className="section services" ref={root}>
      <div className="section__head">
        <p className="eyebrow" data-reveal>
          <span className="eyebrow__line" /> 05 — Services
        </p>
        <SplitText as="h2" text="WHAT I CAN DO FOR YOU" className="display" />
      </div>
      <ul className="services__grid">
        {services.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} />
        ))}
      </ul>
    </section>
  )
}
