import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { Globe2, MapPin, TreePine, CalendarCheck, ChevronRight, Hand } from 'lucide-react'
import IN from 'country-flag-icons/react/3x2/IN'
import TH from 'country-flag-icons/react/3x2/TH'
import AE from 'country-flag-icons/react/3x2/AE'
import US from 'country-flag-icons/react/3x2/US'
import NP from 'country-flag-icons/react/3x2/NP'
import QA from 'country-flag-icons/react/3x2/QA'
import MY from 'country-flag-icons/react/3x2/MY'
import DK from 'country-flag-icons/react/3x2/DK'
import NO from 'country-flag-icons/react/3x2/NO'
import BD from 'country-flag-icons/react/3x2/BD'
import OM from 'country-flag-icons/react/3x2/OM'
import AU from 'country-flag-icons/react/3x2/AU'
import OUTLINES from '../../assets/garden/countryOutlines.json'
import worldTexUrl from '../../assets/garden/worldTexture.svg'
import worldSpecUrl from '../../assets/garden/worldSpec.svg'
import worldGlowUrl from '../../assets/garden/worldGlow.svg'
import './GardenGlobe.css'

type Site = {
  key: string
  name: string
  gardens: number
  lat: number
  lng: number
  hub?: boolean
}

const FLAGS: Record<string, ComponentType> = {
  in: IN, th: TH, ae: AE, us: US, np: NP, qa: QA,
  my: MY, dk: DK, no: NO, bd: BD, om: OM, au: AU,
}

// Garden sites open to visitors, per country.
const SITES: Site[] = [
  { key: 'in', name: 'India', gardens: 24, lat: 22.0, lng: 78.9, hub: true },
  { key: 'th', name: 'Thailand', gardens: 5, lat: 15.8, lng: 100.9 },
  { key: 'ae', name: 'Dubai', gardens: 4, lat: 25.2, lng: 55.3 },
  { key: 'us', name: 'United States', gardens: 3, lat: 39.8, lng: -98.5 },
  { key: 'np', name: 'Nepal', gardens: 2, lat: 28.4, lng: 84.1 },
  { key: 'qa', name: 'Qatar', gardens: 2, lat: 25.3, lng: 51.2 },
  { key: 'my', name: 'Malaysia', gardens: 2, lat: 4.2, lng: 102.0 },
  { key: 'bd', name: 'Bangladesh', gardens: 2, lat: 23.7, lng: 90.4 },
  { key: 'dk', name: 'Denmark', gardens: 1, lat: 56.2, lng: 9.5 },
  { key: 'no', name: 'Norway', gardens: 1, lat: 61.0, lng: 9.0 },
  { key: 'om', name: 'Oman', gardens: 1, lat: 21.0, lng: 57.0 },
  { key: 'au', name: 'Australia', gardens: 1, lat: -25.0, lng: 134.0 },
]

const TOTAL_GARDENS = SITES.reduce((n, s) => n + s.gardens, 0)

const STATS = [
  { Icon: Globe2, num: `${SITES.length}`, label: 'Countries', desc: 'Gardens you can walk through on four continents.' },
  { Icon: MapPin, num: `${TOTAL_GARDENS}`, label: 'Garden Sites', desc: 'Real plantations, open to every grower.' },
  { Icon: TreePine, num: '12,450', label: 'Trees Planted', desc: 'Each one tracked from sapling to canopy.' },
  { Icon: CalendarCheck, num: '365', label: 'Days Open', desc: 'Book a visit and meet your tree in person.' },
]

const gardenLabel = (n: number) => `${n} ${n === 1 ? 'garden' : 'gardens'}`

const RADIUS = 1
function llToVec3(lat: number, lng: number, r: number) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lng + 180) * Math.PI) / 180
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  )
}
const d2r = (d: number) => (d * Math.PI) / 180

