"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { useAppStore } from "@/store/useAppStore";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie,
} from "recharts";
import {
  TrendingUp, TrendingDown, Activity, CalendarDays, Clock,
  Droplets, Dumbbell, BookOpen, Brain, Flame, Sparkles,
  Target, Zap, ChevronDown, Award, Sun,
} from "lucide-react";

const anim = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d, ease: [0.25, 0.46, 0.45, 0.94] },
});

function ProgressBar({ value, max, color, label, sublabel, delay = 0 }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-text-1">{label}</span>
        <span className="text-text-3 font-mono text-xs">{sublabel || `${Math.round(pct)}%`}</span>
      </div>
      <div className="h-2.5 rounded-full bg-surface-3 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, trend, delay = 0 }) {
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : null;
  return (
    <motion.div {...anim(delay)} className="card p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06]"
        style={{ backgroundColor: color, transform: "translate(30%, -30%)" }} />
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + "18" }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-3 font-medium">{label}</p>
          <p className="text-2xl font-bold text-text-1 mt-0.5">{value}</p>
          {sub && (
            <p className="text-xs text-text-3 mt-1 flex items-center gap-1">
              {TrendIcon && <TrendIcon className="w-3 h-3" style={{ color: trend > 0 ? "var(--color-success)" : "var(--color-danger)" }} />}
              {sub}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ScoreRing({ value, size = 120, color }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / 100, 1);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={8} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeLinecap="round" initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          style={{ strokeDasharray: circ }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-text-1">{value}</span>
        <span className="text-[10px] text-text-3 font-medium uppercase tracking-wider">avg score</span>
      </div>
    </div>
  );
}

const PERIOD_OPTIONS = [
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

const insightIcons = {
  exercise: Dumbbell, wake: Sun, water: Droplets,
  calendar: CalendarDays, review: BookOpen, fire: Flame,
  default: Sparkles,
};

const tooltipStyle = {
  borderRadius: "var(--radius-md)", border: "none",
  boxShadow: "var(--shadow-lg)", backgroundColor: "var(--color-surface)",
  color: "var(--color-text-1)", fontSize: 12,
};

export default function AnalyticsPage() {
  const { get } = useApi();
  const { userSettings } = useAppStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    get(`/api/analytics?days=${period}`).then((d) => {
      if (!cancelled && d) setData(d);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [period]);

  const waterGoal = userSettings?.waterGoalGlasses || 8;
  const studyGoal = userSettings?.dailyStudyGoalHours || 4;

  // ── Derived data ──
  const scoreTrend = useMemo(() => {
    if (!data?.scoreTrend) return [];
    return data.scoreTrend.map((d) => ({
      ...d, day: d.date.slice(5),
    }));
  }, [data]);

  const studyChartData = useMemo(() => {
    if (!data?.studyByDay) return [];
    return data.studyByDay.map((d) => ({
      day: d.date.slice(5), hours: +(d.totalMins / 60).toFixed(1),
      goal: studyGoal,
    }));
  }, [data, studyGoal]);



  const ttData = useMemo(() => {
    if (!data?.timetableStats) return [];
    return data.timetableStats.map((d) => ({
      day: d.date.slice(5), pct: d.pct ?? 0, done: d.done, total: d.total,
    }));
  }, [data]);

  const getBarColor = (v) => v >= 80 ? "var(--color-success)" : v >= 50 ? "var(--color-warning)" : "var(--color-danger)";

  if (loading) {
    return (
      <PageWrapper className="space-y-6">
        <div className="space-y-3">
          <div className="skeleton h-10 w-48 rounded-xl" />
          <div className="skeleton h-5 w-72 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-72 rounded-xl" />)}
        </div>
      </PageWrapper>
    );
  }

  if (!data) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Activity className="w-12 h-12 text-text-3 mx-auto" />
          <h2 className="text-xl font-bold text-text-1">No Analytics Yet</h2>
          <p className="text-text-3">Start logging your days to see insights here.</p>
        </div>
      </PageWrapper>
    );
  }

  const s = data.summary;
  const health = data.health;
  const exercisePct = s.daysLogged > 0 ? Math.round((health.totalExerciseDays / s.daysLogged) * 100) : 0;
  const waterPct = waterGoal > 0 ? Math.round((health.avgWater / waterGoal) * 100) : 0;
  const avgStudyH = s.daysLogged > 0 ? +(s.totalStudyHours / s.daysLogged).toFixed(1) : 0;
  const studyGoalPct = studyGoal > 0 ? Math.round((avgStudyH / studyGoal) * 100) : 0;

  const ttAvgPct = (() => {
    const valid = (data.timetableStats || []).filter((d) => d.pct !== null);
    return valid.length ? Math.round(valid.reduce((a, d) => a + d.pct, 0) / valid.length) : 0;
  })();

  return (
    <PageWrapper className="space-y-8">
      {/* ─── Header ─── */}
      <motion.div {...anim(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-1">Analytics</h1>
          <p className="text-text-3 font-medium mt-1">
            {s.daysLogged} days tracked · Deep insights into your productivity
          </p>
        </div>
        <div className="relative">
          <select value={period} onChange={(e) => setPeriod(+e.target.value)}
            className="appearance-none input-field pr-10 text-sm font-medium cursor-pointer min-w-[130px]">
            {PERIOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3 pointer-events-none" />
        </div>
      </motion.div>

      {/* ─── Score Overview ─── */}
      <motion.div {...anim(0.05)} className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand/5 via-transparent to-success/3" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <ScoreRing value={s.avgScore} color={s.avgScore >= 70 ? "var(--color-success)" : s.avgScore >= 40 ? "var(--color-warning)" : "var(--color-danger)"} />
          <div className="flex-1 w-full space-y-4">
            <h2 className="text-lg font-bold text-text-1 text-center md:text-left">Performance Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ProgressBar label="Study Goal" sublabel={`${avgStudyH}/${studyGoal}h avg`} value={avgStudyH} max={studyGoal} color="var(--color-study)" delay={0.2} />
              <ProgressBar label="Timetable Adherence" sublabel={`${ttAvgPct}% avg`} value={ttAvgPct} max={100} color="var(--color-routine)" delay={0.3} />
              <ProgressBar label="Exercise Consistency" sublabel={`${health.totalExerciseDays}/${s.daysLogged} days`} value={exercisePct} max={100} color="var(--color-exercise)" delay={0.4} />
              <ProgressBar label="Hydration" sublabel={`${health.avgWater}/${waterGoal} avg`} value={health.avgWater} max={waterGoal} color="var(--color-water)" delay={0.5} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Flame} label="Days Logged" value={s.daysLogged} sub={`of ${period} days`} color="#f59e0b" delay={0.1} />
        <StatCard icon={BookOpen} label="Total Study" value={`${s.totalStudyHours}h`} sub={`${avgStudyH}h/day avg`} color="#6366f1" delay={0.15} />
        <StatCard icon={Dumbbell} label="Exercise Days" value={health.totalExerciseDays} sub={`${exercisePct}% consistency`} color="#10b981" trend={exercisePct >= 60 ? 1 : -1} delay={0.2} />
        <StatCard icon={Droplets} label="Avg Water" value={`${health.avgWater}`} sub={`${waterPct}% of ${waterGoal} goal`} color="#0ea5e9" trend={waterPct >= 80 ? 1 : -1} delay={0.25} />
      </div>

      {/* ─── Charts Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day Score Trend */}
        <motion.div {...anim(0.15)} className="card p-5 flex flex-col">
          <h2 className="text-base font-bold text-text-1 flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-brand" /> Day Score Trend
          </h2>
          <div className="flex-1 min-h-[260px] min-w-0">
            <ResponsiveContainer width="100%" aspect={1.6} minHeight={0}>
              <AreaChart data={scoreTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-3)" }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-3)" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}/100`, "Score"]} />
                <Area type="monotone" dataKey="score" stroke="var(--color-brand)" strokeWidth={2.5}
                  fill="url(#scoreGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Study Hours */}
        <motion.div {...anim(0.2)} className="card p-5 flex flex-col">
          <h2 className="text-base font-bold text-text-1 flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-study" /> Daily Study Hours
          </h2>
          <div className="flex-1 min-h-[260px] min-w-0">
            <ResponsiveContainer width="100%" aspect={1.6} minHeight={0}>
              <BarChart data={studyChartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-3)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-3)" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [`${v}h`, name === "hours" ? "Studied" : "Goal"]} />
                <Bar dataKey="hours" radius={[4, 4, 0, 0]} barSize={18}>
                  {studyChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.hours >= studyGoal ? "var(--color-success)" : "var(--color-study)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Timetable Completion */}
        <motion.div {...anim(0.25)} className="card p-5 flex flex-col">
          <h2 className="text-base font-bold text-text-1 flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-routine" /> Timetable Completion
          </h2>
          <div className="flex-1 min-h-[260px] min-w-0">
            <ResponsiveContainer width="100%" aspect={1.6} minHeight={0}>
              <BarChart data={ttData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-3)" }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-text-3)" }} />
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(v, n, p) => [`${p.payload.done}/${p.payload.total} done (${v}%)`, "Completion"]} />
                <Bar dataKey="pct" radius={[4, 4, 0, 0]} barSize={18}>
                  {ttData.map((e, i) => <Cell key={i} fill={getBarColor(e.pct)} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>


      </div>

      {/* ─── Progress Goals ─── */}
      <motion.div {...anim(0.35)} className="card p-6">
        <h2 className="text-base font-bold text-text-1 flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-warning" /> Goal Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <ProgressBar label="Avg Day Score" sublabel={`${s.avgScore}/100`} value={s.avgScore} max={100}
            color={s.avgScore >= 70 ? "var(--color-success)" : s.avgScore >= 40 ? "var(--color-warning)" : "var(--color-danger)"} delay={0.1} />
          <ProgressBar label="Study Goal Achievement" sublabel={`${studyGoalPct}%`} value={studyGoalPct} max={100}
            color="var(--color-study)" delay={0.15} />
          <ProgressBar label="Exercise Consistency" sublabel={`${exercisePct}%`} value={exercisePct} max={100}
            color="var(--color-exercise)" delay={0.2} />
          <ProgressBar label="Hydration Goal" sublabel={`${waterPct}%`} value={waterPct} max={100}
            color="var(--color-water)" delay={0.25} />
          <ProgressBar label="Timetable Adherence" sublabel={`${ttAvgPct}%`} value={ttAvgPct} max={100}
            color="var(--color-routine)" delay={0.3} />
          <ProgressBar label="Current Streak" sublabel={`${data.user?.streak || 0} days`} value={data.user?.streak || 0} max={Math.max(period, data.user?.streak || 0)}
            color="var(--color-warning)" delay={0.35} />
        </div>
      </motion.div>

      {/* ─── Best / Worst Day ─── */}
      {(s.bestDay || s.worstDay) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {s.bestDay && (
            <motion.div {...anim(0.4)} className="card p-5 border-success/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
                  <Award className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-text-3 font-medium">Best Day</p>
                  <p className="font-bold text-text-1">{s.bestDay.date}</p>
                </div>
              </div>
              <ProgressBar label="Day Score" sublabel={`${s.bestDay.dayScore}/100`} value={s.bestDay.dayScore} max={100} color="var(--color-success)" />
            </motion.div>
          )}
          {s.worstDay && (
            <motion.div {...anim(0.45)} className="card p-5 border-danger/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-danger" />
                </div>
                <div>
                  <p className="text-xs text-text-3 font-medium">Needs Improvement</p>
                  <p className="font-bold text-text-1">{s.worstDay.date}</p>
                </div>
              </div>
              <ProgressBar label="Day Score" sublabel={`${s.worstDay.dayScore}/100`} value={s.worstDay.dayScore} max={100} color="var(--color-danger)" />
            </motion.div>
          )}
        </div>
      )}

      {/* ─── AI Insights ─── */}
      {data.insights?.length > 0 && (
        <motion.div {...anim(0.5)} className="card p-6">
          <h2 className="text-base font-bold text-text-1 flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-brand" /> Smart Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.insights.map((insight, i) => {
              const IIcon = insightIcons[insight.icon] || insightIcons.default;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-surface-3/50 border border-border hover:border-border-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center shrink-0 mt-0.5">
                    <IIcon className="w-4 h-4 text-brand" />
                  </div>
                  <p className="text-sm text-text-2 leading-relaxed">{insight.text}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </PageWrapper>
  );
}

