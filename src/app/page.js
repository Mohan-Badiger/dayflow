"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Target, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-16 text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, type: "spring" }}
          className="space-y-6"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold text-sm mb-4">
            Personal Daily Tracker
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            Master your days.<br/>
            <span className="text-[var(--color-primary)]">Design your life.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            DayFlow is a minimal, focused tracker for your routines, study sessions, diet, and mood. No fluff, just your data.
          </p>
          <div className="pt-8">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-[var(--border)] text-left"
        >
          <div className="space-y-3 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-xl">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Daily Hub</h3>
            <p className="text-slate-500 text-sm">Everything that matters today in one clean, beautiful dashboard.</p>
          </div>
          <div className="space-y-3 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-[var(--color-primary)] flex items-center justify-center rounded-xl">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Deep Work</h3>
            <p className="text-slate-500 text-sm">Track your study sessions and stay aligned with your career goals.</p>
          </div>
          <div className="space-y-3 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Rich Analytics</h3>
            <p className="text-slate-500 text-sm">Discover patterns between your habits, sleep, study time, and mood.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
