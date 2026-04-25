"use client";

import React from "react";
import { ShieldAlert, Wifi, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TopNavbarProps {
  isMeshActive?: boolean;
}

export default function TopNavbar({ isMeshActive = false }: TopNavbarProps) {
  const pathname = usePathname();

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-10 md:py-5 border-b border-white/5 bg-slate-950/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 rounded-full" />
            <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] ring-1 ring-white/10">
              <ShieldAlert size={24} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-sans font-black tracking-tight text-white drop-shadow-md">
              SentinelSync <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">AI</span>
            </h1>
            <p className="text-[11px] text-indigo-300/70 font-mono tracking-widest uppercase mt-0.5">Tactical Operations Bridge</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10 shadow-inner">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-sans font-bold transition-all duration-300 ${pathname === "/" ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "text-slate-400 hover:text-white hover:bg-white/5 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"}`}
            >
              Dashboard
            </motion.div>
          </Link>
          <Link href="/live-detection">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-sans font-bold transition-all duration-300 ${pathname === "/live-detection" ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "text-slate-400 hover:text-white hover:bg-white/5 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"}`}
            >
              Detection
            </motion.div>
          </Link>
          <Link href="/map">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-sans font-bold transition-all duration-300 ${pathname === "/map" ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "text-slate-400 hover:text-white hover:bg-white/5 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"}`}
            >
              Map
            </motion.div>
          </Link>
          <Link href="/alerts">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-full text-sm font-sans font-bold transition-all duration-300 ${pathname === "/alerts" ? "bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "text-slate-400 hover:text-white hover:bg-white/5 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"}`}
            >
              Alerts
            </motion.div>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <motion.div 
          layout
          className={`flex items-center gap-3 px-5 py-2 rounded-full border backdrop-blur-md transition-colors duration-500 ${
            isMeshActive 
              ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
          }`}
        >
          {isMeshActive ? (
            <WifiOff size={18} className="animate-pulse" />
          ) : (
            <Wifi size={18} />
          )}
          <span className="text-xs font-bold tracking-widest uppercase">
            {isMeshActive ? 'Cloud Lost: Mesh Active' : 'Cloud Link: Stable'}
          </span>
        </motion.div>
        
        <div className="flex items-center gap-3 px-4 py-2 rounded-full glass border-white/5">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full bg-emerald-400 animate-pulse-slow blur-sm opacity-60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          </div>
          <span className="text-xs font-mono tracking-widest text-slate-300 cursor-default hover:text-white transition-colors">GDC Edge Node HQ</span>
        </div>
      </div>
    </motion.nav>
  );
}
