"use client";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { QuickLogPanel } from "@/components/today/QuickLogPanel";
import { useEffect } from "react";

const pageAnim = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 28, staggerChildren: 0.06 }
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

const itemAnim = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

export default function TodayPage() {
  const { data: session } = useSession();
  const todayDate = format(new Date(), "EEEE, d MMMM yyyy");
  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : "User";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const { dayLog, fetchDayLog, activeDate, updateDayLog } = useAppStore();

  useEffect(() => {
    fetchDayLog(activeDate);
  }, [activeDate]);

  // Derived metrics from DayLog
  const score = dayLog?.dayScore || 0;
  const water = dayLog?.diet?.waterGlasses || 0;
  const sessions = dayLog?.workSessions || [];
  const studyMins = sessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const studyHrs = Math.floor(studyMins / 60);
  const studyRem = studyMins % 60;
  
  const circumference = 2 * Math.PI * 36; // r=36
  
  return (
    <motion.div variants={pageAnim} initial="initial" animate="animate" className="container-app py-8 pb-24 md:pb-8 space-y-8">
      {/* Header */}
      <motion.div variants={itemAnim} className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
        <div>
          <h1 className="text-(--color-text-1)">{greeting}, {firstName}</h1>
          <p className="text-(--color-text-2) font-medium mt-1">{todayDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 1.5, color: "#f59e0b" }}
            animate={{ scale: 1, color: "var(--color-warning)" }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="pill bg-(--color-warning-bg) text-(--color-warning)"
          >
            🔥 14 day streak
          </motion.div>
        </div>
        
        {/* Mobile Quick Add FAB */}
        <button className="md:hidden fixed bottom-[80px] right-4 w-14 h-14 bg-(--color-brand) text-white rounded-full shadow-(--shadow-lg) flex items-center justify-center z-40 active:scale-95 transition-transform">
          <Plus size={24} />
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Day Score Ring */}
        <motion.div variants={itemAnim} className="card p-4 flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="var(--color-surface-3)" strokeWidth="6" fill="none" />
              <motion.circle 
                cx="32" cy="32" r="28" 
                stroke="var(--color-brand)" 
                strokeWidth="6" fill="none" 
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (score/100)*circumference }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-(--color-text-1)">
              {score}
            </div>
          </div>
          <div>
            <p className="text-[12px] text-(--color-text-3) uppercase tracking-wider font-medium mb-1">Day Score</p>
            <p className="text-[12px] text-(--color-brand) font-medium">Great day</p>
          </div>
        </motion.div>

        {/* Study Today */}
        <motion.div variants={itemAnim} className="card p-4">
          <p className="text-[12px] text-(--color-text-3) uppercase tracking-wider font-medium mb-2">Study Today</p>
          <p className="text-[28px] font-semibold text-(--color-text-1) leading-none">{studyHrs}h {studyRem}m</p>
          <p className="text-[12px] text-(--color-text-3) mt-1">logged time</p>
          <div style={{ height: "6px", background: "var(--color-surface-3)", borderRadius: "3px", overflow: "hidden", marginTop: "8px" }}>
            <div style={{ height: "100%", width: `${Math.min((studyMins / 240) * 100, 100)}%`, background: "var(--color-study)", borderRadius: "3px", transition: "width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}></div>
          </div>
        </motion.div>

        {/* Water */}
        <motion.div variants={itemAnim} className="card p-4">
          <p className="text-[12px] text-(--color-text-3) uppercase tracking-wider font-medium mb-2">Water</p>
          <p className="text-[28px] font-semibold text-(--color-text-1) leading-none">{water} / 8</p>
          <p className="text-[12px] text-(--color-text-3) mt-1">glasses</p>
          <div className="flex gap-1 mt-2 cursor-pointer" onClick={() => updateDayLog("UPDATE_WATER", Math.min(water + 1, 8))}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className={`h-2 flex-1 rounded-sm ${i <= water ? 'bg-water' : 'bg-surface-3'}`} />
            ))}
          </div>
        </motion.div>

        {/* Habits */}
        <motion.div variants={itemAnim} className="card p-4">
          <p className="text-[12px] text-(--color-text-3) uppercase tracking-wider font-medium mb-2">Habits</p>
          <p className="text-[28px] font-semibold text-(--color-text-1) leading-none">4 / 5</p>
          <p className="text-[12px] text-(--color-text-3) mt-1">completed</p>
          <div className="flex gap-1.5 mt-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full ${i <= 4 ? 'bg-(--color-success)' : 'bg-(--color-surface-3)'}`} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemAnim} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2>Timetable Preview</h2>
              <Link href="/timetable" className="text-[14px] font-medium text-(--color-brand) hover:underline">View full →</Link>
            </div>
            <div className="card p-5 overflow-x-auto no-scrollbar flex gap-2">
              {/* Mini timeline preview */}
              <div className="shrink-0 w-32 p-3 rounded-lg bg-(--color-study-bg) border border-(--color-study) text-(--color-study)">
                <p className="text-xs font-bold mb-1">09:00 - 11:00</p>
                <p className="text-sm font-medium leading-tight">React Study</p>
              </div>
              <div className="shrink-0 w-24 p-3 rounded-lg bg-(--color-meal-bg) border border-(--color-meal) text-(--color-meal)">
                <p className="text-xs font-bold mb-1">11:00 - 12:00</p>
                <p className="text-sm font-medium leading-tight">Lunch</p>
              </div>
              <div className="shrink-0 w-32 p-3 rounded-lg bg-(--color-surface-3) border border-dashed border-(--color-border-2) flex flex-col items-center justify-center text-(--color-text-3) cursor-pointer hover:bg-(--color-surface-2)">
                <Plus size={16} />
                <span className="text-xs mt-1 font-medium">Add Block</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemAnim} className="space-y-3">
            <h2>Daily Goals</h2>
            <div className="card divide-y divide-(--color-border)">
              {['Morning exercise', 'Read 20 pages', 'No screens after 10PM'].map((goal, i) => (
                <div key={i} className="p-4 flex items-center gap-4 cursor-pointer hover:bg-(--color-surface-2) transition-colors">
                  <div className="w-6 h-6 rounded-full border-2 border-(--color-border-2) flex items-center justify-center">
                    {i === 0 && <motion.svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>}
                  </div>
                  <span className={`text-[15px] font-medium ${i===0 ? 'text-(--color-text-3) line-through' : 'text-(--color-text-1)'}`}>{goal}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <motion.div variants={itemAnim} className="space-y-3">
            <h2>Quick Log</h2>
            <QuickLogPanel />
          </motion.div>

          <motion.div variants={itemAnim} className="space-y-3">
            <h2>Habits</h2>
            <div className="card p-4 flex flex-wrap gap-2">
              <motion.button whileTap={{ scale: 0.95 }} className="pill bg-(--color-success) text-white">✓ Make bed</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} className="pill bg-(--color-success) text-white">✓ Meditate</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} className="pill bg-(--color-surface-3) text-(--color-text-2) border border-(--color-border)">Journal</motion.button>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
