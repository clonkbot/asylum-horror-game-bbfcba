import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { GameState } from '../App'
import Corridor from './Corridor'
import GhostEntity from './GhostEntity'
import FlickeringLight from './FlickeringLight'

interface HorrorSceneProps {
  flashlightOn: boolean
  gameState: GameState
  onScare: () => void
  addMessage: (msg: string) => void
}

export default function HorrorScene({
  flashlightOn,
  gameState,
  onScare,
  addMessage,
}: HorrorSceneProps) {
  const { camera } = useThree()
  const flashlightRef = useRef<THREE.SpotLight>(null!)
  const [ghostVisible, setGhostVisible] = useState(false)
  const [ghostPosition, setGhostPosition] = useState<[number, number, number]>([0, 1.5, -15])

  // Random ghost appearances
  useEffect(() => {
    if (gameState !== 'playing') return

    const spawnGhost = () => {
      const delay = 8000 + Math.random() * 15000 // 8-23 seconds
      const timeout = setTimeout(() => {
        setGhostVisible(true)
        // Random position in corridor
        const z = -10 - Math.random() * 15
        const x = (Math.random() - 0.5) * 3
        setGhostPosition([x, 1.5, z])
        addMessage('Something approaches...')

        // Ghost disappears and possibly triggers scare
        setTimeout(() => {
          setGhostVisible(false)
          if (Math.random() < 0.4) {
            onScare()
          }
        }, 2000 + Math.random() * 2000)

        spawnGhost()
      }, delay)

      return timeout
    }

    const timeout = spawnGhost()
    return () => clearTimeout(timeout)
  }, [gameState, onScare, addMessage])

  // Update flashlight to follow camera
  useFrame(() => {
    if (flashlightRef.current) {
      flashlightRef.current.position.copy(camera.position)
      const direction = new THREE.Vector3(0, 0, -1)
      direction.applyQuaternion(camera.quaternion)
      flashlightRef.current.target.position.copy(camera.position).add(direction.multiplyScalar(10))
      flashlightRef.current.target.updateMatrixWorld()
    }
  })

  // Fog color changes based on context
  const fogColor = useMemo(() => new THREE.Color('#080505'), [])

  return (
    <>
      {/* Fog for atmosphere */}
      <fog attach="fog" args={[fogColor, 1, flashlightOn ? 20 : 8]} />

      {/* Very dim ambient - almost no light */}
      <ambientLight intensity={0.02} color="#1a1a2e" />

      {/* Flashlight */}
      {flashlightOn && (
        <spotLight
          ref={flashlightRef}
          intensity={3}
          angle={0.5}
          penumbra={0.5}
          distance={25}
          color="#fff5e0"
          castShadow
          shadow-mapSize={[512, 512]}
          shadow-bias={-0.0001}
        />
      )}

      {/* Flickering corridor lights */}
      <FlickeringLight position={[0, 2.8, -5]} />
      <FlickeringLight position={[0, 2.8, -15]} delay={500} />
      <FlickeringLight position={[0, 2.8, -25]} delay={1200} />

      {/* Corridor environment */}
      <Corridor />

      {/* Ghost entity */}
      {ghostVisible && gameState === 'playing' && (
        <GhostEntity position={ghostPosition} />
      )}

      {/* Floating particles / dust */}
      <DustParticles />

      {/* Camera controls - touch friendly */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        target={[0, 1.6, -5]}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_ROTATE,
        }}
      />
    </>
  )
}

function DustParticles() {
  const particlesRef = useRef<THREE.Points>(null!)
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = Math.random() * 3
      pos[i * 3 + 2] = Math.random() * -30
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#d4b896"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}