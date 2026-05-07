"use client";

import { useState } from "react";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";

const PhotoUploader = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Save to database
      const dbRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: data.filename,
          title: file.name.split(".")[0],
          description: "Uploaded via admin dashboard",
          category: "Community",
          file_path: data.url,
        }),
      });

      if (!dbRes.ok) throw new Error("Failed to save to database");

      setSuccess(true);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <input
          type="file"
          id="photo-upload"
          className="hidden"
          onChange={handleUpload}
          disabled={loading}
          accept="image/*"
        />
        <label
          htmlFor="photo-upload"
          className="flex flex-col items-center justify-center w-full h-64 glass border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:border-neon/50 hover:bg-neon/5 transition-all group"
        >
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-neon animate-spin" />
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Uploading to Sanctuary...</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-neon" />
              <p className="text-neon text-xs uppercase tracking-widest font-bold">Hallelujah! Uploaded.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-neon group-hover:scale-110 transition-all">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-white font-bold mb-1">Click to upload photo</p>
                <p className="text-gray-500 text-xs uppercase tracking-widest">PNG, JPG or WebP (Max 10MB)</p>
              </div>
            </div>
          )}
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
