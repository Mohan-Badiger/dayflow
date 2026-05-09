"use client";
import { useState, useEffect, useMemo } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell, Search, Filter, Flame, Clock, Zap, Play,
  Trophy, TrendingUp, X, Check, RotateCcw,
  Layers, Target, Star, ArrowRight, Activity, Calendar, ChevronRight
} from "lucide-react";
import { EXERCISE_LIBRARY, CATEGORIES, WEEKLY_SCHEDULE, PRESET_WORKOUTS } from "@/lib/exerciseData";

// ─── Daily Schedule Card ──────────────────────────────────────
function DayCard({ dayData, isToday, isActive, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative min-w-[140px] md:min-w-[180px] p-4 rounded-2xl border transition-all flex flex-col items-start text-left ${isActive ? 'bg-brand border-brand shadow-lg' : 'bg-surface border-border hover:border-border-2'}`}
    >
      {isToday && !isActive && (
        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">TODAY</span>
      )}
      <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-white/70' : 'text-text-3'}`}>{dayData.day}</span>
      <h4 className={`text-sm font-bold mb-3 ${isActive ? 'text-white' : 'text-text-1'}`}>{dayData.title}</h4>
      <div className={`flex items-center gap-1.5 text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-text-3'}`}>
        <Target size={12} /> {dayData.focus}
      </div>
    </motion.button>
  );
}

