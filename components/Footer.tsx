import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#111111] border-t border-white/5 pt-32 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(212,162,76,0.02)_0%,_transparent_70%)]" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative w-12 h-12 transition-transform duration-700 group-hover:rotate-[360deg]">
                <img
                  src="/logo3.png"
                  alt="St. Ann's RCM Church Logo"
                  className="object-contain w-full h-full brightness-110 saturate-0 contrast-125 opacity-60"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif tracking-widest text-[#D4A24C] gold-glow uppercase">
                  ST. ANN&apos;S
                </span>
                <span className="text-[9px] tracking-[0.4em] text-[#9CA3AF] uppercase font-black">
                  RCM CHURCH
                </span>
              </div>
            </Link>
            <p className="text-[#9CA3AF] text-sm leading-relaxed font-light">
              Committed to spreading the Gospel, strengthening faith, serving the community, and guiding people toward a deeper relationship with Christ.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full glass flex items-center justify-center text-[#9CA3AF] hover:text-[#D4A24C] hover:border-[#D4A24C]/30 transition-all duration-500">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[#D4A24C] font-black mb-8 uppercase tracking-[0.4em] text-[10px]">Quick Links</h4>
            <ul className="space-y-4 text-xs text-[#9CA3AF] font-bold tracking-widest">
              <li><Link href="/" className="hover:text-[#FAF9F6] transition-colors">Home</Link></li>
              <li><Link href="/gallery" className="hover:text-[#FAF9F6] transition-colors">Gallery</Link></li>
              <li><Link href="/#services" className="hover:text-[#FAF9F6] transition-colors">Mass Timings</Link></li>
              <li><Link href="/#events" className="hover:text-[#FAF9F6] transition-colors">Events</Link></li>
              <li><Link href="/admin" className="hover:text-[#FAF9F6] transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#D4A24C] font-black mb-8 uppercase tracking-[0.4em] text-[10px]">Sacraments</h4>
            <ul className="space-y-4 text-xs text-[#9CA3AF] font-bold tracking-widest">
              <li><Link href="#" className="hover:text-[#FAF9F6] transition-colors">Holy Mass</Link></li>
              <li><Link href="#" className="hover:text-[#FAF9F6] transition-colors">Baptism</Link></li>
              <li><Link href="#" className="hover:text-[#FAF9F6] transition-colors">Holy Communion</Link></li>
              <li><Link href="#" className="hover:text-[#FAF9F6] transition-colors">Confirmation</Link></li>
              <li><Link href="#" className="hover:text-[#FAF9F6] transition-colors">Marriage</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#D4A24C] font-black mb-8 uppercase tracking-[0.4em] text-[10px]">Contact Us</h4>
            <ul className="space-y-6 text-xs text-[#9CA3AF] font-bold tracking-widest">
              <li className="flex gap-4">
                <MapPin size={16} className="text-[#D4A24C]/50 shrink-0" />
                <span className="leading-relaxed text-[#D1D5DB]">SH 21, Sattenapalle, <br />Andhra Pradesh 522403</span>
              </li>
              <li className="flex gap-4">
                <Phone size={16} className="text-[#D4A24C]/50 shrink-0" />
                <span className="text-[#D1D5DB]">08641-232260</span>
              </li>
              <li className="flex gap-4">
                <Mail size={16} className="text-[#D4A24C]/50 shrink-0" />
                <span className="text-[#D1D5DB]">stannsrcm@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} St. Ann&apos;s RCM Church • Sattenapalle
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-[#9CA3AF]">
            <a href="#" className="hover:text-[#FAF9F6] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#FAF9F6] transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
