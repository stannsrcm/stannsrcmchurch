"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      // Attempt to auto-play on mount
      audioRef.current.volume = 0.5; // 50% volume so it's not too loud
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          // Auto-play was prevented by the browser. User interaction is required.
          console.log("Autoplay prevented by browser. User must click play.");
          setIsPlaying(false);
        });
      }
    }
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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 1 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <button 
        onClick={toggleMute}
        className={`w-12 h-12 flex items-center justify-center rounded-full glass border border-white/10 text-white transition-all shadow-[0_0_20px_rgba(255,85,51,0.2)] hover:scale-110 hover:border-[#FF5533]/50 ${!isPlaying ? "animate-pulse border-[#FF5533]" : ""}`}
        title={isPlaying && !isMuted ? "Mute Choir Music" : "Play Choir Music"}
      >
        {isPlaying && !isMuted ? <Volume2 size={20} className="text-[#FF5533]" /> : <VolumeX size={20} className="text-gray-400" />}
      </button>
      <audio 
        ref={audioRef} 
        src="/choir.mp3" 
        loop 
        preload="auto" 
      />
    </motion.div>
  );
}
