"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Activity, 
  MapPin, 
  AlertTriangle,
  Users,
  CheckCircle2,
  ServerCrash
} from "lucide-react";

export default function TacticalDashboard() {
  const [isMeshActive, setIsMeshActive] = useState(false);
  const [offlineNodes, setOfflineNodes] = useState(0);
  const [hazardLevel, setHazardLevel] = useState("Nominal");
  
  // Simulation Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setHazardLevel("Level 5 - Active Fire Detected");
      setIsMeshActive(true);
      
      const interval = setInterval(() => {
        setOfflineNodes(prev => (prev < 400 ? prev + 45 : 400));
      }, 500);
      
      return () => clearInterval(interval);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#050510] text-[#E0E0FF] font-sans selection:bg-purple-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen" />
        {hazardLevel.includes("5") && (
           <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-red-900/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        )}
      </div>

      {/* Top Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">SentinelSync <span className="opacity-70 font-normal">AI</span></h1>
            <p className="text-xs text-indigo-300/70 font-mono tracking-wider uppercase">Tactical Operations Bridge</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${isMeshActive ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
            {isMeshActive ? <WifiOff size={16} className="animate-pulse" /> : <Wifi size={16} />}
            <span className="text-sm font-semibold tracking-wide uppercase">
              {isMeshActive ? 'Cloud Disconnected: Mesh Active' : 'Cloud Link: Stable'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            <span className="text-sm font-medium opacity-70 cursor-default hover:opacity-100 transition-opacity">GDC Edge Node HQ</span>
          </div>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <main className="relative z-10 p-8">
        
        {/* Global Situation Summary */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Global Situation Map</h2>
            <p className="text-indigo-200/60 max-w-xl text-sm leading-relaxed">
              Monitoring 5,000+ active tracking points across hospitality zones constraint-free using WebGL optimizations and offline CRDT peering.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs text-indigo-300/50 uppercase tracking-widest font-semibold mb-1">State</span>
              <div className={`px-4 py-2 rounded-lg font-bold border shadow-lg ${hazardLevel.includes("5") ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-red-500/20' : 'bg-white/5 border-white/10 text-white shadow-black/50'}`}>
                {hazardLevel}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-indigo-300/50 uppercase tracking-widest font-semibold mb-1">Active P2P Nodes</span>
              <div className="px-4 py-2 rounded-lg font-bold bg-white/5 border border-white/10 text-indigo-300 shadow-lg font-mono">
                {offlineNodes} / 1000
              </div>
            </div>
          </div>
        </header>

        {/* 3 Col Grid */}
        <div className="grid grid-cols-12 gap-6 h-[600px]">
          
          {/* Central Map Visualization Window */}
          <div className="col-span-8 relative rounded-2xl border border-white/10 bg-black/40 shadow-2xl overflow-hidden group">
            {/* Mock WebGL Map Component */}
            <div className="absolute inset-0 bg-[#0a0a16]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent" />
            
            {/* Grid Lines Pattern */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            {/* Mock Clusters & Entities */}
            {hazardLevel.includes("5") && (
              <>
                <div className="absolute top-[40%] left-[50%] w-32 h-32 -mt-16 -ml-16 bg-red-500/20 mix-blend-screen rounded-full blur-[20px] animate-pulse" />
                <div className="absolute top-[40%] left-[50%] -mt-3 -ml-3 z-20">
                    <div className="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-[0_0_20px_rgba(220,38,38,1)] flex items-center justify-center">
                        <AlertTriangle size={12} className="text-white" />
                    </div>
                </div>
                
                {/* Simulated Evacuation Routes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                    <path d="M 50% 40% Q 60% 60% 80% 80%" stroke="#10b981" strokeWidth="3" strokeDasharray="6 6" fill="transparent" className="animate-[dash_1s_linear_infinite]" />
                    <path d="M 50% 40% Q 30% 60% 10% 70%" stroke="#10b981" strokeWidth="3" strokeDasharray="6 6" fill="transparent" className="animate-[dash_1s_linear_infinite]" />
                </svg>
              </>
            )}

            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20">
               <div className="px-4 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl">
                 <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
                    <Activity size={16} className="text-indigo-400" /> WebGL Render Pipeline
                 </h3>
                 <p className="text-xs text-indigo-200/50">Processing 5,000+ points at 60fps via Web Workers.</p>
               </div>

               <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                  Access 3D Tiles View
               </button>
            </div>
            
            <style jsx>{`
               @keyframes dash {
                 to { stroke-dashoffset: -12; }
               }
            `}</style>
          </div>

          {/* Right Sidebar - Autonomous Routing & Logs */}
          <div className="col-span-4 flex flex-col gap-6">
            
            {/* Action Card */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Users size={80} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 relative z-10">Vertex AI Agent dispatched</h3>
                <p className="text-sm text-indigo-200/60 mb-6 relative z-10">
                   AI Triage completed. Autonomous routing initialized based on staff certifications.
                </p>
                
                <div className="space-y-4 relative z-10">
                   <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="p-2 bg-emerald-500/20 rounded-lg shrink-0 mt-0.5">
                         <CheckCircle2 size={16} className="text-emerald-400" />
                      </div>
                      <div>
                         <p className="text-sm font-semibold text-white">John D. (CPR Certified)</p>
                         <p className="text-xs text-indigo-200/60 mt-1 flex items-center gap-1">
                            <MapPin size={12} /> Routed to Level 2 Medical Event
                         </p>
                      </div>
                   </div>
                </div>
            </div>

            {/* Mesh Telemetry Log */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex-1 flex flex-col relative overflow-hidden">
               <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-4 opacity-80 flex items-center gap-2">
                 <ServerCrash size={16} className="text-purple-400" /> System Event Log
               </h3>
               
               <div className="flex-1 overflow-auto space-y-3 font-mono text-xs text-indigo-300/70">
                 {isMeshActive ? (
                   <>
                     <div className="text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                       [CRITICAL] Cloud connection severed. Commencing Chaos Test scenario.
                     </div>
                     <div className="text-purple-400 bg-purple-400/10 p-2 rounded border border-purple-400/20">
                       [MESH] Nearby Connections initialized. 400 nodes switching to Wi-Fi Direct.
                     </div>
                     <div className="p-2 rounded border border-white/5">
                       [TELEMETRY] Injecting 50 hazards to Redpanda Queue...
                     </div>
                     <div className="p-2 rounded border border-white/5">
                       [CRDT] Gossiping evacuation route via Last-Writer-Wins resolution. T=420.
                     </div>
                   </>
                 ) : (
                   <div className="p-2 rounded border border-white/5">
                     [SYSTEM] Monitoring active... Normal operations.
                   </div>
                 )}
               </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
