"use client";
import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { Dumbbell, Plus, TrendingUp, Calendar as CalendarIcon, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ExercisePage() {
  const setActiveModal = useAppStore(state => state.setActiveModal);
  
  // Mock data
  const [doneToday, setDoneToday] = useState(true);
  const exercise = { type: "Gym", duration: 45, notes: "Push day" };
  
  const weeklyGrid = [
    { day: "Mon", done: true },
    { day: "Tue", done: false },
    { day: "Wed", done: true },
    { day: "Thu", done: true },
    { day: "Fri", done: null },
    { day: "Sat", done: null },
    { day: "Sun", done: null },
  ];

  return (
    <PageWrapper className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exercise</h1>
          <p className="text-slate-500">Keep moving forward.</p>
        </div>
        <Button onClick={() => setActiveModal("exercise")} className="gap-2 bg-success hover:bg-[#18805e]">
          <Plus className="w-4 h-4" /> Log Exercise
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 border-t-4 border-t-success flex flex-col justify-center min-h-[250px]">
          <div className="text-center space-y-6">
            <h2 className="text-xl font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Today</h2>
            <div className="flex justify-center">
              <button 
                onClick={() => setDoneToday(!doneToday)}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-300 ${
                  doneToday 
                    ? "bg-success border-success text-white shadow-lg shadow-success/30 scale-105" 
                    : "bg-transparent border-slate-200 dark:border-slate-700 text-slate-400 hover:border-success hover:text-success"
                }`}
              >
                <Dumbbell className="w-10 h-10 mb-2" />
                <span className="font-bold">{doneToday ? "DONE" : "PENDING"}</span>
              </button>
            </div>
            
            <AnimatePresence>
              {doneToday && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg inline-block"
                >
                  <p className="font-medium text-slate-900 dark:text-slate-100">{exercise.type} • {exercise.duration} mins</p>
                  <p className="text-sm text-slate-500">{exercise.notes}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-slate-400" /> This Week
            </h2>
            <div className="flex justify-between">
              {weeklyGrid.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">{day.day}</span>
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${
                    day.done === true ? "bg-success text-white" :
                    day.done === false ? "bg-warning text-white" :
                    "bg-slate-100 dark:bg-slate-800 text-transparent"
                  }`}>
                    {day.done === true && <Flame className="w-5 h-5" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Time</p>
                <p className="text-xl font-bold">180m</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Sessions</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
