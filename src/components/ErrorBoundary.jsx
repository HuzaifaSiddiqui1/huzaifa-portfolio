import { Component } from 'react'

// If WebGL is unavailable the site still works — the 3D layer just disappears.
export default class ErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('3D scene disabled:', err?.message || err)
  }
  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children
  }
}
