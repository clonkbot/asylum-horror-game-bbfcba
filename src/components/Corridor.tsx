import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Corridor() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -15]} receiveShadow>
        <planeGeometry args={[6, 40]} />
        <meshStandardMaterial
          color="#1a1512"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, -15]}>
        <planeGeometry args={[6, 40]} />
        <meshStandardMaterial color="#0d0a08" roughness={1} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-3, 1.5, -15]} receiveShadow>
        <planeGeometry args={[40, 3]} />
        <WallMaterial side="left" />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[3, 1.5, -15]} receiveShadow>
        <planeGeometry args={[40, 3]} />
        <WallMaterial side="right" />
      </mesh>

      {/* End wall (far) */}
      <mesh position={[0, 1.5, -35]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#0a0808" roughness={1} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, 5]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#0a0808" roughness={1} />
      </mesh>

      {/* Decorative elements */}
      <Pipes />
      <Debris />
      <BloodStains />
      <Doors />
    </group>
  )
}

function WallMaterial({ side }: { side: 'left' | 'right' }) {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!)

  return (
    <meshStandardMaterial
      ref={materialRef}
      color="#1f1815"
      roughness={0.85}
      metalness={0.05}
    />
  )
}

function Pipes() {
  const pipePositions = useMemo(() => [
    { pos: [-2.9, 2.7, -10], length: 8 },
    { pos: [2.9, 0.3, -20], length: 12 },
    { pos: [-2.9, 0.3, -25], length: 6 },
  ], [])

  return (
    <group>
      {pipePositions.map((pipe, i) => (
        <mesh key={i} position={pipe.pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, pipe.length, 8]} />
          <meshStandardMaterial color="#3d3530" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function Debris() {
  const debris = useMemo(() => {
    const items: { pos: [number, number, number]; scale: number; rot: number }[] = []
    for (let i = 0; i < 15; i++) {
      items.push({
        pos: [
          (Math.random() - 0.5) * 5,
          0.05,
          -Math.random() * 30,
        ],
        scale: 0.1 + Math.random() * 0.15,
        rot: Math.random() * Math.PI * 2,
      })
    }
    return items
  }, [])

  return (
    <group>
      {debris.map((item, i) => (
        <mesh
          key={i}
          position={item.pos}
          rotation={[0, item.rot, Math.random() * 0.3]}
          scale={item.scale}
        >
          <boxGeometry args={[1, 0.3, 1]} />
          <meshStandardMaterial color="#2a2420" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function BloodStains() {
  const stains = useMemo(() => [
    { pos: [-2, 0.01, -8] as [number, number, number], scale: 0.8 },
    { pos: [1.5, 0.01, -18] as [number, number, number], scale: 1.2 },
    { pos: [-1, 0.01, -28] as [number, number, number], scale: 0.6 },
  ], [])

  return (
    <group>
      {stains.map((stain, i) => (
        <mesh
          key={i}
          position={stain.pos}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}
          scale={stain.scale}
        >
          <circleGeometry args={[0.5, 16]} />
          <meshStandardMaterial
            color="#3d1010"
            roughness={0.9}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

function Doors() {
  const doorPositions = useMemo(() => [
    { pos: [-2.95, 1.2, -12] as [number, number, number], rot: Math.PI / 2 },
    { pos: [2.95, 1.2, -22] as [number, number, number], rot: -Math.PI / 2 },
  ], [])

  return (
    <group>
      {doorPositions.map((door, i) => (
        <group key={i} position={door.pos} rotation={[0, door.rot, 0]}>
          {/* Door frame */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.1, 2.4, 1.2]} />
            <meshStandardMaterial color="#2a2018" roughness={0.9} />
          </mesh>
          {/* Door */}
          <mesh position={[0.05, 0.1, 0.3]} rotation={[0, 0.2 * (i === 0 ? 1 : -1), 0]}>
            <boxGeometry args={[0.08, 2.2, 0.9]} />
            <meshStandardMaterial color="#1a1510" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  )
}