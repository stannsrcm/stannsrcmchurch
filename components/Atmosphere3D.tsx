"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const FloatingParticles = ({ count = 800, color = "#F6D28B" }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      const { mouse, clock } = state;
      ref.current.rotation.y += 0.0002;
      ref.current.rotation.x += 0.0001;
      
      // Interactive mouse follow - trending subtle attraction
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mouse.x * 2, 0.05);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, mouse.y * 2, 0.05);
      
      const time = clock.getElapsedTime();
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
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
        size={0.06} 
        color={color} 
        transparent 
        opacity={0.3} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const SacredGeometry = ({ count = 6 }) => {
  const shapes = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40 - 20
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: Math.random() * 0.5 + 0.2
    }));
  }, [count]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.0005;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 1;
    }
  });

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <group key={i} position={s.position} rotation={s.rotation} scale={s.scale}>
          <mesh>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color="#D4A24C" 
              emissive="#C46A2D" 
              emissiveIntensity={0.5} 
              transparent 
              opacity={0.1} 
              wireframe
            />
          </mesh>
          <pointLight color="#F6D28B" intensity={5} distance={10} />
        </group>
      ))}
    </group>
  );
};
