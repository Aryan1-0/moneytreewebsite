import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, useCursor } from '@react-three/drei'
import { easing } from 'maath'
import {
  Bone,
  BoxGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  MathUtils,
  MeshStandardMaterial,
  PerspectiveCamera,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Texture,
  Uint16BufferAttribute,
  Vector3,
} from 'three'
import { SHEETS } from './bookContent'
import { paintFace } from './paintPage'
import { playPageFlip } from './pageFlipSound'

/*
 * 3D page-turning book — adapted from wass08/r3f-animated-book-slider.
 * Each sheet is a thin box split into segments and skinned to a chain of
 * bones; bending the bones curls the page as it turns.
 */

const EASING = 0.5
const EASING_FOLD = 0.3
const INSIDE_CURVE = 0.18
const OUTSIDE_CURVE = 0.05
const TURNING_CURVE = 0.09

const PAGE_WIDTH = 1.28
const PAGE_HEIGHT = 1.71
const PAGE_DEPTH = 0.003
const PAGE_SEGMENTS = 30
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS

const pageGeometry = new BoxGeometry(PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH, PAGE_SEGMENTS, 2)
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0)
{
  const position = pageGeometry.attributes.position
  const v = new Vector3()
  const skinIndexes: number[] = []
  const skinWeights: number[] = []
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i)
    const skinIndex = Math.max(0, Math.floor(v.x / SEGMENT_WIDTH))
    const skinWeight = (v.x % SEGMENT_WIDTH) / SEGMENT_WIDTH
    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
  }
  pageGeometry.setAttribute('skinIndex', new Uint16BufferAttribute(skinIndexes, 4))
  pageGeometry.setAttribute('skinWeight', new Float32BufferAttribute(skinWeights, 4))
}

// Page edges: a soft paper-green, like the gilded edge of a book.
const edgeMaterial = new MeshStandardMaterial({ color: '#cfe7b8', roughness: 0.9 })
const coverEdgeMaterial = new MeshStandardMaterial({ color: '#2D7A3F', roughness: 0.6 })
const GLOW = new Color('#B8FF86')
const WHITE = new Color('#ffffff')
const BASE_EMISSIVE = 0.42 // keeps the dark pages readable
const HOVER_EMISSIVE = 0.18

type Faces = { front: Texture; back: Texture }
/** 'spread' = both pages; 'single' = one page, centred; 'left' / 'right' = one page of the open spread. */
export type Focus = 'spread' | 'single' | 'left' | 'right'

function Page({
  number,
  textures,
  page,
  opened,
  bookClosed,
  onTurn,
}: {
  number: number
  textures: Faces
  page: number
  opened: boolean
  bookClosed: boolean
  onTurn: (page: number) => void
}) {
  const group = useRef<Group>(null)
  const turnedAt = useRef(0)
  const lastOpened = useRef(opened)
  const [highlighted, setHighlighted] = useState(false)
  useCursor(highlighted)

  const isCover = number === 0 || number === SHEETS.length - 1

  const mesh = useMemo(() => {
    const bones: Bone[] = []
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone()
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH
      if (i > 0) bones[i - 1].add(bone)
      bones.push(bone)
    }
    const skeleton = new Skeleton(bones)
    const face = (map: Texture) =>
      new MeshStandardMaterial({
        color: '#ffffff',
        map,
        roughness: isCover ? 0.45 : 0.75,
        emissive: '#ffffff',
        emissiveMap: map,
        emissiveIntensity: BASE_EMISSIVE,
      })
    const edge = isCover ? coverEdgeMaterial : edgeMaterial
    // BoxGeometry groups: +x, -x, +y, -y, +z (front), -z (back)
    const m = new SkinnedMesh(pageGeometry, [edge, edge, edge, edge, face(textures.front), face(textures.back)])
    m.frustumCulled = false
    m.add(skeleton.bones[0])
    m.bind(skeleton)
    return m
  }, [textures, isCover])

  useEffect(
    () => () => {
      ;(mesh.material as MeshStandardMaterial[]).slice(4).forEach((mat) => mat.dispose())
    },
    [mesh],
  )

  useFrame((_, delta) => {
    const mats = mesh.material as MeshStandardMaterial[]
    const target = BASE_EMISSIVE + (highlighted ? HOVER_EMISSIVE : 0)
    for (const mat of [mats[4], mats[5]]) {
      mat.emissiveIntensity = MathUtils.lerp(mat.emissiveIntensity, target, 0.1)
      mat.emissive.lerp(highlighted ? GLOW : WHITE, 0.1)
    }

    if (lastOpened.current !== opened) {
      turnedAt.current = performance.now()
      lastOpened.current = opened
    }
    let turningTime = Math.min(400, performance.now() - turnedAt.current) / 400
    turningTime = Math.sin(turningTime * Math.PI)

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
    if (!bookClosed) targetRotation += MathUtils.degToRad(number * 0.8)

    const bones = mesh.skeleton.bones
    for (let i = 0; i < bones.length; i++) {
      const t = i === 0 ? group.current : bones[i]
      if (!t) continue
      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0
      const turningIntensity = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime
      let rotationAngle =
        INSIDE_CURVE * insideCurveIntensity * targetRotation -
        OUTSIDE_CURVE * outsideCurveIntensity * targetRotation +
        TURNING_CURVE * turningIntensity * targetRotation
      let foldRotationAngle = MathUtils.degToRad(Math.sign(targetRotation) * 2)
      if (bookClosed) {
        rotationAngle = i === 0 ? targetRotation : 0
        foldRotationAngle = 0
      }
      easing.dampAngle(t.rotation, 'y', rotationAngle, EASING, delta)
      const foldIntensity = i > 8 ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime : 0
      easing.dampAngle(t.rotation, 'x', foldRotationAngle * foldIntensity, EASING_FOLD, delta)
    }
  })

  return (
    <group
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHighlighted(true)
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHighlighted(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        onTurn(opened ? number : number + 1)
        setHighlighted(false)
      }}
    >
      <primitive object={mesh} position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH} />
    </group>
  )
}

