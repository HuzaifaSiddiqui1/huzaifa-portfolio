import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/motion'
import { KEYS, SECTION_ORDER, sceneState } from '../three/sceneState'

// Links the 3D scene to scroll: entering each section tweens the shared scene
// state from the previous section's keyframe to the next one (scrubbed).
export function useSceneScroll(enabled) {
  useEffect(() => {
    if (!enabled) return
    const ctx = gsap.context(() => {
      SECTION_ORDER.forEach((id, i) => {
        if (i === 0 || !document.getElementById(id)) return
        gsap.fromTo(
          sceneState,
          { ...KEYS[SECTION_ORDER[i - 1]] },
          {
            ...KEYS[id],
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: `#${id}`, start: 'top 90%', end: 'top 20%', scrub: 1 },
          }
        )
      })
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          sceneState.scroll = self.progress
        },
      })
    })
    return () => ctx.revert()
  }, [enabled])
}
