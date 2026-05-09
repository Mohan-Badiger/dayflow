"use client";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Activity, CalendarDays, Clock } from "lucide-react";
import { PageWrapper } from "@/components/layout/PageWrapper";

const itemAnim = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 }
};

export default function AnalyticsPage() {
  const timetableCompletionData = [
    { name: 'Mon', completion: 85, planned: 9, done: 8 },
    { name: 'Tue', completion: 45, planned: 8, done: 4 },
    { name: 'Wed', completion: 100, planned: 6, done: 6 },
    { name: 'Thu', completion: 60, planned: 10, done: 6 },
    { name: 'Fri', completion: 90, planned: 8, done: 7 },
    { name: 'Sat', completion: 30, planned: 4, done: 1 },
    { name: 'Sun', completion: 0, planned: 0, done: 0 },
  ];

  const getBarColor = (val) => {
    if (val >= 80) return "var(--color-success)";
    if (val >= 50) return "var(--color-warning)";
    return "var(--color-danger)";
  };

  const scoreBreakdownData = [
    { name: 'Routine', value: 35, fill: "var(--color-routine)" },
    { name: 'Timetable', value: 25, fill: "var(--color-study)" },
    { name: 'Health', value: 30, fill: "var(--color-exercise)" },
  ];

  const timeData = [
    { name: 'Mon', planned: 300, actual: 280 },
    { name: 'Tue', planned: 240, actual: 120 },
    { name: 'Wed', planned: 180, actual: 180 },
    { name: 'Thu', planned: 360, actual: 200 },
    { name: 'Fri', planned: 240, actual: 210 },
    { name: 'Sat', planned: 120, actual: 30 },
    { name: 'Sun', planned: 0, actual: 0 },
  ];

  return (
    <PageWrapper className="container-app py-8 space-y-8">
      <motion.div variants={itemAnim}>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-text-2 font-medium mt-1">Track your consistency and schedule adherence.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Timetable Completion */}
        <motion.div variants={itemAnim} className="card p-5 lg:col-span-2 flex flex-col">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <CalendarDays size={20} className="text-brand"/> Timetable Completion
          </h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timetableCompletionData} margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-3)", fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-3)", fontWeight: 500 }} />
                <Tooltip 
                  cursor={{ fill: "var(--color-surface-2)" }} 
                  contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-1)' }}
                  formatter={(val, name, props) => {
                    if (name === "completion") return [`${props.payload.done}/${props.payload.planned} blocks done (${val}%)`, "Completed"];
                    return [val, name];
                  }}
                />
                <Bar dataKey="completion" radius={[4, 4, 0, 0]} barSize={36}>
                  {timetableCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.completion)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div variants={itemAnim} className="card p-5 flex flex-col">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Activity size={20} className="text-routine"/> Day Score Breakdown
          </h2>
          <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={scoreBreakdownData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {scoreBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--color-surface)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {scoreBreakdownData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-sm font-medium">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Planned vs Actual Time */}
        <motion.div variants={itemAnim} className="card p-5 lg:col-span-3 flex flex-col">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Clock size={20} className="text-brand"/> Planned vs Actual Time (Minutes)
          </h2>
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} margin={{ top: 10, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-3)", fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-text-3)", fontWeight: 500 }} />
                <Tooltip cursor={{ fill: "var(--color-surface-2)" }} contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--color-surface)' }} />
                <Bar dataKey="planned" fill="var(--color-surface-3)" radius={[4, 4, 0, 0]} name="Planned" />
                <Bar dataKey="actual" fill="var(--color-study)" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </PageWrapper>
  );
}
