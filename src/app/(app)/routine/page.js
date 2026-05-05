"use client";
import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

function ChecklistItem({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg bg-[var(--background)] hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
      <span className="text-sm font-medium">{label}</span>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(!checked)}
        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
          checked ? "bg-[var(--color-success)] text-white" : "border-2 border-slate-300 dark:border-slate-600 text-transparent"
        }`}
      >
        <motion.div initial={false} animate={{ scale: checked ? 1 : 0 }}>
          <Check className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </div>
  );
}

export default function RoutinePage() {
  const [morning, setMorning] = useState({
    exercise: false,
    meditation: false,
    coldShower: false,
    breakfast: false,
    reviewedPlan: false,
    noPhoneFirstHour: false,
  });

  const [night, setNight] = useState({
    reviewedDay: false,
    plannedTomorrow: false,
    readingOrLearning: false,
  });

  const [wakeTime, setWakeTime] = useState("06:30");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [screenOff, setScreenOff] = useState("22:30");

  const toggleMorning = (key) => setMorning(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleNight = (key) => setNight(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <PageWrapper className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Daily Routine</h1>
        <p className="text-slate-500">Track your wake-to-sleep habits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-6 border-t-4 border-t-[var(--color-success)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Morning</h2>
            <div className="text-sm font-semibold text-[var(--color-success)] bg-[var(--color-success)]/10 px-3 py-1 rounded-full">
              {Object.values(morning).filter(Boolean).length}/6 Done
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-500">Wake Time</label>
            <input 
              type="time" 
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] font-medium"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Checklist</h3>
            <ChecklistItem label="Exercise" checked={morning.exercise} onChange={() => toggleMorning("exercise")} />
            <ChecklistItem label="Meditation" checked={morning.meditation} onChange={() => toggleMorning("meditation")} />
            <ChecklistItem label="Cold shower" checked={morning.coldShower} onChange={() => toggleMorning("coldShower")} />
            <ChecklistItem label="Breakfast" checked={morning.breakfast} onChange={() => toggleMorning("breakfast")} />
            <ChecklistItem label="Reviewed today's plan" checked={morning.reviewedPlan} onChange={() => toggleMorning("reviewedPlan")} />
            <ChecklistItem label="No phone first hour" checked={morning.noPhoneFirstHour} onChange={() => toggleMorning("noPhoneFirstHour")} />
          </div>
        </Card>

        <Card className="p-6 space-y-6 border-t-4 border-t-[var(--color-primary)]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Night</h2>
            <div className="text-sm font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full">
              {Object.values(night).filter(Boolean).length}/3 Done
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-500">Screen Off By</label>
              <input 
                type="time" 
                value={screenOff}
                onChange={(e) => setScreenOff(e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-500">Sleep Time</label>
              <input 
                type="time" 
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] font-medium"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Checklist</h3>
            <ChecklistItem label="Reviewed today" checked={night.reviewedDay} onChange={() => toggleNight("reviewedDay")} />
            <ChecklistItem label="Planned tomorrow" checked={night.plannedTomorrow} onChange={() => toggleNight("plannedTomorrow")} />
            <ChecklistItem label="Reading/learning" checked={night.readingOrLearning} onChange={() => toggleNight("readingOrLearning")} />
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
