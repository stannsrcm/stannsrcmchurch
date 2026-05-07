"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { FloatingParticles } from "./Atmosphere3D";

const GlobalScene3D = () => {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebGLSupported(!!gl);
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  if (!webGLSupported) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 10] }} gl={{ antialias: false, powerPreference: "low-power" }}>
        <FloatingParticles count={300} color="#FF5533" />
      </Canvas>
    </div>
  );
};

export default GlobalScene3D;
