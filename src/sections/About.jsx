import { useRef } from 'react'
import SplitText from '../components/SplitText'
import { useReveal } from '../hooks/useReveal'

const highlights = [
  'WordPress website development',
  'Elementor and visual page building',
  'CMS-based website customization',
  'Shopify and e-commerce websites',
  'Responsive UI implementation',
  'Website performance and usability',
  'Frontend styling and interactive elements',
]

export default function About() {
  const root = useRef(null)
  useReveal(root)

  return (
    <section id="about" className="section about" ref={root}>
      <div className="section__head">
        <p className="eyebrow" data-reveal>
          <span className="eyebrow__line" /> 01 — About
        </p>
        <SplitText as="h2" text="A LITTLE ABOUT ME" className="display" />
      </div>

      <div className="about__grid">
        <div className="about__spacer" aria-hidden="true" />
        <div className="about__body">
          <p className="about__lead" data-reveal>
            I&rsquo;m a developer focused on creating <em>modern websites and digital experiences</em> using CMS
            platforms, page builders, frontend technologies, and responsive design.
          </p>
          <p className="about__text" data-reveal>
            My work sits where design meets function: turning layouts into clean, usable websites that load well,
            adapt to every screen, and are simple for clients to manage.
          </p>
          <ul className="about__list">
            {highlights.map((h, i) => (
              <li key={h} data-reveal>
                <span className="about__num">{String(i + 1).padStart(2, '0')}</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
