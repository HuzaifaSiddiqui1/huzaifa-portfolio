import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// Flag reduced-motion early so CSS can show content without animation.
const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
const flag = () => document.documentElement.classList.toggle('reduced', mq.matches)
flag()
mq.addEventListener('change', flag)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
