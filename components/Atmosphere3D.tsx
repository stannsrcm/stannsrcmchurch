"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const FloatingParticles = ({ count = 500, color = "#FF5533" }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0005;
      ref.current.rotation.x += 0.0002;
      
      // Gentle floating motion
      const time = state.clock.getElapsedTime();
      ref.current.position.y = Math.sin(time * 0.2) * 0.5;
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
        size={0.03} 
        color={color} 
        transparent 
        opacity={0.3} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const FloatingCrosses = ({ count = 5 }) => {
  const crosses = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: Math.random() * 0.5 + 0.2
    }));
  }, [count]);

  return (
    <group>
      {crosses.map((c, i) => (
        <group key={i} position={c.position} rotation={c.rotation} scale={c.scale}>
          <mesh>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial color="#FF5533" emissive="#FF5533" emissiveIntensity={0.5} transparent opacity={0.2} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.6, 0.2, 0.2]} />
            <meshStandardMaterial color="#FF5533" emissive="#FF5533" emissiveIntensity={0.5} transparent opacity={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
