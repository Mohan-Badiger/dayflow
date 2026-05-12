"use client";
import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Check, Sunrise, Coffee, Dumbbell, Brain, Droplets,
  BookOpen, Smartphone, Bed, ListChecks, Sparkles, Clock, Zap,
  Eye, Shield, ChevronDown, AlertTriangle, CheckCircle2, Leaf,
  Heart, Target, BedDouble,
} from "lucide-react";

const anim = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.25, 0.46, 0.45, 0.94] },
});

/* ── Interactive check item (saves to DB) ── */
function RoutineItem({ icon: Icon, label, sublabel, checked, onChange, color, delay = 0 }) {
  return (
    <motion.button {...anim(delay)} onClick={onChange}
      className={`group flex items-center gap-4 w-full p-4 rounded-2xl border transition-all text-left
        ${checked ? "bg-surface border-border-2" : "bg-surface border-border hover:border-border-2"}`}>
      <motion.div
        animate={{ scale: checked ? 1 : 0.85, backgroundColor: checked ? color : "var(--color-surface-3)" }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
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

/* ── Time picker ── */
function TimePicker({ icon: Icon, label, value, onChange, color }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "20" }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-3 font-medium uppercase tracking-wider">{label}</p>
        <input type="time" value={value} onChange={e => onChange(e.target.value)}
          className="bg-transparent text-text-1 font-bold text-lg outline-none w-full mt-0.5 scheme-dark" />
      </div>
    </div>
  );
}

/* ── Score Ring ── */
function ScoreRing({ score, max, size = 80, label }) {
  const pct = max > 0 ? score / max : 0;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const color = pct >= 0.8 ? "var(--color-success)" : pct >= 0.5 ? "var(--color-warning)" : "var(--color-danger)";
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={6} />
          <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
            strokeLinecap="round" initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - pct) }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            style={{ strokeDasharray: circ }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black text-text-1">{score}</span>
        </div>
      </div>
      <span className="text-xs text-text-3 font-medium">{label}</span>
    </div>
  );
}

