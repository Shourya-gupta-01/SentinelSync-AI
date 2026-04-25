"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, AlertTriangle } from "lucide-react";

export default function QuickReportForm() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 500); // Reset animation state
      return;
    }
    
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setLocation("");
      setDescription("");
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="glass-card rounded-2xl p-6 w-full h-full transition-colors duration-300 hover:border-indigo-500/30 flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-sans font-bold text-slate-300 tracking-widest uppercase flex items-center gap-2">
          <AlertTriangle size={16} className="text-yellow-400" /> Quick Report
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl py-10"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
               <Send size={24} className="text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-bold tracking-wide">Report Transmitted</p>
            <p className="text-xs text-slate-400 mt-1">Mesh network received data.</p>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            animate={hasError ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            {/* Location Input with Floating Label */}
            <div className="relative">
              <input 
                type="text" 
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block w-full px-4 pt-5 pb-2 text-sm text-white bg-slate-900/50 rounded-xl border border-white/10 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 peer transition-all"
                placeholder=" "
              />
              <label 
                htmlFor="location" 
                className="absolute text-sm text-slate-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-indigo-400 cursor-text pointer-events-none"
              >
                Incident Location
              </label>
            </div>

            {/* Description Input with Floating Label */}
            <div className="relative">
              <textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="block w-full px-4 pt-5 pb-2 text-sm text-white bg-slate-900/50 rounded-xl border border-white/10 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 peer transition-all resize-none"
                placeholder=" "
              />
              <label 
                htmlFor="description" 
                className="absolute text-sm text-slate-400 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-indigo-400 cursor-text pointer-events-none"
              >
                Description & Details
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold tracking-widest uppercase text-xs transition-all flex items-center justify-center gap-2 ${
                hasError 
                  ? "bg-red-500/20 text-red-400 border border-red-500/50" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:from-indigo-500 hover:to-purple-500"
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={14} /> Submit Report
                </>
              )}
            </motion.button>
            
            {hasError && (
               <p className="text-red-400 text-xs text-center font-medium mt-2 animate-pulse">All fields are required</p>
            )}
          </motion.form>
        )}
      </div>
    </motion.div>
  );
}
