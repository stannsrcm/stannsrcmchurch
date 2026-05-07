"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Calendar, 
  PlayCircle, 
  MessageSquare,
  LogOut, 
  Plus, 
  Trash2,
  ExternalLink,
  Loader2,
  Clock,
  User,
  Mail
} from "lucide-react";
import PhotoUploader from "@/components/PhotoUploader";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("photos");
  const [photos, setPhotos] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [photoRes, requestRes] = await Promise.all([
        fetch("/api/photos"),
        fetch("/api/prayer-requests/admin")
      ]);
      const photoData = await photoRes.json();
      const requestData = await requestRes.json();
      setPhotos(Array.isArray(photoData) ? photoData : []);
      setRequests(Array.isArray(requestData) ? requestData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, router]);

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      const res = await fetch(`/api/photos?id=${id}`, { method: "DELETE" });
      if (res.ok) setPhotos(photos.filter(p => p.id !== id));
    } catch (err) { alert("Failed to delete photo"); }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("Mark this request as handled and delete?")) return;
    try {
      const res = await fetch(`/api/prayer-requests/admin?id=${id}`, { method: "DELETE" });
      if (res.ok) setRequests(requests.filter(r => r.id !== id));
    } catch (err) { alert("Failed to delete request"); }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-neon animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "photos", label: "Gallery", icon: ImageIcon },
    { id: "requests", label: "Prayers", icon: MessageSquare },
    { id: "events", label: "Events", icon: Calendar },
    { id: "sermons", label: "Sermons", icon: PlayCircle },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-8">
            <div className="glass p-6 rounded-[2rem] border-white/5">
              <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-10 h-10 rounded-xl bg-neon flex items-center justify-center text-black">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Admin</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">{session?.user?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab.id 
                        ? "bg-neon text-black" 
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
                
                <div className="pt-8 mt-8 border-t border-white/5">
                  <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-12">
            <header className="flex justify-between items-end">
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tighter uppercase neon-glow">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h1>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
                  Church Management Portal
                </p>
              </div>
            </header>

            <AnimatePresence mode="wait">
              {activeTab === "photos" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                  <section className="space-y-6">
                    <h2 className="text-lg font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                      <Plus size={16} /> Add New Moment
                    </h2>
                    <PhotoUploader onUploadSuccess={fetchData} />
                  </section>
                  <section className="space-y-6">
                    <h2 className="text-lg font-bold text-white/50 uppercase tracking-widest">Recent Uploads</h2>
                    {loading ? (
                      <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-neon animate-spin" /></div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {photos.map((photo) => (
                          <div key={photo.id} className="glass rounded-2xl overflow-hidden group">
                            <div className="relative aspect-video">
                              <Image src={photo.file_path} alt={photo.title} fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button onClick={() => handleDeletePhoto(photo.id)} className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-all"><Trash2 size={18} /></button>
                                <a href={photo.file_path} target="_blank" className="w-10 h-10 rounded-full bg-neon text-black flex items-center justify-center hover:scale-110 transition-all"><ExternalLink size={18} /></a>
                              </div>
                            </div>
                            <div className="p-4">
                              <p className="text-white font-bold text-sm truncate">{photo.title}</p>
                              <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">{photo.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </motion.div>
              )}

              {activeTab === "requests" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-neon animate-spin" /></div>
                  ) : requests.length === 0 ? (
                    <div className="glass p-12 rounded-[2.5rem] border-white/5 text-center text-gray-500">No active prayer requests.</div>
                  ) : (
                    <div className="grid gap-6">
                      {requests.map((r) => (
                        <div key={r.id} className="glass p-8 rounded-3xl border-white/5 flex flex-col md:flex-row justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-4">
                              <div className="bg-neon/10 p-2 rounded-lg text-neon"><User size={16} /></div>
                              <p className="font-bold">{r.name}</p>
                              <div className="bg-white/5 p-2 rounded-lg text-gray-500 flex items-center gap-2 text-xs"><Mail size={12} /> {r.email}</div>
                            </div>
                            <p className="text-gray-300 leading-relaxed italic">&ldquo;{r.message}&rdquo;</p>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500">
                              <Clock size={12} /> {new Date(r.created_at).toLocaleString()}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteRequest(r.id)}
                            className="h-fit px-6 py-3 rounded-xl bg-white/5 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                          >
                            Dismiss
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "events" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-12 rounded-[2.5rem] border-white/5 text-center">
                  <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-400">Events Management</h3>
                  <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white/50 text-xs font-bold uppercase tracking-widest cursor-not-allowed">Coming Soon</button>
                </motion.div>
              )}

              {activeTab === "sermons" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-12 rounded-[2.5rem] border-white/5 text-center">
                  <PlayCircle className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-2 text-gray-400">Sermons Management</h3>
                  <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white/50 text-xs font-bold uppercase tracking-widest cursor-not-allowed">Coming Soon</button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
