import Link from "next/link";
import { Cross, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Cross className="w-8 h-8 text-[#FF5533]" />
              <span className="text-xl font-black tracking-tighter text-[#FF5533]">
                ST. ANNS RCM
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Committed to spreading the Gospel, strengthening faith, serving the community, and guiding people toward a deeper relationship with Christ.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-[#FF5533] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-[#FF5533] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-[#FF5533] transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-neon transition-colors">Home</Link></li>
              <li><Link href="/gallery" className="hover:text-neon transition-colors">Gallery</Link></li>
              <li><Link href="/#services" className="hover:text-neon transition-colors">Mass Timings</Link></li>
              <li><Link href="/#events" className="hover:text-neon transition-colors">Events</Link></li>
              <li><Link href="/admin" className="hover:text-neon transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Services</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-neon transition-colors">Holy Mass</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">Baptism</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">Holy Communion</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">Confirmation</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">Marriage</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <MapPin size={18} className="text-neon shrink-0" />
                <span>SH 21, Nagarjuna Nagar, Sattenapalle, Andhra Pradesh 522403</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-neon shrink-0" />
                <span>08641-232260</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-neon shrink-0" />
                <span>info@stannschurch.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} St. Ann&apos;s RCM Church. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
