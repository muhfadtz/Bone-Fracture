"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface PredictionResult {
    label: string;
    score: number;
}

interface ResultCardProps {
    results: PredictionResult[];
}

export default function ResultCard({ results }: ResultCardProps) {
    const sortedResults = [...results].sort((a, b) => b.score - a.score);
    const topResult = sortedResults[0];
    const isFracture = topResult.label.toLowerCase() === "fracture";
    const confidence = (topResult.score * 100).toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-full glass rounded-3xl overflow-hidden"
        >
            <div className="grid md:grid-cols-2 gap-0">
                {/* Main Result Panel */}
                <div className={twMerge(
                    "p-8 flex flex-col items-center justify-center text-center relative overflow-hidden",
                    isFracture
                        ? "bg-gradient-to-br from-red-500/10 to-red-600/5"
                        : "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"
                )}>
                    <div className={twMerge(
                        "w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-white/50 dark:ring-white/10",
                        isFracture ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                    )}>
                        {isFracture ? (
                            <AlertTriangle className="w-10 h-10" />
                        ) : (
                            <CheckCircle2 className="w-10 h-10" />
                        )}
                    </div>

                    <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                        Hasil Analisis
                    </h2>
                    <div className={twMerge(
                        "text-4xl font-black tracking-tight mb-1",
                        isFracture ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                    )}>
                        {topResult.label}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                        Tingkat Keyakinan: {confidence}%
                    </p>
                </div>

                {/* Details Panel */}
                <div className="p-8 bg-white/40 dark:bg-black/20 backdrop-blur-sm flex flex-col justify-center">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
                        <span className="w-1 h-4 bg-blue-500 rounded-full mr-2" />
                        Detail Probabilitas
                    </h3>

                    <div className="space-y-6">
                        {sortedResults.map((result, index) => {
                            const percentage = (result.score * 100).toFixed(1);
                            const isPrimary = index === 0;
                            const colorClass = result.label.toLowerCase() === "fracture" ? "bg-red-500" : "bg-emerald-500";

                            return (
                                <div key={result.label} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className={clsx(
                                            "font-medium capitalize",
                                            isPrimary ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                                        )}>
                                            {result.label}
                                        </span>
                                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                                            {percentage}%
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, ease: "circOut", delay: 0.2 + (index * 0.1) }}
                                            className={clsx("h-full rounded-full shadow-sm", colorClass)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 text-[10px] text-center text-slate-400 uppercase tracking-wider">
                Model AI v1.0 • Hanya untuk tujuan edukasi
            </div>
        </motion.div>
    );
}
