"use client";

import React from "react";
import { Activity, Cpu, ShieldAlert, Wifi, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

interface SystemStatusProps {
  isMeshActive: boolean;
  offlineNodes: number;
  isLoading?: boolean;
}

export default function SystemStatus({ isMeshActive, offlineNodes, isLoading = false }: SystemStatusProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6 flex flex-col h-full relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />

      <h3 className="text-sm font-sans font-bold text-slate-300 tracking-widest uppercase flex items-center gap-2 mb-6">
        <Activity size={16} className="text-indigo-400" /> System Status
      </h3>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          // Skeleton Loading State
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="neumorphic-inset rounded-xl p-4 flex items-center gap-4 animate-pulse">
              <div className="p-3 bg-white/5 rounded-lg shrink-0 w-11 h-11" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/10 rounded w-1/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : (
          <>
            {/* AI Status */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
              transition={{ duration: 0.3 }}
              className="neumorphic-inset rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/5"
            >
              <div className="p-3 bg-emerald-500/20 rounded-lg shrink-0">
                <Cpu size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">AI Status</p>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <p className="text-white font-mono font-medium">Running</p>
                </div>
              </div>
            </motion.div>

            {/* Devices Connected */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="neumorphic-inset rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/5"
            >
              <div className="p-3 bg-indigo-500/20 rounded-lg shrink-0">
                <ShieldAlert size={20} className="text-indigo-400" />
              </div>
              <div className="w-full">
                <div className="flex justify-between items-end mb-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Devices Connected</p>
                  <p className="text-indigo-300 font-mono text-sm">{offlineNodes} <span className="text-slate-500 text-xs">/ 1000</span></p>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                   <div 
                     className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500" 
                     style={{ width: `${(offlineNodes / 1000) * 100}%` }}
                   />
                </div>
              </div>
            </motion.div>

            {/* Network Status */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`neumorphic-inset rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white/5 ${
              isMeshActive 
                ? 'border-red-500/20 shadow-[inset_0_2px_10px_rgba(239,68,68,0.1)]' 
                : 'border-emerald-500/20 shadow-[inset_0_2px_10px_rgba(16,185,129,0.1)]'
            }`}>
              <div className={`p-3 rounded-lg shrink-0 ${isMeshActive ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                {isMeshActive ? (
                  <WifiOff size={20} className="text-red-400" />
                ) : (
                  <Wifi size={20} className="text-emerald-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Network</p>
                <p className={`font-mono font-medium ${isMeshActive ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isMeshActive ? 'Offline Mode (Mesh Active)' : 'Cloud Connected'}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>

    </motion.div>
  );
}
