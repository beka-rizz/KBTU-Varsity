import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import { useState } from 'react'
import type { School } from '../data/schools'
import { Jacket, initialRot } from './Jacket'

export interface JacketSceneProps {
  school: School
  view: 'auto' | 'front' | 'back'
  onViewSettled?: () => void
  /** false = pause the render loop (e.g. scrolled out of view) */
  active?: boolean
  className?: string
}

/**
 * Default-exported so it can be `React.lazy`-loaded: three.js + R3F only ship
 * when the studio section is about to be seen.
 */
export default function JacketScene({ school, view, onViewSettled, active = true, className }: JacketSceneProps) {
  const rot = useRef(initialRot())
  const [dpr, setDpr] = useState(1.5)

  return (
    <div
      className={className}
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
      onPointerDown={(e) => {
        rot.current.dragging = true
        rot.current.lastX = e.clientX
        rot.current.vel = 0
        e.currentTarget.setPointerCapture(e.pointerId)
        e.currentTarget.style.cursor = 'grabbing'
      }}
      onPointerMove={(e) => {
        const r = rot.current
        if (!r.dragging) return
        const dx = e.clientX - r.lastX
        r.lastX = e.clientX
        r.y += dx * 0.012
        r.vel = dx * 0.5
      }}
      onPointerUp={(e) => {
        rot.current.dragging = false
        e.currentTarget.style.cursor = 'grab'
      }}
      onPointerCancel={() => {
        rot.current.dragging = false
      }}
    >
      <Canvas
        dpr={dpr}
        frameloop={active ? 'always' : 'never'}
        shadows={false}
        camera={{ position: [0, 0.1, 4.2], fov: 32, near: 0.1, far: 20 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
        style={{ background: 'transparent' }}
      >
        {/* Adapt resolution to the device: drop DPR if frames get slow */}
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(1.75, window.devicePixelRatio))} />

        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 4]} intensity={1.6} />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#cfe1ff" />
        <spotLight position={[0, 5, 2]} angle={0.5} penumbra={1} intensity={10} />

        <Suspense fallback={null}>
          {/* Studio-style reflections generated in-memory (no HDR download) */}
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[6, 6, 1]} />
            <Lightformer intensity={1} rotation-y={Math.PI / 2} position={[-5, 1, 0]} scale={[4, 2, 1]} color="#dfe8ff" />
            <Lightformer intensity={0.8} rotation-y={-Math.PI / 2} position={[5, 1, 0]} scale={[4, 2, 1]} color="#fff2df" />
          </Environment>
          <Jacket school={school} view={view} onViewSettled={onViewSettled} rot={rot} />
          <ContactShadows position={[0, -0.95, 0]} opacity={0.4} scale={4} blur={2.4} far={1.4} frames={1} />
        </Suspense>
      </Canvas>
    </div>
  )
}
