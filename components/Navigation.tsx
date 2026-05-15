"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useUI } from "./UIProvider";

const Navigation = () => {
  const { openTour } = useUI();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Visit Us", href: "/#location" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "glass py-2" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 md:w-14 md:h-14 transition-transform duration-700 group-hover:rotate-[360deg] scale-110">
            <Image
              src="/logo3.png"
              alt="St. Ann's RCM Church Logo"
              fill
              className="object-contain brightness-110 saturate-50 contrast-125"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-serif tracking-[0.2em] text-[#D4A24C] gold-glow uppercase leading-tight">
              ST. ANN&apos;S
            </span>
            <span className="text-[10px] tracking-[0.4em] text-[#9CA3AF] uppercase font-bold">
              RCM CHURCH • SATTENAPALLE
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 hover:text-[#D4A24C] relative group ${
                pathname === link.href ? "text-[#D4A24C]" : "text-[#D1D5DB]"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-2 left-0 w-0 h-[1px] bg-[#D4A24C] transition-all duration-500 group-hover:w-full ${pathname === link.href ? "w-full" : ""}`} />
            </Link>
          ))}
          
          <button
            onClick={openTour}
            className="px-8 py-2.5 rounded-full border border-[#D4A24C]/30 glass text-[#D4A24C] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4A24C] hover:text-[#111111] hover:border-[#D4A24C] transition-all duration-500"
          >
            360° Sanctuary
          </button>

          <Link
            href="/admin"
            className="px-8 py-2.5 rounded-full border border-white/10 glass text-[#D1D5DB] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4A24C] hover:text-[#111111] hover:border-[#D4A24C] transition-all duration-500"
          >
            Admin Portal
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full glass py-6 flex flex-col items-center gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={() => {
                setIsOpen(false);
                openTour();
              }}
              className="px-6 py-2 rounded-full bg-[#D6B36A] text-[#0F141B] font-bold"
            >
              360° Sanctuary
            </button>

            <Link
              href="/admin"
              className="px-6 py-2 rounded-full border border-white/10 text-white font-bold"
              onClick={() => setIsOpen(false)}
            >
              Admin Portal
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
