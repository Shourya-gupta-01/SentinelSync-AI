"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TopNavbar from "@/components/TopNavbar";
import { useAlerts } from "@/hooks/useAlerts";
import { Flame, Activity, ShieldAlert, CheckCircle2, ArrowLeft } from "lucide-react";

const severityConfig = {
  high: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/50",
  },
  medium: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/50",
  },
  low: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/50",
  },
};

const typeConfig = {
  fire: { icon: Flame, label: "Fire Detected" },
  medical: { icon: Activity, label: "Medical Emergency" },
  intruder: { icon: ShieldAlert, label: "Security Breach" },
  safe: { icon: CheckCircle2, label: "Area Clear" },
};

export default function AlertDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const alerts = useAlerts();
  
  // Find the specific alert based on ID in params
  const alert = alerts.find(a => a.id === params.id);

  const getAIInstructions = (type: string) => {
    switch (type) {
      case "fire": return ["Use nearest exit", "Avoid elevators", "Stay low"];
      case "medical": return ["Secure area", "Check vitals", "Aide arrives in 2m"];
      case "intruder": return ["Lockdown initiated", "Stay out of sight", "Police notified"];
      default: return ["Monitor situation"];
    }
  };

  const getAssignedStaff = (type: string) => {
    switch (type) {
      case "fire": return "John (Security) - 20ft away";
      case "medical": return "Sarah (Paramedic) - En Route (1m)";
      case "intruder": return "Alpha Team (Response) - On Site";
      default: return "Auto-Monitor AI - Active";
    }
  };

  if (!alert) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading alert details...
      </div>
    );
  }

  const config = severityConfig[alert.severity];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30 flex flex-col">
      <TopNavbar isMeshActive={true} />
      
      <main className="flex-1 p-8 flex flex-col max-w-4xl mx-auto w-full">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Dashboard</span>
        </button>

        <header className="mb-8 flex items-center gap-4">
          <h2 className="text-4xl font-black tracking-tight text-white drop-shadow-sm flex items-center gap-3">
            🚨 ALERT DETAILS
          </h2>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Top Info Panel */}
          <div className={`p-6 rounded-2xl border backdrop-blur-md ${config.bg} ${config.border}`}>
            <div className="space-y-4 font-mono text-base">
              <div className="flex text-slate-200">
                <span className="text-slate-400 w-32 uppercase text-xs tracking-widest mt-1">Type</span> 
                <span className={`font-bold flex items-center gap-2 text-lg ${config.color}`}>
                  {React.createElement(typeConfig[alert.type].icon, { size: 24, className: alert.severity === 'high' ? 'animate-pulse' : '' })}
                  {typeConfig[alert.type].label.toUpperCase()} 
                </span>
              </div>
              <div className="flex text-slate-200">
                <span className="text-slate-400 w-32 uppercase text-xs tracking-widest mt-1">Location</span> 
                <span className="font-semibold text-white text-lg">{alert.zone}</span>
              </div>
              <div className="flex text-slate-200">
                <span className="text-slate-400 w-32 uppercase text-xs tracking-widest mt-1">Time</span> 
                <span className="text-lg">{new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex text-slate-200">
                <span className="text-slate-400 w-32 uppercase text-xs tracking-widest mt-1">Severity</span> 
                <span className={`font-bold uppercase text-lg ${config.color}`}>
                  {alert.severity}
                </span>
              </div>
            </div>
          </div>

          {/* AI Instructions Panel */}
          <div className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-md">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              📢 AI Instructions
            </h4>
            <ul className="space-y-3">
              {getAIInstructions(alert.type).map((instruction, idx) => (
                <li key={idx} className="flex items-start gap-3 text-base text-slate-300 font-medium">
                  <span className="text-indigo-400 mt-0.5 font-bold">-</span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          {/* Assigned Staff Panel */}
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md mb-8">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              👤 Assigned Staff
            </h4>
            <p className="text-base font-mono text-emerald-300 font-semibold tracking-wide">
              {getAssignedStaff(alert.type)}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
