"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { Clock, Plus, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function SessionsPage() {
  const setActiveModal = useAppStore(state => state.setActiveModal);
  
  // Mock Data
  const totalHours = 2.5;
  const targetHours = 4;
  const sessions = [
    { id: 1, category: "React", topic: "useCallback deep dive", platform: "YouTube", duration: 90, quality: 4, startTime: "09:00", endTime: "10:30" },
    { id: 2, category: "DSA", topic: "Binary Search Trees", platform: "Practice", duration: 60, quality: 5, startTime: "14:00", endTime: "15:00" }
  ];

  const categories = [
    { name: "React", hours: 1.5, color: "bg-blue-500" },
    { name: "DSA", hours: 1.0, color: "bg-purple-500" },
  ];

  return (
    <PageWrapper className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Sessions</h1>
          <p className="text-slate-500">Log and review your deep work.</p>
        </div>
        <Button onClick={() => setActiveModal("session")} className="gap-2">
          <Plus className="w-4 h-4" /> New Session
        </Button>
      </div>

      <Card className="p-8 text-center bg-linear-to-br from-work to-[#246bb3] text-white border-none shadow-lg">
        <p className="text-blue-100 font-medium mb-2 uppercase tracking-wide text-sm">Today's Focus</p>
        <div className="flex items-baseline justify-center gap-2">
          <motion.h2 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-6xl font-black tracking-tighter"
          >
            {totalHours}
          </motion.h2>
          <span className="text-xl text-blue-100 font-medium">/ {targetHours} hrs</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto mt-6 bg-black/20 rounded-full h-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalHours/targetHours)*100, 100)}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        {categories.map(cat => (
          <div key={cat.name} className="flex items-center gap-2 bg-(--card) border border-(--border) px-4 py-2 rounded-full text-sm font-medium shadow-sm">
            <span className={`w-3 h-3 rounded-full ${cat.color}`} />
            {cat.name}
            <span className="text-slate-500 ml-1">{cat.hours}h</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Today's Logs</h3>
        {sessions.map(session => (
          <motion.div key={session.id} whileHover={{ scale: 1.01 }}>
            <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-work">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                    {session.category}
                  </span>
                  <span className="text-xs text-slate-500">{session.platform}</span>
                </div>
                <h4 className="font-bold text-lg">{session.topic}</h4>
              </div>
              
              <div className="flex items-center gap-6 md:gap-8">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{session.startTime} - {session.endTime}</span>
                  <span className="text-xs font-bold ml-1">({session.duration}m)</span>
                </div>
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < session.quality ? "fill-current" : "text-slate-300 dark:text-slate-700"}`} />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