function Globe({
  selected,
  onUserRotate,
  onSelect,
  inView,
}: {
  selected: Site | null
  onUserRotate: () => void
  onSelect: (key: string) => void
  inView: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const drag = useRef({ active: false, started: false, x: 0, y: 0 })
  const target = useRef<{ x: number; y: number } | null>(null)
  const { gl } = useThree()

  // Rotation that brings the hub (India) front-and-centre — the home position.
  const home = useMemo<[number, number, number]>(() => {
    const p = SITES.find((s) => s.hub) ?? SITES[0]
    return [d2r(p.lat) * 0.6, d2r(-90 - p.lng), 0]
  }, [])

  // Each time the section scrolls into view, face the hub (then idle-spin).
  useEffect(() => {
    if (inView && group.current && !target.current) {
      group.current.rotation.set(home[0], home[1], home[2])
    }
  }, [inView, home])

  const [tex, specTex, glowTex] = useLoader(THREE.TextureLoader, [
    worldTexUrl,
    worldSpecUrl,
    worldGlowUrl,
  ])
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    glowTex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = specTex.anisotropy = glowTex.anisotropy = 8
  }, [tex, specTex, glowTex])

  // Target rotation that brings the selected country to the front (+Z).
  useMemo(() => {
    target.current = selected
      ? { x: d2r(selected.lat) * 0.6, y: d2r(-90 - selected.lng) }
      : null
  }, [selected])

  // Manual occlusion: hide pins on the far hemisphere.
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const pinBases = useMemo(() => SITES.map((s) => llToVec3(s.lat, s.lng, 1)), [])
  const pinRefs = useRef<(HTMLDivElement | null)[]>([])

  // Selected country's border rings, lifted off the globe as a glowing outline.
  const outlineRings = useMemo(() => {
    if (!selected) return null
    const rings = (OUTLINES as Record<string, number[][][]>)[selected.key]
    if (!rings?.length) return null
    return rings.map((ring) => ring.map(([lng, lat]) => llToVec3(lat, lng, RADIUS * 1.035)))
  }, [selected])

  // Drag-to-rotate. pan-y keeps vertical swipes scrolling the page on phones.
  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'pan-y'
    el.style.cursor = 'grab'
    const down = (e: PointerEvent) => {
      drag.current = { active: true, started: false, x: e.clientX, y: e.clientY }
      el.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      const g = group.current
      if (!drag.current.active || !g) return
      const dx = e.clientX - drag.current.x
      const dy = e.clientY - drag.current.y
      if (!drag.current.started) {
        if (Math.abs(dx) + Math.abs(dy) < 3) return // ignore taps / jitter
        drag.current.started = true
        onUserRotate()
      }
      drag.current.x = e.clientX
      drag.current.y = e.clientY
      g.rotation.y += dx * 0.006
      g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + dy * 0.006, -1.1, 1.1)
    }
    const up = () => {
      if (drag.current.active) {
        drag.current.active = false
        el.style.cursor = 'grab'
      }
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [gl, onUserRotate])

  useFrame(({ camera }, delta) => {
    const g = group.current
    if (!g) return
    if (!drag.current.active) {
      if (target.current) {
        // Ease the selected country to the front and hold (parent clears after 5s).
        const k = Math.min(1, delta * 3.2)
        let dy = target.current.y - g.rotation.y
        dy = Math.atan2(Math.sin(dy), Math.cos(dy)) // shortest path
        g.rotation.y += dy * k
        g.rotation.x += (target.current.x - g.rotation.x) * k
        g.rotation.z += (0 - g.rotation.z) * k
      } else {
        g.rotation.y += delta * 0.08 // idle spin
      }
    }
    // Show only front-hemisphere pins (camera looks down -Z at the origin), and
    // stack them like map pins: the lower a pin's point sits on screen, the
    // further in front it goes (its head grows up over the pins behind it).
    // drei's own distance-based z-index rounds every pin to the same value, so
    // DOM order would win and later pins would always cover earlier ones.
    for (let i = 0; i < SITES.length; i++) {
      const el = pinRefs.current[i]
      if (!el) continue
      tmp.copy(pinBases[i]).applyQuaternion(g.quaternion)
      el.style.visibility = tmp.z > 0.12 ? 'visible' : 'hidden'
      const wrapper = el.closest<HTMLElement>('.gd-globe-html')
      if (!wrapper) continue
      const ndcY = tmp.project(camera).y // -1 (bottom) … 1 (top)
      const z =
        selected?.key === SITES[i].key ? 500 : 100 + Math.round((1 - ndcY) * 100)
      wrapper.style.zIndex = `${z}`
    }
  })

  return (
    <group ref={group} rotation={home}>
      <mesh>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshPhongMaterial
          map={tex}
          specularMap={specTex}
          specular={new THREE.Color('#d8ffc0')}
          shininess={26}
          emissiveMap={glowTex}
          emissive={new THREE.Color('#ffffff')}
          emissiveIntensity={1.3}
        />
      </mesh>

      {/* Green atmosphere rim */}
      <mesh scale={1.04}>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#69c248"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Selected country lifted off the globe with a glowing border */}
      {selected &&
        outlineRings?.map((pts, i) => (
          <Line
            key={`${selected.key}-${i}`}
            points={pts}
            color="#b8ff86"
            lineWidth={3}
            transparent
            depthWrite={false}
          />
        ))}

      {/* Flag pins */}
      {SITES.map((s, i) => {
        const v = llToVec3(s.lat, s.lng, RADIUS * 1.01)
        const active = selected?.key === s.key
        const Flag = FLAGS[s.key]
        return (
          <group key={s.key} position={[v.x, v.y, v.z]}>
            <Html zIndexRange={[0, 0]} wrapperClass="gd-globe-html">
              <div
                className={`gd-pin${s.hub ? ' is-hub' : ''}${active ? ' is-active' : ''}`}
                ref={(el) => {
                  pinRefs.current[i] = el
                }}
              >
                <button
                  type="button"
                  className="gd-pin-marker"
                  onClick={() => onSelect(s.key)}
                  aria-label={`${s.name}: ${gardenLabel(s.gardens)}`}
                >
                  <svg className="gd-pin-shape" viewBox="0 0 84 108" aria-hidden="true">
                    <defs>
                      <linearGradient id="gdLeaf" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#E4FFD0" />
                        <stop offset="30%" stopColor="#8EE65A" />
                        <stop offset="65%" stopColor="#2D7A3F" />
                        <stop offset="100%" stopColor="#0E2A16" />
                      </linearGradient>
                      <radialGradient id="gdCore" cx="50%" cy="45%" r="55%">
                        <stop offset="0%" stopColor="#14421F" />
                        <stop offset="60%" stopColor="#072112" />
                        <stop offset="100%" stopColor="#020A05" />
                      </radialGradient>
                    </defs>
                    <path
                      d="M 42,12 C 62,12 78,28 78,48 C 78,61 71,72 61,78 L 42,102 L 23,78 C 13,72 6,61 6,48 C 6,28 22,12 42,12 Z"
                      fill="url(#gdLeaf)"
                    />
                    <circle cx="42" cy="48" r="28" fill="url(#gdCore)" />
                    <circle cx="42" cy="48" r="25" fill="none" stroke="url(#gdLeaf)" strokeWidth="1.2" opacity="0.85" />
                  </svg>
                  <span className="gd-pin-ico">{Flag ? <Flag /> : null}</span>
                </button>
                <div className="gd-pin-label">
                  {s.name}: <strong>{gardenLabel(s.gardens)}</strong>
                </div>
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

export default function GardenGlobe() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false) // mobile: list toggle
  const [inView, setInView] = useState(false) // pause the WebGL globe off-screen
  const globeBoxRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Only animate while on screen; frameloop="demand" still renders once on load.
  useEffect(() => {
    const el = globeBoxRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const selected = useMemo(() => SITES.find((s) => s.key === selectedKey) ?? null, [selectedKey])

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }
  // Focus a country for 5s, then resume the idle spin.
  const handleSelect = (key: string) => {
    clearTimer()
    setSelectedKey(key)
    timerRef.current = setTimeout(() => {
      setSelectedKey(null)
      timerRef.current = null
    }, 5000)
  }
  // A manual drag cancels the focus immediately.
  const handleUserRotate = useCallback(() => {
    clearTimer()
    setSelectedKey(null)
  }, [])
  useEffect(() => () => clearTimer(), [])

  return (
    <section className="gd-wmap" id="garden">
      <div className="gd-head">
        <h1 className="text-[clamp(30px,4.4vw,54px)] font-extrabold leading-[1.05] tracking-tight text-white">
          Visit Us <span className="text-gradient">Physically</span> At
        </h1>
        <p className="gd-sub">
          Walk among the trees you grow — {TOTAL_GARDENS} garden sites open to visitors across{' '}
          {SITES.length} countries.
        </p>
      </div>

      <div className="gd-stage">
        {/* Left: stats timeline */}
        <div className="gd-stats">
          {STATS.map((s) => (
            <div className="gd-stat" key={s.label}>
              <span className="gd-stat-ico">
                <s.Icon size={20} />
              </span>
              <div className="gd-stat-body">
                <strong>{s.num}</strong>
                <span className="gd-stat-label">{s.label}</span>
                <span className="gd-stat-desc">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Centre: globe */}
        <div className="gd-globe" ref={globeBoxRef}>
          <Canvas
            className="gd-canvas"
            dpr={[1, 1.75]}
            frameloop={inView ? 'always' : 'demand'}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 3.3], fov: 40 }}
          >
            <ambientLight intensity={0.95} color="#eef8ec" />
            <directionalLight position={[3, 2, 4]} intensity={0.6} color="#f0ffe6" />
            <directionalLight position={[-3, -1.5, -2]} intensity={0.18} color="#69c248" />
            <Suspense fallback={null}>
              <Globe
                selected={selected}
                onUserRotate={handleUserRotate}
                onSelect={handleSelect}
                inView={inView}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Mobile-only: swipe hint */}
        <div className="gd-swipe">
          <Hand size={16} /> Swipe to explore our gardens
        </div>

        {/* Mobile-only: CTA that reveals the list */}
        <button
          type="button"
          className={`gd-cta${panelOpen ? ' is-open' : ''}`}
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
        >
          View Garden Locations <ChevronRight size={18} />
        </button>

        {/* Right: clickable garden locations */}
        <div className={`gd-panel${panelOpen ? ' is-open' : ''}`}>
          <h2 className="gd-panel-title">Garden Locations</h2>
          <ul className="gd-list">
            {SITES.map((s) => {
              const Flag = FLAGS[s.key]
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    className={`gd-row${s.hub ? ' is-hub' : ''}${selectedKey === s.key ? ' is-active' : ''}`}
                    onClick={() => handleSelect(s.key)}
                  >
                    <span className="gd-flag">{Flag ? <Flag /> : null}</span>
                    <span className="gd-name">{s.name}</span>
                    <span className="gd-num">{gardenLabel(s.gardens)}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
