import { useRef, useState } from 'react'
import { AlertCircle, ArrowUpRight, Check, Github, Linkedin, Mail, MessageCircle, Send } from 'lucide-react'
import SplitText from '../components/SplitText'
import Button from '../components/Button'
import { useReveal } from '../hooks/useReveal'
import { scrollToId } from '../lib/motion'
import { nav, site } from '../data/site'

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT
const W3F_KEY = import.meta.env.VITE_WEB3FORMS_KEY

const validate = (v) => {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.message.trim().length < 10) e.message = 'Tell me a little more (at least 10 characters).'
  return e
}

// A contact link, or a clearly marked placeholder if the detail wasn't supplied.
function ContactLink({ href, icon, label, hint, primary }) {
  if (!href) {
    return (
      <span className="btn btn--ghost btn--placeholder" title={hint} aria-disabled="true">
        <span className="btn__icon">{icon}</span>
        <span className="btn__label">{label} — add in site.js</span>
      </span>
    )
  }
  return (
    <Button href={href} variant={primary ? 'solid' : 'ghost'} icon={icon}>
      {label}
    </Button>
  )
}

export default function Contact() {
  const root = useRef(null)
  useReveal(root)
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus('idle')
      root.current.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus()
      return
    }
    if (!ENDPOINT) {
      // Be honest: nothing is configured, so nothing is sent.
      setStatus('error')
      setErrorMsg(
        site.email
          ? `The form isn't connected to an email service yet, so your message was not sent. Please email ${site.email} directly.`
          : "The form isn't connected to an email service yet, so your message was not sent."
      )
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, ...(W3F_KEY ? { access_key: W3F_KEY } : {}) }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('success')
      setValues({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong while sending. Please try again in a moment.')
    }
  }

  const waHref = site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g, '')}` : ''

  return (
    <section id="contact" className="section contact" ref={root}>
      <div className="contact__grid">
        <div className="contact__intro">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow__line" /> 06 — Contact
          </p>
          <SplitText as="h2" text="LET'S BUILD SOMETHING GREAT." mode="words" className="display display--xl" />
          <p className="contact__lead" data-reveal>
            Have a project in mind or looking for a developer? Let&rsquo;s connect and discuss how I can help.
          </p>
          <div className="contact__links" data-reveal>
            <ContactLink
              primary
              href={site.email ? `mailto:${site.email}` : ''}
              icon={<Mail size={16} />}
              label="Email me"
              hint="Set `email` in src/data/site.js"
            />
            <ContactLink
              href={site.linkedin}
              icon={<Linkedin size={16} />}
              label="LinkedIn"
              hint="Set `linkedin` in src/data/site.js"
            />
            <ContactLink
              href={site.github}
              icon={<Github size={16} />}
              label="GitHub"
              hint="Set `github` in src/data/site.js"
            />
            <ContactLink
              href={waHref}
              icon={<MessageCircle size={16} />}
              label="WhatsApp"
              hint="Set `whatsapp` in src/data/site.js"
            />
          </div>
        </div>

        <form className="form" onSubmit={onSubmit} noValidate data-reveal aria-describedby="form-status">
          <div className={`field ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="c-name">Name</label>
            <input
              id="c-name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={onChange}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'e-name' : undefined}
            />
            {errors.name && (
              <p className="field__error" id="e-name" role="alert">
                {errors.name}
              </p>
            )}
          </div>
          <div className={`field ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="c-email">Email</label>
            <input
              id="c-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={onChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'e-email' : undefined}
            />
            {errors.email && (
              <p className="field__error" id="e-email" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div className={`field ${errors.message ? 'has-error' : ''}`}>
            <label htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={onChange}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'e-message' : undefined}
            />
            {errors.message && (
              <p className="field__error" id="e-message" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          <button type="submit" className={`submit ${status}`} disabled={status === 'sending'}>
            <span className="submit__label">
              {status === 'sending' ? 'Sending…' : status === 'success' ? 'Sent' : 'Send message'}
            </span>
            <span className="submit__icon">{status === 'success' ? <Check size={18} /> : <Send size={18} />}</span>
          </button>

          <div id="form-status" role="status" aria-live="polite" className="form__status">
            {status === 'success' && (
              <p className="msg msg--ok">
                <Check size={16} /> Thanks — your message has been sent. I&rsquo;ll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="msg msg--err">
                <AlertCircle size={16} /> {errorMsg}
              </p>
            )}
          </div>
        </form>
      </div>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <nav aria-label="Footer">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(n.id)
              }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a
          href="#hero"
          className="footer__top"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('hero')
          }}
        >
          Back to top <ArrowUpRight size={14} />
        </a>
      </footer>
    </section>
  )
}
