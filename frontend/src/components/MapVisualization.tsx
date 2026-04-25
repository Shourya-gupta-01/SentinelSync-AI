"use client";

import React, { useMemo } from "react";
import { Activity, AlertTriangle, Flame, ShieldAlert, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useAlerts } from "@/hooks/useAlerts";

interface MapVisualizationProps {
  hazardLevel: string;
}

export default function MapVisualization({ hazardLevel }: MapVisualizationProps) {
  const alerts = useAlerts();
  
  // Center map on default location or latest alert
  const center = useMemo(() => {
    const alertsWithLocation = alerts.filter(a => a.lat && a.lng);
    if (alertsWithLocation.length > 0) {
      return { lat: alertsWithLocation[0].lat!, lng: alertsWithLocation[0].lng! };
    }
    return { lat: 37.7749, lng: -122.4194 }; // Default San Francisco
  }, [alerts]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "DEMO_MAP_ID";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full relative glass-panel overflow-hidden group"
    >
      <div className="absolute inset-0 bg-[#020205]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent z-10 pointer-events-none" />
      
      {/* Google Map */}
      <div className="absolute inset-0 overflow-hidden">
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={center}
              defaultZoom={15}
              mapId={mapId}
              disableDefaultUI={true}
            >
              {alerts.map((alert) => {
                if (!alert.lat || !alert.lng) return null;
                const isHighSeverity = alert.severity === "high";
                return (
                  <AdvancedMarker
                    key={alert.id}
                    position={{ lat: alert.lat, lng: alert.lng }}
                  >
                    <div className={`relative ${isHighSeverity ? "animate-bounce" : ""}`}>
                      {isHighSeverity && (
                        <div className="absolute inset-0 w-16 h-16 -top-4 -left-4 bg-red-500/20 mix-blend-screen rounded-full blur-[10px] animate-pulse-slow pointer-events-none" />
                      )}
                      <div className={`w-8 h-8 rounded-full border-[3px] shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center relative ${
                        alert.severity === "high" ? "bg-red-600 border-white" : 
                        alert.severity === "medium" ? "bg-amber-500 border-white" : 
                        "bg-emerald-500 border-white"
                      }`}>
                        {alert.type === "fire" ? <Flame size={14} className="text-white" /> : 
                         alert.type === "intruder" ? <ShieldAlert size={14} className="text-white" /> :
                         <AlertTriangle size={14} className="text-white" />}
                        {isHighSeverity && (
                          <div className="absolute border border-red-500 rounded-full animate-[ping_2s_infinite] inset-0" />
                        )}
                      </div>
                      
                      <div className={`absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 border text-[10px] font-mono px-2 py-1 rounded shadow-xl backdrop-blur-sm ${
                        alert.severity === "high" ? "border-red-500/50 text-red-100" :
                        "border-white/10 text-slate-200"
                      }`}>
                        {alert.zone}: {alert.type.toUpperCase()}
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}
            </Map>
          </APIProvider>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050510] text-slate-400 z-20 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            {/* Radar Sweep */}
            <div className="absolute w-[800px] h-[800px] border border-indigo-500/20 rounded-full flex items-center justify-center">
              <div className="absolute w-[600px] h-[600px] border border-indigo-500/30 rounded-full" />
              <div className="absolute w-[400px] h-[400px] border border-indigo-500/40 rounded-full" />
              <div className="absolute w-[200px] h-[200px] border border-indigo-500/50 rounded-full" />
              
              {/* Radar scanner */}
              <div className="absolute w-1/2 h-1/2 top-0 right-1/2 origin-bottom-right bg-[conic-gradient(from_0deg,transparent_0deg,rgba(99,102,241,0.5)_90deg)] animate-[spin_4s_linear_infinite]" />
            </div>

            {/* Simulated Data Points */}
            <div className="absolute top-[30%] left-[40%] animate-bounce">
              <div className="w-8 h-8 rounded-full bg-red-600 border-[3px] border-white shadow-[0_0_15px_rgba(239,68,68,0.8)] flex items-center justify-center relative">
                <Flame size={14} className="text-white" />
                <div className="absolute border border-red-500 rounded-full animate-[ping_2s_infinite] inset-0" />
              </div>
            </div>

            <div className="absolute top-[60%] left-[70%]">
              <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
                 <CheckCircle2 size={12} className="text-white" />
              </div>
            </div>

            <div className="absolute top-[45%] left-[20%]">
              <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center">
                 <Activity size={12} className="text-white" />
              </div>
            </div>

            {/* Error Message Panel Overlay */}
            <div className="relative z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <AlertTriangle size={32} className="mb-2 text-indigo-400" />
              <p className="text-sm font-mono text-indigo-200 font-bold tracking-wider">Simulated Radar Mode</p>
              <p className="text-xs mt-2 text-slate-400 max-w-[250px] text-center">
                Live Google Maps disabled. Please set <span className="text-emerald-400 font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> in your environment to enable geospatial tracking.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Left Title Overlay */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-6 py-3 glass border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
            <span>🗺️</span> Emergency Map
          </h2>
        </motion.div>
      </div>

      {/* Overlay UI elements */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20 pointer-events-none">
        {/* Legend */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-6 py-4 glass border border-white/10 rounded-2xl pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Legend</h3>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full bg-red-500 animate-[ping_2s_infinite]" />
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] relative" />
              </div>
              <span className="text-sm font-bold text-slate-200">High Risk (Blinking)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <span className="text-sm font-bold text-slate-200">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-sm font-bold text-slate-200">Low</span>
            </div>
          </div>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-4 bg-white text-slate-900 hover:bg-slate-200 font-black tracking-wide text-sm rounded-2xl transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2 group pointer-events-auto"
        >
          [ 3D / Map View ]
          <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:bg-purple-500 transition-colors" />
        </motion.button>
      </div>
    </motion.div>
  );
}
