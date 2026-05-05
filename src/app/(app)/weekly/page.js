"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Target, Flag, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function WeeklyPage() {
  const goals = [
    { category: "React / Next.js", target: 15, current: 8.5 },
    { category: "DSA", target: 8, current: 3 },
    { category: "System Design", target: 5, current: 1 },
  ];

  const totalTarget = goals.reduce((acc, curr) => acc + curr.target, 0);
  const totalCurrent = goals.reduce((acc, curr) => acc + curr.current, 0);
  const progressPercent = (totalCurrent / totalTarget) * 100;

  return (
    <PageWrapper className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weekly Goals</h1>
          <p className="text-slate-500">Plan your week, execute your days.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 bg-gradient-to-r from-[var(--color-primary)] to-[#9f98eb] text-white border-none">
            <h2 className="text-lg font-medium mb-1 opacity-90">Weekly Focus Theme</h2>
            <p className="text-2xl font-bold">Next.js App Router Mastery</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--color-primary)]" /> Goal Progress
            </h2>
            
            <div className="mb-8">
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Overall Weekly Study</span>
                <span>{totalCurrent} / {totalTarget} hrs</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progressPercent}%` }} 
                  className="bg-[var(--color-primary)] h-3 rounded-full" 
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="space-y-5">
              {goals.map((goal, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{goal.category}</span>
                    <span className="text-slate-500">{goal.current} / {goal.target}h</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(goal.current / goal.target) * 100}%` }} 
                      className="bg-[var(--color-work)] h-2 rounded-full" 
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-[var(--color-warning)]" /> Top 3 Priorities
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-warning)]/20 text-[var(--color-warning)] flex items-center justify-center font-bold text-xs">1</span>
                <span className="text-sm font-medium">Finish Next.js Caching module on Udemy</span>
              </li>
              <li className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-warning)]/20 text-[var(--color-warning)] flex items-center justify-center font-bold text-xs">2</span>
                <span className="text-sm font-medium">Solve 15 Medium LC Array questions</span>
              </li>
              <li className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-warning)]/20 text-[var(--color-warning)] flex items-center justify-center font-bold text-xs">3</span>
                <span className="text-sm font-medium">Workout 4 times this week</span>
              </li>
            </ul>
          </Card>
          
          <Button className="w-full gap-2" variant="outline">
            <Play className="w-4 h-4" /> Start Weekly Review
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
