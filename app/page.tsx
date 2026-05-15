"use client";

import { useState, useRef, useEffect } from "react";
import Hero3D from "@/components/Hero3D";
import EventCard from "@/components/EventCard";
import DailyVerse from "@/components/DailyVerse";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, PlayCircle, MapPin, Phone, Mail, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import { TiltCard } from "@/components/TiltCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });
  const [events, setEvents] = useState<any[]>([]);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

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
          // Fallback if no events in DB yet, so the section doesn't look empty
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
    // Cinematic Reveal for all sections
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

    // 1. About section depth
    gsap.from(".about-text", {
      x: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        end: "center center",
        scrub: 2,
      }
    });

    gsap.from(".about-image", {
      scale: 0.8,
      rotateY: 20,
      opacity: 0,
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        end: "center center",
        scrub: 2,
      }
    });

    // 2. Services stagger reveal
    gsap.from(".service-card", {
      y: 150,
      opacity: 0,
      scale: 0.8,
      stagger: 0.3,
      scrollTrigger: {
        trigger: "#services",
        start: "top 80%",
        end: "center center",
        scrub: 2,
      }
    });

    // 3. Contact section cinematic reveal
    gsap.from(".contact-info", {
      y: 100,
      opacity: 0,
      filter: "blur(10px)",
      scrollTrigger: {
        trigger: "#contact",
        start: "top 90%",
        end: "top 50%",
        scrub: 2,
      }
    });

    gsap.from(".contact-form", {
      scale: 0.9,
      opacity: 0,
      y: 50,
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
        end: "top 40%",
        scrub: 2,
      }
    });
  }, { scope: container });

  return (
    <div className="flex flex-col relative overflow-hidden" ref={container}>
      {/* 3D Hero */}
      <div className="hero-section">
        <Hero3D />
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
              <motion.div
                className="space-y-10 about-text"
              >
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
                <motion.div
                  key={e.id || idx}
                  className="group service-card"
                >
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

        {/* Contact Section */}
        <section id="contact" className="py-40 relative overflow-hidden">
          {/* Old Theme Background Picture (Mother Mary) */}
          <div className="absolute inset-0 z-0 bg-[#0a0a0a]">
            <Image 
              src="/pics/mary.jpg"
              alt="Sacred Background"
              fill
              className="object-cover opacity-10 grayscale brightness-50 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(196,106,45,0.05)_0%,_transparent_70%)]" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
              <div className="space-y-20 contact-info">
                <div className="space-y-8">
                  <h2 className="text-[#C46A2D] font-black tracking-[0.4em] text-xs uppercase">Divine Connection</h2>
                  <h3 className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85] uppercase text-[#FAF9F6]">We Pray <br /> <span className="text-white/5 italic">For You</span></h3>
                  <p className="text-[#E5E7EB] text-xl font-light leading-relaxed max-w-lg">
                    Whether you seek guidance or need prayer—reach out.
                  </p>
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
                  <div className="flex gap-10 items-center group">
                    <div className="w-16 h-16 rounded-full glass border-white/10 flex items-center justify-center text-[#D6B36A] group-hover:bg-[#D6B36A] group-hover:text-[#0F141B] transition-all duration-700 shadow-xl">
                      <Mail size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#D1D5DB] text-[10px] font-black uppercase tracking-[0.3em]">Email</p>
                      <p className="text-[#FAF9F6] text-xl font-serif tracking-wide">stannsrcm@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div 
                className="glass p-16 rounded-[4rem] border-white/5 relative overflow-hidden contact-form shadow-2xl"
              >
                {status.success ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 glass flex flex-col items-center justify-center text-center p-12">
                    <CheckCircle2 size={80} className="text-[#D6B36A] mb-8" />
                    <h4 className="text-3xl font-serif mb-4 tracking-tight">REQUEST RECEIVED</h4>
                    <p className="text-[#D1D5DB] text-xs tracking-widest uppercase">Go in peace.</p>
                    <button onClick={() => setStatus({ ...status, success: false })} className="mt-12 text-[#D6B36A] uppercase tracking-[0.4em] text-[9px] font-black underline decoration-[#D6B36A]/30 underline-offset-8">Send Another</button>
                  </motion.div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D1D5DB] ml-4">Full Name</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="St. Jude" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-8 py-5 outline-none focus:border-[#D6B36A]/40 focus:bg-white/[0.05] transition-all font-medium text-white placeholder:text-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="faith@example.com" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-8 py-5 outline-none focus:border-[#D6B36A]/40 focus:bg-white/[0.05] transition-all font-medium text-white placeholder:text-white/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Subject</label>
                    <input type="text" name="subject" required value={formData.subject} onChange={handleInputChange} placeholder="Prayer Request" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-8 py-5 outline-none focus:border-[#D6B36A]/40 focus:bg-white/[0.05] transition-all font-medium text-white placeholder:text-white/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">Your Message</label>
                    <textarea name="message" required rows={4} value={formData.message} onChange={handleInputChange} placeholder="How can we pray for you?" className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-8 py-6 outline-none focus:border-[#D6B36A]/40 focus:bg-white/[0.05] transition-all font-medium text-white placeholder:text-white/10 resize-none"></textarea>
                  </div>
                  <button type="submit" disabled={status.loading} className="w-full py-6 rounded-2xl bg-[#D6B36A] text-[#0F141B] font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_20px_50px_rgba(214,179,106,0.2)] hover:scale-[1.01] hover:shadow-[0_25px_60px_rgba(214,179,106,0.3)] transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group">
                    {status.loading ? <Loader2 className="animate-spin" /> : <><Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Submit Request</>}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
