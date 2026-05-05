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
    <PageWrapper className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-slate-500">Find the patterns in your life.</p>
      </div>

      <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {['7d', '30d', '90d'].map((range, i) => (
          <button 
            key={range} 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${i === 0 ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"}`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Day Score Trend
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "white" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-work" /> Study Distribution
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="hours" fill="var(--color-work)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">AI Insights</h2>
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.15 }}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-start gap-3 border-l-4 border-l-transparent hover:border-l-primary transition-colors"
                >
                  <insight.icon className={`w-5 h-5 shrink-0 mt-0.5 ${insight.color}`} />
                  <p className="text-sm font-medium leading-relaxed">{insight.text}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-primary text-white border-none">
            <h2 className="text-lg font-bold mb-2 opacity-90">Best Day This Week</h2>
            <p className="text-3xl font-black mb-1">Saturday</p>
            <p className="text-sm opacity-80">Score: 95/100</p>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
