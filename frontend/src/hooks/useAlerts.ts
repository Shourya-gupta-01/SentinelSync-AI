import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Alert {
  id: string;
  type: "fire" | "medical" | "intruder" | "safe";
  severity: "high" | "medium" | "low";
  timestamp: string;
  description: string;
  zone: string;
  lat?: number;
  lng?: number;
}

// Global state for demo purposes across routes
let globalDummyAlerts: Alert[] = [
  {
    id: "1",
    type: "fire",
    severity: "high",
    timestamp: new Date().toISOString(),
    description: "Thermal anomaly detected in sector 7G",
    zone: "Sector 7G (Server Room)",
    lat: 37.7755,
    lng: -122.4180
  },
  {
    id: "2",
    type: "intruder",
    severity: "medium",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    description: "Unauthorized access attempt at Gate B",
    zone: "Gate B (East Wing)",
    lat: 37.7745,
    lng: -122.4200
  },
  {
    id: "3",
    type: "safe",
    severity: "low",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    description: "Routine perimeter sweep completed. All clear.",
    zone: "Zone 1 (Lobby)",
    lat: 37.7749,
    lng: -122.4194
  }
];

// Allows adding alerts from any page to update the global demo state
export const addDemoAlert = (alert: Alert) => {
  globalDummyAlerts = [alert, ...globalDummyAlerts];
  // Dispatch custom event to force re-render in useAlerts hook
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('demo_alerts_updated'));
  }
};

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Check if Firebase is actually configured. If not, use global dummy data.
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.log("Firebase API Key not found. Using fallback dummy data.");
      
      const updateAlerts = () => setAlerts([...globalDummyAlerts]);
      updateAlerts(); // initial load
      
      // Listen for new demo alerts being added
      window.addEventListener('demo_alerts_updated', updateAlerts);
      return () => window.removeEventListener('demo_alerts_updated', updateAlerts);
    }

    // We order by timestamp descending, limit to latest 20 alerts
    const q = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(20));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // If the collection exists but is empty, let's also show dummy data just for demo purposes
        setAlerts([...globalDummyAlerts]);
        return;
      }
      
      const newAlerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Alert[];
      
      setAlerts(newAlerts);
    }, (error) => {
      console.error("Error fetching alerts: ", error);
      // Fallback data if Firebase fails
      setAlerts([...globalDummyAlerts]);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  return alerts;
}
