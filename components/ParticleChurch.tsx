"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uVortexStrength;
  uniform vec2 uMouse;

  attribute vec3 aInitialPosition;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aDelay;

  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    // Lerp between initial dust cloud and cathedral shape
    vec3 pos = mix(aInitialPosition, position, uProgress);

    // Vortex effect during transition
    float angle = uTime * 0.5 + aDelay * 10.0;
    float dist = length(pos.xz);
    float vortex = uVortexStrength * (1.0 - uProgress) * 5.0;
    pos.x += cos(angle + dist * 0.5) * vortex;
    pos.z += sin(angle + dist * 0.5) * vortex;

    // Organic breathing motion
    pos.y += sin(uTime * 0.5 + aDelay * 20.0) * 0.15;
    
    // Mouse Interaction
    float mouseDist = distance(pos.xy, uMouse * 15.0);
    if (mouseDist < 3.0) {
      pos += normalize(pos - vec3(uMouse * 15.0, 0.0)) * (3.0 - mouseDist) * 0.8;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vColor = aColor;
    vOpacity = mix(0.1, 0.8, uProgress);
    vOpacity *= 0.7 + 0.3 * sin(uTime * 1.5 + aDelay * 10.0);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    
    float strength = 0.1 / d - 0.2;
    gl_FragColor = vec4(vColor, vOpacity * strength);
  }
`;

export default function ParticleChurch({ progress = 0, vortex = 0 }) {
  const count = 70000;
  const meshRef = useRef<THREE.Points>(null);

  const cathedralData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const delays = new Float32Array(count);

    // Colors from user's request
    const colorPink = new THREE.Color('#e0a0a0'); // Pink Bricks
    const colorGrey = new THREE.Color('#808080'); // Stone
    const colorBlue = new THREE.Color('#4aa3df');  // Windows/Dome
    const colorGold = new THREE.Color('#d4af37'); // Statue/Details
    const colorRoof = new THREE.Color('#c05c50'); // Tower roof accent

    let idx = 0;

    const addPoint = (x: number, y: number, z: number, color: THREE.Color) => {
      if (idx >= count) return;
      
      const i3 = idx * 3;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Start Position (Random Sphere Cloud)
      const r = 60 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      initialPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      initialPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      initialPositions[i3 + 2] = r * Math.cos(phi);

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[idx] = Math.random() * 0.8 + 0.2;
      delays[idx] = Math.random();
      idx++;
    };

    const fillVolume = (ox: number, oy: number, oz: number, w: number, h: number, d: number, color: THREE.Color, density: number) => {
      const step = 0.4; 
      for (let x = ox; x < ox + w; x += step) {
        for (let y = oy; y < oy + h; y += step) {
          for (let z = oz; z < oz + d; z += step) {
            if (Math.random() < density && idx < count) {
              const noise = (Math.random() - 0.5) * 0.25;
              addPoint(x + noise, y + noise, z + noise, color);
            }
          }
        }
      }
    };

    // --- 1. Main Building (Pink Brick Walls) ---
    fillVolume(-8, -6, -6, 16, 12, 14, colorPink, 0.4);
    fillVolume(-7.5, -6, -6, 1.5, 14, 14, colorGrey, 0.5);
    fillVolume(6, -6, -6, 1.5, 14, 14, colorGrey, 0.5);

    // --- 2. Blue Cross Windows ---
    const createCross = (cx: number, cy: number, cz: number, scale: number) => {
      const t = 0.2 * scale;
      const l = 1.2 * scale;
      fillVolume(cx - t/2, cy - l/2, cz, t, l, 0.3, colorBlue, 0.9);
      fillVolume(cx - l/2, cy - t/2, cz, l, t, 0.3, colorBlue, 0.9);
    };
    createCross(0, 0, -5.8, 4);
    createCross(-8, -2, 0, 2);
    createCross(8, -2, 0, 2);

    // --- 3. Tower with Spiral Staircase (Left) ---
    fillVolume(-14, -6, -4, 6, 22, 10, colorGrey, 0.35);
    const stairRadius = 2.5;
    const towerX = -11;
    const towerZ = 0;
    for (let y = -5; y < 15; y += 0.3) {
      const angle = y * 1.5;
      const sx = towerX + Math.cos(angle) * stairRadius;
      const sz = towerZ + Math.sin(angle) * stairRadius;
      for(let r=0; r<0.5; r+=0.15) {
         addPoint(sx + (Math.random()-0.5)*0.3, y, sz + (Math.random()-0.5)*0.3, colorGold);
      }
    }
    fillVolume(-14, 16, -4, 6, 3, 10, colorRoof, 0.5);
    createCross(-11, 20, 0, 2.5);

    // --- 4. Blue Dome with Jesus Statue (Center-Back) ---
    const domeCx = 0, domeCy = 6, domeCz = 4;
    const domeR = 6;
    for (let phi = 0; phi <= Math.PI / 2; phi += 0.2) {
      for (let theta = 0; theta <= Math.PI * 2; theta += 0.2) {
        const r = domeR * Math.sin(phi);
        const y = domeR * Math.cos(phi);
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        if (Math.random() < 0.4) {
          addPoint(domeCx + x, domeCy + y, domeCz + z, colorBlue);
        }
      }
    }
    fillVolume(-0.5, domeCy + domeR, domeCz, 1, 1, 1, colorGold, 0.7);
    fillVolume(-0.2, domeCy + domeR + 1, domeCz, 0.4, 4, 0.4, colorGold, 0.9);
    addPoint(0, domeCy + domeR + 5.5, domeCz, colorGold);

    // Ground Debris
    while (idx < count) {
        const r = 30 + Math.random() * 30;
        const theta = Math.random() * Math.PI * 2;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        const groundColor = Math.random() > 0.5 ? new THREE.Color('#2d4c1e') : new THREE.Color('#555555');
        addPoint(x, -6 + Math.random(), z, groundColor);
    }

    return { positions, initialPositions, colors, sizes, delays };
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
      material.uniforms.uProgress.value = THREE.MathUtils.lerp(material.uniforms.uProgress.value, progress, 0.025);
      material.uniforms.uVortexStrength.value = THREE.MathUtils.lerp(material.uniforms.uVortexStrength.value, vortex, 0.05);
      material.uniforms.uMouse.value.lerp(state.mouse, 0.1);
      
      meshRef.current.rotation.y = state.mouse.x * 0.15;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={cathedralData.positions} itemSize={3} />
        <bufferAttribute attach="attributes-aInitialPosition" count={count} array={cathedralData.initialPositions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={count} array={cathedralData.colors} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={cathedralData.sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aDelay" count={count} array={cathedralData.delays} itemSize={1} />
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
