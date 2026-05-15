"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleChurch from "./ParticleChurch";
import { Sparkles, MousePointer2 } from "lucide-react";

export default function CinematicIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [sequence, setSequence] = useState<"dark" | "vortex" | "forming" | "complete">("dark");
  const [progress, setProgress] = useState(0);
  const [vortex, setVortex] = useState(0.05);
  const bellsRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (hasStarted) {
      // Sequence timing
      const timers = [
        setTimeout(() => setSequence("vortex"), 1000),
        setTimeout(() => setVortex(1.5), 2000),
        setTimeout(() => {
          setSequence("forming");
          setProgress(1);
          setVortex(0.2);
        }, 5000),
        setTimeout(() => setSequence("complete"), 12000),
        setTimeout(() => setIsVisible(false), 15000),
      ];

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [hasStarted]);

  const handleStart = () => {
    setHasStarted(true);
    window.dispatchEvent(new Event("startMusic"));
    if (bellsRef.current) bellsRef.current.play().catch(() => {});
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
    >
      <audio ref={bellsRef} src="https://assets.mixkit.co/active_storage/sfx/2215/2215-preview.mp3" />

      {/* 3D Particle Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <ParticleChurch progress={progress} vortex={vortex} />
        </Canvas>
      </div>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_100%)] opacity-80" />
        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* Floating Interactive Message */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20 flex flex-col items-center gap-8 cursor-pointer group"
            onClick={handleStart}
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-12 bg-[#D4A24C]/20 blur-[60px] rounded-full"
              />
              <div className="w-20 h-20 rounded-full border border-[#D4A24C]/30 flex items-center justify-center glass group-hover:scale-110 transition-all duration-700">
                <Sparkles className="text-[#D4A24C] w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-[#D4A24C] font-serif text-3xl tracking-[0.3em] uppercase gold-glow">
                Begin the Experience
              </h2>
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4">
                <MousePointer2 size={12} /> Click to Illuminate
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Progression Hints */}
      <AnimatePresence>
        {hasStarted && sequence !== "complete" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-12 left-0 w-full flex justify-center z-20"
          >
            <p className="text-[#D4A24C]/40 text-[9px] font-black uppercase tracking-[1em] animate-pulse">
              {sequence === "vortex" && "Vortex of Faith"}
              {sequence === "forming" && "Structure of Grace"}
              {sequence === "dark" && "Gathering Light"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Film Grain & Vignette */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150" />
    </motion.div>
  );
}
