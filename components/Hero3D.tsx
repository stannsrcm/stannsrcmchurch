"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { FloatingParticles } from "./Atmosphere3D";

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
    <div className="relative h-screen w-full overflow-hidden" style={{ background: "black" }}>
      {/* 🚀 BULLETPROOF THEME BACKGROUND (Mary.jpg) 🚀 */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/pics/mary.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.7
        }}
      >
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,85,51,0.15)_0%,transparent_70%)]" />
      </div>

      <div className="absolute inset-0 z-10">
        {webGLSupported ? (
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 40 }} 
            gl={{ antialias: false, alpha: true }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#FF5533" />
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            <FloatingParticles count={400} color="#FF5533" />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        ) : null}
      </div>

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center space-y-8 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 
              className="text-4xl md:text-7xl lg:text-[6rem] font-[1000] tracking-[-0.05em] uppercase leading-none select-none whitespace-nowrap"
              style={{ 
                color: "#FF5533",
                textShadow: "0 0 30px rgba(255, 85, 51, 0.8), 0 0 60px rgba(255, 85, 51, 0.4)"
              }}
            >
              ST. ANN&apos;S RCM CHURCH
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-2xl text-white/70 font-bold tracking-[0.6em] uppercase"
          >
            Faith • Community • Grace
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="pt-12 pointer-events-auto"
          >
            <a
              href="#about"
              className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-black text-[#FF5533] transition-all duration-300 border-2 border-[#FF5533] rounded-full hover:text-black"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-full bg-[#FF5533] group-hover:translate-x-0"></span>
              <span className="relative text-xs uppercase tracking-[0.4em]">Enter Sanctuary</span>
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero3D;
