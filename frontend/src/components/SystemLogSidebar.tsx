"use client";

import React from "react";
import { Users, CheckCircle2, MapPin, ServerCrash } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface SystemLogSidebarProps {
  isMeshActive: boolean;
}

const listVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariant: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function SystemLogSidebar({ isMeshActive }: SystemLogSidebarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="col-span-3 flex flex-col gap-6"
    >
      {/* Action Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="glass-panel rounded-2xl p-6 flex flex-col relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full" />
        
        <div className="absolute top-4 right-4 opacity-10 text-indigo-200">
           <Users size={80} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <h3 className="text-lg font-bold text-white tracking-wide">Vertex AI Router</h3>
          </div>
          
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
             AI Triage completed. Autonomous routing initialized based on staff certifications and proximal hazard data.
          </p>
          
          <div className="space-y-4">
             <motion.div 
               whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
               className="flex items-start gap-4 p-4 rounded-xl glass border-white/5 cursor-pointer transition-all duration-300 group"
             >
                <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0 mt-0.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:bg-emerald-500/30 transition-colors">
                   <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                <div>
                   <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">John D. (CPR Certified)</p>
                   <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5 font-mono">
                      <MapPin size={12} className="text-indigo-400" /> Routed to L2 Med Event
                   </p>
                </div>
             </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mesh Telemetry Log */}
      <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col relative overflow-hidden">
         <div className="flex items-center justify-between mb-6">
           <h3 className="text-sm font-bold text-slate-200 tracking-widest uppercase flex items-center gap-2">
             <ServerCrash size={16} className="text-purple-400" /> Event Telemetry
           </h3>
           <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
         </div>
         
         <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 overflow-y-auto no-scrollbar pointer-events-auto origin-top h-full pr-2">
              <AnimatePresence mode="wait">
                 {isMeshActive ? (
                   <motion.div 
                     key="mesh-logs"
                     variants={listVariant}
                     initial="hidden"
                     animate="visible"
                     className="space-y-3 font-mono text-[11px] leading-relaxed"
                   >
                     <motion.div variants={itemVariant} className="text-red-300 bg-red-950/40 p-3 rounded-xl border border-red-500/20 shadow-inner">
                       <span className="font-bold text-red-400 mr-2">[CRITICAL]</span> Cloud connection severed. Initiating Chaos protocol.
                     </motion.div>
                     <motion.div variants={itemVariant} className="text-purple-300 bg-purple-950/40 p-3 rounded-xl border border-purple-500/20 shadow-inner">
                       <span className="font-bold text-purple-400 mr-2">[MESH]</span> Nearby Connections initialized. 400 nodes switching to Wi-Fi Direct.
                     </motion.div>
                     <motion.div variants={itemVariant} className="text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                       <span className="font-bold text-slate-400 mr-2">[TELEMETRY]</span> Injecting 50 hazards to Redpanda Queue...
                     </motion.div>
                     <motion.div variants={itemVariant} className="text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
                       <span className="font-bold text-slate-400 mr-2">[CRDT]</span> Gossiping evacuation route (Last-Writer-Wins). T=420.
                     </motion.div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="normal-logs"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="font-mono text-[11px] text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5"
                   >
                     <span className="font-bold text-emerald-400 mr-2">[SYSTEM]</span> Monitoring active... Core operations nominal.
                   </motion.div>
                 )}
              </AnimatePresence>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
