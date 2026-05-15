"use client";

import { useState, useEffect } from "react";
import { getDailyVerse, BibleVerse } from "@/lib/bible-verses";
import { motion } from "framer-motion";
import { BookOpen, Calendar } from "lucide-react";

const DailyVerse = () => {
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [showEnglish, setShowEnglish] = useState(false);

  useEffect(() => {
    setVerse(getDailyVerse());
  }, []);

  if (!verse) return null;

  const today = new Date();
  const dateString = today.toLocaleDateString("te-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="relative max-w-2xl mx-auto px-6 py-6"
    >
      {/* 3D Card Effect */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#C46A2D] via-[#D4A24C] to-[#C46A2D] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-[2000ms]" />

        {/* Main Card */}
        <div className="relative glass rounded-[2.5rem] p-8 md:p-12 border border-white/5 overflow-hidden shadow-2xl bg-[#1A1A1A]/80">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(196,106,45,0.1)_0%,_transparent_70%)]" />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#C46A2D]/5 rounded-xl border border-[#C46A2D]/10">
                <BookOpen className="w-4 h-4 text-[#C46A2D]" />
              </div>
              <div>
                <h3 className="text-[#D4A24C] font-serif text-xl tracking-tight gold-glow">
                  దైనిక వాక్యం
                </h3>
                <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">Sacred Revelation</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-white/20 font-black text-[9px] uppercase tracking-[0.3em]">
              <Calendar className="w-3 h-3" />
              <span>{dateString}</span>
            </div>
          </div>

          {/* Verse Content */}
          <div className="relative space-y-8">
            {/* Telugu Verse */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <p className="text-2xl md:text-4xl text-[#FAF9F6] leading-[1.3] font-serif tracking-tight">
                {verse.telugu}
              </p>
            </motion.div>

            {/* Reference */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex items-center gap-4"
            >
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#C46A2D]/30" />
              <p className="text-[#D4A24C] font-serif italic text-xl tracking-wide">
                {verse.reference}
              </p>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C46A2D]/30 to-transparent" />
            </motion.div>

            {/* English Translation (Toggle) */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: showEnglish ? 1 : 0,
                height: showEnglish ? "auto" : 0,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-6 border-t border-white/5">
                <p className="text-white/40 text-lg font-light italic leading-relaxed font-serif">
                  {verse.english}
                </p>
              </div>
            </motion.div>

            {/* Toggle Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              onClick={() => setShowEnglish(!showEnglish)}
              className="flex items-center gap-3 text-white/30 hover:text-[#D6B36A] transition-all duration-500 text-[8px] font-black tracking-[0.4em] uppercase"
            >
              <span>{showEnglish ? "Simplify" : "Expand"} Translation</span>
              <div className={`w-1 h-1 rounded-full transition-all duration-500 ${showEnglish ? "bg-[#D6B36A] gold-glow" : "bg-white/10"}`} />
            </motion.button>
          </div>

          {/* Decorative Cross */}
          <div className="absolute top-10 right-10 opacity-[0.03]">
            <svg width="100" height="150" viewBox="0 0 100 150" fill="none">
              <rect x="45" y="0" width="10" height="150" fill="white" />
              <rect x="20" y="40" width="60" height="10" fill="white" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyVerse;
