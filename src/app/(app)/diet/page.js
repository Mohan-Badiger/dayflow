"use client";
import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Plus, Apple, AlertTriangle, CheckCircle2,
  Coffee, Salad, Cookie, Utensils, Flame, Heart,
  Trash2, Clock, Sparkles
} from "lucide-react";

const MEAL_TYPES = [
  { value: "Breakfast", icon: Coffee,   color: "#f59e0b", label: "Breakfast" },
  { value: "Lunch",     icon: Utensils, color: "#10b981", label: "Lunch" },
  { value: "Dinner",    icon: Salad,    color: "#8b5cf6", label: "Dinner" },
  { value: "Snack",     icon: Cookie,   color: "#ec4899", label: "Snack" },
];

// ─── Water Glass ────────────────────────────────────────
function WaterGlass({ filled, index, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className="relative w-9 h-12 rounded-b-xl rounded-t-md overflow-hidden border-2 transition-colors"
      style={{ borderColor: filled ? "#0ea5e9" : "var(--color-border)" }}
    >
      <motion.div
        initial={false}
        animate={{ height: filled ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-water to-[#38bdf8]"
      />
      {filled && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center">
          <Droplets className="w-3.5 h-3.5 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}

export default function DietPage() {
  const { get, post, patch, del } = useApi();
  const { add: toast } = useToast();
  const { activeDate, dayLog, fetchDayLog } = useAppStore();

  const [meals, setMeals] = useState([]);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [junkFood, setJunkFood] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [mealForm, setMealForm] = useState({ type: "Breakfast", description: "", time: "", isHealthy: true });

  const waterGoal = 8;

  const fetchData = useCallback(async () => {
    setLoading(true);
    fetchDayLog(activeDate);
    const dietData = await get(`/api/day/${activeDate}/diet`);
    if (dietData) {
      setWaterGlasses(dietData.waterGlasses || 0);
      setJunkFood(dietData.junkFood || false);
    }
    const mealData = await get(`/api/day/${activeDate}/diet/meals`);
    if (mealData) setMeals(mealData);
    setLoading(false);
  }, [activeDate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleWaterClick = async (index) => {
    const newVal = index === waterGlasses - 1 ? index : index + 1;
    setWaterGlasses(newVal);
    await patch(`/api/day/${activeDate}/diet`, { waterGlasses: newVal });
  };

  const handleJunkToggle = async () => {
    const val = !junkFood;
    setJunkFood(val);
    await patch(`/api/day/${activeDate}/diet`, { junkFood: val });
  };

  const handleAddMeal = async () => {
    if (!mealForm.description) return;
    const now = new Date();
    const time = mealForm.time || `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const res = await post(`/api/day/${activeDate}/diet/meals`, { ...mealForm, time });
    if (res) {
      toast("Meal logged! 🍽️", "success");
      setShowModal(false);
      setMealForm({ type: "Breakfast", description: "", time: "", isHealthy: true });
      fetchData();
    }
  };

  // Stats
  const healthyCount = meals.filter(m => m.isHealthy).length;
  const waterPct = Math.min(waterGlasses / waterGoal, 1);

  return (
    <PageWrapper className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-1">Diet & Nutrition</h1>
          <p className="text-text-3 font-medium">Fuel your body right. Track every meal.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 h-10">
          <Plus className="w-4 h-4" /> Log Meal
        </Button>
      </div>

      {/* Water + Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Water Tracker */}
        <div className="lg:col-span-2 card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-water/5 to-transparent" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-water" />
                <h2 className="font-bold text-text-1">Water Intake</h2>
              </div>
              <motion.span key={waterGlasses} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                className="text-sm font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: waterPct >= 1 ? "var(--color-success)" : "var(--color-surface-3)", color: waterPct >= 1 ? "white" : "var(--color-text-2)" }}>
                {waterGlasses}/{waterGoal}
              </motion.span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden mb-4">
              <motion.div animate={{ width: `${waterPct * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="h-full rounded-full bg-linear-to-r from-water to-[#38bdf8]" />
            </div>

            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: waterGoal }).map((_, i) => (
                <WaterGlass key={i} filled={i < waterGlasses} index={i} onClick={() => handleWaterClick(i)} />
              ))}
            </div>

            {waterPct >= 1 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-success font-medium mt-3 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Hydration goal reached!
              </motion.p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-text-3">Healthy Meals</p>
              <p className="font-bold text-text-1 text-lg">{healthyCount}/{meals.length || 0}</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-text-3">Meals Logged</p>
              <p className="font-bold text-text-1 text-lg">{meals.length}</p>
            </div>
          </div>
          {/* Junk Food Flag */}
          <div className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <p className="text-xs text-text-3">Junk Food</p>
                <p className="font-bold text-text-1 text-sm">{junkFood ? "Yes 😬" : "Clean ✓"}</p>
              </div>
            </div>
            <button onClick={handleJunkToggle}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors ${junkFood ? "bg-danger" : "bg-surface-3"}`}>
              <motion.div className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: junkFood ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold text-text-1 text-lg">Today's Meals</h2>
          <span className="text-xs text-text-3 font-medium">{meals.length} logged</span>
        </div>

        {meals.length === 0 && !loading ? (
          <div className="card p-12 text-center">
            <Apple className="w-12 h-12 text-text-3 mx-auto mb-3 opacity-30" />
            <p className="text-text-3 font-medium">No meals logged yet.</p>
            <Button onClick={() => setShowModal(true)} variant="outline" className="mt-3 gap-2 text-xs">
              <Plus className="w-3 h-3" /> Log First Meal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {meals.map((meal, i) => {
              const mealCfg = MEAL_TYPES.find(m => m.value === meal.type) || MEAL_TYPES[0];
              const MealIcon = mealCfg.icon;
              return (
                <motion.div key={meal._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: mealCfg.color }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: mealCfg.color + "18" }}>
                      <MealIcon className="w-5 h-5" style={{ color: mealCfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: mealCfg.color + "18", color: mealCfg.color }}>{meal.type}</span>
                        {meal.time && <span className="text-[10px] text-text-3 font-mono">{meal.time}</span>}
                      </div>
                      <p className="font-semibold text-text-1 text-sm mt-0.5 truncate">{meal.description || "No description"}</p>
                    </div>
                    <div className="shrink-0">
                      {meal.isHealthy ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Healthy
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-warning bg-warning/10 px-2 py-1 rounded-full">
                          <Flame className="w-3 h-3" /> Indulgent
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Meal Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log a Meal">
        <div className="space-y-5">
          {/* Meal Type */}
          <div>
            <label className="block text-sm font-bold mb-2 text-text-2">Meal Type</label>
            <div className="grid grid-cols-4 gap-2">
              {MEAL_TYPES.map(mt => {
                const Icon = mt.icon;
                return (
                  <button key={mt.value} onClick={() => setMealForm({ ...mealForm, type: mt.value })}
                    className={`p-3 rounded-xl flex flex-col items-center gap-1.5 border transition-all ${mealForm.type === mt.value ? "border-brand bg-brand/10" : "border-border bg-surface hover:border-border-2"}`}>
                    <Icon className="w-5 h-5" style={{ color: mt.color }} />
                    <span className="text-[10px] font-bold text-text-2">{mt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2 text-text-2">What did you eat?</label>
            <input type="text" value={mealForm.description} onChange={e => setMealForm({ ...mealForm, description: e.target.value })}
              className="input-field" placeholder="e.g. Grilled chicken with rice and salad" />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-bold mb-2 text-text-2">Time</label>
            <input type="time" value={mealForm.time} onChange={e => setMealForm({ ...mealForm, time: e.target.value })}
              className="input-field scheme-dark" placeholder="Leave blank for now" />
          </div>

          {/* Healthy Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-3 border border-border">
            <div>
              <p className="font-bold text-sm text-text-1">Healthy Meal?</p>
              <p className="text-xs text-text-3 mt-0.5">Was this a clean, nutritious meal?</p>
            </div>
            <button onClick={() => setMealForm({ ...mealForm, isHealthy: !mealForm.isHealthy })}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors ${mealForm.isHealthy ? "bg-success" : "bg-surface-3 border border-border"}`}>
              <motion.div className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: mealForm.isHealthy ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            </button>
          </div>

          <Button className="w-full h-11" onClick={handleAddMeal} disabled={!mealForm.description}>
            <Apple className="w-4 h-4 mr-2" /> Log Meal
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
