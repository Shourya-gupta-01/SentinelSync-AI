"use client";

import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityTimelineProps {
  hazardLevel: string;
  isLoading?: boolean;
}

export default function ActivityTimeline({ hazardLevel, isLoading = false }: ActivityTimelineProps) {
  // Generate simulated data for the chart to make it look alive
  const data = useMemo(() => {
    const isHighAlert = hazardLevel.includes("5");
    const points = [];
    const now = new Date();
    
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60000); // Past 2 hours, 5 min intervals
      
      // Base random activity
      let incidents = Math.floor(Math.random() * 5) + 1;
      
      // Spike activity recently if there's a high alert
      if (isHighAlert && i < 5) {
        incidents += Math.floor(Math.random() * 15) + 10;
      }

      points.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        incidents: incidents,
      });
    }
    return points;
  }, [hazardLevel]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-card rounded-2xl p-6 w-full mt-6 transition-colors duration-300 hover:border-indigo-500/30"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-sans font-bold text-slate-300 tracking-widest uppercase flex items-center gap-2">
          <Activity size={16} className="text-indigo-400" /> Activity Timeline
        </h3>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-slate-400 font-sans">Total Incidents</span>
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full">
        {isLoading ? (
          <div className="h-full w-full bg-white/5 rounded-xl animate-pulse flex items-end justify-between px-4 pb-4">
             {Array.from({ length: 12 }).map((_, i) => (
               <div 
                 key={i} 
                 className="w-[6%] bg-white/10 rounded-t-sm" 
                 style={{ height: `${Math.random() * 60 + 20}%` }}
               />
             ))}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Area 
                type="monotone" 
                dataKey="incidents" 
                stroke="#a855f7" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorIncidents)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
