"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function PageLoader({ loading }: { loading: boolean }) {
  const [show, setShow] = useState(loading);

  useEffect(() => {
    if (!loading) {
      // Small delay so the exit animation plays
      const t = setTimeout(() => setShow(false), 600);
      return () => clearTimeout(t);
    } else {
      setShow(true);
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0F172A]"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-mint/8 rounded-full blur-[120px]" />
          </div>

          {/* Logo + spinner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col items-center gap-6"
          >
            {/* Logo mark */}
            <div className="relative">
              <div className="h-16 w-16 bg-mint rounded-2xl flex items-center justify-center text-deep-forest font-bold text-3xl shadow-lg shadow-mint/20 font-display">
                S
              </div>
              {/* Orbiting dot */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-12px]"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-mint rounded-full shadow-lg shadow-mint/40" />
              </motion.div>
            </div>

            {/* Brand text */}
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-white tracking-tight font-display">
                SHS<span className="text-white/40">prep</span>
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-mint to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
