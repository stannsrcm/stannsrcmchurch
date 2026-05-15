"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("@/components/Hero3D"), { ssr: false });
const VirtualTour = dynamic(() => import("@/components/VirtualTour"), { ssr: false });

import EventCard from "@/components/EventCard";
import DailyVerse from "@/components/DailyVerse";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, PlayCircle, MapPin, Phone, Mail, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { TiltCard } from "@/components/TiltCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });
  const [events, setEvents] = useState<any[]>([]);
  const [showTour, setShowTour] = useState(false);
  const { scrollYProgress } = useScroll();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      const res = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setStatus({ loading: false, success: true, error: "" });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus(s => ({ ...s, success: false })), 5000);
    } catch (err: any) {
      let errorMessage = err.message;
      if (err.message.includes("fetch failed") || err.message.includes("ENOTFOUND")) {
        errorMessage = "Connection to Church Database failed. Please check your internet or Supabase configuration.";
      }
      setStatus({ loading: false, success: false, error: errorMessage });
    }
  };

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        } else {
          setEvents([
            { id: "1", date: "Sunday", time: "7:00 AM", title: "Holy Mass & Rosary", location: "Main Church" },
            { id: "2", date: "Monday - Friday", time: "6:00 PM & 7:00 PM", title: "Daily Mass", location: "Main Church" },
            { id: "3", date: "Saturday", time: "5:30 PM", title: "Vigil Mass", location: "Main Church" },
            { id: "4", date: "Confession", time: "4:00 PM - 5:30 PM", title: "Mon - Sat", location: "Confessional" },
          ]);
        }
      })
      .catch(() => {
        setEvents([]);
      });
  }, []);

  useGSAP(() => {
    gsap.utils.toArray("section").forEach((section: any) => {
      gsap.from(section, {
        opacity: 0,
        y: 100,
        filter: "blur(20px)",
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "top 20%",
          scrub: 1.5,
        }
      });
    });
  }, { scope: container });

  return (
    <>
      <div className="flex flex-col relative overflow-hidden" ref={container}>
        {/* 3D Hero */}
        <div className="hero-section">
          <Hero3D onOpenTour={() => setShowTour(true)} />
        </div>

        {/* Daily Bible Verse */}
        <div className="relative z-10 -mt-20">
          <DailyVerse />
        </div>

        <div className="relative z-10">
          {/* About Section */}
          <section id="about" className="py-32 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <motion.div className="space-y-10 about-text">
                  <div className="space-y-4">
                    <h2 className="text-[#D6B36A] font-black tracking-[0.4em] text-xs uppercase flex items-center gap-3">
                      <Sparkles size={14} className="gold-glow" /> Our Sacred Mission
                    </h2>
                    <h3 className="text-5xl md:text-8xl font-serif tracking-tight leading-[0.9] uppercase text-[#FAF9F6]">
                      A LIGHT IN <br /> <span className="text-white/5 italic">SATTENAPALLE</span>
                    </h3>
                  </div>
                  <p className="text-[#E5E7EB] leading-relaxed text-xl font-light max-w-xl">
                    St. Ann&apos;s RCM Church stands as a beacon of hope and faith. We are a Christ-centered community dedicated to worship, compassion, and the spiritual journey of every soul.
                  </p>
                  <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/5">
                    <div className="group space-y-4">
                      <div className="text-[#D4A24C] font-serif text-3xl tracking-tight group-hover:translate-x-2 transition-transform duration-700">Eternal Faith</div>
                      <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.3em] leading-loose">Spiritual growth through the Holy Sacraments.</p>
                    </div>
                    <div className="group space-y-4">
                      <div className="text-[#D4A24C] font-serif text-3xl tracking-tight group-hover:translate-x-2 transition-transform duration-700">Divine Unity</div>
                      <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.3em] leading-loose">Experience the profound peace of our parish family.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="about-image">
                  <TiltCard className="relative aspect-[4/5] group">
                    <div className="absolute -inset-4 border border-[#D6B36A]/20 rounded-[2rem] rotate-3 group-hover:rotate-0 transition-all duration-1000" />
                    <div className="absolute inset-0 glass rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                      <Image 
                        src="/pics/rosary.jpg" 
                        alt="Sacred Rosary" 
                        fill 
                        className="object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms]" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F141B] via-transparent to-transparent" />
                      <div className="relative h-full p-10 flex flex-col justify-end">
                        <p className="text-[#D4A24C] font-serif italic text-2xl mb-6 leading-snug tracking-tight">&ldquo;I can do all things through Christ who strengthens me.&rdquo;</p>
                        <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.5em]">Philippians 4:13</p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-40 bg-[#0F141B]/80 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(155,184,255,0.03)_0%,_transparent_70%)]" />
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-24 space-y-4">
                <h2 className="text-[#C46A2D] font-black tracking-[0.4em] text-xs uppercase">Sacred Liturgy</h2>
                <h3 className="text-6xl md:text-9xl font-serif tracking-tight uppercase text-[#FAF9F6]">Mass Timings</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {events.map((e, idx) => (
                  <motion.div key={e.id || idx} className="group service-card">
                    <TiltCard>
                      <div className="glass p-10 rounded-[3rem] border-white/5 hover:border-[#D6B36A]/30 transition-all duration-700 h-full relative overflow-hidden flex flex-col justify-between group">
                        <div>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A24C]/5 blur-[60px] group-hover:bg-[#D4A24C]/10 transition-colors duration-700" />
                          <Clock className="text-[#D4A24C] mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 opacity-60" size={32} />
                          <h4 className="text-xl font-serif mb-3 tracking-wide text-[#FAF9F6]">{e.date}</h4>
                          <p className="text-[#D4A24C] font-serif text-3xl mb-6 tracking-tight gold-glow">{e.time}</p>
                          <p className="text-white/60 font-black text-[10px] uppercase tracking-[0.3em] mb-4">{e.title}</p>
                          {e.description && <p className="text-[#9CA3AF] text-xs font-medium leading-relaxed line-clamp-3">{e.description}</p>}
                        </div>
                        {e.location && (
                          <div className="flex items-center gap-3 text-gray-600 text-[9px] font-black uppercase tracking-[0.3em] mt-8 pt-6 border-t border-white/5">
                            <MapPin size={10} className="text-[#D6B36A]/50" />
                            <span>{e.location}</span>
                          </div>
                        )}
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Visit Us Section (Map) */}
          <section id="location" className="py-40 relative overflow-hidden bg-transparent">
            <div className="container mx-auto px-6">
              <div className="text-center mb-24 space-y-4">
                <h2 className="text-[#C46A2D] font-black tracking-[0.4em] text-xs uppercase flex items-center justify-center gap-3">
                  <MapPin size={14} className="gold-glow" /> Find Your Way
                </h2>
                <h3 className="text-6xl md:text-[8rem] font-serif tracking-tight uppercase text-[#FAF9F6]">Visit Us</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
                <div className="lg:col-span-1 space-y-8 h-full">
                  <div className="glass p-12 rounded-[3.5rem] border-white/5 h-full flex flex-col justify-between">
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Our Sanctuary</p>
                        <h4 className="text-4xl font-serif text-[#D4A24C] leading-tight">St. Ann&apos;s RCM Church</h4>
                      </div>
                      <div className="space-y-6">
                        <div className="flex gap-6 items-start">
                          <MapPin className="text-[#D6B36A] mt-1 shrink-0" size={24} />
                          <p className="text-white/80 text-xl font-light leading-relaxed">Main Road, Sattenapalle, <br /> Andhra Pradesh 522403</p>
                        </div>
                        <div className="flex gap-6 items-center">
                          <Clock className="text-[#D6B36A] shrink-0" size={24} />
                          <p className="text-white/80 text-xl font-light">Open Daily for Prayer</p>
                        </div>
                      </div>
                    </div>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=St.+Ann's+RCM+Church+Sattenapalle" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center w-full py-6 overflow-hidden glass rounded-full transition-all duration-500 border border-[#D6B36A]/20 hover:border-[#D6B36A] mt-12">
                      <div className="absolute inset-0 bg-[#D6B36A] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
                      <span className="relative text-[10px] uppercase tracking-[0.6em] font-black text-white group-hover:text-[#0F141B] transition-colors duration-500 flex items-center gap-3">
                        Get Directions <Send size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-2 relative h-[500px] lg:h-auto min-h-[400px]">
                  <div className="absolute -inset-4 border border-[#D6B36A]/10 rounded-[4rem] rotate-1" />
                  <div className="relative h-full glass rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3830.123!2d80.145!3d16.395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4af18!2sSt.%20Ann's%20RCM%20Church!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%) grayscale(0.5)" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-40 relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
              <Image src="/pics/mary.jpg" alt="Sacred Background" fill className="object-cover opacity-10 grayscale brightness-50 contrast-125" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                <div className="space-y-20 contact-info">
                  <div className="space-y-8">
                    <h2 className="text-[#C46A2D] font-black tracking-[0.4em] text-xs uppercase">Divine Connection</h2>
                    <h3 className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85] uppercase text-[#FAF9F6]">We Pray <br /> <span className="text-white/5 italic">For You</span></h3>
                  </div>
                  <div className="grid gap-12">
                    <div className="flex gap-10 items-center group">
                      <div className="w-16 h-16 rounded-full glass border-white/10 flex items-center justify-center text-[#D6B36A] group-hover:bg-[#D6B36A] group-hover:text-[#0F141B] transition-all duration-700 shadow-xl">
                        <MapPin size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Location</p>
                        <p className="text-white text-xl font-serif tracking-wide">Sattenapalle, AP 522403</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div className="glass p-16 rounded-[4rem] border-white/5 relative overflow-hidden contact-form shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D1D5DB] ml-4">Full Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-8 py-5 outline-none focus:border-[#D6B36A]/40 text-white" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-6 rounded-2xl bg-[#D6B36A] text-[#0F141B] font-black uppercase tracking-[0.4em] text-[11px]">Submit Request</button>
                  </form>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {showTour && <VirtualTour onClose={() => setShowTour(false)} />}
      </AnimatePresence>
    </>
  );
}
