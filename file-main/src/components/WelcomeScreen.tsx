import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStartExploring: () => void;
}

export default function WelcomeScreen({ onStartExploring }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-[9998] flex flex-col p-6 overflow-hidden select-none bg-white font-['Inter',sans-serif]">
      {/* Decorative dotted grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 space-y-8">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-40 h-40 flex items-center justify-center"
        >
          <img src="/logo.svg" alt="Caffélino" className="w-full h-full object-contain" />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-center space-y-3"
        >
          <h1 className="text-3xl font-black text-black tracking-tight">
            Caffélino
          </h1>
          <p className="text-stone-500 font-medium leading-relaxed max-w-[260px] mx-auto text-sm">
            Find Your Perfect Café ☕
          </p>
        </motion.div>
      </div>

      {/* Simple Premium Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="z-10 mt-auto pb-4"
      >
        <button
          onClick={onStartExploring}
          className="w-full h-[56px] bg-black text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-lg active:scale-95 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-stone-900"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