// ─── Exercise Item (List Style) ────────────────────────────────
function ExerciseListItem({ exercise, onInfo }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-2xl hover:border-border-2 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-surface-3 border border-border flex items-center justify-center text-2xl">
        {exercise.icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm md:text-base font-bold text-text-1">{exercise.name}</h4>
        <p className="text-xs text-text-3 mt-0.5">{exercise.defaultSets} sets × {exercise.defaultReps} · {exercise.defaultRestSec}s rest</p>
      </div>
      <button
        onClick={onInfo}
        className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center text-text-3 hover:text-text-1 transition-colors"
      >
        <RotateCcw size={16} />
      </button>
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

  const totalSets = exercises.reduce((s, e) => s + (parseInt(e.defaultSets) || 0), 0);
  const doneSets = Object.values(completedSets).filter(Boolean).length;
  const progress = totalSets > 0 ? (doneSets / totalSets) * 100 : 0;

  const handleComplete = () => {
    const totalCalories = exercises.reduce((s, e) => s + (e.caloriesPerMin * (timer / 60) / exercises.length), 0);
    onComplete({
      workoutName: workout?.title || workout?.name || "Custom Workout",
      category: workout?.category || "full-body",
      environment: "gym",
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-surface-2/95 backdrop-blur-xl overflow-y-auto flex flex-col items-center p-4 md:p-8"
    >
      <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[90vh]">
        <div className="p-6 md:p-8 border-b border-border bg-surface sticky top-0 z-20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-text-1">{workout?.title || workout?.name}</h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-text-3 font-medium">
              <Clock size={12} /> {formatTime(timer)} · {doneSets}/{totalSets} Sets
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-surface-3 rounded-xl flex items-center justify-center text-text-2 hover:text-text-1" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? "⏸" : "▶"}
            </button>
            <button className="w-10 h-10 bg-surface-3 rounded-xl flex items-center justify-center text-rose-500" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="h-1 bg-surface-3 w-full">
          <motion.div className="h-full bg-brand" animate={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {exercises.map((ex, exIdx) => (
            <div key={ex.slug} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{ex.icon}</span>
                <h4 className="text-base font-bold text-text-1">{ex.name}</h4>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {Array.from({ length: ex.defaultSets }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => toggleSet(exIdx, i)}
                    className={`h-10 rounded-lg border-2 transition-all flex items-center justify-center text-xs font-bold ${completedSets[`${exIdx}-${i}`] ? "bg-brand border-brand text-white" : "bg-surface-3 border-transparent text-text-2"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 md:p-8 bg-surface border-t border-border sticky bottom-0">
          <button
            className="w-full py-4 bg-brand text-white rounded-2xl font-bold text-base hover:opacity-90 shadow-lg shadow-brand/20 transition-all"
            onClick={handleComplete}
          >
            Complete Workout
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function ExercisePage() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [activeWorkoutExercises, setActiveWorkoutExercises] = useState([]);
  const [infoExercise, setInfoExercise] = useState(null);
  const [view, setView] = useState("plan"); // "plan" | "library" | "history"
  const [stats, setStats] = useState({ weeklyWorkouts: 0, weeklyMinutes: 0, weeklyCalories: 0, streak: 0 });
  const [workoutHistory, setWorkoutHistory] = useState([]);

  const todayIndex = (new Date().getDay() + 6) % 7; // Monday is 0
  const todayName = WEEKLY_SCHEDULE[todayIndex].day;

  useEffect(() => {
    setSelectedDay(WEEKLY_SCHEDULE[todayIndex]);
    fetch("/api/workouts?limit=50").then(r => r.json()).then(d => {
      if (d.success) {
        setStats(d.data.stats);
        setWorkoutHistory(d.data.workouts || []);
      }
    }).catch(() => { });
  }, []);

  const dayExercises = useMemo(() => {
    if (!selectedDay) return [];
    return selectedDay.exercises.map(slug => EXERCISE_LIBRARY.find(e => e.slug === slug)).filter(Boolean);
  }, [selectedDay]);

  const startWorkout = () => {
    setActiveWorkout(selectedDay);
    setActiveWorkoutExercises(dayExercises);
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
  };

  return (
    <PageWrapper className="pb-32">
      <AnimatePresence>
        {activeWorkout && (
          <ActiveWorkout workout={activeWorkout} exercises={activeWorkoutExercises} onClose={() => setActiveWorkout(null)} onComplete={completeWorkout} />
        )}
        {infoExercise && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setInfoExercise(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-surface w-full max-w-md rounded-3xl p-6 border border-border shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-surface-3 p-3 rounded-xl">{infoExercise.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-text-1">{infoExercise.name}</h3>
                    <span className="text-xs text-brand font-bold uppercase">{infoExercise.difficulty}</span>
                  </div>
                </div>
                <button onClick={() => setInfoExercise(null)} className="text-text-3 hover:text-text-1"><X size={20} /></button>
              </div>
              <p className="text-sm text-text-2 leading-relaxed mb-6">{infoExercise.instructions}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-surface-3 p-3 rounded-xl border border-border">
                  <span className="block text-[10px] text-text-3 uppercase font-bold mb-1">Target Muscles</span>
                  <span className="text-xs font-semibold text-text-1">{infoExercise.muscleGroups.join(", ")}</span>
                </div>
                <div className="bg-surface-3 p-3 rounded-xl border border-border">
                  <span className="block text-[10px] text-text-3 uppercase font-bold mb-1">Equipment</span>
                  <span className="text-xs font-semibold text-text-1 capitalize">{infoExercise.equipment}</span>
                </div>
              </div>
              <button onClick={() => setInfoExercise(null)} className="w-full py-3 bg-text-1 text-surface rounded-xl font-bold text-sm">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <div className="mb-10 mt-4">
        <div className="flex items-center gap-3 mb-2 text-brand">
          <Calendar size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">{todayName}, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-1 leading-tight">
          Today's Routine: <br />
          <span className="text-brand">{WEEKLY_SCHEDULE[todayIndex].title}</span>
        </h1>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="bg-surface border border-border rounded-2xl p-4 text-center">
          <span className="block text-2xl font-bold text-text-1">{stats.streak || 0}</span>
          <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">Streak</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 text-center">
          <span className="block text-2xl font-bold text-text-1">{stats.weeklyMinutes || 0}</span>
          <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">Minutes</span>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-4 text-center">
          <span className="block text-2xl font-bold text-text-1">{stats.weeklyWorkouts || 0}</span>
          <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">Session</span>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1.5 p-1 bg-surface-3 border border-border rounded-xl mb-8 w-full md:w-max">
        <button onClick={() => setView("plan")} className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === "plan" ? "bg-surface text-text-1 shadow-sm border border-border" : "text-text-3 hover:text-text-1"}`}>Daily Plan</button>
        <button onClick={() => setView("library")} className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === "library" ? "bg-surface text-text-1 shadow-sm border border-border" : "text-text-3 hover:text-text-1"}`}>All Exercises</button>
        <button onClick={() => setView("history")} className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === "history" ? "bg-surface text-text-1 shadow-sm border border-border" : "text-text-3 hover:text-text-1"}`}>History</button>
      </div>

      {view === "plan" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Weekly Roadmap */}
          <div>
            <h3 className="text-xs font-bold text-text-3 uppercase tracking-widest mb-4">The Weekly Roadmap</h3>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
              {WEEKLY_SCHEDULE.map((day, idx) => (
                <DayCard
                  key={day.day}
                  dayData={day}
                  isToday={idx === todayIndex}
                  isActive={selectedDay?.day === day.day}
                  onClick={() => setSelectedDay(day)}
                />
              ))}
            </div>
          </div>

          {/* Exercises for selected day */}
          <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-1">{selectedDay?.title}</h2>
                <p className="text-sm text-text-3 mt-1">{selectedDay?.description}</p>
              </div>
              <button
                onClick={startWorkout}
                className="flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-xl font-bold text-sm shadow-lg shadow-brand/20 hover:opacity-90 transition-all"
              >
                <Play size={16} fill="currentColor" /> Start Workout
              </button>
            </div>

            <div className="space-y-3">
              {dayExercises.map(ex => (
                <ExerciseListItem key={ex.slug} exercise={ex} onInfo={() => setInfoExercise(ex)} />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {view === "library" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXERCISE_LIBRARY.map(ex => (
              <div key={ex.slug} className="p-4 bg-surface border border-border rounded-2xl flex items-center gap-4">
                <span className="text-2xl">{ex.icon}</span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-text-1">{ex.name}</h4>
                  <p className="text-[10px] text-text-3 uppercase font-bold tracking-wider">{ex.category}</p>
                </div>
                <button onClick={() => setInfoExercise(ex)} className="text-text-3 hover:text-text-1"><RotateCcw size={16} /></button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {view === "history" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {workoutHistory.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border rounded-2xl">
              <Dumbbell size={48} className="mx-auto mb-4 text-border-2" />
              <h3 className="text-base font-bold text-text-2 mb-1">No history yet</h3>
            </div>
          ) : (
            workoutHistory.map((w, i) => (
              <div key={w._id || i} className="flex items-center gap-5 p-5 bg-surface border border-border rounded-2xl">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-surface-3 rounded-xl border border-border shrink-0">
                  <span className="text-[10px] font-bold text-text-3 uppercase">{new Date(w.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className="text-sm font-bold text-text-1">{new Date(w.date + "T00:00:00").toLocaleDateString("en-US", { day: "numeric" })}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-text-1 mb-1">{w.workoutName}</h4>
                  <div className="flex gap-4 text-xs font-medium text-text-3">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {w.totalDurationMin}m</span>
                    <span className="flex items-center gap-1.5"><Flame size={14} /> {w.caloriesBurned} cal</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}
    </PageWrapper>
  );
}
