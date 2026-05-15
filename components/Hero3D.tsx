"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { FloatingParticles, SacredGeometry } from "./Atmosphere3D";

const MouseLight = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (lightRef.current) {
      const { mouse, viewport } = state;
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      lightRef.current.position.set(x, y, 2);
    }
  });
  return <pointLight ref={lightRef} intensity={50} color="#F6D28B" distance={15} decay={2} />;
};

const ScrollCamera = () => {
  const { camera } = useThree();
  const targetZ = useRef(12);
  const targetY = useRef(0);
  const targetX = useRef(0);

  useFrame((state) => {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    
    // Cinematic Drift - subtle constant motion
    const t = state.clock.getElapsedTime();
    const driftX = Math.sin(t * 0.2) * 0.5;
    const driftY = Math.cos(t * 0.2) * 0.3;

    // Zoom into the scene
    targetZ.current = 12 - progress * 4;
    // Pan slightly
    targetY.current = -progress * 2 + driftY;
    targetX.current = -progress * 1 + driftX;
    
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY.current, 0.03);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX.current, 0.03);
    camera.lookAt(0, 0, -10);
  });
  return null;
};

const BackgroundPlane = () => {
  const texture = useLoader(THREE.TextureLoader, '/pics/gallery_exterior_full.jpg');
  const { viewport } = useThree();
  const scale = Math.max(viewport.width, viewport.height) * 2;

  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[scale * 2.5, scale * 1.8]} />
      <meshBasicMaterial map={texture} transparent opacity={0.6} color={new THREE.Color(0xffffff)} />
    </mesh>
  );
};

const Hero3D = () => {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        setWebGLSupported(!!gl);
      } catch (e) {
        setWebGLSupported(false);
      }
    };
    checkWebGL();
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Cinematic Vignette */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(17,17,17,0.95)_100%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_300px_rgba(0,0,0,1)]" />
      </div>

      <div className="fixed inset-0 z-[-1] pointer-events-none">
        {webGLSupported ? (
          <Canvas 
            camera={{ position: [0, 0, 12], fov: typeof window !== 'undefined' && window.innerWidth < 768 ? 45 : 35 }} 
            gl={{ antialias: true, alpha: true }}
            onCreated={({ gl }) => gl.setClearColor(0x111111, 1)}
          >
            <Suspense fallback={null}>
              <BackgroundPlane />
            </Suspense>
            <ambientLight intensity={0.1} />
            <spotLight position={[0, 10, -5]} intensity={500} color="#F6D28B" angle={0.6} penumbra={1} />
            <pointLight position={[-10, -5, 5]} intensity={150} color="#C46A2D" />
            <pointLight position={[10, 5, -10]} intensity={200} color="#D4A24C" />
            <MouseLight />
            <SacredGeometry count={8} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.2} />
            <FloatingParticles count={1000} color="#F6D28B" />
            <ScrollCamera />
          </Canvas>
        ) : null}
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none pt-20 md:pt-0">
        <div className="text-center space-y-8 md:space-y-12 px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 
              className="text-4xl sm:text-5xl md:text-8xl lg:text-[7rem] font-serif tracking-tight uppercase leading-[0.9] md:leading-[0.8] select-none text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              ST. ANN&apos;S <br />
              <span className="text-[#D6B36A]/80 gold-glow">RCM CHURCH</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="flex items-center justify-center gap-4 md:gap-6"
          >
            <div className="h-[1px] w-8 md:w-12 bg-white/10" />
            <p className="text-[10px] md:text-lg text-white/40 font-light tracking-[0.4em] md:tracking-[0.8em] uppercase">
              Faith • Community • Grace
            </p>
            <div className="h-[1px] w-8 md:w-12 bg-white/10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="pt-10 md:pt-16 pointer-events-auto"
          >
            <a
              href="#about"
              className="group relative inline-flex items-center justify-center px-10 md:px-16 py-4 md:py-6 overflow-hidden glass rounded-full transition-all duration-500 border border-white/5 hover:border-[#D6B36A]/50"
            >
              <div className="absolute inset-0 bg-[#D6B36A] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
              <span className="relative text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-white group-hover:text-[#0F141B] transition-colors duration-500">
                Explore the Sanctuary
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Cinematic Fog Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#0F141B] to-transparent" />
      </div>
    </div>
  );
};

export default Hero3D;
