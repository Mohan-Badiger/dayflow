"use client";
import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { useInvalidateDayLog } from "@/hooks/useTimetable";
import {
  Sun, Moon, Check, Sunrise, Dumbbell, Brain, Droplets,
  BookOpen, Smartphone, Bed, ListChecks, Sparkles, Clock,
  Eye, ChevronDown, AlertTriangle, CheckCircle2,
  Heart, BedDouble, Footprints, Wind, Coffee,
} from "lucide-react";

/* ── Morning items — `id` not `key` to avoid React spread warning ── */
const MORNING_ITEMS = [
  { id: "exercise", icon: Dumbbell, label: "Exercise / Workout", sub: "Strength or cardio — 30+ min", color: "#10b981" },
  { id: "meditation", icon: Wind, label: "Sunlight + Deep Breathing", sub: "15–20 min outside, no phone", color: "#f59e0b" },
  { id: "coldShower", icon: Droplets, label: "Hydrate + Cold Shower", sub: "1–2 glasses water, cold shower", color: "#0ea5e9" },
  { id: "breakfast", icon: Coffee, label: "Healthy Breakfast", sub: "Eggs, nuts, seeds — no junk", color: "#f59e0b" },
  { id: "reviewedPlan", icon: ListChecks, label: "Review Today's Plan", sub: "Know what you're doing today", color: "#6366f1" },
  { id: "noPhoneFirstHour", icon: Smartphone, label: "No Phone First Hour", sub: "Protect your morning focus", color: "#ef4444" },
];

const NIGHT_ITEMS = [
  { id: "reviewedDay", icon: Eye, label: "Review Today's Wins", sub: "What went well, what to improve", color: "#8b5cf6" },
  { id: "plannedTomorrow", icon: ListChecks, label: "Plan Tomorrow", sub: "Clarity = no wasted morning", color: "#6366f1" },
  { id: "readingOrLearning", icon: BookOpen, label: "Read / Stretch / Calm", sub: "No doom scrolling before bed", color: "#10b981" },
];

const EXERCISE_SCHEDULE = [
  { day: "Mon / Wed / Fri", type: "Strength", accent: "#10b981", items: ["Push-ups — 3 sets", "Squats — 3 sets", "Lunges — 3 sets", "Plank — 3 rounds", "Pull-ups if possible"] },
  { day: "Tue / Thu / Sat", type: "Cardio", accent: "#0ea5e9", items: ["Running or brisk walking", "Sprint intervals", "Stretching"] },
  { day: "Sunday", type: "Rest", accent: "#8b5cf6", items: ["Rest or light walking"] },
];

const SLEEP_TIPS = [
  "Aim for 7–9 hours every night",
  "Sleep before 11 PM regularly",
  "No screens 1 hour before bed",
  "Light stretching or reading to wind down",
  "Your body recovers and rebuilds during deep sleep",
];

const REDUCE = ["Smoking", "Alcohol", "Too much junk food", "Sleeping late daily", "Doom scrolling"];

