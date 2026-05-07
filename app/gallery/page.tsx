"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Maximize2 } from "lucide-react";

const staticPhotos = [
  { id: 1, title: "Sunday Mass", category: "Services", url: "/pics/rosary.jpg" },
  { id: 2, title: "Easter Celebration", category: "Events", url: "/pics/pexels-mario-wallner-107470762-14388650.jpg" },
  { id: 3, title: "Church Exterior", category: "Community", url: "/pics/pexels-alexeydemidov-9949096.jpg" },
  { id: 4, title: "Choir Practice", category: "Services", url: "/pics/pexels-pavel-danilyuk-8817492.jpg" },
  { id: 5, title: "Youth Group", category: "Community", url: "/pics/Gemini_Generated_Image_hudzm5hudzm5hudz.png" },
];

const categories = ["All", "Services", "Events", "Community"];

export default function GalleryPage() {
  const [dynamicPhotos, setDynamicPhotos] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/photos")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDynamicPhotos(data);
      })
      .catch(err => console.error("Supabase fetch failed, showing local only"));
  }, []);

  const allPhotos = [
    ...staticPhotos,
    ...dynamicPhotos.map(p => ({ 
      id: p.id, 
      title: p.title || "Uploaded Photo", 
      category: p.category || "General", 
      url: p.file_path 
    }))
  ];

  const filteredPhotos = allPhotos.filter(p => 
    (selectedCategory === "All" || p.category === selectedCategory) &&
    (p.title?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter neon-glow">GALLERY</h1>
          <p className="text-gray-400 tracking-widest uppercase text-sm font-bold">Moments of Faith & Fellowship</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full border text-sm font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? "bg-neon text-black border-neon" 
                    : "border-white/10 text-gray-500 hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search moments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 outline-none focus:border-neon/50 transition-all text-sm"
            />
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group aspect-square rounded-3xl overflow-hidden glass cursor-pointer"
                onClick={() => setSelectedPhoto(p)}
              >
                <Image
                  src={p.url}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <p className="text-neon text-[10px] font-bold uppercase tracking-widest mb-1">{p.category}</p>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <Maximize2 className="absolute top-8 right-8 text-white/50 group-hover:text-neon transition-colors" size={20} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedPhoto(null)}
          >
            <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors z-[101]">
              <X size={40} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,243,255,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black via-black/50 to-transparent">
                <p className="text-neon font-bold uppercase tracking-widest text-xs mb-2">{selectedPhoto.category}</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">{selectedPhoto.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
