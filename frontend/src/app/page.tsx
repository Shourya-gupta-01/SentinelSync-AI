"use client";

import React, { useState, useEffect } from "react";
import ClickSpark from "@/components/ClickSpark";
import TopNavbar from "@/components/TopNavbar";
import ActiveAlerts from "@/components/ActiveAlerts";
import SystemStatus from "@/components/SystemStatus";
import ActivityTimeline from "@/components/ActivityTimeline";
import QuickReportForm from "@/components/QuickReportForm";
import { motion, AnimatePresence } from "framer-motion";

export default function TacticalDashboard() {
  const [isMeshActive, setIsMeshActive] = useState(false);
  const [offlineNodes, setOfflineNodes] = useState(0);
  const [hazardLevel, setHazardLevel] = useState("Nominal");
  const [isBooting, setIsBooting] = useState(true);
  
  // Simulation Effect
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 2000);

    const timer = setTimeout(() => {
      setHazardLevel("Level 5 - Active Fire Detected");
      setIsMeshActive(true);
      
      const interval = setInterval(() => {
        setOfflineNodes(prev => (prev < 400 ? prev + 45 : 400));
      }, 500);
      
      return () => clearInterval(interval);
    }, 5000);
    return () => {
      clearTimeout(bootTimer);
      clearTimeout(timer);
    };
  }, []);

  return (
    <ClickSpark
      sparkColor='#a855f7'
      sparkSize={12}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
    >
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col relative overflow-hidden">
      
        {/* Background Ambience */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/15 blur-[150px] rounded-full mix-blend-screen" />
          {hazardLevel.includes("5") && (
             <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-red-600/15 blur-[180px] rounded-full mix-blend-screen animate-pulse-slow" />
          )}
        </div>

        {/* Top Navbar Component */}
        <TopNavbar isMeshActive={isMeshActive} />
        
        {/* Main Content Dashboard */}
        <main className="relative z-10 px-6 pt-32 pb-12 md:px-12 flex-1 flex flex-col max-w-7xl mx-auto w-full">
          
          {/* Global Situation Summary */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Active Defense Network
              </div>
              <h1 className="text-5xl font-sans font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 drop-shadow-sm">
                SentinelSync Tactical Bridge
              </h1>
              <div className="space-y-2">
                <p className="text-slate-200 max-w-3xl text-base leading-relaxed font-medium">
                  An offline-first, Edge AI crisis management system designed to protect lives when traditional networks fail. 
                </p>
                <p className="text-slate-400 max-w-3xl text-sm leading-relaxed">
                  SentinelSync provides real-time vision detection for thermal anomalies and physical threats, instantly synchronizing mission-critical telemetry and evacuation guidance across devices via resilient P2P mesh networking.
                </p>
              </div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 mt-8"
              >
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99,102,241,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold text-sm tracking-widest uppercase shadow-[0_4px_20px_rgba(79,70,229,0.4)] relative overflow-hidden group"
                >
                  <span className="relative z-10">Deploy Countermeasures</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05, bg: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 glass-panel border-white/10 text-white rounded-full font-bold text-sm tracking-widest uppercase hover:border-white/20 transition-all"
                >
                  View Live Feed
                </motion.button>
              </motion.div>
            </div>
            
            <div className="flex gap-5">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-1.5 font-sans">State</span>
                <motion.div 
                  layout
                  className={`px-6 py-3 rounded-2xl font-sans font-bold transition-colors duration-500 glass-card ${
                    hazardLevel.includes("5") 
                      ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                      : 'border-white/10 text-white'
                  }`}
                >
                  <motion.span layout="position">{hazardLevel}</motion.span>
                </motion.div>
              </div>
            </div>
          </motion.header>

          {/* Top 2 Col Grid */}
          <div className="grid md:grid-cols-2 gap-6 min-h-[400px]">
            {/* Left Sidebar - Active Alerts */}
            <div className="h-full">
              <ActiveAlerts hazardLevel={hazardLevel} isLoading={isBooting} />
            </div>

            {/* Right Sidebar - System Status */}
            <div className="h-full">
              <SystemStatus isMeshActive={isMeshActive} offlineNodes={offlineNodes} isLoading={isBooting} />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <ActivityTimeline hazardLevel={hazardLevel} isLoading={isBooting} />
            </div>
            <div className="lg:col-span-1">
              <QuickReportForm />
            </div>
          </div>
          
        </main>
      </div>
    </ClickSpark>
  );
}