function Book({
  page,
  textures,
  onTurn,
  sound,
}: {
  page: number
  textures: Faces[]
  onTurn: (p: number) => void
  sound: boolean
}) {
  // Turn one sheet at a time toward `page`, so jumping chapters riffles pages.
  const [delayedPage, setDelayedPage] = useState(page)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const step = () => {
      setDelayedPage((d) => {
        if (d === page) return d
        timeout = setTimeout(step, Math.abs(page - d) > 2 ? 50 : 150)
        return d + (page > d ? 1 : -1)
      })
    }
    step()
    return () => clearTimeout(timeout)
  }, [page])

  // One flip sound per sheet turned; softer while riffling through many.
  const lastSounded = useRef(delayedPage)
  useEffect(() => {
    if (delayedPage === lastSounded.current) return
    lastSounded.current = delayedPage
    if (sound) playPageFlip(delayedPage === page ? 1 : 0.55)
  }, [delayedPage, page, sound])

  // Slide the book so it stays centred: a closed book sits to one side of its spine.
  const slide = useRef<Group>(null)
  useFrame((_, delta) => {
    if (!slide.current) return
    const x = delayedPage === 0 ? -PAGE_WIDTH / 2 : delayedPage === SHEETS.length ? PAGE_WIDTH / 2 : 0
    easing.damp(slide.current.position, 'x', x, 0.35, delta)
  })

  return (
    <group ref={slide} position-x={-PAGE_WIDTH / 2}>
      <group rotation-y={-Math.PI / 2}>
        {SHEETS.map((_, i) => (
          <Page
            key={i}
            number={i}
            textures={textures[i]}
            page={delayedPage}
            opened={delayedPage > i}
            bookClosed={delayedPage === 0 || delayedPage === SHEETS.length}
            onTurn={onTurn}
          />
        ))}
      </group>
    </group>
  )
}

/**
 * Frames the book at any canvas aspect ratio, zooming onto a single page
 * when `focus` asks for it (phones read the book page by page).
 */
function CameraRig({ focus }: { focus: Focus }) {
  const { camera, size } = useThree()
  const distance = useRef(3.4)
  useEffect(() => {
    const cam = camera as PerspectiveCamera
    const t = Math.tan(MathUtils.degToRad(cam.fov / 2))
    const pages = focus === 'spread' ? 2 : 1
    const needH = (PAGE_HEIGHT * 1.14) / (2 * t)
    const needW = (PAGE_WIDTH * pages * 1.1) / (2 * t * (size.width / size.height))
    distance.current = Math.max(needH, needW)
  }, [camera, size, focus])
  useFrame((_, delta) => {
    const x = focus === 'left' ? -PAGE_WIDTH / 2 : focus === 'right' ? PAGE_WIDTH / 2 : 0
    easing.damp3(camera.position, [x, 0, distance.current], 0.35, delta)
  })
  return null
}

/** Subtle tilt toward the pointer. */
function Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((state, delta) => {
    if (!ref.current) return
    easing.dampE(
      ref.current.rotation,
      [-0.16 + state.pointer.y * -0.06, state.pointer.x * 0.12, 0],
      0.4,
      delta,
    )
  })
  return <group ref={ref}>{children}</group>
}

function useBookTextures() {
  const [textures, setTextures] = useState<Faces[] | null>(null)
  useEffect(() => {
    let alive = true
    const made: Texture[] = []
    const toTex = (c: HTMLCanvasElement) => {
      const t = new CanvasTexture(c)
      t.colorSpace = SRGBColorSpace
      t.anisotropy = 8
      made.push(t)
      return t
    }
    Promise.all(
      SHEETS.map(async (s, i) => {
        const [front, back] = await Promise.all([
          paintFace(s.front, i * 2, 'front'),
          paintFace(s.back, i * 2 + 1, 'back'),
        ])
        return { front: toTex(front), back: toTex(back) }
      }),
    ).then((t) => alive && setTextures(t))
    return () => {
      alive = false
      made.forEach((t) => t.dispose())
    }
  }, [])
  return textures
}

export default function Book3D({
  page,
  onPageChange,
  active,
  focus = 'spread',
  sound = true,
  onReady,
}: {
  page: number
  onPageChange: (page: number) => void
  active: boolean // animate only while on screen
  focus?: Focus
  sound?: boolean
  onReady?: () => void
}) {
  const textures = useBookTextures()
  useEffect(() => {
    if (textures) onReady?.()
  }, [textures, onReady])

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'demand'}
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <CameraRig focus={focus} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[2, 4, 5]} intensity={1.6} />
      <directionalLight position={[-3, -1, 2]} intensity={0.35} color="#8EE65A" />
      {textures && (
        <Tilt>
          <Float floatIntensity={0.35} rotationIntensity={0.15} speed={1.6}>
            <Book page={page} textures={textures} onTurn={onPageChange} sound={sound} />
          </Float>
        </Tilt>
      )}
    </Canvas>
  )
}
