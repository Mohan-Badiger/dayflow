"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { StatCard } from "@/components/today/StatCard";
import { Timeline } from "@/components/today/Timeline";
import { QuickLogPanel } from "@/components/today/QuickLogPanel";
import { HabitDots } from "@/components/today/HabitDots";
import { Activity, Clock, Droplet, CheckSquare } from "lucide-react";
import { format } from "date-fns";

export default function TodayPage() {
  const todayDate = format(new Date(), "EEEE, MMMM do");

  // Mock data for UI layout
  const mockHabits = [
    { id: "1", name: "Read 10 pages" },
    { id: "2", name: "No social media until noon" },
    { id: "3", name: "Stretch 5 mins" },
  ];

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Good morning, User</h1>
          <p className="text-slate-500">{todayDate}</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full font-bold text-sm">
          🔥 5 day streak
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Day Score" 
          value="85" 
          subtitle="/100" 
          icon={Activity} 
          colorClass="bg-primary text-primary" 
          delay={0.1} 
        />
        <StatCard 
          title="Study Hours" 
          value="2.5" 
          subtitle="/ 4h goal" 
          icon={Clock} 
          colorClass="bg-work text-work" 
          delay={0.2} 
        />
        <StatCard 
          title="Water" 
          value="3" 
          subtitle="/ 8 glasses" 
          icon={Droplet} 
          colorClass="bg-work text-work" 
          delay={0.3} 
        />
        <StatCard 
          title="Habits" 
          value="1" 
          subtitle="/ 3 done" 
          icon={CheckSquare} 
          colorClass="bg-success text-success" 
          delay={0.4} 
        />
      </div>

      <QuickLogPanel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Timeline</h2>
          <Timeline events={[]} />
        </div>
        <div className="space-y-6">
          <HabitDots habits={mockHabits} />
        </div>
      </div>
    </PageWrapper>
  );
}
