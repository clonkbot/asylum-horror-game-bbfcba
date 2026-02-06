import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

interface GhostEntityProps {
  position: [number, number, number]
}

export default function GhostEntity({ position }: GhostEntityProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!)

  useFrame((state) => {
    if (materialRef.current) {
      // Pulsing opacity
      materialRef.current.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 5) * 0.2
    }
    if (groupRef.current) {
      // Slight wobble
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Main body - humanoid shape */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.3, 1, 8, 16]} />
          <meshStandardMaterial
            ref={materialRef}
            color="#d4d4d4"
            transparent
            opacity={0.4}
            emissive="#808080"
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color="#e0e0e0"
            transparent
            opacity={0.5}
            emissive="#a0a0a0"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Eyes - dark voids */}
        <mesh position={[-0.08, 0.95, 0.2]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0.08, 0.95, 0.2]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Wispy trails */}
        <WispyTrails />

        {/* Point light for eerie glow */}
        <pointLight
          intensity={0.5}
          distance={5}
          color="#8888ff"
          position={[0, 0.5, 0]}
        />
      </group>
    </Float>
  )
}

function WispyTrails() {
  const trailsRef = useRef<THREE.Points>(null!)
  const count = 50

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 0.2 + Math.random() * 0.3
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = -0.5 - Math.random() * 1
      pos[i * 3 + 2] = Math.sin(angle) * radius
    }
    return pos
  }, [])

  useFrame((state) => {
    if (trailsRef.current) {
      const positions = trailsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 3 + i) * 0.005
      }
      trailsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={trailsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#aaaadd"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}