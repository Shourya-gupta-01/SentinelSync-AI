"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ToastProps {
  id: string;
  title: string;
  message: string;
}

export default function GlobalToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newToast: ToastProps = {
        id: Math.random().toString(36).substr(2, 9),
        title: customEvent.detail.title || "New Alert",
        message: customEvent.detail.message || "Something happened",
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener("show_toast", handleToast);
    return () => window.removeEventListener("show_toast", handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-20 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-slate-900 border border-slate-700 shadow-2xl shadow-black/50 rounded-xl w-80 backdrop-blur-xl"
          >
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="text-sm font-bold text-white mb-1">{toast.title}</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-white transition-colors p-1"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
