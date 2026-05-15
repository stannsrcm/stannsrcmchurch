"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Move, Camera, Sparkles } from "lucide-react";

// --- Photo Sphere Component ---
const PhotoSphere = ({ texturePath, fallbackPath }: { texturePath: string; fallbackPath: string }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Attempt 1: Local Project File
    loader.load(
      texturePath,
      (tex) => {
        tex.mapping = THREE.UVMapping;
        setTexture(tex);
      },
      undefined,
      () => {
        // Attempt 2: Cinematic Fallback URL
        loader.load(
          fallbackPath,
          (tex) => {
            tex.mapping = THREE.UVMapping;
            setTexture(tex);
          },
          undefined,
          () => setError(true)
        );
      }
    );
  }, [texturePath, fallbackPath]);
  
  if (error) {
    return (
      <mesh>
        <sphereGeometry args={[100, 60, 40]} />
        <meshBasicMaterial color="#050505" side={THREE.BackSide} />
      </mesh>
    );
  }

  if (!texture) return null;

  return (
    <motion.group initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
      <mesh>
        <sphereGeometry args={[100, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} transparent opacity={1} />
      </mesh>
    </motion.group>
  );
};

interface VirtualTourProps {
  onClose: () => void;
}

const VirtualTour = ({ onClose }: VirtualTourProps) => {
  const [view, setView] = useState<"exterior" | "interior">("exterior");
  
  // High-fidelity fallback URLs (St. Peters and historic cathedrals)
  const exteriorFallback = "https://images.unsplash.com/photo-1433334359648-3f4a9c8d997f?q=80&w=2070&auto=format&fit=crop";
  const interiorFallback = "https://images.unsplash.com/photo-1548705085-101177834f47?q=80&w=2072&auto=format&fit=crop";

  const localExterior = "/pics/church_exterior_render.jpg";
  const localInterior = "/pics/church_inside_altar.jpg";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col"
    >
      {/* Cinematic Overlay UI */}
      <div className="absolute top-0 left-0 w-full z-10 p-8 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <h2 className="text-[#D4A24C] font-serif text-3xl tracking-[0.2em] uppercase gold-glow leading-tight">
              360° Sanctuary Tour
            </h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
              <Sparkles size={12} className="text-[#D6B36A]" /> Cinematic Virtual Experience
            </p>
          </div>
          
          <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
          
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setView("exterior")}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border ${view === "exterior" ? "bg-[#D6B36A] text-[#0F141B] border-[#D6B36A]" : "text-white/60 border-white/10 hover:border-white/30"}`}
            >
              Exterior View
            </button>
            <button 
              onClick={() => setView("interior")}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border ${view === "interior" ? "bg-[#D6B36A] text-[#0F141B] border-[#D6B36A]" : "text-white/60 border-white/10 hover:border-white/30"}`}
            >
              Holy Interior
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-14 h-14 rounded-full glass border-white/10 flex items-center justify-center text-white hover:bg-[#D6B36A] hover:text-[#0F141B] transition-all duration-700"
        >
          <X size={24} />
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 cursor-grab active:cursor-grabbing">
        <Canvas gl={{ antialias: true, powerPreference: "high-performance" }}>
          <Suspense fallback={null}>
            <PhotoSphere 
              key={view} // Force re-mount for smooth transition
              texturePath={view === "exterior" ? localExterior : localInterior} 
              fallbackPath={view === "exterior" ? exteriorFallback : interiorFallback} 
            />
            
            <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={typeof window !== 'undefined' && window.innerWidth < 768 ? 85 : 75} />
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              rotateSpeed={-0.4} 
              autoRotate
              autoRotateSpeed={0.3}
              enableDamping
              dampingFactor={0.05}
              minDistance={0.1}
              maxDistance={50}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Navigation Footer */}
      <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-t from-black/90 to-transparent">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
            <Move size={16} className="text-[#D6B36A]" /> Drag to Look Around
          </div>
          <div className="flex items-center gap-3 text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
            <Maximize2 size={16} className="text-[#D6B36A]" /> Scroll to Zoom
          </div>
        </div>

        <div className="flex items-center gap-6">
          <p className="text-[#D4A24C] font-serif italic text-lg opacity-80">&ldquo;Behold, I make all things new.&rdquo;</p>
        </div>
      </div>

      {/* Mobile Selector */}
      <div className="md:hidden absolute bottom-32 left-0 w-full flex justify-center gap-4 px-8">
        <button 
          onClick={() => setView("exterior")}
          className={`flex-1 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border ${view === "exterior" ? "bg-[#D6B36A] text-[#0F141B] border-[#D6B36A]" : "glass text-white/60 border-white/10"}`}
        >
          Exterior
        </button>
        <button 
          onClick={() => setView("interior")}
          className={`flex-1 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border ${view === "interior" ? "bg-[#D6B36A] text-[#0F141B] border-[#D6B36A]" : "glass text-white/60 border-white/10"}`}
        >
          Interior
        </button>
      </div>
    </motion.div>
  );
};

export default VirtualTour;
