"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Target, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react"
import GoalCard from "@/components/goals/GoalCard"
import GoalForm from "@/components/goals/GoalForm"
import GoalProgressChart from "@/components/goals/GoalProgressChart"
import { Button } from "@/components/ui/Button"

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [filter, setFilter] = useState("All")

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals")
      const data = await res.json()
      if (res.ok) {
        setGoals(data.data || [])
      } else {
        setError(data.error || "Failed to fetch goals")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        setLoading(true);
        fetchGoals();
      }
    });
    return () => { active = false; };
  }, [])

  const handleCreateOrUpdate = async (goalData) => {
    try {
      const isEditing = !!editingGoal
      const url = isEditing ? `/api/goals/${editingGoal._id}` : "/api/goals"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalData)
      })

      if (res.ok) {
        await fetchGoals()
      } else {
        const errData = await res.json()
        console.error("Failed to save goal:", errData)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setEditingGoal(null)
    }
  }

  const handleQuickUpdate = async (id, data) => {
    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (res.ok) fetchGoals()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" })
      if (res.ok) fetchGoals()
    } catch (e) {
      console.error(e)
    }
  }

  const openEditForm = (goal) => {
    setEditingGoal(goal)
    setShowForm(true)
  }

  const filteredGoals = goals.filter(g => {
    if (filter === "Completed") return g.status === "Completed"
    if (filter === "Active") return g.status !== "Completed"
    return true
  })

  const completedCount = goals.filter(g => g.status === "Completed").length
  const activeCount = goals.length - completedCount

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-text-1 tracking-tight mb-2"
          >
            Goals & Tracking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-3"
          >
            Design your life and track your progress creatively.
          </motion.p>
        </div>

        <Button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => { setEditingGoal(null); setShowForm(true); }}
          className="gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> New Goal
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Goals", value: goals.length, icon: Target, color: "text-brand", bg: "bg-brand/10" },
          { label: "Active", value: activeCount, icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
          { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3 }}
            className="bg-surface border border-border p-6 rounded-sm shadow-sm flex items-center gap-4"
          >
            <div className={`p-4 rounded-sm ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-text-3 font-medium">{stat.label}</p>
              <h4 className="text-2xl font-bold text-text-1">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <GoalProgressChart goals={goals} />
      </motion.div>

      {/* Goals Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {["All", "Active", "Completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-sm font-medium transition-colors whitespace-nowrap ${filter === f
                  ? 'bg-text-1 text-surface'
                  : 'bg-surface border border-border text-text-2 hover:bg-surface-3 hover:text-text-1'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-sm animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-danger/10 border border-danger/20 text-danger p-6 rounded-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-sm bg-surface">
            <Target className="w-12 h-12 text-text-3 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-1 mb-2">No goals found</h3>
            <p className="text-text-3 mb-6">You don&apos;t have any {filter.toLowerCase()} goals yet.</p>
            <button
              onClick={() => { setEditingGoal(null); setShowForm(true); }}
              className="text-brand font-semibold hover:opacity-80 transition-opacity"
            >
              Create your first goal →
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredGoals.map(goal => (
                <GoalCard
                  key={goal._id}
                  goal={goal}
                  onUpdate={handleQuickUpdate}
                  onDelete={handleDelete}
                  onEdit={openEditForm}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {showForm && (
        <GoalForm
          initialData={editingGoal}
          onClose={() => { setShowForm(false); setEditingGoal(null); }}
          onSubmit={handleCreateOrUpdate}
        />
      )}
    </div>
  )
}
