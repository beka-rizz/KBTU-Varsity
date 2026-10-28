import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Decal } from '@react-three/drei'
import * as THREE from 'three'
import type { School } from '../data/schools'
import { BACK_DECAL, FRONT_DECAL, drawBack, drawFront, drawSeal, drawStripes, loadJacketFonts } from './textures'

/* ------------------------------------------------------------------ */
/* Proportions (world units). Body is a z-squashed cylinder.           */
const BODY_R_TOP = 0.66
const BODY_R_BOT = 0.57
const BODY_H = 1.45
const BODY_Z = 0.44 // squash factor front/back
const SHOULDER_Y = BODY_H / 2
const SLEEVE_R = 0.19
const SLEEVE_LEN = 1.0
const SLEEVE_TILT = 0.16
/** Overall extents used to fit the jacket into the viewport */
const JACKET_W = 2.0
const JACKET_H = 2.1
const JACKET_CENTER_Y = 0.12

function useCanvasTexture(draw: () => HTMLCanvasElement, deps: unknown[], fontsReady: boolean) {
  const gl = useThree((s) => s.gl)
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(draw())
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    return t
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, fontsReady])
  useEffect(() => () => tex.dispose(), [tex])
  return tex
}

/** Smoothly lerps a material colour toward the target on every frame. */
function useLerpColor(ref: React.MutableRefObject<THREE.MeshStandardMaterial | null>, hex: string) {
  const target = useMemo(() => new THREE.Color(hex), [hex])
  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    const k = 1 - Math.exp(-dt * 7)
    m.color.lerp(target, k)
  })
}

export interface RotState {
  y: number
  vel: number
  dragging: boolean
  lastX: number
}
export const initialRot = (): RotState => ({ y: 0.35, vel: 0, dragging: false, lastX: 0 })

interface JacketProps {
  school: School
  /** 'front' / 'back' hold the jacket on that side; 'auto' keeps spinning. */
  view: 'auto' | 'front' | 'back'
  /** Shared mutable rotation state, driven by pointer events on the canvas wrapper. */
  rot: React.MutableRefObject<RotState>
}

