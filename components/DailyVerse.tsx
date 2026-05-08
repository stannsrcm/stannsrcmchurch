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
      className="relative max-w-4xl mx-auto px-6 py-8"
    >
      {/* 3D Card Effect */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5533] via-[#FF7733] to-[#FF5533] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />

        {/* Main Card */}
        <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-[#FF5533]/30 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#FF5533_0%,transparent_50%)]" />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#FF5533]/10 rounded-xl">
                <BookOpen className="w-6 h-6 text-[#FF5533]" />
              </div>
              <div>
                <h3 className="text-[#FF5533] font-bold text-lg tracking-wider">
                  దైనిక వాక్యం
                </h3>
                <p className="text-white/50 text-sm">Daily Verse</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{today.getDate()}</span>
            </div>
          </div>

          {/* Verse Content */}
          <div className="relative space-y-6">
            {/* Telugu Verse */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <p className="text-2xl md:text-3xl text-white leading-relaxed font-medium">
                {verse.telugu}
              </p>
            </motion.div>

            {/* Reference */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex items-center gap-2"
            >
              <div className="h-px w-12 bg-[#FF5533]/50" />
              <p className="text-[#FF5533] font-bold text-lg tracking-wider">
                {verse.reference}
              </p>
              <div className="h-px flex-1 bg-[#FF5533]/50" />
            </motion.div>

            {/* English Translation (Toggle) */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: showEnglish ? 1 : 0,
                height: showEnglish ? "auto" : 0,
              }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/60 text-lg italic leading-relaxed">
                  {verse.english}
                </p>
              </div>
            </motion.div>

            {/* Toggle Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              onClick={() => setShowEnglish(!showEnglish)}
              className="flex items-center gap-2 text-white/40 hover:text-[#FF5533] transition-colors text-sm tracking-wider uppercase"
            >
              <span>{showEnglish ? "Hide" : "Show"} English</span>
              <div className={`w-2 h-2 rounded-full bg-[#FF5533] ${showEnglish ? "opacity-100" : "opacity-30"}`} />
            </motion.button>
          </div>

          {/* Decorative Cross */}
          <div className="absolute top-4 right-4 opacity-10">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="25" y="5" width="10" height="50" fill="#FF5533" />
              <rect x="10" y="20" width="40" height="10" fill="#FF5533" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyVerse;
