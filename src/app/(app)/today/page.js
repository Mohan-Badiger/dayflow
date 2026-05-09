"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  CalendarDays, Clock, Droplets, Dumbbell, BookOpen,
  ChevronRight, Flame, Target, Sun, Moon, Apple,
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link href={href} className="card p-4 flex items-center gap-4 group hover:border-border-2 transition-all">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "18" }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-3 font-medium">{label}</p>
          <p className="text-lg font-bold text-text-1 leading-tight">{value}</p>
          {sublabel && <p className="text-[10px] text-text-3 mt-0.5">{sublabel}</p>}
        </div>
        <ChevronRight className="w-4 h-4 text-text-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </motion.div>
  );
}

export default function TodayPage() {
  const { data: session } = useSession();
  const { dayLog, fetchDayLog, activeDate } = useAppStore();
  const { get, patch } = useApi();
  const { add: toast } = useToast();

  const [habits, setHabits] = useState([]);
  const [streak, setStreak] = useState(0);

  const firstName = session?.user?.name?.split(" ")[0] || "User";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const todayStr = format(new Date(), "EEEE, d MMMM yyyy");

  useEffect(() => { fetchDayLog(activeDate); }, [activeDate]);

  const fetchExtras = useCallback(async () => {
    const h = await get("/api/habits");
    if (h) {
      const logs = await get(`/api/habits/log?date=${activeDate}`);
      if (logs) {
        setHabits(h.map(hb => ({ ...hb, completed: logs.some(l => l.habitId === hb._id && l.completed) })));
      } else setHabits(h);
    }
    const s = await get("/api/user/streak");
    if (s?.currentStreak !== undefined) setStreak(s.currentStreak);
  }, [activeDate]);

  useEffect(() => { fetchExtras(); }, [fetchExtras]);

  // Derived
  const score = dayLog?.dayScore || 0;
  const water = dayLog?.diet?.waterGlasses || 0;
  const waterGoal = 8;
  const sessions = dayLog?.workSessions || [];
  const studyMins = sessions.reduce((s, x) => s + (x.durationMinutes || 0), 0);
  const timetable = dayLog?.timetable || [];
  const ttDone = timetable.filter(b => b.status === "done").length;
  const morning = dayLog?.routine?.morningChecklist || {};
  const night = dayLog?.routine?.nightChecklist || {};
  const morningDone = Object.values(morning).filter(Boolean).length;
  const nightDone = Object.values(night).filter(Boolean).length;
  const routineTotal = morningDone + nightDone;
  const habitsDone = habits.filter(h => h.completed).length;
  const meals = dayLog?.diet?.meals || [];
  const exerciseDone = dayLog?.exercise?.done || false;

  const handleWaterAdd = async () => {
    const newVal = Math.min(water + 1, waterGoal);
    useAppStore.setState(prev => ({
      dayLog: { ...prev.dayLog, diet: { ...prev.dayLog?.diet, waterGlasses: newVal } }
    }));
    await patch(`/api/day/${activeDate}/diet`, { waterGlasses: newVal });
    toast("💧 Water logged!", "success");
  };

  const scoreColor = score >= 75 ? "var(--color-success)" : score >= 40 ? "var(--color-warning)" : "var(--color-danger)";
  const scoreLabel = score >= 75 ? "Great day!" : score >= 40 ? "Keep pushing" : "Let's go!";

  return (
    <PageWrapper className="space-y-6 pb-8">
      {/* ─── Header ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-text-1">{greeting}, {firstName}</h1>
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
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand/5 via-transparent to-success/3" />
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing value={score} max={100} size={100} color={scoreColor} />
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-text-3 font-medium uppercase tracking-widest mb-1">Day Score</p>
            <p className="text-2xl font-bold text-text-1">{scoreLabel}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="pill bg-surface-3 text-text-2 border border-border text-xs">
                <BookOpen className="w-3 h-3 mr-1" /> {Math.floor(studyMins / 60)}h {studyMins % 60}m study
              </span>
              <span className="pill bg-surface-3 text-text-2 border border-border text-xs">
                <Droplets className="w-3 h-3 mr-1" /> {water}/{waterGoal} water
              </span>
              <span className="pill bg-surface-3 text-text-2 border border-border text-xs">
                <Target className="w-3 h-3 mr-1" /> {routineTotal}/9 routine
              </span>
            </div>
          </div>
          <Link href="/review" className="btn-primary text-sm shrink-0 hidden sm:flex gap-2">
            <Sparkles className="w-4 h-4" /> Evening Review
          </Link>
        </div>
      </div>

      {/* ─── Quick Nav Grid ──────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <QuickNavCard href="/timetable" icon={CalendarDays} label="Timetable"
          value={`${ttDone}/${timetable.length} blocks`}
          sublabel={timetable.length ? `${timetable.filter(b => b.status === "planned").length} remaining` : "Plan your day"}
          color="#6366f1" delay={0.05} />
        <QuickNavCard href="/routine" icon={Sun} label="Routine"
          value={`${routineTotal}/9 done`}
          sublabel={`${morningDone}/6 morning · ${nightDone}/3 night`}
          color="#f59e0b" delay={0.1} />
        <QuickNavCard href="/sessions" icon={Brain} label="Study"
          value={`${Math.floor(studyMins / 60)}h ${studyMins % 60}m`}
          sublabel={`${sessions.length} session${sessions.length !== 1 ? "s" : ""} logged`}
          color="#8b5cf6" delay={0.15} />
        <QuickNavCard href="/diet" icon={Apple} label="Diet"
          value={`${meals.length} meals`}
          sublabel={`${water}/${waterGoal} glasses water`}
          color="#10b981" delay={0.2} />
        <QuickNavCard href="/habits" icon={CheckCircle2} label="Habits"
          value={`${habitsDone}/${habits.length} done`}
          sublabel={habits.length ? `${habits.length - habitsDone} left today` : "No habits set"}
          color="#ec4899" delay={0.25} />
        <QuickNavCard href="/analytics" icon={TrendingUp} label="Analytics"
          value="View insights"
          sublabel="Trends & patterns"
          color="#0ea5e9" delay={0.3} />
      </div>

      {/* ─── Water Quick Add ─────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-water" />
            <h3 className="font-bold text-text-1">Water</h3>
          </div>
          <button onClick={handleWaterAdd}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-water/15 text-water hover:bg-water/25 transition-colors">
            + Add Glass
          </button>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: waterGoal }).map((_, i) => (
            <motion.div key={i} initial={false}
              animate={{ backgroundColor: i < water ? "#0ea5e9" : "var(--color-surface-3)" }}
              className="h-2.5 flex-1 rounded-full transition-colors cursor-pointer"
              onClick={() => {
                const val = i === water - 1 ? i : i + 1;
                useAppStore.setState(p => ({ dayLog: { ...p.dayLog, diet: { ...p.dayLog?.diet, waterGlasses: val } } }));
                patch(`/api/day/${activeDate}/diet`, { waterGlasses: val });
              }}
            />
          ))}
        </div>
        {water >= waterGoal && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-success font-medium mt-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Hydration goal hit!
          </motion.p>
        )}
      </div>

      {/* ─── Today's Timetable Preview ───────────── */}
      {timetable.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-text-1">Today's Schedule</h3>
            <Link href="/timetable" className="text-xs text-brand font-medium hover:underline flex items-center gap-1">
              Full view <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {timetable.slice(0, 6).map((block, i) => {
              const isDone = block.status === "done";
              const catColors = { study: "#6366f1", exercise: "#10b981", meal: "#f59e0b", routine: "#8b5cf6", break: "#94a3b8", personal: "#ec4899" };
              const c = catColors[block.category] || "#6366f1";
              return (
                <motion.div key={block._id || i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={`shrink-0 w-36 p-3 rounded-xl border transition-opacity ${isDone ? "opacity-50" : ""}`}
                  style={{ borderColor: c + "40", backgroundColor: c + "10" }}>
                  <p className="text-[10px] font-mono font-medium" style={{ color: c }}>{block.startTime}–{block.endTime}</p>
                  <p className={`text-sm font-semibold mt-0.5 leading-tight truncate ${isDone ? "line-through" : ""}`} style={{ color: c }}>{block.title}</p>
                  {isDone && <CheckCircle2 className="w-3 h-3 mt-1" style={{ color: c }} />}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Study Quick Start ───────────────────── */}
      <Link href="/sessions" className="card p-5 flex items-center gap-4 group hover:border-brand/40 transition-all">
        <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
          <Play className="w-6 h-6 text-brand" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-text-1">Start a Study Session</p>
          <p className="text-xs text-text-3 mt-0.5">Deep work timer with focus lock mode</p>
        </div>
        <ChevronRight className="w-5 h-5 text-text-3 group-hover:text-brand transition-colors" />
      </Link>

      {/* ─── Mobile Evening Review ───────────────── */}
      <Link href="/review" className="sm:hidden card p-4 flex items-center gap-3 bg-linear-to-r from-brand/10 to-success/10 border-brand/20">
        <Sparkles className="w-5 h-5 text-brand" />
        <div className="flex-1">
          <p className="font-bold text-text-1 text-sm">Evening Review</p>
          <p className="text-[10px] text-text-3">Reflect, score, and plan tomorrow</p>
        </div>
        <ChevronRight className="w-4 h-4 text-text-3" />
      </Link>
    </PageWrapper>
  );
}
