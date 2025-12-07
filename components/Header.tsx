import { Activity } from "lucide-react";

export default function Header() {
    return (
        <header className="sticky top-4 z-50 w-full px-4 mb-8">
            <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                            Bone Fracture Classifier
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            AI-Powered Diagnostic Assistant
                        </p>
                    </div>
                </div>

                <div className="hidden sm:block text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Research Preview
                </div>
            </div>
        </header>
    );
}