/* ═══════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════ */
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
  const invalidateDayLog = useInvalidateDayLog();

  useEffect(() => { fetchDayLog(activeDate); }, [activeDate]);

  useEffect(() => {
    if (dayLog?.routine) {
      if (dayLog.routine.morningChecklist) setMorning(p => ({ ...p, ...dayLog.routine.morningChecklist }));
      if (dayLog.routine.nightChecklist) setNight(p => ({ ...p, ...dayLog.routine.nightChecklist }));
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
    fetchDayLog(activeDate);
    invalidateDayLog(activeDate);
  }, [activeDate, patch, fetchDayLog, invalidateDayLog]);

  const toggleM = (id) => {
    const v = !morning[id];
    setMorning(p => ({ ...p, [id]: v }));
    save({ morningChecklist: { [id]: v } });
    if (v) toast("Nice! ✓", "success");
  };
  const toggleN = (id) => {
    const v = !night[id];
    setNight(p => ({ ...p, [id]: v }));
    save({ nightChecklist: { [id]: v } });
    if (v) toast("Done! ✓", "success");
  };
  const setTime = (f, v) => {
    if (f === "wake") { setWakeTime(v); save({ wakeTime: v }); }
    else if (f === "sleep") { setSleepTime(v); save({ sleepTime: v }); }
    else { setScreenOff(v); save({ nightChecklist: { screenOffBy: v } }); }
  };

  const mDone = Object.values(morning).filter(v => v === true).length;
  const nDone = Object.values(night).filter(v => v === true).length;
  const total = mDone + nDone;
  const pct = Math.round((total / 9) * 100);

  const sleepH = (() => {
    const [wh, wm] = wakeTime.split(":").map(Number);
    const [sh, sm] = sleepTime.split(":").map(Number);
    let d = (wh * 60 + wm) - (sh * 60 + sm);
    if (d < 0) d += 1440;
    if (d > 720) d = 1440 - d;
    return (d / 60).toFixed(1);
  })();

  const [exOpen, setExOpen] = useState(false);
  const [slOpen, setSlOpen] = useState(false);

  return (
    <PageWrapper className="space-y-6 pb-10">

      {/* ════ HERO ════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-brand/8 via-transparent to-success/5" />
        <div className="relative p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-6">
          {/* ring */}
          <div className="relative w-25 h-25 shrink-0">
            <svg width={100} height={100} className="-rotate-90">
              <circle cx={50} cy={50} r={42} fill="none" stroke="var(--color-surface-3)" strokeWidth={7} />
              <motion.circle cx={50} cy={50} r={42} fill="none"
                stroke={pct >= 80 ? "var(--color-success)" : pct >= 45 ? "var(--color-warning)" : "var(--color-brand)"}
                strokeWidth={7} strokeLinecap="round"
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 * (1 - total / 9) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ strokeDasharray: 264 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-text-1">{pct}%</span>
              <span className="text-[9px] text-text-3 font-bold uppercase tracking-widest">done</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-1">Daily Routine</h1>
            <p className="text-sm text-text-3">
              {total === 9 ? "Perfect day! Every task done 🔥" : `${total} of 9 tasks complete — ${9 - total} remaining`}
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-surface-3 text-text-2 border border-border">
                <Bed className="w-3 h-3" /> {sleepH}h sleep
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-surface-3 text-text-2 border border-border">
                <Clock className="w-3 h-3" /> Wake {wakeTime}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-surface-3 text-text-2 border border-border">
                <Sun className="w-3 h-3 text-warning" /> {mDone}/6
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-surface-3 text-text-2 border border-border">
                <Moon className="w-3 h-3 text-brand" /> {nDone}/3
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ════ TIME PICKERS ════ */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Sunrise, label: "Wake", value: wakeTime, field: "wake", color: "#f59e0b" },
          { icon: Smartphone, label: "Screens Off", value: screenOff, field: "screen", color: "#ef4444" },
          { icon: Moon, label: "Sleep", value: sleepTime, field: "sleep", color: "#8b5cf6" },
        ].map(t => (
          <div key={t.field} className="card p-3 flex items-center gap-2.5 rounded-sm">
            <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: t.color + "20" }}>
              <t.icon className="w-4 h-4" style={{ color: t.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-text-3 font-bold uppercase tracking-wider">{t.label}</p>
              <input type="time" value={t.value} onChange={e => setTime(t.field, e.target.value)}
                className="bg-transparent text-text-1 font-bold text-sm outline-none w-full scheme-dark" />
            </div>
          </div>
        ))}
      </div>

      {/* ════ MORNING SECTION ════ */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-bold text-text-1 flex items-center gap-2 text-base">
            <Sun className="w-5 h-5 text-warning" /> Morning Power‑Up
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-sm"
            style={{ background: mDone === 6 ? "var(--color-success)" : "var(--color-surface-3)", color: mDone === 6 ? "#fff" : "var(--color-text-2)" }}>
            {mDone}/6
          </span>
        </div>
        <div className="h-1.5 rounded-sm bg-surface-3 overflow-hidden">
          <motion.div animate={{ width: `${(mDone / 6) * 100}%` }} className="h-full rounded-sm bg-linear-to-r from-warning to-success" />
        </div>
        <div className="space-y-1.5">
          {MORNING_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const checked = morning[item.id];
            return (
              <motion.button key={item.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => toggleM(item.id)}
                className={`group w-full flex items-center gap-3 p-3 rounded-sm border text-left transition-all
                  ${checked ? "bg-surface-2 border-border-2" : "bg-surface border-border hover:border-border-2 hover:bg-surface-2/50"}`}
              >
                <motion.div
                  animate={{ backgroundColor: checked ? item.color : "var(--color-surface-3)" }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                >
                  {checked
                    ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="w-4 h-4 text-white" /></motion.div>
                    : <Icon className="w-4 h-4 text-text-3" />}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${checked ? "text-text-3 line-through" : "text-text-1"}`}>{item.label}</p>
                  <p className="text-[11px] text-text-3 mt-0.5 truncate">{item.sub}</p>
                </div>
                {checked && <Sparkles className="w-3.5 h-3.5 text-warning shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ════ NIGHT SECTION ════ */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="font-bold text-text-1 flex items-center gap-2 text-base">
            <Moon className="w-5 h-5 text-brand" /> Night Wind‑Down
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-sm"
            style={{ background: nDone === 3 ? "var(--color-success)" : "var(--color-surface-3)", color: nDone === 3 ? "#fff" : "var(--color-text-2)" }}>
            {nDone}/3
          </span>
        </div>
        <div className="h-1.5 rounded-sm bg-surface-3 overflow-hidden">
          <motion.div animate={{ width: `${(nDone / 3) * 100}%` }} className="h-full rounded-sm bg-linear-to-r from-brand to-brand-mid" />
        </div>
        <div className="space-y-1.5">
          {NIGHT_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const checked = night[item.id];
            return (
              <motion.button key={item.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => toggleN(item.id)}
                className={`group w-full flex items-center gap-3 p-3 rounded-sm border text-left transition-all
                  ${checked ? "bg-surface-2 border-border-2" : "bg-surface border-border hover:border-border-2 hover:bg-surface-2/50"}`}
              >
                <motion.div
                  animate={{ backgroundColor: checked ? item.color : "var(--color-surface-3)" }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                >
                  {checked
                    ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="w-4 h-4 text-white" /></motion.div>
                    : <Icon className="w-4 h-4 text-text-3" />}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${checked ? "text-text-3 line-through" : "text-text-1"}`}>{item.label}</p>
                  <p className="text-[11px] text-text-3 mt-0.5 truncate">{item.sub}</p>
                </div>
                {checked && <Sparkles className="w-3.5 h-3.5 text-warning shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ════ COMPLETION ════ */}
      <AnimatePresence>
        {total === 9 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="card p-6 text-center bg-linear-to-r from-success/10 to-brand/10 border-success/30">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-lg font-bold text-text-1">Perfect Routine Day!</h3>
            <p className="text-text-3 text-sm mt-1">Consistency compounds. Keep going.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ EXERCISE SCHEDULE ════ */}
      <div className="card overflow-hidden rounded-sm">
        <button onClick={() => setExOpen(!exOpen)}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-3/30 transition-colors">
          <div className="w-9 h-9 rounded-sm bg-emerald-500/15 flex items-center justify-center shrink-0">
            <Dumbbell className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <span className="flex-1 font-bold text-sm text-text-1">Exercise Schedule</span>
          <motion.div animate={{ rotate: exOpen ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-text-3" /></motion.div>
        </button>
        <AnimatePresence initial={false}>
          {exOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {EXERCISE_SCHEDULE.map((g, i) => (
                  <div key={i} className="rounded-sm bg-surface-3/50 p-3">
                    <p className="text-xs font-bold mb-1.5" style={{ color: g.accent }}>{g.day} — {g.type}</p>
                    <ul className="space-y-1">{g.items.map((x, j) => (
                      <li key={j} className="text-sm text-text-2 flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: g.accent }} />{x}
                      </li>
                    ))}</ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════ SLEEP PROTOCOL ════ */}
      <div className="card overflow-hidden rounded-sm">
        <button onClick={() => setSlOpen(!slOpen)}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-3/30 transition-colors">
          <div className="w-9 h-9 rounded-sm bg-violet-500/15 flex items-center justify-center shrink-0">
            <BedDouble className="w-4.5 h-4.5 text-violet-400" />
          </div>
          <span className="flex-1 font-bold text-sm text-text-1">Sleep Protocol</span>
          <motion.div animate={{ rotate: slOpen ? 180 : 0 }}><ChevronDown className="w-4 h-4 text-text-3" /></motion.div>
        </button>
        <AnimatePresence initial={false}>
          {slOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <ul className="px-4 pb-4 space-y-1.5">{SLEEP_TIPS.map((x, i) => (
                <li key={i} className="text-sm text-text-2 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-violet-400 shrink-0" />{x}
                </li>
              ))}</ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ════ REDUCE ════ */}
      <div className="rounded-sm bg-danger/5 border border-danger/10 p-4">
        <p className="text-sm font-bold text-danger flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-4 h-4" /> Reduce These
        </p>
        <div className="flex flex-wrap gap-2">
          {REDUCE.map((r, i) => (
            <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-sm bg-danger/8 text-danger/80 border border-danger/10">{r}</span>
          ))}
        </div>
      </div>

      {/* ════ WHAT MATTERS ════ */}
      <div className="card p-5 relative overflow-hidden rounded-sm">
        <div className="absolute inset-0 bg-linear-to-br from-brand/5 via-transparent to-transparent" />
        <div className="relative">
          <h2 className="font-bold text-text-1 flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-danger" /> What Actually Matters
          </h2>
          <div className="space-y-2.5">
            {[
              { n: 1, t: "Sleep (7–9 hrs)", ic: BedDouble, pct: 100 },
              { n: 2, t: "Strength exercise", ic: Dumbbell, pct: 80 },
              { n: 3, t: "Healthy body fat", ic: Heart, pct: 60 },
              { n: 4, t: "Stress reduction", ic: Brain, pct: 40 },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-sm bg-brand/15 flex items-center justify-center text-[10px] font-black text-brand shrink-0">{p.n}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-text-1 flex items-center gap-1.5">
                      <p.ic className="w-3.5 h-3.5 text-text-3" />{p.t}
                    </span>
                    <span className="text-[10px] text-text-3 font-mono">{p.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-sm bg-surface-3 overflow-hidden">
                    <motion.div className="h-full rounded-sm bg-brand" initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