export function Jacket({ school, view, rot }: JacketProps) {
  const group = useRef<THREE.Group>(null)
  const [fontsReady, setFontsReady] = useState(false)
  useEffect(() => {
    let alive = true
    loadJacketFonts().then(() => alive && setFontsReady(true))
    return () => {
      alive = false
    }
  }, [])

  const front = useCanvasTexture(() => drawFront(school), [school.id], fontsReady)
  const back = useCanvasTexture(
    () => drawBack(school),
    [school.id, school.backArc, school.backLine, school.tagline, school.accent, school.body],
    fontsReady,
  )
  const seal = useCanvasTexture(() => drawSeal(school), [school.id], fontsReady)
  const stripes = useCanvasTexture(() => drawStripes(school), [school.id], fontsReady)

  const bodyMat = useRef<THREE.MeshStandardMaterial>(null)
  const shoulderMat = useRef<THREE.MeshStandardMaterial>(null)
  const placketMat = useRef<THREE.MeshStandardMaterial>(null)
  const sleeveMatL = useRef<THREE.MeshPhysicalMaterial>(null)
  const sleeveMatR = useRef<THREE.MeshPhysicalMaterial>(null)
  useLerpColor(bodyMat, school.body)
  useLerpColor(shoulderMat, school.body)
  useLerpColor(placketMat, school.body)
  useLerpColor(sleeveMatL, school.sleeve)
  useLerpColor(sleeveMatR, school.sleeve)

  /* Fit the jacket into whatever aspect ratio the stage has */
  const viewport = useThree((s) => s.viewport)
  const fit = Math.min((viewport.width - 0.25) / JACKET_W, (viewport.height - 0.35) / JACKET_H, 1.05)

  /* Rotation: spin, drag inertia, or hold the chosen side */
  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const r = rot.current
    if (r.dragging) {
      // y is updated directly by the pointer handlers
    } else if (view === 'auto') {
      r.y += dt * 0.35 + r.vel * dt
      r.vel *= Math.exp(-dt * 3)
    } else {
      const target = view === 'front' ? 0 : Math.PI
      // shortest path on the circle
      const cur = THREE.MathUtils.euclideanModulo(r.y, Math.PI * 2)
      let diff = target - cur
      if (diff > Math.PI) diff -= Math.PI * 2
      if (diff < -Math.PI) diff += Math.PI * 2
      const step = diff * (1 - Math.exp(-dt * 6))
      r.y = cur + step
    }
    g.rotation.y = r.y
    // gentle idle float
    const t = performance.now() / 1000
    g.position.y = Math.sin(t * 1.2) * 0.02
    g.rotation.z = Math.sin(t * 0.8) * 0.012
  })

  const stripeMatProps = { map: stripes, roughness: 1, metalness: 0 }

  return (
    <group ref={group} scale={fit}>
      <group position={[0, -JACKET_CENTER_Y, 0]}>
      {/* ---------- Body (wool) ---------- */}
      <mesh scale={[1, 1, BODY_Z]} castShadow>
        <cylinderGeometry args={[BODY_R_TOP, BODY_R_BOT, BODY_H, 72, 1, false]} />
        <meshStandardMaterial ref={bodyMat} color={school.body} roughness={0.95} metalness={0} />

        {/* Front graphics: chest letter + pockets */}
        <Decal position={[0, 0, BODY_R_TOP * 0.95]} rotation={[0, 0, 0]} scale={[FRONT_DECAL.w, FRONT_DECAL.h, 0.6]}>
          <meshStandardMaterial
            map={front}
            transparent
            polygonOffset
            polygonOffsetFactor={-4}
            roughness={0.9}
            depthWrite={false}
          />
        </Decal>

        {/* Back graphics: arched school name */}
        <Decal position={[0, 0.02, -BODY_R_TOP * 0.95]} rotation={[0, Math.PI, 0]} scale={[BACK_DECAL.w, BACK_DECAL.h, 0.6]}>
          <meshStandardMaterial
            map={back}
            transparent
            polygonOffset
            polygonOffsetFactor={-4}
            roughness={0.9}
            depthWrite={false}
          />
        </Decal>
      </mesh>

      {/* Shoulder dome */}
      <mesh position={[0, SHOULDER_Y, 0]} scale={[1, 0.28, BODY_Z]}>
        <sphereGeometry args={[BODY_R_TOP, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial ref={shoulderMat} color={school.body} roughness={0.95} />
      </mesh>

      {/* Collar (rib knit) */}
      <mesh position={[0, SHOULDER_Y + 0.2, -0.02]} scale={[1, 1, 0.78]}>
        <cylinderGeometry args={[0.27, 0.3, 0.2, 48, 1, true]} />
        <meshStandardMaterial {...stripeMatProps} side={THREE.DoubleSide} />
      </mesh>
      {/* Neck lining */}
      <mesh position={[0, SHOULDER_Y + 0.16, -0.02]} scale={[1, 1, 0.78]}>
        <cylinderGeometry args={[0.26, 0.26, 0.02, 32]} />
        <meshStandardMaterial color="#1a1a1f" roughness={1} />
      </mesh>

      {/* Hem (rib knit) */}
      <mesh position={[0, -BODY_H / 2 - 0.07, 0]} scale={[1, 1, BODY_Z]}>
        <cylinderGeometry args={[BODY_R_BOT, BODY_R_BOT * 0.96, 0.16, 72, 1, false]} />
        <meshStandardMaterial {...stripeMatProps} />
      </mesh>

      {/* Placket + snap buttons */}
      <mesh position={[0, -0.03, BODY_R_TOP * BODY_Z + 0.004]}>
        <boxGeometry args={[0.055, BODY_H - 0.02, 0.012]} />
        <meshStandardMaterial ref={placketMat} color={school.body} roughness={0.95} />
      </mesh>
      {[0.55, 0.3, 0.05, -0.2, -0.45].map((y) => (
        <mesh key={y} position={[0, y, BODY_R_TOP * BODY_Z + 0.02]}>
          <sphereGeometry args={[0.024, 16, 12]} />
          <meshStandardMaterial color="#cfd3d8" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}

      {/* ---------- Sleeves (leather) ---------- */}
      <Sleeve side={-1} matRef={sleeveMatL} color={school.sleeve} stripes={stripes} seal={seal} />
      <Sleeve side={1} matRef={sleeveMatR} color={school.sleeve} stripes={stripes} />

      {/* Hanger hook */}
      <mesh position={[0, SHOULDER_Y + 0.42, -0.02]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.11, 0.012, 10, 32, Math.PI]} />
        <meshStandardMaterial color="#b8bcc2" metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[0.11, SHOULDER_Y + 0.31, -0.02]}>
        <cylinderGeometry args={[0.012, 0.012, 0.22, 10]} />
        <meshStandardMaterial color="#b8bcc2" metalness={0.95} roughness={0.2} />
      </mesh>
      </group>
    </group>
  )
}

function Sleeve({
  side,
  matRef,
  color,
  stripes,
  seal,
}: {
  side: 1 | -1
  matRef: React.MutableRefObject<THREE.MeshPhysicalMaterial | null>
  color: string
  stripes: THREE.Texture
  seal?: THREE.Texture
}) {
  // Sleeve hangs from the shoulder, flaring slightly outward and forward.
  // (rotating a Y-axis capsule by +z moves its lower end toward -x, hence the sign)
  const tilt = side * SLEEVE_TILT
  const { center, cuffPos } = useMemo(() => {
    const shoulder = new THREE.Vector3(side * (BODY_R_TOP - 0.08), SHOULDER_Y - 0.16, 0)
    const axis = new THREE.Vector3(0, -1, 0).applyEuler(new THREE.Euler(0.08, 0, tilt))
    return {
      center: shoulder.clone().add(axis.clone().multiplyScalar(SLEEVE_LEN / 2)),
      cuffPos: shoulder.clone().add(axis.clone().multiplyScalar(SLEEVE_LEN + 0.08)),
    }
  }, [side, tilt])

  // Seal sits on the outer-front of the upper arm so it reads from the front view too
  const sealAngle = -Math.PI / 3.2
  const sealPos: [number, number, number] = [
    Math.sin(sealAngle) * SLEEVE_R * 0.98,
    SLEEVE_LEN * 0.2,
    Math.cos(sealAngle) * SLEEVE_R * 0.98,
  ]

  return (
    <group>
      <mesh position={center} rotation={[0.08, 0, tilt]} castShadow>
        <capsuleGeometry args={[SLEEVE_R, SLEEVE_LEN, 8, 32]} />
        <meshPhysicalMaterial ref={matRef} color={color} roughness={0.5} clearcoat={0.35} clearcoatRoughness={0.4} />
        {seal && (
          <Decal position={sealPos} rotation={[0, sealAngle, 0]} scale={[0.26, 0.26, 0.3]}>
            <meshStandardMaterial map={seal} transparent polygonOffset polygonOffsetFactor={-4} depthWrite={false} roughness={0.9} />
          </Decal>
        )}
      </mesh>
      {/* Cuff */}
      <mesh position={cuffPos} rotation={[0.08, 0, tilt]}>
        <cylinderGeometry args={[SLEEVE_R * 0.92, SLEEVE_R * 0.84, 0.17, 32, 1, false]} />
        <meshStandardMaterial map={stripes} roughness={1} />
      </mesh>
    </group>
  )
}
