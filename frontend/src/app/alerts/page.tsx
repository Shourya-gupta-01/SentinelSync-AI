"use client";

import React, { useState } from "react";
import TopNavbar from "@/components/TopNavbar";
import ActiveAlerts from "@/components/ActiveAlerts";
import ActivityTimeline from "@/components/ActivityTimeline";

export default function AlertsPage() {
  const [isMeshActive, setIsMeshActive] = useState(false);
  const [hazardLevel, setHazardLevel] = useState("Level 5 - Active Fire Detected");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/15 blur-[150px] rounded-full mix-blend-screen" />
      </div>
      <TopNavbar isMeshActive={isMeshActive} />
      
      <main className="relative z-10 flex-1 px-6 py-10 md:px-12 md:py-12 flex flex-col max-w-5xl mx-auto w-full">
        <header className="mb-10">
          <h2 className="text-4xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-sm">Alerts Log</h2>
          <p className="text-slate-400 max-w-2xl text-sm leading-relaxed font-medium mt-3">
            Detailed feed of all active alerts and system incident history.
          </p>
        </header>

        <div className="flex flex-col gap-6 flex-1 min-h-[500px]">
          {/* Timeline on top for alerts view */}
          <ActivityTimeline hazardLevel={hazardLevel} />
          
          {/* Alerts panel taking up remaining space */}
          <div className="flex-1 min-h-[400px]">
            <ActiveAlerts hazardLevel={hazardLevel} />
          </div>
        </div>
      </main>
    </div>
  );
}
