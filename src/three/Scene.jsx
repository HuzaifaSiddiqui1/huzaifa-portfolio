import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Float, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { sceneState } from './sceneState'

const { damp } = THREE.MathUtils
const ACCENT = '#e4ff1a'
const FOV = 40
const REF_DIST = 7
const HALF_H = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * REF_DIST

// ── Shared geometries / materials (created once) ──────────────
const geos = {
  oct: new THREE.OctahedronGeometry(1, 0),
  ico: new THREE.IcosahedronGeometry(1, 0),
  torus: new THREE.TorusGeometry(0.8, 0.28, 24, 64),
  box: new THREE.BoxGeometry(1.2, 1.2, 1.2),
  tet: new THREE.TetrahedronGeometry(1.1, 0),
}
const mats = {
  chrome: new THREE.MeshStandardMaterial({ color: '#d8d8d8', metalness: 1, roughness: 0.16 }),
  accent: new THREE.MeshStandardMaterial({ color: ACCENT, metalness: 0.4, roughness: 0.3, emissive: ACCENT, emissiveIntensity: 0.35 }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#ffffff', metalness: 0, roughness: 0.05, transparent: true, opacity: 0.32, clearcoat: 1, clearcoatRoughness: 0.05 }),
}

const SATELLITES = [
  { shape: 'oct', mat: 'chrome', base: [-3.6, 1.7, -1.0], size: 0.34, speed: 1.1 },
  { shape: 'torus', mat: 'accent', base: [3.4, 2.1, -0.5], size: 0.3, speed: 0.9 },
  { shape: 'ico', mat: 'glass', base: [-2.4, -2.0, 0.6], size: 0.42, speed: 1.3 },
  { shape: 'box', mat: 'chrome', base: [4.4, -1.7, -1.2], size: 0.26, speed: 0.8 },
  { shape: 'tet', mat: 'accent', base: [-4.6, -0.2, -2.0], size: 0.3, speed: 1.0 },
  { shape: 'oct', mat: 'glass', base: [1.8, -2.7, 0.9], size: 0.36, speed: 1.2 },
  { shape: 'torus', mat: 'chrome', base: [-1.2, 2.8, -1.6], size: 0.28, speed: 0.7 },
  { shape: 'ico', mat: 'chrome', base: [5.2, 0.4, -2.2], size: 0.32, speed: 1.0 },
  { shape: 'box', mat: 'accent', base: [0.6, 3.2, -2.4], size: 0.2, speed: 1.4 },
]

function useWindowPointer() {
  useEffect(() => {
    const move = (e) => {
      sceneState.px = (e.clientX / window.innerWidth) * 2 - 1
      sceneState.py = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
}

function Rig({ reduced }) {
  useWindowPointer()
  useFrame(({ camera }, dt) => {
    const s = sceneState
    const m = reduced ? 0 : 1
    camera.position.x = damp(camera.position.x, s.px * 0.45 * m, 3, dt)
    camera.position.y = damp(camera.position.y, s.py * 0.28 * m, 3, dt)
    camera.position.z = damp(camera.position.z, s.camZ, 3, dt)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Centerpiece({ reduced }) {
  const group = useRef()
  const tilt = useRef()
  const knot = useRef()
  const shell = useRef()
  const ringA = useRef()
  const ringB = useRef()
  const knotMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#e6e6e6', metalness: 1, roughness: 0.14, envMapIntensity: 1.7, emissive: ACCENT, emissiveIntensity: 0 }),
    []
  )
  useEffect(() => () => knotMat.dispose(), [knotMat])

  useFrame((state, dt) => {
    const s = sceneState
    const aspect = state.size.width / state.size.height
    const narrow = aspect < 0.9
    const halfW = HALF_H * aspect

    const tx = narrow ? 0 : s.gx * halfW
    // Portrait phones: hero keeps a visible centerpiece above the title, then it
    // tucks up behind the nav so it never competes with the content.
    const away = Math.min(1, s.scroll * 12)
    const ty = narrow ? 1.55 + 0.5 * away : s.gy * HALF_H
    const sc = (narrow ? 0.5 - 0.1 * away : 1) * s.scale
    const intro = s.intro
    const g = group.current
    g.position.x = damp(g.position.x, tx, 4, dt)
    g.position.y = damp(g.position.y, ty, 4, dt)
    const target = sc * (0.001 + intro)
    g.scale.setScalar(damp(g.scale.x, target, 4, dt))

    const m = reduced ? 0 : 1
    tilt.current.rotation.z = damp(tilt.current.rotation.z, s.tilt, 3, dt)
    tilt.current.rotation.y = damp(tilt.current.rotation.y, s.px * 0.35 * m, 3, dt)
    tilt.current.rotation.x = damp(tilt.current.rotation.x, -s.py * 0.2 * m, 3, dt)

    if (!reduced) {
      knot.current.rotation.y += dt * (0.12 + s.spin)
      knot.current.rotation.x += dt * 0.05
      shell.current.rotation.y -= dt * 0.08
      shell.current.rotation.z += dt * 0.04
      ringA.current.rotation.z += dt * 0.15
      ringB.current.rotation.x -= dt * 0.12
    }
    knotMat.emissiveIntensity = damp(knotMat.emissiveIntensity, s.glow * 0.55, 3, dt)
  })

  return (
    <group ref={group}>
      <group ref={tilt}>
        <mesh ref={knot} material={knotMat}>
          <torusKnotGeometry args={[1, 0.34, 220, 32, 2, 3]} />
        </mesh>
        <mesh ref={shell}>
          <icosahedronGeometry args={[1.95, 1]} />
          <meshBasicMaterial wireframe color={ACCENT} transparent opacity={0.1} />
        </mesh>
        <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.4, 0.008, 8, 160]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.7} />
        </mesh>
        <mesh ref={ringB} rotation={[0.4, 0.6, 0]}>
          <torusGeometry args={[2.85, 0.006, 8, 160]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
        </mesh>
      </group>
    </group>
  )
}

function Satellite({ shape, mat, base, size, speed, narrow, reduced }) {
  const ref = useRef()
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, dt) => {
    const s = sceneState
    const aspect = state.size.width / state.size.height
    const k = s.spread * (narrow ? 0.55 : 1)
    // satellites orbit the centerpiece, so follow its group position too
    v.set(base[0] * k, base[1] * k, base[2] * k)
    ref.current.position.x = damp(ref.current.position.x, v.x, 3, dt)
    ref.current.position.y = damp(ref.current.position.y, v.y, 3, dt)
    ref.current.position.z = damp(ref.current.position.z, v.z, 3, dt)
    const target = size * s.sat * s.intro * (aspect < 0.9 ? 0.8 : 1)
    ref.current.scale.setScalar(damp(ref.current.scale.x, Math.max(target, 0.0001), 3, dt))
  })
  return (
    <group ref={ref}>
      <Float
        speed={reduced ? 0 : speed}
        rotationIntensity={reduced ? 0 : 1.4}
        floatIntensity={reduced ? 0 : 1.6}
      >
        <mesh geometry={geos[shape]} material={mats[mat]} />
      </Float>
    </group>
  )
}

function Satellites({ count, narrow, reduced }) {
  return SATELLITES.slice(0, count).map((s, i) => (
    <Satellite key={i} {...s} narrow={narrow} reduced={reduced} />
  ))
}

function Particles({ count, size, parallax, reduced }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 26
      a[i * 3 + 1] = (Math.random() - 0.5) * 18
      a[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2
    }
    return a
  }, [count])
  useFrame((_, dt) => {
    const p = ref.current
    if (!reduced) p.rotation.y += dt * 0.012
    p.position.y = sceneState.scroll * parallax
    p.material.opacity = damp(p.material.opacity, sceneState.particles * sceneState.intro, 3, dt)
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={size} sizeAttenuation color="#f2f6c4" transparent opacity={0} depthWrite={false} />
    </points>
  )
}

function Lights() {
  const point = useRef()
  useFrame((_, dt) => {
    const s = sceneState
    point.current.position.x = damp(point.current.position.x, s.px * 6, 4, dt)
    point.current.position.y = damp(point.current.position.y, s.py * 4, 4, dt)
    point.current.intensity = damp(point.current.intensity, 18 + s.glow * 30, 3, dt)
  })
  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[-4, 5, 4]} intensity={1.1} />
      <pointLight ref={point} position={[0, 0, 3.5]} color={ACCENT} distance={16} intensity={18} />
    </>
  )
}

export default function Scene({ mobile, reduced }) {
  const [dpr, setDpr] = useState(mobile ? 1.25 : 1.75)
  const count = mobile ? 5 : SATELLITES.length

  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: FOV, near: 0.1, far: 60 }}
        dpr={[1, dpr]}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <fog attach="fog" args={['#050505', 11, 26]} />
        <Lights />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={5} position={[0, 5, -4]} scale={[14, 2, 1]} />
          <Lightformer form="rect" intensity={3} position={[-6, 0, 2]} scale={[2, 8, 1]} />
          <Lightformer form="rect" intensity={2.5} position={[6, 1, 2]} scale={[2, 6, 1]} color={ACCENT} />
          <Lightformer form="ring" intensity={2} position={[0, -3, 4]} scale={5} />
        </Environment>
        <Rig reduced={reduced} />
        <Centerpiece reduced={reduced} />
        <Satellites count={count} narrow={mobile} reduced={reduced} />
        <Particles count={mobile ? 350 : 1100} size={0.022} parallax={3} reduced={reduced} />
        <Particles count={mobile ? 60 : 220} size={0.045} parallax={8} reduced={reduced} />
      </Canvas>
    </div>
  )
}
