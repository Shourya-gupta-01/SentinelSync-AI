"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlerts, Alert } from "@/hooks/useAlerts";
import { Flame, Activity, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function MobileEmergencyOverlay() {
  const alerts = useAlerts();
  // Filter only high severity alerts that need immediate attention
  const highPriorityAlerts = alerts.filter(a => a.severity === 'high');
  const [activeAlert, setActiveAlert] = useState<Alert | null>(highPriorityAlerts[0] || null);

  useEffect(() => {
    // If a new high priority alert comes in, show it immediately
    if (highPriorityAlerts.length > 0) {
      setActiveAlert(highPriorityAlerts[0]);
    } else {
      setActiveAlert(null);
    }
  }, [alerts]);

  const handleAction = () => {
    // In a real app, this would trigger an API call to acknowledge or trigger the evacuation protocol
    setActiveAlert(null); // Temporarily dismiss locally
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "fire": return Flame;
      case "medical": return Activity;
      case "intruder": return ShieldAlert;
      default: return CheckCircle2;
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case "fire": return "EVACUATE NOW";
      case "medical": return "AIDE EN ROUTE";
      case "intruder": return "LOCKDOWN SECURED";
      default: return "ACKNOWLEDGE";
    }
  };

  return (
    <AnimatePresence>
      {activeAlert && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-600 p-6 text-white text-center"
        >
          {/* Animated background strobe effect for emergency */}
          <div className="absolute inset-0 bg-black/20 animate-pulse pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
            <h2 className="text-2xl font-black tracking-widest text-white/80 mb-8 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-white animate-ping" />
              ALERT
              <span className="w-3 h-3 rounded-full bg-white animate-ping" />
            </h2>
            
            {/* Dynamic Icon */}
            {(() => {
              const Icon = getAlertIcon(activeAlert.type);
              return <Icon size={80} className="mb-6 drop-shadow-2xl" />;
            })()}

            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none">
              {activeAlert.type === 'fire' ? 'FIRE DETECTED' : 
               activeAlert.type === 'medical' ? 'MEDICAL EMERGENCY' : 
               activeAlert.type === 'intruder' ? 'SECURITY BREACH' : 'THREAT DETECTED'}
            </h1>

            <p className="text-2xl font-bold bg-black/30 px-6 py-2 rounded-xl mb-12">
              {activeAlert.zone}
            </p>

            <button 
              onClick={handleAction}
              className="w-full py-6 bg-white text-red-600 rounded-2xl text-3xl font-black uppercase tracking-tight shadow-[0_10px_40px_rgba(0,0,0,0.5)] active:scale-95 transition-transform"
            >
              [ {getActionText(activeAlert.type)} ]
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
