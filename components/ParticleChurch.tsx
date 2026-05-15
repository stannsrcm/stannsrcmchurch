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
    // GPU Lerp for 120,000 particles
    vec3 pos = mix(aInitialPosition, position, uProgress);

    // Cinematic Vortex
    float angle = uTime * 0.4 + aDelay * 8.0;
    float dist = length(pos.xz);
    float vortex = uVortexStrength * (1.0 - uProgress) * 6.0;
    pos.x += cos(angle + dist * 0.4) * vortex;
    pos.z += sin(angle + dist * 0.4) * vortex;

    // Sacred Breathing
    pos.y += sin(uTime * 0.6 + aDelay * 15.0) * 0.12;
    
    // Interactive Mouse Dispersion
    float mouseDist = distance(pos.xy, uMouse * 18.0);
    if (mouseDist < 3.5) {
      pos += normalize(pos - vec3(uMouse * 18.0, 0.0)) * (3.5 - mouseDist) * 1.0;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (350.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    vColor = aColor;
    vOpacity = mix(0.1, 0.9, uProgress);
    vOpacity *= 0.75 + 0.25 * sin(uTime * 2.0 + aDelay * 12.0);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;

  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    
    float strength = 0.12 / d - 0.24;
    gl_FragColor = vec4(vColor, vOpacity * strength);
  }
`;

export default function ParticleChurch({ progress = 0, vortex = 0 }) {
  const count = 120000;
  const meshRef = useRef<THREE.Points>(null);

  const cathedralData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const initialPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const delays = new Float32Array(count);

    // Cathedral Color Palette
    const WARM_STONE = new THREE.Color('#d4a574');
    const DARK_STONE = new THREE.Color('#8b7355');
    const ROOF_RED = new THREE.Color('#b53b2a');
    const STAINED_BLUE = new THREE.Color('#3a6ea5');
    const GOLD = new THREE.Color('#e8c547');
    const WINDOW_LIGHT = new THREE.Color('#7ec8e0');
    const DOOR_WOOD = new THREE.Color('#6b3a2a');

    let idx = 0;

    const addParticle = (x: number, y: number, z: number, color: THREE.Color) => {
      if (idx >= count) return;
      
      const i3 = idx * 3;
      positions[i3] = x;
      positions[i3 + 1] = y - 4; // Vertical offset
      positions[i3 + 2] = z;

      const radius = 50 * Math.pow(Math.random(), 1.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      initialPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      initialPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      initialPositions[i3 + 2] = radius * Math.cos(phi);

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Sacred White particles (Crosses) are larger and brighter
      const isCross = color.r > 0.9 && color.g > 0.9 && color.b > 0.9;
      sizes[idx] = isCross ? Math.random() * 2.0 + 1.0 : Math.random() * 0.7 + 0.2;
      delays[idx] = isCross ? 0 : Math.random(); // No delay for crosses to form first
      idx++;
    };

    // 1. MAIN NAVE (Central Hall)
    for (let x = -6; x <= 6; x += 0.3) {
      for (let z = -10; z <= 8; z += 0.3) {
        for (let y = 0; y <= 8; y += 0.3) {
          if ((Math.abs(x) > 5.7 || Math.abs(z) > 9.7 || z > 7.7) && Math.random() < 0.4) {
            addParticle(x, y, z, WARM_STONE);
          }
        }
      }
    }

    // 2. TOWERS
    const towerPositions = [[-5.5, 0, -9.5], [5.5, 0, -9.5]];
    towerPositions.forEach(([tx, ty, tz]) => {
      for (let y = 0; y <= 20; y += 0.3) {
        for (let x = -1.4; x <= 1.4; x += 0.3) {
          for (let z = -1.4; z <= 1.4; z += 0.3) {
            if ((Math.abs(x) > 1.2 || Math.abs(z) > 1.2) && Math.random() < 0.5) {
              const isSpire = y > 16;
              addParticle(tx + x, y, tz + z, isSpire ? GOLD : WARM_STONE);
            }
          }
        }
      }
      // Spire tip & Cross
      for (let y = 20; y <= 24; y += 0.2) {
        const rad = (24 - y) * 0.4;
        for (let a = 0; a < Math.PI * 2; a += 0.4) {
          if (Math.random() < 0.6) addParticle(tx + Math.cos(a) * rad, y, tz + Math.sin(a) * rad, GOLD);
        }
      }
      addParticle(tx, 25, tz, GOLD); // Cross
    });

    // 3. ROSE WINDOW
    const roseCenter = [0, 8, -9.5];
    for (let r = 0; r <= 3; r += 0.2) {
      for (let a = 0; a < Math.PI * 2; a += 0.2) {
        if (Math.random() < 0.7) {
          addParticle(roseCenter[0] + Math.cos(a) * r, roseCenter[1] + Math.sin(a) * r, roseCenter[2], STAINED_BLUE);
        }
      }
    }

    // 3.1 LARGE CENTRAL CRUCIFIX (Sacred White)
    const SACRED_WHITE = new THREE.Color('#ffffff');
    const crucifixPos = [0, 15, -9.8]; // Above Rose Window
    // Vertical Beam
    for (let y = 12; y <= 19; y += 0.1) {
      for (let j = 0; j < 5; j++) {
        addParticle(crucifixPos[0] + (Math.random()-0.5)*0.15, y, crucifixPos[2], SACRED_WHITE);
      }
    }
    // Horizontal Beam
    for (let x = -2; x <= 2; x += 0.1) {
      for (let j = 0; j < 5; j++) {
        addParticle(x, 17, crucifixPos[2], SACRED_WHITE);
      }
    }

    // 4. POINTED ARCH DOOR
    for (let y = 0; y <= 5; y += 0.2) {
      const width = 1.5 * (1 - y / 6);
      for (let x = -width; x <= width; x += 0.2) {
        if (Math.random() < 0.6) addParticle(x, y, -9.8, DOOR_WOOD);
      }
    }

    // 5. FLYING BUTTRESSES
    const buttressPos = [[-6, 5, -5], [6, 5, -5], [-6, 5, 3], [6, 5, 3]];
    buttressPos.forEach(([bx, by, bz]) => {
      for (let t = 0; t <= 1; t += 0.05) {
        const x = bx + (bx > 0 ? 3 : -3) * t;
        const y = by - 5 * t * (1 - t);
        if (Math.random() < 0.5) addParticle(x, y + (by - y) * t, bz, DARK_STONE);
      }
    });

    // 6. CENTRAL SPIRE
    for (let y = 8; y <= 18; y += 0.3) {
      const rad = 2 * (1 - (y - 8) / 12);
      for (let a = 0; a < Math.PI * 2; a += 0.3) {
        if (Math.random() < 0.5) addParticle(Math.cos(a) * rad, y, 0, y > 15 ? GOLD : ROOF_RED);
      }
    }

    // 7. ROOF
    for (let x = -6; x <= 6; x += 0.3) {
      const roofY = 8 + (1 - Math.abs(x) / 6) * 4;
      for (let z = -9; z <= 7; z += 0.3) {
        if (Math.random() < 0.4) addParticle(x, roofY, z, ROOF_RED);
      }
    }

    // 8. BELLS & DETAILS
    towerPositions.forEach(([bx, by, bz]) => {
      for (let i = 0; i < 6; i++) {
        addParticle(bx, 14 + i * 0.5, bz, GOLD);
      }
    });

    // Atmospheric Dust Floor
    while (idx < count) {
      const r = 40 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      addParticle(x, 0, z, new THREE.Color('#333333'));
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
      
      meshRef.current.rotation.y = state.mouse.x * 0.12;
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
