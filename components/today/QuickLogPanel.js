"use client";
import { motion } from "framer-motion";
import { Clock, Apple, Dumbbell, SmilePlus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function QuickLogPanel() {
  const setActiveModal = useAppStore((state) => state.setActiveModal);

  const logs = [
    { id: "session", name: "Log Session", icon: Clock, color: "bg-[var(--color-work)]" },
    { id: "meal", name: "Log Meal", icon: Apple, color: "bg-[var(--color-warning)]" },
    { id: "exercise", name: "Log Exercise", icon: Dumbbell, color: "bg-[var(--color-success)]" },
    { id: "mood", name: "Log Mood", icon: SmilePlus, color: "bg-[var(--color-energy)]" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {logs.map((log) => (
        <motion.button
          key={log.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveModal(log.id)}
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 ${log.color}`}>
            <log.icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium">{log.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
