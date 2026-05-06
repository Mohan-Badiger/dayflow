"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { StatCard } from "@/components/today/StatCard";
import { Timeline } from "@/components/today/Timeline";
import { QuickLogPanel } from "@/components/today/QuickLogPanel";
import { HabitDots } from "@/components/today/HabitDots";
import { Activity, Clock, Droplet, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function TodayPage() {
  const { data: session } = useSession();
  const todayDate = format(new Date(), "EEEE, MMMM do");

  // Extract first name or fallback
  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : "User";

  // Start with 0 habits for a new account
  const mockHabits = [];

  // Container variants for staggered entrance
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PageWrapper className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black tracking-tight">Good morning, {firstName}</h1>
          <p className="text-slate-500 mt-1 font-medium">{todayDate}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 bg-linear-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 text-orange-600 dark:text-orange-400 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-orange-200/50 dark:border-orange-900/50"
        >
          🔥 0 day streak
        </motion.div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Day Score"
          value="0"
          subtitle="/100"
          icon={Activity}
          colorClass="bg-primary/10 text-primary border-primary/20"
        />
        <StatCard
          title="Study Hours"
          value="0"
          subtitle="/ 4h goal"
          icon={Clock}
          colorClass="bg-work/10 text-work border-work/20"
        />
        <StatCard
          title="Water"
          value="0"
          subtitle="/ 8 glasses"
          icon={Droplet}
          colorClass="bg-work/10 text-work border-work/20"
        />
        <StatCard
          title="Habits"
          value="0"
          subtitle="/ 0 done"
          icon={CheckSquare}
          colorClass="bg-success/10 text-success border-success/20"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <QuickLogPanel />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Timeline</h2>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm min-h-[200px] flex items-center justify-center">
            <p className="text-slate-400 font-medium text-sm text-center">No events logged today.<br />Start tracking to see your timeline!</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Daily Habits</h2>
          </div>
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm min-h-[200px]">
            <HabitDots habits={mockHabits} />
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
