"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { Plus, Battery, Target, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MoodPage() {
  const setActiveModal = useAppStore(state => state.setActiveModal);
  
  const emojis = ["😴", "😟", "😐", "🙂", "😄"];
  const moodData = {
    morning: 4,
    evening: 5,
    energy: 8,
    focus: 7,
    stress: 3,
  };

  const chartData = [
    { day: "Mon", mood: 3 },
    { day: "Tue", mood: 4 },
    { day: "Wed", mood: 3 },
    { day: "Thu", mood: 5 },
    { day: "Fri", mood: 4 },
    { day: "Sat", mood: 5 },
    { day: "Sun", mood: 5 },
  ];

  const getEmoji = (val) => emojis[val - 1] || "😐";

  return (
    <PageWrapper className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mood & Energy</h1>
          <p className="text-slate-500">Track your internal state.</p>
        </div>
        <Button onClick={() => setActiveModal("mood")} className="gap-2 bg-energy hover:bg-[#b54268]">
          <Plus className="w-4 h-4" /> Log Mood
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-t-4 border-t-energy">
          <h2 className="text-xl font-bold mb-6">Today's State</h2>
          
          <div className="flex justify-around mb-8">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Morning</p>
              <div className="text-5xl">{getEmoji(moodData.morning)}</div>
            </div>
            <div className="w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Evening</p>
              <div className="text-5xl">{getEmoji(moodData.evening)}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1 font-medium"><Battery className="w-4 h-4 text-green-500" /> Energy</span>
                <span>{moodData.energy}/10</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(moodData.energy/10)*100}%` }} className="bg-green-500 h-2 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1 font-medium"><Target className="w-4 h-4 text-blue-500" /> Focus</span>
                <span>{moodData.focus}/10</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(moodData.focus/10)*100}%` }} className="bg-blue-500 h-2 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1 font-medium"><BrainCircuit className="w-4 h-4 text-orange-500" /> Stress</span>
                <span>{moodData.stress}/10</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(moodData.stress/10)*100}%` }} className="bg-orange-500 h-2 rounded-full" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">7-Day Trend</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={10} />
                <YAxis domain={[1, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} ticks={[1, 2, 3, 4, 5]} />
                <Tooltip cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="mood" stroke="var(--color-energy)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "white" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}
