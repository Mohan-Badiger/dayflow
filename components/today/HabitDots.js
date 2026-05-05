"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Check } from "lucide-react";

export function HabitDots({ habits = [] }) {
  const [completed, setCompleted] = useState({});

  const toggleHabit = (id) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
    // Here we would also call API to log the habit completion
  };

  return (
    <Card className="p-5">
      <h3 className="font-semibold mb-4">Today's Habits</h3>
      <div className="flex flex-col gap-3">
        {habits.length === 0 ? (
          <p className="text-sm text-slate-500">No active habits. Add some from the Habits page.</p>
        ) : (
          habits.map((habit) => {
            const isDone = completed[habit.id];
            return (
              <div key={habit.id} className="flex items-center justify-between">
                <span className="text-sm font-medium">{habit.name}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    isDone 
                      ? "bg-[var(--color-success)] border-[var(--color-success)] text-white" 
                      : "border-slate-300 dark:border-slate-600 text-transparent hover:border-slate-400"
                  }`}
                >
                  <motion.div
                    initial={false}
                    animate={{ scale: isDone ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
