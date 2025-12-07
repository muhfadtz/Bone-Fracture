"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface ImageUploaderProps {
    onImageSelect: (file: File | null) => void;
    selectedImage: File | null;
    disabled?: boolean;
}

export default function ImageUploader({
    onImageSelect,
    selectedImage,
    disabled = false,
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelect = useCallback((file: File) => {
        onImageSelect(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    }, [onImageSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (disabled) return;

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith("image/")) {
                    handleFileSelect(file);
                }
            }
        },
        [disabled, handleFileSelect]
    );

    const clearImage = () => {
        onImageSelect(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!selectedImage ? (
                    <motion.div
                        key="upload-zone"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                        className={twMerge(
                            "glass relative rounded-3xl p-10 transition-all duration-300 ease-out flex flex-col items-center justify-center text-center cursor-pointer min-h-[400px] border-2 border-dashed",
                            isDragging
                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-blue-500/20 shadow-2xl"
                                : "border-slate-300/50 hover:border-blue-400 dark:border-slate-700/50 dark:hover:border-blue-500",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => !disabled && document.getElementById("file-upload")?.click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                            }}
                            disabled={disabled}
                        />

                        <div className="relative mb-6 group">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                            <div className="relative w-24 h-24 bg-gradient-to-tr from-blue-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center shadow-xl border border-white/50 dark:border-white/10">
                                <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                            Unggah Gambar X-ray
                        </h3>
                        <p className="text-base text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
                            Drag & drop file gambar di sini, atau klik area ini untuk memilih dari perangkat.
                        </p>

                        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full">
                            <ImageIcon className="w-3 h-3" />
                            <span>JPG, PNG (Max 10MB)</span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview-zone"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
                    >
                        <div className="relative aspect-[16/10] w-full bg-slate-950 flex items-center justify-center">
                            {previewUrl && (
                                <>
                                    <Image
                                        src={previewUrl}
                                        alt="X-ray preview"
                                        fill
                                        className="object-contain"
                                    />
                                    {/* Scanning Effect Overlay */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        <motion.div
                                            initial={{ top: "0%" }}
                                            animate={{ top: "100%" }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 2,
                                                ease: "linear",
                                                repeatType: "loop"
                                            }}
                                            className="absolute left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {!disabled && (
                            <div className="absolute top-4 right-4 flex space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearImage();
                                    }}
                                    className="p-2.5 bg-black/40 hover:bg-red-500/80 text-white rounded-full transition-all backdrop-blur-md border border-white/10 hover:scale-105"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
