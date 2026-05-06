"use client";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Lightbulb, TrendingUp, Activity, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const scoreData = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 75 },
    { name: 'Wed', score: 85 },
    { name: 'Thu', score: 70 },
    { name: 'Fri', score: 90 },
    { name: 'Sat', score: 95 },
    { name: 'Sun', score: 85 },
  ];

  const studyData = [
    { name: 'React', hours: 14 },
    { name: 'DSA', hours: 8 },
    { name: 'System Design', hours: 4 },
  ];

  const insights = [
    { icon: TrendingUp, text: "You study 40% more on days you wake before 6:30.", color: "text-primary" },
    { icon: Activity, text: "Your mood is highest on days with exercise.", color: "text-success" },
    { icon: Lightbulb, text: "You missed your study goal 3 days this week — plan for those gaps.", color: "text-warning" },
  ];

  return (
    <PageWrapper className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-black tracking-tight">Analytics</h1>
        <p className="text-slate-500 font-medium mt-1">Find the patterns in your life.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex gap-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-xl w-fit border border-slate-200/50 dark:border-slate-700/50"
      >
        {['7d', '30d', '90d'].map((range, i) => (
          <button
            key={range}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${i === 0 ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"}`}
          >
            {range}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/20 dark:shadow-none transition-all hover:shadow-xl hover:shadow-slate-200/40">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" /> Day Score Trend
              </h2>
              <div className="min-h-[300px] w-full min-w-0" style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }} />
                    <Tooltip cursor={{ stroke: "rgba(148, 163, 184, 0.2)", strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--card)', color: 'var(--foreground)', fontWeight: 'bold' }} />
                    <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={4} dot={{ r: 5, strokeWidth: 3, fill: "var(--background)", stroke: "var(--color-primary)" }} activeDot={{ r: 8, strokeWidth: 0, fill: "var(--color-primary)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/20 dark:shadow-none transition-all hover:shadow-xl hover:shadow-slate-200/40">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-work" /> Study Distribution
              </h2>
              <div className="min-h-[300px] w-full min-w-0" style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={studyData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }} />
                    <Tooltip cursor={{ fill: "rgba(148, 163, 184, 0.05)" }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--card)', color: 'var(--foreground)', fontWeight: 'bold' }} />
                    <Bar dataKey="hours" fill="var(--color-work)" radius={[6, 6, 0, 0]} barSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-200/20 dark:shadow-none">
              <h2 className="text-xl font-bold mb-5 tracking-tight">AI Insights</h2>
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    className="p-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl flex items-start gap-3 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all group"
                  >
                    <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm group-hover:scale-110 transition-transform`}>
                      <insight.icon className={`w-5 h-5 ${insight.color}`} />
                    </div>
                    <p className="text-sm font-medium leading-relaxed pt-1 text-slate-700 dark:text-slate-300">{insight.text}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-8 bg-linear-to-br from-primary to-indigo-600 text-white border-none shadow-xl shadow-primary/30 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <Lightbulb className="w-24 h-24 rotate-12" />
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-bold mb-2 text-white/90">Best Day This Week</h2>
                <p className="text-4xl font-black mb-2 tracking-tight">Saturday</p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                  <span className="text-sm font-bold">Score: 95/100</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
