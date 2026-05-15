"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleStartMusic = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    window.addEventListener("startMusic", handleStartMusic);

    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {});
      }
    }

    return () => window.removeEventListener("startMusic", handleStartMusic);
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        // If it was blocked from autoplay, start playing it now
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.muted = false;
        setIsMuted(false);
      } else {
        const newMutedState = !isMuted;
        audioRef.current.muted = newMutedState;
        setIsMuted(newMutedState);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 3, duration: 1 }}
      className="fixed bottom-8 left-8 z-[60]"
    >
      <button 
        onClick={toggleMute}
        className={`w-14 h-14 flex items-center justify-center rounded-full glass border border-white/10 text-white transition-all duration-500 shadow-2xl hover:scale-110 hover:border-[#D4A24C]/50 group ${!isPlaying ? "animate-pulse border-[#D4A24C]/50" : ""}`}
        title={isPlaying && !isMuted ? "Mute Choir" : "Play Choir"}
      >
        <div className="absolute inset-0 rounded-full bg-[#D4A24C]/5 group-hover:bg-[#D4A24C]/10 transition-colors" />
        {isPlaying && !isMuted ? (
          <Volume2 size={20} className="text-[#D4A24C] gold-glow relative z-10" />
        ) : (
          <VolumeX size={20} className="text-white/40 relative z-10" />
        )}
      </button>
      <audio 
        ref={audioRef} 
        src="/music.mp3" 
        loop 
        preload="auto" 
      />
    </motion.div>
  );
}