/* ── Expandable guide section ── */
function GuideSection({ title, icon: Icon, accent, gradient, items, defaultOpen = false, delay = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div {...anim(delay)} className="card overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left group transition-colors hover:bg-surface-3/40">
        <div className={`w-11 h-11 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center shrink-0 ring-1 ring-white/5`}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <h3 className="flex-1 font-bold text-text-1">{title}</h3>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-5 h-5 text-text-3" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-5 pb-5 space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-text-2">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: accent }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Checklist items config ── */
const MORNING_ITEMS = [
  { key: "exercise", icon: Dumbbell, label: "Exercise / Strength Training", sublabel: "Push-ups, squats, lunges, plank — 30+ min", color: "#10b981" },
  { key: "meditation", icon: Brain, label: "Sunlight + Deep Breathing", sublabel: "15-20 min outside, 5 deep breaths", color: "#f59e0b" },
  { key: "coldShower", icon: Droplets, label: "Water + Cold Shower", sublabel: "1-2 glasses water + cold shower for alertness", color: "#0ea5e9" },
  { key: "breakfast", icon: Coffee, label: "Testosterone-Support Breakfast", sublabel: "Eggs, banana, nuts, seeds — no junk", color: "#f59e0b" },
  { key: "reviewedPlan", icon: ListChecks, label: "Reviewed Today's Plan", sublabel: "Know what you're attacking today", color: "#6366f1" },
  { key: "noPhoneFirstHour", icon: Smartphone, label: "No Phone First Hour", sublabel: "Protect your morning dopamine", color: "#ef4444" },
];

const NIGHT_ITEMS = [
  { key: "reviewedDay", icon: Eye, label: "Reviewed Today + Wins", sublabel: "Reflect on what went well", color: "#8b5cf6" },
  { key: "plannedTomorrow", icon: ListChecks, label: "Planned Tomorrow", sublabel: "Clarity = no wasted morning", color: "#6366f1" },
  { key: "readingOrLearning", icon: BookOpen, label: "Reading / Stretching / Calm", sublabel: "Wind down — no doom scrolling", color: "#10b981" },
];

/* ── Guide data matching diet page ── */
const GUIDES = [
  {
    title: "Exercise Schedule (Mon-Sun)", icon: Dumbbell, accent: "#10b981",
    gradient: "from-emerald-500/15 to-green-500/8",
    items: [
      "Mon / Wed / Fri — Strength: Push-ups 3 sets, Squats 3 sets, Lunges 3 sets, Plank 3 rounds, Pull-ups",
      "Tue / Thu / Sat — Cardio: Running, sprint intervals, stretching",
      "Sunday — Rest or light walking",
    ],
  },
  {
    title: "Breakfast Options", icon: Coffee, accent: "#f59e0b",
    gradient: "from-amber-500/15 to-orange-500/8",
    items: [
      "Option 1: 3 eggs + banana + milk",
      "Option 2: Oats with nuts + peanut butter + fruit",
      "Option 3 (Veg): Sprouts + paneer + dry fruits",
      "Daily must-add: 4 soaked almonds, 2 walnuts, pumpkin seeds",
    ],
  },
  {
    title: "Mid-Day Nutrition", icon: Leaf, accent: "#8b5cf6",
    gradient: "from-violet-500/15 to-purple-500/8",
    items: [
      "10:30 AM — Fruit: Pomegranate, apple, watermelon, banana",
      "Lunch — Rice/roti + dal + veggies + chicken/fish/paneer + curd",
      "Best veggies: Spinach, broccoli, beans, carrot",
      "4:30 PM — Peanuts/chikki, fruit, green tea",
    ],
  },
  {
    title: "Evening & Night Rules", icon: Moon, accent: "#6366f1",
    gradient: "from-indigo-500/15 to-blue-500/8",
    items: [
      "5:30-6:30 PM — Walking, sports, cycling, or light gym",
      "Dinner: Keep lighter than lunch — roti + sabji, soup + eggs",
      "9 PM — Light stretching, reading, calm music",
      "Sleep before 11 PM — 7-9 hours for max testosterone production",
    ],
  },
];

const REDUCE_LIST = ["Smoking", "Alcohol", "Too much junk food", "Sleeping late daily", "Excess doom scrolling"];

const PRIORITY_STACK = [
  { n: 1, text: "Sleep (7-9 hrs)", icon: BedDouble },
  { n: 2, text: "Strength exercise", icon: Dumbbell },
  { n: 3, text: "Healthy body fat", icon: Heart },
  { n: 4, text: "Good nutrition", icon: Leaf },
  { n: 5, text: "Stress reduction", icon: Brain },
];

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════ */
export default function RoutinePage() {
  const [morning, setMorning] = useState({
    exercise: false, meditation: false, coldShower: false,
    breakfast: false, reviewedPlan: false, noPhoneFirstHour: false,
  });
  const [night, setNight] = useState({
    reviewedDay: false, plannedTomorrow: false, readingOrLearning: false,
  });
  const [wakeTime, setWakeTime] = useState("06:00");
  const [sleepTime, setSleepTime] = useState("22:30");
  const [screenOff, setScreenOff] = useState("21:30");

  const { patch } = useApi();
  const { add: toast } = useToast();
  const { activeDate, dayLog, fetchDayLog, userSettings } = useAppStore();

  useEffect(() => { fetchDayLog(activeDate); }, [activeDate]);

  useEffect(() => {
    if (dayLog?.routine) {
      if (dayLog.routine.morningChecklist) setMorning(prev => ({ ...prev, ...dayLog.routine.morningChecklist }));
      if (dayLog.routine.nightChecklist) setNight(prev => ({ ...prev, ...dayLog.routine.nightChecklist }));
      if (dayLog.routine.wakeTime) setWakeTime(dayLog.routine.wakeTime);
      else if (userSettings?.wakeTarget) setWakeTime(userSettings.wakeTarget);
      if (dayLog.routine.sleepTime) setSleepTime(dayLog.routine.sleepTime);
      else if (userSettings?.sleepTarget) setSleepTime(userSettings.sleepTarget);
      if (dayLog.routine.nightChecklist?.screenOffBy) setScreenOff(dayLog.routine.nightChecklist.screenOffBy);
    } else if (userSettings) {
      if (userSettings.wakeTarget) setWakeTime(userSettings.wakeTarget);
      if (userSettings.sleepTarget) setSleepTime(userSettings.sleepTarget);
    }
  }, [dayLog, userSettings]);

  const save = useCallback(async (data) => {
    await patch(`/api/day/${activeDate}/routine`, data);
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

  const morningDone = Object.values(morning).filter(Boolean).length;
  const nightDone = Object.values(night).filter(Boolean).length;
  const totalDone = morningDone + nightDone;
  const totalItems = 9;

  const sleepHours = (() => {
    if (!wakeTime || !sleepTime) return "—";
    const [wh, wm] = wakeTime.split(":").map(Number);
    const [sh, sm] = sleepTime.split(":").map(Number);
    let diff = (wh * 60 + wm) - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60;
    if (diff > 12 * 60) diff = 24 * 60 - diff;
    return (diff / 60).toFixed(1);
  })();

  const currentHour = new Date().getHours();
  const phase = currentHour < 12 ? "morning" : currentHour < 17 ? "afternoon" : "evening";

  return (
    <PageWrapper className="space-y-8 pb-10">
      {/* ─── Hero ─── */}
      <motion.div {...anim(0)} className="card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/8 via-transparent to-emerald-500/5" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="flex gap-4">
            <ScoreRing score={morningDone} max={6} label="Morning" />
            <ScoreRing score={nightDone} max={3} label="Night" />
            <ScoreRing score={totalDone} max={totalItems} label="Total" size={90} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Daily Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-1">Daily Routine Tracker</h1>
            <p className="text-text-3 mt-1 font-medium text-sm sm:text-base">
              {totalDone === totalItems
                ? "Perfect day! Every habit checked. 🔥"
                : `${totalDone}/${totalItems} complete — ${totalItems - totalDone} left to crush.`}
            </p>
            {sleepHours !== "—" && (
              <div className="flex flex-wrap items-center gap-2 mt-3 justify-center md:justify-start">
                <span className="pill bg-surface-3 text-text-2 border border-border text-xs">
                  <Bed className="w-3 h-3 mr-1" /> ~{sleepHours}h sleep
                </span>
                <span className="pill bg-surface-3 text-text-2 border border-border text-xs">
                  <Clock className="w-3 h-3 mr-1" /> Wake {wakeTime}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ─── Time Controls ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TimePicker icon={Sunrise} label="Wake Up" value={wakeTime} onChange={v => handleTime("wakeTime", v)} color="#f59e0b" />
        <TimePicker icon={Smartphone} label="Screens Off" value={screenOff} onChange={v => handleTime("screenOff", v)} color="#ef4444" />
        <TimePicker icon={Moon} label="Sleep" value={sleepTime} onChange={v => handleTime("sleepTime", v)} color="#8b5cf6" />
      </div>

      {/* ─── Morning Checklist ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-bold text-text-1">Morning Power-Up</h2>
          </div>
          <motion.div key={morningDone} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: morningDone === 6 ? "var(--color-success)" : "var(--color-surface-3)", color: morningDone === 6 ? "white" : "var(--color-text-2)" }}>
            {morningDone}/6
          </motion.div>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
          <motion.div animate={{ width: `${(morningDone / 6) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="h-full rounded-full bg-linear-to-r from-warning to-success" />
        </div>
        <div className="space-y-2">
          {MORNING_ITEMS.map((item, i) => (
            <RoutineItem key={item.key} icon={item.icon} label={item.label} sublabel={item.sublabel}
              checked={morning[item.key]} onChange={() => toggleMorning(item.key)} color={item.color} delay={i * 0.04} />
          ))}
        </div>
      </div>

      {/* ─── Night Checklist ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-brand" />
            <h2 className="text-lg font-bold text-text-1">Night Wind-Down</h2>
          </div>
          <motion.div key={nightDone} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: nightDone === 3 ? "var(--color-success)" : "var(--color-surface-3)", color: nightDone === 3 ? "white" : "var(--color-text-2)" }}>
            {nightDone}/3
          </motion.div>
        </div>
        <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
          <motion.div animate={{ width: `${(nightDone / 3) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="h-full rounded-full bg-linear-to-r from-brand to-brand-mid" />
        </div>
        <div className="space-y-2">
          {NIGHT_ITEMS.map((item, i) => (
            <RoutineItem key={item.key} icon={item.icon} label={item.label} sublabel={item.sublabel}
              checked={night[item.key]} onChange={() => toggleNight(item.key)} color={item.color} delay={i * 0.04} />
          ))}
        </div>
      </div>

      {/* ─── Completion Banner ─── */}
      <AnimatePresence>
        {totalDone === totalItems && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card p-6 text-center bg-linear-to-r from-success/10 to-brand/10 border-success/30">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl mb-2">🏆</motion.div>
            <h3 className="text-xl font-bold text-text-1">Perfect Routine Day!</h3>
            <p className="text-text-3 text-sm mt-1">Every morning and night habit checked. Consistency compounds.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Reference Guides (diet-style) ─── */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-text-1 flex items-center gap-2 px-1">
          <BookOpen className="w-5 h-5 text-brand" /> Quick Reference Guide
        </h2>
        <p className="text-sm text-text-3 px-1 mb-2">Your complete daily protocol at a glance.</p>
        {GUIDES.map((g, i) => (
          <GuideSection key={i} title={g.title} icon={g.icon} accent={g.accent}
            gradient={g.gradient} items={g.items} delay={0.3 + i * 0.06} />
        ))}
      </div>

      {/* ─── Reduce These ─── */}
      <motion.div {...anim(0.5)} className="rounded-xl bg-danger/5 border border-danger/10 p-5">
        <p className="text-sm font-bold text-danger flex items-center gap-1.5 mb-3">
          <AlertTriangle className="w-4 h-4" /> Reduce These
        </p>
        <div className="flex flex-wrap gap-2">
          {REDUCE_LIST.map((r, i) => (
            <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full bg-danger/8 text-danger/80 border border-danger/10">
              {r}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ─── Priority Stack ─── */}
      <motion.div {...anim(0.55)} className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand/5 via-transparent to-transparent" />
        <div className="relative">
          <h2 className="text-lg font-bold text-text-1 flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-warning" /> What Actually Matters
          </h2>
          <p className="text-sm text-text-3 mb-5">Consistency over intensity. The biggest natural gains come from:</p>
          <div className="space-y-3">
            {PRIORITY_STACK.map((p, i) => {
              const PIcon = p.icon;
              const pct = ((5 - i) / 5) * 100;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }} className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-lg bg-brand/15 flex items-center justify-center text-xs font-black text-brand shrink-0">
                    {p.n}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-text-1 flex items-center gap-1.5">
                        <PIcon className="w-3.5 h-3.5 text-text-3" /> {p.text}
                      </span>
                      <span className="text-[10px] text-text-3 font-mono">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-3 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-brand"
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.7 + i * 0.1, ease: "easeOut" }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
