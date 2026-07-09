"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { motion } from "framer-motion"

export default function GoalProgressChart({ goals }) {
  // We'll calculate average progress based on categories for the chart data
  const data = []

  if (goals && goals.length > 0) {
    const categories = [...new Set(goals.map(g => g.category))]

    categories.forEach(cat => {
      const catGoals = goals.filter(g => g.category === cat)
      const avgProgress = catGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / catGoals.length

      data.push({
        name: cat,
        progress: Math.round(avgProgress),
        total: catGoals.length
      })
    })
  }

  if (data.length === 0) {
    return (
      <div className="h-75 w-full flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
        <p className="text-gray-400">Add some goals to see your progress chart.</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-white/10 p-4 rounded-xl shadow-xl">
          <p className="text-white font-semibold mb-1">{label}</p>
          <p className="text-blue-400 text-sm">Avg Progress: {payload[0].value}%</p>
          <p className="text-gray-400 text-sm mt-1">Total Goals: {payload[0].payload.total}</p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      <h3 className="text-lg font-bold text-white mb-6">Average Progress by Category</h3>
      <div className="h-62.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="progress"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProgress)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
