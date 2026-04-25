"use client";

import React, { useState, useEffect } from "react";
import TopNavbar from "@/components/TopNavbar";
import MapVisualization from "@/components/MapVisualization";

export default function MapPage() {
  const [isMeshActive, setIsMeshActive] = useState(false);
  const [hazardLevel, setHazardLevel] = useState("Level 5 - Active Fire Detected");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30 flex flex-col">
      <TopNavbar isMeshActive={isMeshActive} />
      
      <main className="flex-1 flex flex-col w-full relative">
        <div className="absolute inset-0">
          <MapVisualization hazardLevel={hazardLevel} />
        </div>
      </main>
    </div>
  );
}
