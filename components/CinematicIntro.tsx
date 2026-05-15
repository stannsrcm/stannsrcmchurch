"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function CinematicIntro() {
  const [stage, setStage] = useState<"dark" | "sketch" | "glow" | "complete">("dark");
  const [isVisible, setIsVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bellsRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("sketch"), 500);
    const timer2 = setTimeout(() => setStage("glow"), 1500);
    const timer3 = setTimeout(() => setStage("complete"), 2500);
    const timer4 = setTimeout(() => setIsVisible(false), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleStart = () => {
    window.dispatchEvent(new Event("startMusic"));
    if (bellsRef.current) bellsRef.current.play().catch(() => {});
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#0F141B] flex flex-center justify-center overflow-hidden cursor-pointer"
      onClick={handleStart}
    >
      <audio ref={bellsRef} src="https://assets.mixkit.co/active_storage/sfx/2215/2215-preview.mp3" />

      {/* Volumetric Fog */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <motion.div
          animate={{ x: ["-20%", "0%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/Anisayari/cinematic-fog/main/fog.png')] bg-repeat-x bg-contain"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-10%"], 
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-4xl aspect-video flex items-center justify-center px-10">
        <AnimatePresence mode="wait">
          {stage === "sketch" && (
            <motion.div
              key="sketch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="relative w-full h-full"
            />
          )}

          {stage === "glow" && (
            <motion.div
              key="glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="relative w-full h-full"
            />
          )}

          {stage === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
              className="text-center space-y-6"
            >
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-4xl md:text-6xl font-serif tracking-widest text-[#D6B36A] gold-glow uppercase"
              >
                St. Ann&apos;s RCM Church
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="text-white/40 tracking-[0.5em] uppercase text-xs"
              >
                Enter the Sacred Journey
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interaction Prompt */}
      {stage === "dark" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-20 text-white/20 text-xs tracking-widest uppercase animate-pulse"
        >
          Click to begin the experience
        </motion.div>
      )}

      {/* Volumetric Light Rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[140%] bg-[radial-gradient(ellipse_at_top,_rgba(155,184,255,0.05)_0%,_transparent_50%)] rotate-12" />
        <div className="absolute top-[-20%] right-[-10%] w-[120%] h-[140%] bg-[radial-gradient(ellipse_at_top,_rgba(214,179,106,0.05)_0%,_transparent_50%)] -rotate-12" />
      </div>
    </motion.div>
  );
}
