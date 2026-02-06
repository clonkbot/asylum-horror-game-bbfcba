import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FlickeringLightProps {
  position: [number, number, number]
  delay?: number
}

export default function FlickeringLight({ position, delay = 0 }: FlickeringLightProps) {
  const lightRef = useRef<THREE.PointLight>(null!)
  const [active, setActive] = useState(false)
  const [intensity, setIntensity] = useState(0.3)

  useEffect(() => {
    const timeout = setTimeout(() => setActive(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useFrame((state) => {
    if (!lightRef.current || !active) return

    // Random flickering pattern
    const time = state.clock.elapsedTime
    const flicker = Math.sin(time * 20) * Math.sin(time * 33) * Math.sin(time * 47)

    // Occasionally go completely dark
    const darkPulse = Math.sin(time * 0.5 + delay * 0.01) > 0.8 ? 0 : 1

    // Calculate final intensity
    const baseIntensity = 0.4
    const flickerIntensity = baseIntensity + flicker * 0.3
    const finalIntensity = Math.max(0.05, flickerIntensity * darkPulse)

    lightRef.current.intensity = finalIntensity
  })

  return (
    <group position={position}>
      {/* Light fixture */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color="#2a2520" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Bulb */}
      <mesh position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color="#ffeecc"
          emissive="#ffaa44"
          emissiveIntensity={active ? 0.5 : 0}
        />
      </mesh>

      {/* Light source */}
      <pointLight
        ref={lightRef}
        intensity={0.3}
        distance={8}
        color="#ff9944"
        castShadow
        shadow-mapSize={[256, 256]}
      />
    </group>
  )
}