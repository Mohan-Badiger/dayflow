"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { useDayLog } from "@/hooks/useTimetable";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  CalendarDays, Clock, Dumbbell, BookOpen,
  ChevronRight, Flame, Target, Sun, Moon,
  CheckCircle2, Brain, TrendingUp, Sparkles, Play
} from "lucide-react";

function ScoreRing({ value, max, size = 72, label, color = "var(--color-brand)" }) {
  const pct = max > 0 ? value / max : 0;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={6} />
          <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
            strokeLinecap="round" initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            style={{ strokeDasharray: circ }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black text-text-1">{value}</span>
        </div>
      </div>
      {label && <span className="text-[10px] text-text-3 font-medium uppercase tracking-wider">{label}</span>}
    </div>
  );
}

function QuickNavCard({ href, icon: Icon, label, value, sublabel, color, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="h-full">
      <Link href={href} className="card h-full p-4 md:p-5 flex flex-col justify-between group hover:border-border-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-surface-1/60 backdrop-blur-md relative overflow-hidden border border-border/50">
        <div className="absolute top-0 right-0 w-32 h-32 rounded opacity-10 blur-3xl transition-opacity group-hover:opacity-30" style={{ backgroundColor: color }} />

        <div className="flex items-center justify-between relative z-10 mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-inner" style={{ backgroundColor: color + "15", color: color, boxShadow: `inset 0 0 0 1px ${color}30` }}>
            <Icon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <ChevronRight className="w-5 h-5 text-text-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </div>

        <div className="relative z-10 mt-auto">
          <p className="text-[10px] md:text-xs text-text-3 font-bold tracking-wider uppercase mb-1">{label}</p>
          <p className="text-lg md:text-xl font-black text-text-1 leading-tight">{value}</p>
          <p className="text-[10px] md:text-[11px] text-text-3 mt-1.5 font-medium min-h-4 flex items-center">{sublabel || " "}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TodayPage() {
  const { data: session } = useSession();
  const { dayLog: storeDayLog, fetchDayLog, activeDate } = useAppStore();
  const { data: queryDayLog } = useDayLog(activeDate);
  const dayLog = queryDayLog?.data || storeDayLog;
  const { get, patch } = useApi();
  const { add: toast } = useToast();

  const [streak, setStreak] = useState(0);

  const firstName = session?.user?.name?.split(" ")[0] || "User";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const todayStr = format(new Date(), "EEEE, d MMMM yyyy");

  useEffect(() => { fetchDayLog(activeDate); }, [activeDate]);

  const fetchExtras = useCallback(async () => {
    const s = await get("/api/user/streak");
    if (s?.streak !== undefined) setStreak(s.streak);
  }, [activeDate]);

  useEffect(() => { fetchExtras(); }, [fetchExtras]);

  // Derived
  const score = dayLog?.dayScore || 0;
  const sessions = dayLog?.workSessions || [];
  const studyMins = sessions.reduce((s, x) => s + (x.durationMinutes || 0), 0);
  const timetable = dayLog?.timetable || [];
  const ttDone = timetable.filter(b => b.status === "done").length;
  const morning = dayLog?.routine?.morningChecklist || {};
  const night = dayLog?.routine?.nightChecklist || {};
  const morningDone = Object.values(morning).filter(v => v === true).length;
  const nightDone = Object.values(night).filter(v => v === true).length;
  const routineTotal = morningDone + nightDone;
  const exerciseDone = dayLog?.exercise?.done || false;

  const scoreColor = score >= 75 ? "var(--color-success)" : score >= 40 ? "var(--color-warning)" : "var(--color-danger)";
  const scoreLabel = score >= 75 ? "Great day!" : score >= 40 ? "Keep pushing" : "Let's go!";

  return (
    <PageWrapper className="space-y-6 pb-8">
      {/* ─── Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-1">{greeting}, {firstName}</h1>
          <p className="text-text-3 font-medium mt-0.5">{todayStr}</p>
        </div>
        {streak > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}
            className="pill bg-warning/15 text-warning border border-warning/30 text-sm font-bold">
            <Flame className="w-4 h-4 mr-1" /> {streak} day streak
          </motion.div>
        )}
      </div>

      {/* ─── Score + Overview ────────────────────── */}
      <div className="card p-8 relative overflow-hidden bg-surface-1/50 backdrop-blur-xl border-border-2/50">
        <div className="absolute inset-0 bg-linear-to-br from-brand/10 via-transparent to-brand-light/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-md blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row items-center gap-8">
          <ScoreRing value={score} max={100} size={110} color={scoreColor} />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-brand font-semibold uppercase tracking-[0.2em] mb-2">Day Score</p>
            <p className="text-3xl font-black text-text-1 tracking-tight">{scoreLabel}</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <span className="pill bg-surface-2 text-text-1 border border-border-2 text-xs shadow-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-brand" /> {Math.floor(studyMins / 60)}h {studyMins % 60}m study
              </span>
              <span className="pill bg-surface-2 text-text-1 border border-border-2 text-xs shadow-xs font-semibold">
                <Target className="w-3.5 h-3.5 mr-1.5 text-success" /> {routineTotal}/9 routine
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Quick Nav Grid ──────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <QuickNavCard href="/timetable" icon={CalendarDays} label="Timetable"
          value={`${ttDone}/${timetable.length} blocks`}
          sublabel={timetable.length ? `${timetable.filter(b => b.status === "planned").length} remaining` : "Plan your day"}
          color="#6366f1" delay={0.05} />
        <QuickNavCard href="/routine" icon={Sun} label="Routine"
          value={`${routineTotal}/9 done`}
          sublabel={`${morningDone}/6 AM · ${nightDone}/3 PM`}
          color="#f59e0b" delay={0.1} />
        <QuickNavCard href="/sessions" icon={Brain} label="Study"
          value={`${Math.floor(studyMins / 60)}h ${studyMins % 60}m`}
          sublabel={`${sessions.length} session${sessions.length !== 1 ? "s" : ""}`}
          color="#8b5cf6" delay={0.15} />
        <QuickNavCard href="/analytics" icon={TrendingUp} label="Analytics"
          value="Insights"
          sublabel="Trends & patterns"
          color="#0ea5e9" delay={0.2} />
      </div>

      {/* ─── Today's Timetable Preview ───────────── */}
      {timetable.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-text-1 text-lg">Today's Schedule</h3>
            <Link href="/timetable" className="text-xs text-brand font-semibold hover:underline flex items-center gap-1">
              Full view <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {timetable.slice(0, 6).map((block, i) => {
              const isDone = block.status === "done";
              const catColors = { study: "#6366f1", exercise: "#10b981", meal: "#f59e0b", routine: "#8b5cf6", break: "#94a3b8", personal: "#ec4899" };
              const c = catColors[block.category] || "#6366f1";
              return (
                <motion.div key={block._id || i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={`shrink-0 w-40 p-4 rounded border backdrop-blur-sm transition-all shadow-xs ${isDone ? "opacity-50" : "hover:shadow-md hover:-translate-y-0.5"}`}
                  style={{ borderColor: c + "30", backgroundColor: c + "08" }}>
                  <p className="text-[11px] font-mono font-bold tracking-wide" style={{ color: c }}>{block.startTime}–{block.endTime}</p>
                  <p className={`text-sm font-bold mt-1.5 leading-snug truncate ${isDone ? "line-through opacity-70" : "text-text-1"}`}>{block.title}</p>
                  {isDone && <CheckCircle2 className="w-4 h-4 mt-2" style={{ color: c }} />}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Study Quick Start ───────────────────── */}
      <Link href="/sessions" className="group relative overflow-hidden rounded-md p-6 flex items-center gap-5 border border-brand/20 bg-linear-to-r from-brand/10 to-brand/5 shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand/10 rounded-full blur-2xl transition-colors" />
        <div className="w-14 h-14 rounded-2xl bg-brand/20 flex items-center justify-center relative z-10 shrink-0 group-hover:scale-110 transition-transform">
          <Play className="w-7 h-7 text-brand ml-1" />
        </div>
        <div className="flex-1 relative z-10">
          <p className="text-xl font-bold text-text-1">Start a Study Session</p>
          <p className="text-sm text-text-2 mt-1 font-medium">Deep work timer with focus lock mode</p>
        </div>
        <ChevronRight className="w-6 h-6 text-brand relative z-10 group-hover:translate-x-1 transition-transform" />
      </Link>
    </PageWrapper>
  );
}
