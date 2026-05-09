"use client";
import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Check, Sunrise, Coffee, Dumbbell, Brain,
  Droplets, BookOpen, Smartphone, Bed, ListChecks,
  Sparkles, TrendingUp, ChevronRight, Clock, Zap, Eye
} from "lucide-react";

// ─── Animated Check Item ────────────────────────────────
function RoutineItem({ icon: Icon, label, sublabel, checked, onChange, color = "var(--color-brand)", delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 25 }}
      onClick={onChange}
      className={`group flex items-center gap-4 w-full p-4 rounded-2xl border transition-all duration-200 text-left
        ${checked
          ? "bg-surface border-border-2"
          : "bg-surface border-border hover:border-border-2"
        }`}
    >
      <motion.div
        animate={{ scale: checked ? 1 : 0.85, backgroundColor: checked ? color : "var(--color-surface-3)" }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      >
        {checked ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}>
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        ) : (
          <Icon className="w-5 h-5 text-text-3 group-hover:text-text-2 transition-colors" />
        )}
      </motion.div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm transition-all ${checked ? "text-text-3 line-through" : "text-text-1"}`}>{label}</p>
        {sublabel && <p className="text-xs text-text-3 mt-0.5">{sublabel}</p>}
      </div>
      {checked && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0">
          <Sparkles className="w-4 h-4 text-warning" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Time Picker Card ───────────────────────────────────
function TimePicker({ icon: Icon, label, value, onChange, color }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "20" }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-3 font-medium uppercase tracking-wider">{label}</p>
        <input
          type="time"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="bg-transparent text-text-1 font-bold text-lg outline-none w-full mt-0.5 scheme-dark"
        />
      </div>
    </div>
  );
}

// ─── Score Ring ──────────────────────────────────────────
function ScoreRing({ score, max, size = 80, label }) {
  const pct = max > 0 ? score / max : 0;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = pct >= 0.8 ? "var(--color-success)" : pct >= 0.5 ? "var(--color-warning)" : "var(--color-danger)";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={6} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-700 ease-out" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black text-text-1">{score}</span>
        </div>
      </div>
      <span className="text-xs text-text-3 font-medium">{label}</span>
    </div>
  );
}

// ─── Morning items config ───────────────────────────────
const MORNING_ITEMS = [
  { key: "exercise", icon: Dumbbell, label: "Exercise", sublabel: "Move your body for 20+ min", color: "#10b981" },
  { key: "meditation", icon: Brain, label: "Meditation", sublabel: "5-10 min mindfulness", color: "#8b5cf6" },
  { key: "coldShower", icon: Droplets, label: "Cold Shower", sublabel: "Shock your system awake", color: "#0ea5e9" },
  { key: "breakfast", icon: Coffee, label: "Healthy Breakfast", sublabel: "Fuel for the morning grind", color: "#f59e0b" },
  { key: "reviewedPlan", icon: ListChecks, label: "Reviewed Today's Plan", sublabel: "Know what you're attacking", color: "#6366f1" },
  { key: "noPhoneFirstHour", icon: Smartphone, label: "No Phone First Hour", sublabel: "Protect your morning focus", color: "#ef4444" },
];

const NIGHT_ITEMS = [
  { key: "reviewedDay", icon: Eye, label: "Reviewed Today", sublabel: "Reflect on wins & lessons", color: "#8b5cf6" },
  { key: "plannedTomorrow", icon: ListChecks, label: "Planned Tomorrow", sublabel: "Clarity = no wasted morning", color: "#6366f1" },
  { key: "readingOrLearning", icon: BookOpen, label: "Reading / Learning", sublabel: "30 min before bed", color: "#10b981" },
];

export default function RoutinePage() {
  const [morning, setMorning] = useState({
    exercise: false, meditation: false, coldShower: false,
    breakfast: false, reviewedPlan: false, noPhoneFirstHour: false,
  });
  const [night, setNight] = useState({
    reviewedDay: false, plannedTomorrow: false, readingOrLearning: false,
  });
  const [wakeTime, setWakeTime] = useState("06:30");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [screenOff, setScreenOff] = useState("22:30");
  const [saving, setSaving] = useState(false);

  const { patch } = useApi();
  const { add: toast } = useToast();
  const { activeDate, dayLog, fetchDayLog } = useAppStore();

  useEffect(() => { fetchDayLog(activeDate); }, [activeDate]);

  useEffect(() => {
    if (dayLog?.routine) {
      if (dayLog.routine.morningChecklist) setMorning(prev => ({ ...prev, ...dayLog.routine.morningChecklist }));
      if (dayLog.routine.nightChecklist) setNight(prev => ({ ...prev, ...dayLog.routine.nightChecklist }));
      if (dayLog.routine.wakeTime) setWakeTime(dayLog.routine.wakeTime);
      if (dayLog.routine.sleepTime) setSleepTime(dayLog.routine.sleepTime);
      if (dayLog.routine.nightChecklist?.screenOffBy) setScreenOff(dayLog.routine.nightChecklist.screenOffBy);
    }
  }, [dayLog]);

  const save = useCallback(async (data) => {
    setSaving(true);
    await patch(`/api/day/${activeDate}/routine`, data);
    setSaving(false);
  }, [activeDate, patch]);

  const toggleMorning = (key) => {
    const val = !morning[key];
    setMorning(prev => ({ ...prev, [key]: val }));
    save({ morningChecklist: { [key]: val } });
    if (val) toast("Nice one! ✓", "success");
  };

  const toggleNight = (key) => {
    const val = !night[key];
    setNight(prev => ({ ...prev, [key]: val }));
    save({ nightChecklist: { [key]: val } });
    if (val) toast("Done! ✓", "success");
  };

  const handleTime = (field, value) => {
    if (field === "wakeTime") { setWakeTime(value); save({ wakeTime: value }); }
    else if (field === "sleepTime") { setSleepTime(value); save({ sleepTime: value }); }
    else { setScreenOff(value); save({ nightChecklist: { screenOffBy: value } }); }
  };

  // ─── Computed Scores ──────────────────────────────
  const morningDone = Object.values(morning).filter(Boolean).length;
  const nightDone = Object.values(night).filter(Boolean).length;
  const totalDone = morningDone + nightDone;
  const totalItems = 9;

  const currentHour = new Date().getHours();
  const phase = currentHour < 12 ? "morning" : currentHour < 17 ? "afternoon" : "evening";
  const greeting = phase === "morning" ? "Rise & Conquer" : phase === "afternoon" ? "Stay Locked In" : "Wind Down Right";
  const greetIcon = phase === "morning" ? Sunrise : phase === "afternoon" ? Zap : Moon;
  const GreetIcon = greetIcon;

  const sleepHours = (() => {
    if (!wakeTime || !sleepTime) return "—";
    const [wh, wm] = wakeTime.split(":").map(Number);
    const [sh, sm] = sleepTime.split(":").map(Number);
    let diff = (wh * 60 + wm) - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60;
    if (diff > 12 * 60) diff = 24 * 60 - diff;
    return (diff / 60).toFixed(1);
  })();

  return (
    <PageWrapper className="space-y-6 pb-8">
      {/* ─── Hero Header ──────────────────────────── */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand/8 via-transparent to-success/5" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="flex gap-4">
            <ScoreRing score={morningDone} max={6} label="Morning" />
            <ScoreRing score={nightDone} max={3} label="Night" />
            <ScoreRing score={totalDone} max={totalItems} label="Total" size={90} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <GreetIcon className="w-5 h-5 text-brand" />
              <span className="text-xs font-bold text-brand uppercase tracking-widest">{greeting}</span>
            </div>
            <h1 className="text-3xl font-bold text-text-1">Daily Routine</h1>
            <p className="text-text-3 mt-1 font-medium">
              {totalDone === totalItems
                ? "Perfect day! Every habit checked. 🔥"
                : `${totalDone}/${totalItems} complete — ${totalItems - totalDone} left to crush.`}
            </p>
            {sleepHours !== "—" && (
              <div className="flex items-center gap-3 mt-3">
                <span className="pill bg-surface-3 text-text-2 border border-border">
                  <Bed className="w-3 h-3 mr-1" /> ~{sleepHours}h sleep
                </span>
                <span className="pill bg-surface-3 text-text-2 border border-border">
                  <Clock className="w-3 h-3 mr-1" /> Wake {wakeTime}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Time Controls ────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TimePicker icon={Sunrise} label="Wake Up" value={wakeTime} onChange={v => handleTime("wakeTime", v)} color="#f59e0b" />
        <TimePicker icon={Smartphone} label="Screens Off" value={screenOff} onChange={v => handleTime("screenOff", v)} color="#ef4444" />
        <TimePicker icon={Moon} label="Sleep" value={sleepTime} onChange={v => handleTime("sleepTime", v)} color="#8b5cf6" />
      </div>

      {/* ─── Morning Section ──────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-bold text-text-1">Morning Power-Up</h2>
          </div>
          <motion.div
            key={morningDone}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: morningDone === 6 ? "var(--color-success)" : "var(--color-surface-3)",
              color: morningDone === 6 ? "white" : "var(--color-text-2)"
            }}
          >
            {morningDone}/6
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
          <motion.div
            animate={{ width: `${(morningDone / 6) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="h-full rounded-full bg-linear-to-r from-warning to-success"
          />
        </div>

        <div className="space-y-2">
          {MORNING_ITEMS.map((item, i) => (
            <RoutineItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              sublabel={item.sublabel}
              checked={morning[item.key]}
              onChange={() => toggleMorning(item.key)}
              color={item.color}
              delay={i * 0.04}
            />
          ))}
        </div>
      </div>

      {/* ─── Night Section ────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-bold text-text-1">Night Wind-Down</h2>
          </div>
          <motion.div
            key={nightDone}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: nightDone === 3 ? "var(--color-success)" : "var(--color-surface-3)",
              color: nightDone === 3 ? "white" : "var(--color-text-2)"
            }}
          >
            {nightDone}/3
          </motion.div>
        </div>

        <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
          <motion.div
            animate={{ width: `${(nightDone / 3) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="h-full rounded-full bg-linear-to-r from-brand to-brand-mid"
          />
        </div>

        <div className="space-y-2">
          {NIGHT_ITEMS.map((item, i) => (
            <RoutineItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              sublabel={item.sublabel}
              checked={night[item.key]}
              onChange={() => toggleNight(item.key)}
              color={item.color}
              delay={i * 0.04}
            />
          ))}
        </div>
      </div>

      {/* ─── Completion Banner ────────────────────── */}
      <AnimatePresence>
        {totalDone === totalItems && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card p-6 text-center bg-linear-to-r from-success/10 to-brand/10 border-success/30"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-4xl mb-2"
            >
              🏆
            </motion.div>
            <h3 className="text-xl font-bold text-text-1">Perfect Routine Day!</h3>
            <p className="text-text-3 text-sm mt-1">Every morning and night habit checked. Consistency compounds.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
