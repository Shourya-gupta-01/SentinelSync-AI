"use client";

import React, { useState, useEffect } from "react";
import { useAlerts, Alert } from "@/hooks/useAlerts";
import { Flame, Activity, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const severityConfig = {
  high: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/50",
    glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  },
  medium: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/50",
    glow: "shadow-[0_0_15px_rgba(234,179,8,0.3)]",
  },
  low: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/50",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  },
};

const typeConfig = {
  fire: { icon: Flame, label: "Fire Detected" },
  medical: { icon: Activity, label: "Medical Emergency" },
  intruder: { icon: ShieldAlert, label: "Security Breach" },
  safe: { icon: CheckCircle2, label: "Area Clear" },
};

interface ActiveAlertsProps {
  hazardLevel: string;
  isLoading?: boolean;
}

export default function ActiveAlerts({ hazardLevel, isLoading = false }: ActiveAlertsProps) {
  const alerts = useAlerts();
  const [prevAlertIds, setPrevAlertIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    // Check for new high severity alerts
    const newAlerts = alerts.filter(a => !prevAlertIds.has(a.id));
    const hasNewHighSeverity = newAlerts.some(a => a.severity === 'high');

    if (hasNewHighSeverity) {
      // Play alert sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
        oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (e) {
        console.error("Audio playback failed", e);
      }
    }

    // Update seen alerts
    if (newAlerts.length > 0) {
      setPrevAlertIds(new Set(alerts.map(a => a.id)));
    }
  }, [alerts, prevAlertIds]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col h-full glass-card rounded-2xl p-5 relative overflow-hidden">
        
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-xl" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="font-sans text-indigo-400 font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert size={20} className="text-indigo-400" /> Active Alerts
          </h3>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute inset-0 overflow-y-auto no-scrollbar pr-2 space-y-4 pb-4"
          >
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl glass-panel border border-white/5 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-1/3" />
                      <div className="h-3 bg-white/5 rounded w-full" />
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              alerts.map((alert) => {
              const Icon = typeConfig[alert.type].icon;
              const config = severityConfig[alert.severity];

              return (
                <motion.div
                  key={alert.id}
                  onClick={() => router.push(`/alerts/${alert.id}`)}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.02, y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className={`p-4 rounded-xl transition-all duration-300 relative overflow-hidden group cursor-pointer hover:brightness-125 hover:shadow-lg glass-panel ${config.bg} ${config.border}`}
                >
                  {/* Background glow for high severity */}
                  {alert.severity === "high" && (
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse-slow pointer-events-none" />
                  )}

                  <div className="relative z-10 flex items-start gap-4 pointer-events-none">
                    {/* Icon */}
                    <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 border border-white/10 glass ${config.glow}`}>
                      <Icon size={18} className={config.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-sans font-bold truncate ${config.color}`}>
                          {typeConfig[alert.type].label}
                        </h4>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${config.bg} ${config.color} border ${config.border}`}>
                          {alert.severity}
                        </span>
                      </div>
                      
                      <p className="text-xs text-white/90 font-medium mb-2 line-clamp-2 leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1.5 text-indigo-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          {alert.zone}
                        </span>
                        <span className="flex items-center gap-1 opacity-70">
                          <Clock size={10} />
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
            )}
            
            {!isLoading && alerts.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                <CheckCircle2 size={32} className="text-slate-600 mb-3 opacity-50" />
                <p className="text-sm">No active alerts at this time.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
