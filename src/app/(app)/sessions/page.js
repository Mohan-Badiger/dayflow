"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Square, Plus, Star, Clock, Target, Brain,
  BookOpen, AlertTriangle, Flame, ChevronRight, CheckCircle2,
  RotateCcw, Zap, TrendingUp, Coffee, Trash2
} from "lucide-react";

const DURATIONS = [
  { label: "25 min", value: 25, type: "pomodoro" },
  { label: "45 min", value: 45, type: "deep" },
  { label: "60 min", value: 60, type: "deep" },
  { label: "90 min", value: 90, type: "deep" },
];

// ─── Timer Ring SVG ────────────────────────────────────
function TimerRing({ progress, size = 220, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--color-surface-3)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--color-brand)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0px 0px 8px var(--color-brand))' }}
        className="transition-all duration-1000 ease-linear" />
    </svg>
  );
}

// ─── Quality Stars ─────────────────────────────────────
function QualityStars({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange(i)}
          className={`transition-transform hover:scale-110 ${i <= value ? "text-yellow-400" : "text-slate-600"}`}>
          <Star className={`w-8 h-8 ${i <= value ? "fill-current" : ""}`} />
        </button>
      ))}
    </div>
  );
}

export default function SessionsPage() {
  const { get, post, del } = useApi();
  const { add: toast } = useToast();
  const { activeDate } = useAppStore();

  // ─── Data State ───────────────────────────────────
  const [sessions, setSessions] = useState([]);
  const [userSettings, setUserSettings] = useState({ dailyStudyGoalHours: 6 });
  const [loading, setLoading] = useState(true);

  // ─── Timer State ──────────────────────────────────
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0); // total seconds
  const [timerTopic, setTimerTopic] = useState("");
  const [timerIntention, setTimerIntention] = useState("");
  const [focusLock, setFocusLock] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // ─── Post-Session State ───────────────────────────
  const [showPostSession, setShowPostSession] = useState(false);
  const [postQuality, setPostQuality] = useState(3);
  const [postNote, setPostNote] = useState("");
  const [postAchieved, setPostAchieved] = useState(null);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Setup Modal State ────────────────────────────
  const [showSetup, setShowSetup] = useState(false);
  const [setupTopic, setSetupTopic] = useState("");
  const [setupIntention, setSetupIntention] = useState("");
  const [setupDuration, setSetupDuration] = useState(45);

  // ─── Fetch Data ───────────────────────────────────
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const data = await get(`/api/day/${activeDate}/sessions`);
    if (data) setSessions(data);
    const user = await get("/api/user");
    if (user?.settings) setUserSettings(user.settings);
    setLoading(false);
  }, [activeDate]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  // ─── Computed Values ──────────────────────────────
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const goalHours = userSettings.dailyStudyGoalHours || 6;
  const progress = Math.min(totalMinutes / (goalHours * 60), 1);

  // ─── Timer Logic ──────────────────────────────────
  const startTimer = () => {
    setTimerTopic(setupTopic);
    setTimerIntention(setupIntention);
    setTimerDuration(setupDuration * 60);
    setTimerSeconds(setupDuration * 60);
    setTimerActive(true);
    setTimerPaused(false);
    setFocusLock(true);
    setShowSetup(false);
    startTimeRef.current = new Date();

    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const togglePause = () => {
    if (timerPaused) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); handleTimerEnd(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    setTimerPaused(!timerPaused);
  };

  const endTimerEarly = () => {
    clearInterval(timerRef.current);
    const elapsed = timerDuration - timerSeconds;
    setCompletedDuration(Math.round(elapsed / 60));
    setTimerActive(false);
    setFocusLock(false);
    if (elapsed >= 60) setShowPostSession(true);
    else { toast("Session too short to log", "error"); resetTimer(); }
  };

  const handleTimerEnd = () => {
    setCompletedDuration(Math.round(timerDuration / 60));
    setTimerActive(false);
    setFocusLock(false);
    setShowPostSession(true);
    if (typeof window !== "undefined" && "Notification" in window) {
      try { new Notification("Session Complete!", { body: `${timerTopic || "Work Session"} — Time to rate it.` }); } catch { }
    }
  };

  const resetTimer = () => {
    setTimerActive(false); setTimerPaused(false); setTimerSeconds(0);
    setTimerDuration(0); setTimerTopic("");
    setTimerIntention(""); setFocusLock(false);
    setShowPostSession(false); setPostQuality(3); setPostNote("");
    setPostAchieved(null); setCompletedDuration(0); setIsSubmitting(false);
  };

  const submitPostSession = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const now = new Date();
    const start = startTimeRef.current || new Date(now.getTime() - completedDuration * 60000);
    const fmt = d => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

    const sessionData = {
      topic: timerTopic || undefined,
      startTime: fmt(start), endTime: fmt(now),
      durationMinutes: completedDuration, quality: postQuality,
      notes: [timerIntention && `Intention: ${timerIntention}`, postNote, postAchieved !== null && `Goal achieved: ${postAchieved ? "Yes" : "No"}`].filter(Boolean).join(" | "),
    };

    const res = await post(`/api/day/${activeDate}/sessions`, sessionData);
    if (res) { toast("Session logged! 🎯", "success"); fetchSessions(); }
    resetTimer();
  };

  const deleteSession = async (id) => {
    if (window.confirm("Are you sure you want to remove this session log?")) {
      await del(`/api/day/${activeDate}/sessions/${id}`);
      toast("Session removed", "success");
      fetchSessions();
    }
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const currentHour = new Date().getHours();
  const behindPace = currentHour >= 15 && totalMinutes < (goalHours * 60 * 0.5);

  // ─── FOCUS LOCK MODE ──────────────────────────────
  if (focusLock && timerActive) {
    const elapsed = timerDuration - timerSeconds;
    const pct = timerDuration > 0 ? elapsed / timerDuration : 0;
    return (
      <div className="fixed inset-0 z-100 bg-black flex flex-col items-center justify-center select-none">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-8">
          <p className="text-text-3 text-sm font-medium uppercase tracking-widest">Deep Focus</p>
          <div className="relative">
            <TimerRing progress={pct} size={280} stroke={6} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-mono font-bold text-text-1 tabular-nums">{formatTime(timerSeconds)}</span>
              <span className="text-text-3 text-sm mt-1">{timerTopic || "Focus Session"}</span>
            </div>
          </div>
          {timerTopic && <p className="text-xl font-semibold text-text-1 text-center max-w-md">{timerTopic}</p>}
          {timerIntention && <p className="text-sm text-text-3 text-center max-w-sm italic">"{timerIntention}"</p>}
          <div className="flex gap-4 mt-8">
            <button onClick={togglePause}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-surface-3/50 backdrop-blur-md border border-white/5 hover:bg-surface-3 hover:border-white/10 hover:shadow-[0_0_20px_rgba(var(--color-brand-rgb),0.3)] transition-all">
              {timerPaused ? <><Play className="w-5 h-5 text-brand" /><span className="font-bold text-brand uppercase tracking-wider text-sm">Resume</span></> : <><Pause className="w-5 h-5 text-text-2" /><span className="font-bold text-text-2 uppercase tracking-wider text-sm">Pause</span></>}
            </button>
            <button onClick={endTimerEarly}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-danger/10 backdrop-blur-md border border-danger/20 hover:bg-danger/20 hover:border-danger/30 transition-all hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <Square className="w-5 h-5 text-danger" /><span className="font-bold text-danger uppercase tracking-wider text-sm">End</span>
            </button>
          </div>
          {timerPaused && <p className="text-brand text-sm font-bold uppercase tracking-widest animate-pulse mt-4">Session Paused</p>}
        </motion.div>
      </div>
    );
  }

  // ─── POST-SESSION REVIEW ──────────────────────────
  if (showPostSession) {
    return (
      <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md space-y-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-brand" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-text-1">Session Complete!</h2>
            <p className="text-text-3 mt-1">{completedDuration} minutes of deep focus</p>
          </div>

          <div className="card p-6 space-y-5 text-left">
            <div>
              <label className="text-sm font-bold text-text-2 block mb-2">How was this session?</label>
              <QualityStars value={postQuality} onChange={setPostQuality} />
            </div>

            {timerIntention && (
              <div>
                <label className="text-sm font-bold text-text-2 block mb-2">Did you achieve your intention?</label>
                <div className="flex gap-3">
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => setPostAchieved(v)}
                      className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${postAchieved === v ? (v ? "bg-success text-white" : "bg-danger text-white") : "bg-surface-3 text-text-2 hover:bg-border"}`}>
                      {v ? "✓ Yes" : "✗ Not quite"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-text-2 block mb-2">Quick note (optional)</label>
              <input type="text" value={postNote} onChange={e => setPostNote(e.target.value)}
                className="input-field" placeholder="What did you learn?" />
            </div>
          </div>

          <Button className="w-full h-12 text-lg disabled:opacity-70 disabled:cursor-not-allowed" onClick={submitPostSession} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : <><Zap className="w-5 h-5 mr-2" /> Save & Continue</>}
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── MAIN PAGE ────────────────────────────────────
  return (
    <PageWrapper className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Study</h1>
          <p className="text-text-3 font-medium">Deep work. Real progress. No faking it.</p>
        </div>
        <Button onClick={() => setShowSetup(true)} className="gap-2 h-11 px-5">
          <Play className="w-4 h-4" /> Start Session
        </Button>
      </div>

      {/* Behind Pace Alert */}
      <AnimatePresence>
        {behindPace && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-danger/10 border border-danger/30">
              <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
              <div>
                <p className="font-bold text-danger text-sm">Behind Pace</p>
                <p className="text-text-3 text-sm">You need {(goalHours - parseFloat(totalHours)).toFixed(1)}h more today. It's already {currentHour > 12 ? currentHour - 12 + "pm" : currentHour + "am"}.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Hero */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand/5 to-transparent" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-36 h-36 shrink-0">
            <TimerRing progress={progress} size={144} stroke={8} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-text-1 tabular-nums">{totalHours}</span>
              <span className="text-xs text-text-3 font-medium">/ {goalHours}h goal</span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <p className="text-text-3 text-sm font-medium uppercase tracking-wider">Today's Focus</p>
              <p className="text-2xl font-bold text-text-1">{sessions.length} session{sessions.length !== 1 ? "s" : ""} · {totalMinutes} minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Flame, label: "Streak", value: "—", color: "text-warning" },
          { icon: Target, label: "Consistency", value: `${Math.round(progress * 100)}%`, color: "text-brand" },
          { icon: TrendingUp, label: "Avg Quality", value: sessions.length ? (sessions.reduce((s, x) => s + (x.quality || 3), 0) / sessions.length).toFixed(1) : "—", color: "text-success" },
          { icon: Coffee, label: "Efficiency", value: `${Math.round((totalMinutes / (goalHours * 60)) * 100)}%`, color: "text-personal" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-text-3 font-medium">{stat.label}</p>
              <p className="text-lg font-bold text-text-1 leading-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Sessions */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-text-1">Today's Sessions</h3>
        {sessions.length === 0 && !loading ? (
          <div className="card p-12 text-center">
            <Brain className="w-12 h-12 text-text-3 mx-auto mb-3 opacity-40" />
            <p className="text-text-3 font-medium">No sessions logged yet.</p>
            <p className="text-text-3 text-sm mt-1">Start a deep work timer to begin tracking.</p>
            <Button onClick={() => setShowSetup(true)} className="mt-4 gap-2" variant="outline">
              <Play className="w-4 h-4" /> Start First Session
            </Button>
          </div>
        ) : (
          sessions.map((s, i) => (
            <motion.div key={s._id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="card p-4 flex items-center gap-4 border-l-4 border-l-brand hover:border-l-brand/80 hover:bg-surface-2 transition-all group shadow-sm hover:shadow-md">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 bg-brand shadow-[0_0_10px_var(--color-brand)]">
                  {(s.durationMinutes || 0)}m
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-1 truncate">{s.topic || "Untitled session"}</p>
                  {s.notes && <p className="text-xs text-text-3 mt-0.5 truncate">{s.notes}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-text-3 font-mono">{s.startTime} – {s.endTime}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= (s.quality || 3) ? "fill-current" : "text-surface-3"}`} />
                    ))}
                  </div>
                  <button onClick={() => deleteSession(s._id)} 
                    className="p-2 text-text-3 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-danger rounded-lg hover:bg-danger/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Start Session Modal */}
      <Modal isOpen={showSetup} onClose={() => setShowSetup(false)} title="Start Deep Work Session">
        <div className="space-y-4 sm:space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2">Topic</label>
            <input type="text" value={setupTopic} onChange={e => setSetupTopic(e.target.value)}
              className="input-field text-sm" placeholder="e.g. Hooks deep dive" />
          </div>

          {/* Intention */}
          <div>
            <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2 items-center gap-1.5">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> What will you accomplish?
            </label>
            <input type="text" value={setupIntention} onChange={e => setSetupIntention(e.target.value)}
              className="input-field text-sm" placeholder="I will finish understanding..." />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2">Duration</label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {DURATIONS.map(d => (
                <button key={d.value} onClick={() => setSetupDuration(d.value)}
                  className={`p-2 sm:p-3 rounded-lg text-center transition-all border ${setupDuration === d.value ? "bg-brand text-white border-brand" : "bg-surface-3 text-text-2 border-border hover:border-brand/50"}`}>
                  <span className="block font-bold text-xs sm:text-sm">{d.label}</span>
                  <span className="text-[10px] sm:text-xs opacity-70">{d.type}</span>
                </button>
              ))}
            </div>
          </div>

          <Button className="w-full h-10 sm:h-12 text-sm sm:text-base gap-2 mt-2" onClick={startTimer}>
            <Play className="w-4 h-4 sm:w-5 sm:h-5" /> Start Timer
          </Button>
        </div>
      </Modal>
    </PageWrapper>
  );
}
