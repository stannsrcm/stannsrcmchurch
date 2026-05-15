"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uVortexStrength;
  uniform vec2 uMouse;

  attribute vec3 aRandomPosition;
  attribute float aSize;
  attribute float aDelay;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    // Basic Lerp between random chaos and church shape
    vec3 pos = mix(aRandomPosition, position, uProgress);

    // Vortex effect during transition
    float angle = uTime * 0.5 + aDelay * 10.0;
    float dist = length(pos.xz);
    float vortex = uVortexStrength * (1.0 - uProgress) * 5.0;
    pos.x += cos(angle + dist * 0.5) * vortex;
    pos.z += sin(angle + dist * 0.5) * vortex;

    // Organic breathing motion
    pos.y += sin(uTime * 0.5 + aDelay * 20.0) * 0.1;
    pos.x += cos(uTime * 0.3 + aDelay * 15.0) * 0.05;

    // Mouse Interaction (Subtle repulsion)
    float mouseDist = distance(pos.xy, uMouse * 10.0);
    if (mouseDist < 2.0) {
      pos += normalize(pos - vec3(uMouse * 10.0, 0.0)) * (2.0 - mouseDist) * 0.5;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Color based on height and formation progress (Burnt Gold to Candle Glow)
    vColor = mix(vec3(0.83, 0.63, 0.30), vec3(0.96, 0.82, 0.54), pos.y * 0.1 + 0.5);
    vOpacity = mix(0.1, 0.6, uProgress);
    
    // Pulse effect
    vOpacity *= 0.8 + 0.2 * sin(uTime * 2.0 + aDelay * 10.0);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    
    float strength = 0.05 / d - 0.1;
    gl_FragColor = vec4(vColor, vOpacity * strength);
  }
`;

export default function ParticleChurch({ progress = 0, vortex = 0 }) {
  const count = 15000;
  const meshRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randomPositions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const delays = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random initial positions (chaos)
      randomPositions[i3] = (Math.random() - 0.5) * 40;
      randomPositions[i3 + 1] = (Math.random() - 0.5) * 40;
      randomPositions[i3 + 2] = (Math.random() - 0.5) * 40;

      // Detailed Cathedral Shape Generation
      let tx = 0, ty = 0, tz = 0;
      const type = Math.random();

      if (type < 0.4) {
        // Main Cathedral Body (Rectangular base + arched top)
        tx = (Math.random() - 0.5) * 8;
        const height = Math.random() * 10 - 5;
        // Curve the top for the arched roof feel
        const roofCurve = Math.cos((tx / 4) * (Math.PI / 2)) * 2;
        ty = height + roofCurve * 0.5;
        tz = (Math.random() - 0.5) * 5;
      } else if (type < 0.7) {
        // Two Majestic Spires/Towers
        const side = Math.random() > 0.5 ? 1 : -1;
        tx = side * 3.5 + (Math.random() - 0.5) * 1.5;
        const towerHeight = Math.random() * 15 - 5;
        // Taper the towers towards the top
        const taper = 1.0 - (towerHeight + 5) / 15;
        tx *= (0.8 + taper * 0.2);
        ty = towerHeight;
        tz = (Math.random() - 0.5) * 1.5;
      } else if (type < 0.8) {
        // The Holy Cross (Higher density)
        if (Math.random() > 0.4) {
          // Vertical post
          tx = (Math.random() - 0.5) * 0.15;
          ty = 10 + Math.random() * 3;
        } else {
          // Horizontal bar
          tx = (Math.random() - 0.5) * 1.5;
          ty = 11.5 + (Math.random() - 0.5) * 0.15;
        }
        tz = 0;
      } else if (type < 0.9) {
        // Cathedral Entrance Arch & Large Windows
        const side = Math.random() > 0.5 ? 1 : -1;
        const winX = side * 1.8;
        const winY = Math.random() * 4 - 2;
        const arch = Math.sin(Math.random() * Math.PI) * 0.5;
        tx = winX + (Math.random() - 0.5) * 0.8;
        ty = winY + arch;
        tz = 2.6; // Slightly in front
      } else {
        // Flying Buttresses / Side Aisles
        const side = Math.random() > 0.5 ? 1 : -1;
        tx = side * (4.5 + Math.random() * 2);
        ty = Math.random() * 6 - 5;
        tz = (Math.random() - 0.5) * 3;
      }

      positions[i3] = tx;
      positions[i3 + 1] = ty;
      positions[i3 + 2] = tz;

      sizes[i] = Math.random() * 0.5 + 0.1;
      delays[i] = Math.random();
    }

    return { positions, randomPositions, sizes, delays };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uVortexStrength: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uProgress.value = THREE.MathUtils.lerp(material.uniforms.uProgress.value, progress, 0.02);
      material.uniforms.uVortexStrength.value = THREE.MathUtils.lerp(material.uniforms.uVortexStrength.value, vortex, 0.05);
      material.uniforms.uMouse.value.lerp(state.mouse, 0.1);
      
      meshRef.current.rotation.y = state.mouse.x * 0.1;
      meshRef.current.rotation.x = -state.mouse.y * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandomPosition"
          count={count}
          array={particles.randomPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aDelay"
          count={count}
          array={particles.delays}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
