"use client";

import { useState, useRef } from "react";
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

  const services = [
    { day: "Sunday", time: "7:00 AM", event: "Holy Mass & Rosary" },
    { day: "Monday - Friday", time: "6:00 PM & 7:00 PM", event: "Daily Mass" },
    { day: "Saturday", time: "5:30 PM", event: "Vigil Mass" },
    { day: "Confession", time: "4:00 PM - 5:30 PM", event: "Mon - Sat" },
  ];

  useGSAP(() => {
    // 1. About section parallax
    gsap.from(".about-text", {
      y: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: "#about",
        start: "top 80%",
        end: "center center",
        scrub: 1,
      }
    });

    gsap.from(".about-image", {
      y: 200,
      scale: 0.8,
      scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "center center",
        scrub: 1.5,
      }
    });

    // 2. Services stagger
    gsap.from(".service-card", {
      y: 100,
      opacity: 0,
      scale: 0.9,
      stagger: 0.2,
      scrollTrigger: {
        trigger: "#services",
        start: "top 70%",
        end: "center center",
        scrub: 1,
      }
    });

    // 3. Contact form parallax
    gsap.from(".contact-info", {
      x: -50,
      opacity: 0,
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
        end: "center center",
        scrub: 1,
      }
    });

    gsap.from(".contact-form", {
      x: 50,
      opacity: 0,
      scrollTrigger: {
        trigger: "#contact",
        start: "top 80%",
        end: "center center",
        scrub: 1,
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
                  <h2 className="text-[#FF5533] font-black tracking-[0.3em] text-sm uppercase flex items-center gap-3">
                    <Sparkles size={16} /> Our Sacred Mission
                  </h2>
                  <h3 className="text-5xl md:text-7xl font-[1000] tracking-[-0.05em] leading-[0.9] uppercase">
                    A LIGHT IN <br /> <span className="text-white/20">SATTENAPALLE</span>
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-xl font-medium max-w-xl">
                  St. Ann&apos;s RCM Church stands as a beacon of hope and faith. We are a Christ-centered community dedicated to worship, compassion, and the spiritual journey of every soul.
                </p>
                <div className="grid grid-cols-2 gap-10 pt-10">
                  <div className="group space-y-4">
                    <div className="text-[#FF5533] font-black text-3xl tracking-tighter group-hover:translate-x-2 transition-transform">Eternal Faith</div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-loose">Spiritual growth through the Holy Sacraments.</p>
                  </div>
                  <div className="group space-y-4">
                    <div className="text-[#FF5533] font-black text-3xl tracking-tighter group-hover:translate-x-2 transition-transform">Divine Unity</div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-loose">Experience the profound peace of our parish family.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div className="about-image">
                <TiltCard className="relative aspect-square group">
                  <div className="absolute -inset-6 border-2 border-[#FF5533]/20 rounded-[3rem] -rotate-6 group-hover:rotate-0 transition-all duration-1000" />
                  <div className="absolute inset-0 glass rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(255,85,51,0.1)]">
                    <Image 
                      src="/pics/rosary.jpg" 
                      alt="Sacred Rosary" 
                      fill 
                      className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="relative h-full p-12 flex flex-col justify-end">
                      <p className="text-[#FF5533] font-black italic text-2xl mb-4 leading-tight tracking-tighter">&ldquo;I can do all things through Christ who strengthens me.&rdquo;</p>
                      <p className="text-white/30 text-xs font-black uppercase tracking-[0.5em]">— Philippians 4:13</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 bg-black/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-[#FF5533] font-black tracking-[0.3em] text-sm uppercase">Sacred Liturgy</h2>
              <h3 className="text-5xl md:text-8xl font-[1000] tracking-[-0.05em] uppercase">Mass Timings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((s, idx) => (
                <motion.div
                  key={idx}
                  className="group service-card"
                >
                  <TiltCard>
                    <div className="glass p-10 rounded-[2.5rem] border-white/5 hover:border-[#FF5533]/50 transition-all h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5533]/5 blur-[60px] group-hover:bg-[#FF5533]/20 transition-colors" />
                      <Clock className="text-[#FF5533] mb-8 group-hover:scale-125 transition-transform duration-500" size={40} />
                      <h4 className="text-2xl font-black mb-2 uppercase tracking-tighter">{s.day}</h4>
                      <p className="text-[#FF5533] font-black text-2xl mb-4 tracking-[-0.02em]">{s.time}</p>
                      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">{s.event}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-transparent">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <div className="space-y-16 contact-info">
                <div className="space-y-6">
                  <h2 className="text-[#FF5533] font-black tracking-[0.3em] text-sm uppercase">Divine Connection</h2>
                  <h3 className="text-5xl md:text-8xl font-[1000] tracking-[-0.05em] leading-[0.9] uppercase">We Pray <br /> <span className="text-white/20">For You</span></h3>
                  <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-lg">
                    Whether you seek guidance or need prayer—reach out.
                  </p>
                </div>
                
                <div className="grid gap-10">
                  <div className="flex gap-8 items-center group">
                    <div className="w-20 h-20 rounded-[2rem] glass border-[#FF5533]/20 flex items-center justify-center text-[#FF5533] group-hover:bg-[#FF5533] group-hover:text-black transition-all duration-500">
                      <MapPin size={28} />
                    </div>
                    <p className="text-white text-xl font-black tracking-tighter">Sattenapalle, AP 522403</p>
                  </div>
                  <div className="flex gap-8 items-center group">
                    <div className="w-20 h-20 rounded-[2rem] glass border-[#FF5533]/20 flex items-center justify-center text-[#FF5533] group-hover:bg-[#FF5533] group-hover:text-black transition-all duration-500">
                      <Mail size={28} />
                    </div>
                    <p className="text-white text-xl font-black tracking-tighter">info@stannschurch.org</p>
                  </div>
                </div>
              </div>

              <motion.div 
                className="glass p-12 rounded-[3.5rem] border-white/10 relative overflow-hidden contact-form"
              >
                {status.success ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 glass flex flex-col items-center justify-center text-center p-12">
                    <CheckCircle2 size={100} className="text-[#FF5533] mb-8 animate-bounce" />
                    <h4 className="text-4xl font-[1000] mb-4 tracking-tighter">REQUEST RECEIVED</h4>
                    <button onClick={() => setStatus({ ...status, success: false })} className="mt-8 text-[#FF5533] uppercase tracking-[0.4em] text-[10px] font-black underline">Send Another</button>
                  </motion.div>
                ) : null}

                {status.error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-500 text-sm font-bold mb-6 text-center">
                    {status.error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Name" className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-[#FF5533]/50 transition-all font-bold" />
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-[#FF5533]/50 transition-all font-bold" />
                  </div>
                  <input type="text" name="subject" required value={formData.subject} onChange={handleInputChange} placeholder="Subject" className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-8 py-5 outline-none focus:border-[#FF5533]/50 transition-all font-bold" />
                  <textarea name="message" required rows={5} value={formData.message} onChange={handleInputChange} placeholder="Message" className="w-full bg-white/[0.05] border border-white/10 rounded-[2rem] px-8 py-6 outline-none focus:border-[#FF5533]/50 transition-all font-bold resize-none"></textarea>
                  <button type="submit" disabled={status.loading} className="w-full py-6 rounded-3xl bg-[#FF5533] text-black font-[1000] uppercase tracking-[0.5em] text-sm shadow-[0_20px_50px_rgba(255,85,51,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed">
                    {status.loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Submit</>}
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
