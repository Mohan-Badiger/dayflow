"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Check, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";

export default function HabitsPage() {
  const habits = [
    { id: 1, name: "Wake before 6:30", category: "routine", streak: 5, color: "var(--color-primary)" },
    { id: 2, name: "Cold shower", category: "health", streak: 12, color: "var(--color-success)" },
    { id: 3, name: "No junk food", category: "diet", streak: 2, color: "var(--color-warning)" },
  ];

  return (
    <PageWrapper className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Habits</h1>
          <p className="text-slate-500">Build the systems that run your life.</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> New Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {habits.map((habit, i) => (
          <motion.div key={habit.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" 
                  style={{ backgroundColor: habit.color }}
                >
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{habit.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded capitalize text-slate-600 dark:text-slate-400">
                      {habit.category}
                    </span>
                    <span className="text-sm font-semibold text-orange-500 flex items-center gap-1">
                      🔥 {habit.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex gap-1">
                {[...Array(21)].map((_, idx) => {
                  const isDone = Math.random() > 0.3;
                  return (
                    <div 
                      key={idx} 
                      className={`w-4 h-4 rounded-sm ${isDone ? "" : "bg-slate-100 dark:bg-slate-800"}`}
                      style={{ backgroundColor: isDone ? habit.color : undefined }}
                    />
                  );
                })}
              </div>
              
              <button className="absolute top-4 right-4 md:static p-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
