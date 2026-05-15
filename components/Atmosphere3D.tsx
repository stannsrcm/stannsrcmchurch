"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const FloatingParticles = ({ count = 500, color = "#D6B36A" }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40;
      p[i * 3 + 1] = (Math.random() - 0.5) * 40;
      p[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0003;
      ref.current.rotation.x += 0.0001;
      
      const time = state.clock.getElapsedTime();
      ref.current.position.y = Math.sin(time * 0.15) * 0.3;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.04} 
        color={color} 
        transparent 
        opacity={0.2} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const FloatingCrosses = ({ count = 8 }) => {
  const crosses = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 15
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: Math.random() * 0.3 + 0.1
    }));
  }, [count]);

  return (
    <group>
      {crosses.map((c, i) => (
        <group key={i} position={c.position} rotation={c.rotation} scale={c.scale}>
          <mesh>
            <boxGeometry args={[0.1, 1, 0.1]} />
            <meshStandardMaterial color="#D6B36A" emissive="#D6B36A" emissiveIntensity={0.2} transparent opacity={0.15} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.1]} />
            <meshStandardMaterial color="#D6B36A" emissive="#D6B36A" emissiveIntensity={0.2} transparent opacity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
