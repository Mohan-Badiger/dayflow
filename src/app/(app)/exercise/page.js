"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell, Search, Filter, Flame, Clock, Zap, Play,
  Trophy, TrendingUp, X, Check, RotateCcw,
  Layers, Target, Star, ArrowRight, Activity
} from "lucide-react";
import { EXERCISE_LIBRARY, CATEGORIES, ENVIRONMENTS, DIFFICULTIES, PRESET_WORKOUTS } from "@/lib/exerciseData";

// ─── Clean 3D Exercise Card ─────────────────────────────────────────
function ExerciseCard({ exercise, index, onSelect, isSelected }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const diffColors = {
    beginner: "text-emerald-500 bg-emerald-500/10",
    intermediate: "text-amber-500 bg-amber-500/10",
    advanced: "text-rose-500 bg-rose-500/10"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3), duration: 0.3 }}
      className="h-[240px] relative group"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full relative transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front Face */}
        <div
          className={`absolute inset-0 rounded-2xl p-5 flex flex-col bg-surface border transition-all duration-300 z-10 ${isSelected ? "border-brand shadow-[0_0_0_1px_var(--color-brand)]" : "border-border hover:border-border-2 shadow-sm"}`}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {isSelected && (
            <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shadow-md">
              <Check size={14} />
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-surface-3 flex items-center justify-center text-2xl border border-border">
              {exercise.icon}
            </div>
            <div className="flex-1 pr-6">
              <h3 className="text-base font-bold text-text-1 leading-tight">{exercise.name}</h3>
              <p className="text-xs text-text-3 mt-1 line-clamp-1">{exercise.muscleGroups.join(", ")}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1.5 rounded-lg ${diffColors[exercise.difficulty]}`}>
              {exercise.difficulty}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1.5 rounded-lg bg-surface-3 text-text-2">
              {exercise.category}
            </span>
          </div>

          <div className="mt-auto flex items-center gap-2">
            <button
              onClick={() => onSelect(exercise)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${isSelected ? "bg-surface-3 text-text-1" : "bg-text-1 text-surface hover:opacity-90 shadow-sm"}`}
            >
              {isSelected ? "Remove" : "Add to Workout"}
            </button>
            <button
              onClick={() => setIsFlipped(true)}
              className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center text-text-2 hover:text-text-1 hover:bg-border border border-transparent hover:border-border transition-all"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col bg-surface border border-border z-0 shadow-sm"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-text-1 flex items-center gap-2">
              <RotateCcw size={14} className="text-brand" /> Details
            </h3>
            <button onClick={() => setIsFlipped(false)} className="text-text-3 hover:text-text-1 bg-surface-3 p-1.5 rounded-lg"><X size={14} /></button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 text-sm text-text-2 space-y-3 scrollbar-none">
            <p className="leading-relaxed text-[13px]">{exercise.instructions}</p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="bg-surface-3 p-2 rounded-lg">
                <span className="block text-[10px] text-text-3 uppercase font-bold mb-1">Target</span>
                <span className="text-xs font-semibold text-text-1">{exercise.defaultSets}x{exercise.defaultReps}</span>
              </div>
              <div className="bg-surface-3 p-2 rounded-lg">
                <span className="block text-[10px] text-text-3 uppercase font-bold mb-1">Rest</span>
                <span className="text-xs font-semibold text-text-1">{exercise.defaultRestSec}s</span>
              </div>
              <div className="bg-surface-3 p-2 rounded-lg">
                <span className="block text-[10px] text-text-3 uppercase font-bold mb-1">Equipment</span>
                <span className="text-xs font-semibold text-text-1 capitalize">{exercise.equipment}</span>
              </div>
              <div className="bg-surface-3 p-2 rounded-lg">
                <span className="block text-[10px] text-text-3 uppercase font-bold mb-1">Burn</span>
                <span className="text-xs font-semibold text-text-1">{exercise.caloriesPerMin} cal/m</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Minimal Preset Card ──────────────────────────────────────
function PresetCard({ preset, index, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-surface border border-border rounded-2xl p-6 transition-all hover:border-brand/30 hover:shadow-lg cursor-pointer group flex flex-col"
      onClick={() => onStart(preset)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-3 border border-border flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
          {preset.icon}
        </div>
        <div className="bg-surface-3 px-3 py-1.5 rounded-lg text-xs font-bold text-text-2 flex items-center gap-1.5">
          <Clock size={12} /> {preset.durationMin}m
        </div>
      </div>

      <h3 className="text-lg font-bold text-text-1 mb-1">{preset.name}</h3>
      <p className="text-sm text-text-3 mb-6">{preset.exercises.length} exercises · {preset.environment === "gym" ? "Gym" : preset.environment === "home" ? "Home" : "Anywhere"}</p>

      <button className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-surface-3 text-text-1 font-semibold text-sm group-hover:bg-brand group-hover:text-white transition-all">
        <Play size={16} /> Start Routine
      </button>
    </motion.div>
  );
}

// ─── Sleek Stats Bar ──────────────────────────────────────────────
function StatsBar({ stats }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
          <Activity size={26} />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-1">Weekly Summary</h2>
          <p className="text-xs text-text-3 mt-0.5">Keep pushing forward</p>
        </div>
      </div>

      <div className="flex flex-1 w-full md:w-auto justify-between md:justify-end gap-4 md:gap-12">
        <div className="text-center md:text-left">
          <span className="block text-2xl md:text-3xl font-bold text-text-1">{stats.weeklyWorkouts || 0}</span>
          <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">Workouts</span>
        </div>
        <div className="text-center md:text-left">
          <span className="block text-2xl md:text-3xl font-bold text-text-1">{stats.weeklyMinutes || 0}</span>
          <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">Minutes</span>
        </div>
        <div className="text-center md:text-left">
          <span className="block text-2xl md:text-3xl font-bold text-text-1">{stats.streak || 0} <Flame size={18} className="inline text-warning -mt-1" /></span>
          <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">Streak</span>
        </div>
      </div>
    </div>
  );
}

// ─── Polished Active Workout Overlay ─────────────────────────────────────
function ActiveWorkout({ workout, exercises, onClose, onComplete }) {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [completedSets, setCompletedSets] = useState({});

  useEffect(() => {
    let interval;
    if (isRunning) interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const toggleSet = (exIdx, setIdx) => {
    const key = `${exIdx}-${setIdx}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalSets = exercises.reduce((s, e) => s + e.defaultSets, 0);
  const doneSets = Object.values(completedSets).filter(Boolean).length;
  const progress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  const handleComplete = () => {
    const totalCalories = exercises.reduce((s, e) => s + (e.caloriesPerMin * (timer / 60) / exercises.length), 0);
    onComplete({
      workoutName: workout?.name || "Custom Workout",
      category: workout?.category || "full-body",
      environment: workout?.environment || "gym",
      exercises: exercises.map(e => ({
        exerciseName: e.name,
        sets: Array.from({ length: e.defaultSets }, (_, i) => ({
          reps: parseInt(e.defaultReps) || 0,
          weight: 0,
          completed: !!completedSets[`${exercises.indexOf(e)}-${i}`],
        })),
      })),
      totalDurationMin: Math.round(timer / 60),
      caloriesBurned: Math.round(totalCalories),
      completed: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="fixed inset-0 z-100 bg-surface-2/95 backdrop-blur-md overflow-y-auto flex flex-col items-center p-4 md:p-8"
    >
      <div className="w-full max-w-3xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[90vh]">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border bg-surface sticky top-0 z-20 flex justify-between items-center gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-3 h-3 rounded-full bg-brand animate-pulse"></span>
              <h2 className="text-xl md:text-2xl font-bold text-text-1">{workout?.name || "Custom Workout"}</h2>
            </div>
            <p className="text-sm text-text-3 ml-6">{exercises.length} exercises · Goal: Completing sets</p>
          </div>

          <div className="flex items-center gap-3 bg-surface-3 p-1.5 rounded-2xl border border-border">
            <div className="px-4 py-2 text-xl font-bold font-mono tracking-wider text-text-1">
              {formatTime(timer)}
            </div>
            <button className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border text-text-2 hover:text-text-1 transition-all" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? "⏸" : "▶"}
            </button>
            <button className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border text-rose-500 hover:bg-rose-500/10 transition-all" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-surface-3 w-full">
          <motion.div className="h-full bg-brand" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>

        {/* Body */}
        <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto bg-surface-2">
          {exercises.map((ex, exIdx) => (
            <div key={ex.slug} className="bg-surface border border-border rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-surface-3 flex items-center justify-center text-2xl border border-border">
                  {ex.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-text-1">{ex.name}</h4>
                  <span className="text-sm text-text-3 font-medium">{ex.defaultSets} sets × {ex.defaultReps}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: ex.defaultSets }, (_, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSet(exIdx, i)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${completedSets[`${exIdx}-${i}`] ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "bg-surface border-border text-text-2 hover:border-text-3"}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1">Set {i + 1}</span>
                    {completedSets[`${exIdx}-${i}`] ? <Check size={20} /> : <span className="text-lg font-bold opacity-80">{ex.defaultReps}</span>}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-surface border-t border-border flex justify-between items-center sticky bottom-0 z-20 flex-wrap gap-4">
          <div className="flex gap-6">
            <div>
              <span className="block text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">Sets Done</span>
              <span className="text-lg font-bold text-text-1">{doneSets} <span className="text-text-3 text-sm">/ {totalSets}</span></span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">Est. Burn</span>
              <span className="text-lg font-bold text-text-1">{Math.round(exercises.reduce((s, e) => s + e.caloriesPerMin, 0) * timer / 60)} <span className="text-text-3 text-sm">cal</span></span>
            </div>
          </div>
          <button
            className="flex items-center gap-2 px-8 py-4 bg-text-1 text-surface rounded-xl font-bold text-base hover:opacity-90 transition-all w-full md:w-auto justify-center"
            onClick={handleComplete}
          >
            <Trophy size={18} /> Finish Session
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function ExercisePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [activeWorkoutExercises, setActiveWorkoutExercises] = useState([]);
  const [view, setView] = useState("library"); // "library" | "presets" | "history"
  const [stats, setStats] = useState({ weeklyWorkouts: 0, weeklyMinutes: 0, weeklyCalories: 0, streak: 0 });
  const [workoutHistory, setWorkoutHistory] = useState([]);

  useEffect(() => {
    fetch("/api/workouts?limit=50").then(r => r.json()).then(d => {
      if (d.success) { setStats(d.data.stats); setWorkoutHistory(d.data.workouts || []); }
    }).catch(() => { });
  }, []);

  const filtered = useMemo(() => {
    let list = [...EXERCISE_LIBRARY];
    if (activeCategory !== "all") list = list.filter(e => e.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.muscleGroups.some(m => m.toLowerCase().includes(q)));
    }
    return list;
  }, [activeCategory, searchQuery]);

  const toggleExercise = useCallback((ex) => {
    setSelectedExercises(prev => prev.find(e => e.slug === ex.slug) ? prev.filter(e => e.slug !== ex.slug) : [...prev, ex]);
  }, []);

  const startCustomWorkout = () => {
    if (selectedExercises.length === 0) return;
    setActiveWorkout({ name: "Custom Workout", category: "full-body", environment: "gym" });
    setActiveWorkoutExercises(selectedExercises);
  };

  const startPreset = (preset) => {
    const exs = preset.exercises.map(slug => EXERCISE_LIBRARY.find(e => e.slug === slug)).filter(Boolean);
    setActiveWorkout(preset);
    setActiveWorkoutExercises(exs);
  };

  const completeWorkout = async (data) => {
    try {
      const res = await fetch("/api/workouts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          setWorkoutHistory(prev => [d.data, ...prev]);
          setStats(prev => ({ ...prev, weeklyWorkouts: prev.weeklyWorkouts + 1, weeklyMinutes: prev.weeklyMinutes + (data.totalDurationMin || 0), weeklyCalories: prev.weeklyCalories + (data.caloriesBurned || 0) }));
        }
      }
    } catch (e) { console.error(e); }
    setActiveWorkout(null);
    setActiveWorkoutExercises([]);
    setSelectedExercises([]);
  };

  return (
    <PageWrapper className="pb-32">
      <AnimatePresence>
        {activeWorkout && (
          <ActiveWorkout workout={activeWorkout} exercises={activeWorkoutExercises} onClose={() => { setActiveWorkout(null); setActiveWorkoutExercises([]); }} onComplete={completeWorkout} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-1 mb-2">Workout Studio</h1>
        <p className="text-text-3 text-sm">Build your routine, track your progress, stay consistent.</p>
      </div>

      <StatsBar stats={stats} />

      {/* Clean Segmented Control Tabs */}
      <div className="flex p-1 bg-surface-3 border border-border rounded-xl w-full md:w-max mb-8">
        {[
          { id: "library", label: "Library" },
          { id: "presets", label: "Routines" },
          { id: "history", label: "History" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${view === tab.id ? "bg-surface text-text-1 shadow-sm border border-border" : "text-text-3 hover:text-text-2 border border-transparent"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "library" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
              <input
                type="text"
                placeholder="Search exercises or muscles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-surface border border-border rounded-xl text-sm outline-none focus:border-brand transition-all text-text-1 placeholder:text-text-3 shadow-sm"
              />
            </div>
            {/* Clean Category Select */}
            <div className="h-12 bg-surface border border-border rounded-xl flex items-center px-4 shadow-sm w-full md:w-auto overflow-hidden">
              <select
                value={activeCategory}
                onChange={e => setActiveCategory(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium text-text-2 w-full min-w-[150px] cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
          </div>

          <p className="text-[11px] font-bold text-text-3 uppercase tracking-wider mb-4 px-1">{filtered.length} Exercises</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((ex, i) => (
              <ExerciseCard key={ex.slug} exercise={ex} index={i} onSelect={toggleExercise} isSelected={!!selectedExercises.find(s => s.slug === ex.slug)} />
            ))}
          </div>
        </motion.div>
      )}

      {view === "presets" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRESET_WORKOUTS.map((p, i) => (
              <PresetCard key={p.name} preset={p} index={i} onStart={startPreset} />
            ))}
          </div>
        </motion.div>
      )}

      {view === "history" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
          {workoutHistory.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border rounded-2xl">
              <Dumbbell size={48} className="mx-auto mb-4 text-border-2" />
              <h3 className="text-base font-bold text-text-2 mb-1">No workouts yet</h3>
              <p className="text-sm text-text-3">Your completed sessions will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {workoutHistory.map((w, i) => (
                <div key={w._id || i} className="flex items-center gap-5 p-5 bg-surface border border-border rounded-2xl hover:shadow-sm transition-all">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-surface-3 rounded-xl border border-border shrink-0">
                    <span className="text-[10px] font-bold text-text-3 uppercase">{new Date(w.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}</span>
                    <span className="text-sm font-bold text-text-1">{new Date(w.date + "T00:00:00").toLocaleDateString("en-US", { day: "numeric" })}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-text-1 mb-1">{w.workoutName}</h4>
                    <div className="flex gap-4 text-xs font-medium text-text-3">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {w.totalDurationMin}m</span>
                      <span className="flex items-center gap-1.5"><Flame size={14} /> {w.caloriesBurned} cal</span>
                      <span className="flex items-center gap-1.5"><Layers size={14} /> {w.exercises?.length || 0} ex</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Floating Action Bar for Selected Exercises */}
      <AnimatePresence>
        {selectedExercises.length > 0 && !activeWorkout && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between p-2 pl-6 bg-text-1 rounded-2xl shadow-2xl w-[90%] max-w-md"
          >
            <div className="text-sm font-bold text-surface">
              {selectedExercises.length} selected
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2.5 text-xs font-bold text-surface/70 hover:text-surface transition-colors" onClick={() => setSelectedExercises([])}>
                Clear
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-all" onClick={startCustomWorkout}>
                <Play size={14} /> Start
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
