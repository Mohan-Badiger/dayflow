"use client";
import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { Droplet, Plus, Apple, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function WaterTracker({ glasses, setGlasses, target = 8 }) {
  return (
    <Card className="p-8 border-b-4 border-b-work">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Droplet className="w-5 h-5 text-work" /> Water Intake
          </h2>
          <p className="text-slate-500 mt-1">Goal: {target} glasses</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {[...Array(target)].map((_, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.8 }}
              onClick={() => setGlasses(i === glasses - 1 ? i : i + 1)}
              className={`w-10 h-14 rounded-b-xl rounded-t flex items-end justify-center overflow-hidden border-2 transition-colors duration-300 ${
                i < glasses 
                  ? "border-work bg-work/10" 
                  : "border-slate-200 dark:border-slate-700 bg-transparent"
              }`}
            >
              <motion.div
                initial={false}
                animate={{ height: i < glasses ? "100%" : "0%" }}
                className="w-full bg-work"
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              />
            </motion.button>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function DietPage() {
  const setActiveModal = useAppStore(state => state.setActiveModal);
  const [glasses, setGlasses] = useState(3);
  const [junkFood, setJunkFood] = useState(false);

  // Mock data
  const meals = [
    { id: 1, type: "Breakfast", description: "Oatmeal and berries", time: "07:30", isHealthy: true },
    { id: 2, type: "Lunch", description: "Chicken salad", time: "13:00", isHealthy: true },
  ];

  return (
    <PageWrapper className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Diet & Water</h1>
          <p className="text-slate-500">Track your fuel.</p>
        </div>
        <Button onClick={() => setActiveModal("meal")} className="gap-2 bg-warning hover:bg-[#b04a28]">
          <Plus className="w-4 h-4" /> Log Meal
        </Button>
      </div>

      <WaterTracker glasses={glasses} setGlasses={setGlasses} target={8} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Today's Meals</h2>
            <span className="text-sm font-medium text-slate-500">{meals.length} logged</span>
          </div>
          
          <div className="space-y-3">
            {meals.map(meal => (
              <motion.div key={meal.id} whileHover={{ scale: 1.01 }}>
                <Card className="flex items-center justify-between p-4 border-l-4 border-l-warning">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                      <Apple className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold">{meal.type}</h4>
                        <span className="text-xs text-slate-500">{meal.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{meal.description}</p>
                    </div>
                  </div>
                  {meal.isHealthy ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Healthy
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded-full">
                      <AlertTriangle className="w-3 h-3" /> Indulgence
                    </span>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Daily Flags</h2>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" /> Junk Food
                </h4>
                <p className="text-xs text-slate-500 mt-1">Did you eat junk food today?</p>
              </div>
              <button 
                onClick={() => setJunkFood(!junkFood)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${junkFood ? "bg-warning" : "bg-slate-200 dark:bg-slate-700"}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: junkFood ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
