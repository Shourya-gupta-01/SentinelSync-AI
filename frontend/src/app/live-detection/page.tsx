"use client";

import React, { useState, useRef, useCallback } from "react";
import TopNavbar from "@/components/TopNavbar";
import ClickSpark from "@/components/ClickSpark";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, AlertTriangle, Activity, ShieldAlert, CheckCircle2, ScanLine, X, ImageIcon, Loader2, ClipboardList, Flame } from "lucide-react";

type ThreatType = "fire" | "medical" | "intruder" | "safe" | null;
type Severity = "high" | "medium" | "low" | null;

interface DetectionResult {
  threatType: ThreatType;
  severity: Severity;
  confidence: number;
  guidanceSteps: string[];
}

export default function LiveDetection() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraActive(true);
      setImagePreview(null);
      setResult(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        stopCamera();
        analyzeImage(dataUrl);
      }
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        if (isCameraActive) stopCamera();
        analyzeImage(result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    setResult(null);
  };

  // Mock Backend Endpoint integration
  const analyzeImage = (dataUrl: string) => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate sending data to POST /detect-crisis
    setTimeout(() => {
      // FOR THE DEMO FLOW: Guarantee a FIRE detection when an image is uploaded
      const mockResult: DetectionResult = { 
        threatType: "fire", severity: "high", confidence: 0.94,
        guidanceSteps: [
          "Evacuate area immediately using designated fire exits.",
          "Do not use elevators.",
          "Activate nearest fire alarm pull station.",
          "Wait for emergency responders at the assembly point."
        ]
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);

      // Trigger the Global Toast notification
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show_toast', {
          detail: {
            title: "CRITICAL ALERT: FIRE DETECTED",
            message: "AI Vision Node has detected a severe thermal anomaly. Protocols initiated."
          }
        }));

        // Dynamically import addDemoAlert to avoid breaking SSR if needed
        import('@/hooks/useAlerts').then(({ addDemoAlert }) => {
          addDemoAlert({
            id: Math.random().toString(36).substr(2, 9),
            type: "fire",
            severity: "high",
            timestamp: new Date().toISOString(),
            description: "AI Vision Node: Confirmed thermal anomaly and smoke pattern detected.",
            zone: "Zone 4 (Hallway Camera B)",
            lat: 37.7760,
            lng: -122.4170
          });
        });
      }
    }, 2000);
  };

  const getResultUI = () => {
    if (!result) return null;

    let Icon = AlertTriangle;
    let label = "Unknown";
    let colorClass = "text-slate-400";
    let bgClass = "bg-slate-500/10";
    let borderClass = "border-slate-500/30";
    let glowClass = "shadow-[0_0_20px_rgba(148,163,184,0.2)]";

    if (result.threatType === "fire") {
      Icon = Flame;
      label = "Fire Detected";
      colorClass = "text-red-400";
      bgClass = "bg-red-500/10";
      borderClass = "border-red-500/50";
      glowClass = "shadow-[0_0_30px_rgba(239,68,68,0.3)]";
    } else if (result.threatType === "medical") {
      Icon = Activity;
      label = "Medical Emergency";
      colorClass = "text-amber-400";
      bgClass = "bg-amber-500/10";
      borderClass = "border-amber-500/50";
      glowClass = "shadow-[0_0_30px_rgba(245,158,11,0.3)]";
    } else if (result.threatType === "intruder") {
      Icon = ShieldAlert;
      label = "Security Breach";
      colorClass = "text-red-400";
      bgClass = "bg-red-500/10";
      borderClass = "border-red-500/50";
      glowClass = "shadow-[0_0_30px_rgba(239,68,68,0.3)]";
    } else if (result.threatType === "safe") {
      Icon = CheckCircle2;
      label = "Area Clear - Nominal";
      colorClass = "text-emerald-400";
      bgClass = "bg-emerald-500/10";
      borderClass = "border-emerald-500/50";
      glowClass = "shadow-[0_0_30px_rgba(16,185,129,0.3)]";
    }

    // Removed local Flame component to use lucide-react instead
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex flex-col gap-6"
      >
        <div className={`p-6 rounded-2xl glass-card border ${borderClass} ${bgClass} ${glowClass} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className={`p-4 rounded-full border glass ${borderClass} shadow-xl`}>
              <Icon size={40} className={colorClass} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className={`text-2xl font-black tracking-wide mb-1 ${colorClass}`}>{label}</h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                <span className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-full border ${bgClass} ${borderClass} ${colorClass}`}>
                  Severity: {result.severity}
                </span>
                <span className="px-3 py-1 text-xs font-mono font-bold text-slate-300 rounded-full bg-white/5 border border-white/10">
                  Endpoint: /detect-crisis
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
               <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle cx="48" cy="48" r="36" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                     <motion.circle 
                        cx="48" cy="48" r="36" fill="transparent" 
                        stroke="currentColor" strokeWidth="8" 
                        strokeDasharray="226.2" // 2 * PI * 36
                        initial={{ strokeDashoffset: 226.2 }}
                        animate={{ strokeDashoffset: 226.2 - (226.2 * result.confidence) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={colorClass}
                     />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                     <span className="text-xl font-black text-white">{Math.round(result.confidence * 100)}%</span>
                  </div>
               </div>
               <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-2">Confidence</span>
            </div>
          </div>
        </div>

        {/* Emergency Guidance Panel */}
        <div className="p-6 rounded-2xl glass-card border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
              <ClipboardList size={20} className="text-indigo-400" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white tracking-wide">Emergency Guidance</h4>
              <p className="text-xs text-indigo-300/70 font-mono tracking-wider uppercase">AI-Generated Protocol</p>
            </div>
          </div>

          <div className="space-y-4">
            {result.guidanceSteps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-indigo-300">{index + 1}</span>
                </div>
                <p className="text-sm font-medium text-slate-200 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <ClickSpark sparkColor='#a855f7' sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col relative overflow-hidden">
        
        {/* Background Ambient Glows */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/15 blur-[150px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/15 blur-[150px] rounded-full mix-blend-screen" />
        </div>

        <TopNavbar isMeshActive={false} />

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10 md:px-12 md:py-12 max-w-4xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-sm mb-4">
                Live AI Edge Detection
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto font-medium">
                Upload a frame or use your camera to test the vision model. Data is analyzed directly on the edge for real-time crisis triage.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-8 border border-white/5 relative overflow-hidden shadow-2xl">
              
              {/* Main Content Area: Image/Video */}
              <div 
                className={`w-full aspect-video rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-300 ${isDragging ? 'bg-indigo-500/20 border-indigo-400 border-dashed border-2 shadow-[0_0_30px_rgba(99,102,241,0.3)]' : 'neumorphic-inset'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />

                <AnimatePresence mode="wait">
                  {imagePreview ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      
                      {/* Scanning animation when analyzing */}
                      {isAnalyzing && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="w-full h-[2px] bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,1)] animate-scan-down relative top-0" />
                          <div className="absolute inset-0 bg-indigo-500/10" />
                        </div>
                      )}

                      {!isAnalyzing && !result && (
                         <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={clearImage} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors">
                              <X size={18} />
                            </button>
                         </div>
                      )}
                    </motion.div>
                  ) : isCameraActive ? (
                    <motion.div 
                      key="camera"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]" />
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                        <button onClick={capturePhoto} className="px-6 py-3 bg-white text-black font-bold rounded-xl shadow-xl hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2">
                          <ScanLine size={18} /> Capture & Analyze
                        </button>
                        <button onClick={stopCamera} className="px-4 py-3 bg-red-500/80 hover:bg-red-500 text-white font-bold rounded-xl shadow-xl backdrop-blur-md transition-all active:scale-95">
                          <X size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="placeholder"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center p-6 text-center pointer-events-none"
                    >
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 border shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-transform duration-500 ${isDragging ? 'bg-indigo-500/30 border-indigo-400 scale-125' : 'bg-indigo-500/10 border-indigo-500/20 group-hover:scale-110'}`}>
                        <ScanLine size={32} className={isDragging ? 'text-white' : 'text-indigo-400'} />
                      </div>
                      <p className="text-slate-300 font-medium text-lg mb-2">
                        {isDragging ? 'Drop Image Here' : 'No Feed Active'}
                      </p>
                      <p className="text-slate-500 text-sm max-w-sm mb-6">
                        {isDragging ? 'Release to instantly analyze the image for threats.' : 'Drag & drop an image, upload a file, or start your camera to begin the threat detection process.'}
                      </p>
                      
                      <div className="flex gap-4 pointer-events-auto">
                        <button onClick={triggerFileInput} className="px-5 py-2.5 glass border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                          <Upload size={18} /> Upload Image
                        </button>
                        <span className="text-slate-600 self-center font-mono text-xs">OR</span>
                        <button onClick={startCamera} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center gap-2">
                          <Camera size={18} /> Start Camera
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Status & Results */}
              <AnimatePresence mode="wait">
                {isAnalyzing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 flex flex-col items-center justify-center py-4"
                  >
                    <Loader2 size={32} className="text-indigo-400 animate-spin mb-4" />
                    <p className="text-indigo-300 font-mono tracking-widest uppercase text-sm animate-pulse">Running Neural Networks...</p>
                  </motion.div>
                )}
                
                {!isAnalyzing && result && getResultUI()}
              </AnimatePresence>

            </div>
          </motion.div>
        </main>
      </div>
    </ClickSpark>
  );
}
