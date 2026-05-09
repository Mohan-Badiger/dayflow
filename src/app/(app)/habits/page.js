"use client";
import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Plus, Check, MoreVertical, X } from "lucide-react";
import { motion } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "routine",
    color: "#6366f1",
    targetDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  });

  const { get, post } = useApi();
  const { add: toast } = useToast();
  const { activeDate } = useAppStore();

  const fetchHabits = async () => {
    const data = await get("/api/habits");
    if (data) {
      const logs = await get(`/api/habits/log?date=${activeDate}`);
      if (logs) {
        const habitsWithStatus = data.map(h => ({
          ...h,
          completed: logs.some(l => l.habitId === h._id && l.completed)
        }));
        setHabits(habitsWithStatus);
      } else {
        setHabits(data);
      }
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [activeDate]);

  const handleHabitToggle = async (habitId, completed) => {
    setHabits(prev => prev.map(h =>
      h._id === habitId ? { ...h, completed } : h
    ));
    await post("/api/habits/log", { habitId, date: activeDate, completed });
    if (completed) toast("Habit done! 🎉", "success");
  };

  const handleCreateHabit = async () => {
    if (!formData.name) return;
    const res = await post("/api/habits", formData);
    if (res) {
      toast("Habit created!", "success");
      setIsModalOpen(false);
      setFormData({
        name: "",
        category: "routine",
        color: "#6366f1",
        targetDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      });
      fetchHabits();
    }
  };

  const categories = ["routine", "health", "study", "diet", "custom"];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <PageWrapper className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Habits</h1>
          <p className="text-slate-500">Build the systems that run your life.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {habits.length > 0 ? habits.map((habit, i) => (
          <motion.div key={habit._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 hover:border-slate-300 transition-colors relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => handleHabitToggle(habit._id, !habit.completed)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold cursor-pointer transition-transform active:scale-95 z-10 ${habit.completed ? 'opacity-100' : 'opacity-50 grayscale'}`} 
                  style={{ backgroundColor: habit.color || "#6366f1" }}
                >
                  {habit.completed && <Check className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{habit.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded capitalize text-slate-600 dark:text-slate-400">
                      {habit.category}
                    </span>
                    <span className="text-sm font-semibold text-orange-500 flex items-center gap-1">
                      🔥 {habit.currentStreak || 0} day streak
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex gap-1">
                {days.map((day) => {
                  const isActive = habit.targetDays?.includes(day);
                  return (
                    <div 
                      key={day} 
                      className={`w-2 h-6 rounded-full ${isActive ? "" : "bg-slate-100 dark:bg-slate-800"}`}
                      style={{ backgroundColor: isActive ? habit.color : undefined, opacity: isActive ? 1 : 0.3 }}
                      title={day}
                    />
                  );
                })}
              </div>
              
              <button className="absolute top-4 right-4 md:static p-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </Card>
          </motion.div>
        )) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <p className="text-slate-400 mb-4">No habits yet. Start by creating one!</p>
            <Button onClick={() => setIsModalOpen(true)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" /> Create First Habit
            </Button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Habit">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Habit Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., Morning Meditation"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFormData({...formData, category: cat})}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.category === cat ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Color</label>
            <div className="flex gap-3">
              {["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"].map(c => (
                <button
                  key={c}
                  onClick={() => setFormData({...formData, color: c})}
                  className={`w-8 h-8 rounded-full transition-transform ${formData.color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Target Days</label>
            <div className="flex gap-2">
              {days.map(day => {
                const selected = formData.targetDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => {
                      const next = selected 
                        ? formData.targetDays.filter(d => d !== day)
                        : [...formData.targetDays, day];
                      setFormData({...formData, targetDays: next});
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${selected ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                  >
                    {day[0]}
                  </button>
                );
              })}
            </div>
          </div>

          <Button className="w-full h-12 text-lg" onClick={handleCreateHabit} disabled={!formData.name}>
            Create Habit
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
