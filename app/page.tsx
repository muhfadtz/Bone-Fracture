"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import ResultCard from "@/components/ResultCard";
import { classifyImage, PredictionResult } from "@/lib/api";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await classifyImage(selectedImage);
      const results = Array.isArray(data) ? data : [data];
      setResult(results);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memproses gambar. Periksa koneksi atau konfigurasi API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col pb-12">
      <Header />

      {/* Main Container with 70% Max Width on Desktop */}
      <div className="flex-1 w-full lg:w-[70%] lg:max-w-[70%] mx-auto px-4 sm:px-6 flex flex-col items-center space-y-10">

        {/* Upload Section */}
        <div className="w-full">
          <ImageUploader
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            disabled={loading}
          />
        </div>

        {/* Action Button Area */}
        <AnimatePresence>
          {selectedImage && !result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="z-10"
            >
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />

                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Sedang Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Mulai Analisis AI</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="w-full glass border-l-4 border-red-500 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl flex items-center space-x-3 shadow-red-500/10"
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0 text-red-500" />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <div className="w-full">
              <ResultCard results={result} />
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer */}
      <footer className="mt-auto pt-12 pb-6 text-center">
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} Bone Fracture Classification Demo
        </p>
      </footer>
    </main>
  );
}
