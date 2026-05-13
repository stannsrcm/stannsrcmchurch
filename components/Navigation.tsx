"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
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
    { name: "Events", href: "/#events" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform duration-500 group-hover:scale-110">
            <Image
              src="/logo3.png"
              alt="St. Ann's RCM Church Logo"
              fill
              className="object-contain filter drop-shadow-[0_0_8px_rgba(255,85,51,0.5)]"
              priority
            />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-[#FF5533]">
            ST. ANN&apos;S RCM CHURCH
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-[#FF5533] ${
                pathname === link.href ? "text-[#FF5533]" : "text-gray-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/admin"
            className="px-6 py-2 rounded-full border-2 border-[#FF5533]/50 text-[#FF5533] text-xs font-black uppercase tracking-widest hover:bg-[#FF5533] hover:text-black transition-all shadow-[0_0_20px_rgba(255,85,51,0.1)]"
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
            <Link
              href="/admin"
              className="px-6 py-2 rounded-full bg-neon text-black font-bold"
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
