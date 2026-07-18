"use client"

import { motion } from "framer-motion"
import { CheckCircle, Circle, Clock, TrendingUp, MoreHorizontal, Check, Pause, Play, Edit3, Trash2 } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

export default function GoalCard({ goal, onUpdate, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false)

  const progress = goal.progress || 0
  const isCompleted = goal.status === "Completed"

  const handleStatusChange = async (newStatus) => {
    let newProgress = progress
    if (newStatus === "Completed") newProgress = 100
    if (newStatus === "In Progress" && progress === 100) newProgress = 99

    await onUpdate(goal._id, { status: newStatus, progress: newProgress })
    setShowMenu(false)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      await onDelete(goal._id)
    }
  }

  const handleToggleSubTask = async (subTaskToToggle) => {
    const updatedSubTasks = goal.subTasks.map(sub => 
      (sub._id === subTaskToToggle._id || (sub.title === subTaskToToggle.title && !sub._id))
        ? { ...sub, completed: !sub.completed }
        : sub
    )

    const total = updatedSubTasks.length
    const completedCount = updatedSubTasks.filter(st => st.completed).length
    const newProgress = Math.round((completedCount / total) * 100)
    
    let newStatus = goal.status
    if (newProgress === 100) {
      newStatus = "Completed"
    } else if (goal.status === "Completed" && newProgress < 100) {
      newStatus = "In Progress"
    } else if (goal.status === "Not Started" && newProgress > 0) {
      newStatus = "In Progress"
    }

    await onUpdate(goal._id, { 
      subTasks: updatedSubTasks, 
      progress: newProgress, 
      status: newStatus 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`relative p-6 rounded-sm border bg-surface backdrop-blur-xl transition-colors ${isCompleted ? 'border-success/30' : 'border-border'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-sm bg-brand-light text-brand-dark">
              {goal.category}
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-sm bg-surface-3 text-text-3">
              {goal.type}
            </span>
            {isCompleted && (
              <span className="px-2.5 py-1 text-xs font-medium rounded-sm bg-success/10 text-success flex items-center gap-1">
                <Check className="w-3 h-3" /> Done
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-text-1 tracking-tight">{goal.title}</h3>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-sm hover:bg-surface-3 text-text-3 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-48 py-2 bg-surface border border-border rounded-sm shadow-xl z-10 overflow-hidden"
            >
              <button onClick={() => { onEdit(goal); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-text-2 hover:bg-surface-3 flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              {isCompleted ? (
                <button onClick={() => handleStatusChange("In Progress")} className="w-full text-left px-4 py-2 text-sm text-warning hover:bg-surface-3 flex items-center gap-2">
                  <Play className="w-4 h-4" /> Resume
                </button>
              ) : (
                <button onClick={() => handleStatusChange("Completed")} className="w-full text-left px-4 py-2 text-sm text-success hover:bg-surface-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Mark Completed
                </button>
              )}
              <div className="h-px bg-border my-1"></div>
              <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-surface-3 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <p className="text-text-2 text-sm mb-4 line-clamp-2">
        {goal.description || "No description provided."}
      </p>

      {/* Subtasks checklist inside card */}
      {goal.subTasks && goal.subTasks.length > 0 && (
        <div className="mt-4 mb-6 space-y-2 border-t border-border/50 pt-4">
          <h4 className="text-xs font-bold text-text-3 uppercase tracking-wider mb-2">Subtasks</h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {goal.subTasks.map((sub) => (
              <label
                key={sub._id || sub.title}
                className="flex items-start gap-2.5 text-xs text-text-2 hover:text-text-1 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => handleToggleSubTask(sub)}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-border text-brand focus:ring-brand bg-surface-2 cursor-pointer"
                />
                <span className={`leading-relaxed ${sub.completed ? 'line-through text-text-3' : ''}`}>
                  {sub.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-text-3 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-brand-mid" /> Progress
          </span>
          <span className="font-semibold text-text-1">{progress}%</span>
        </div>

        <div className="h-2 w-full bg-border rounded-sm overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-sm ${isCompleted ? 'bg-success' : 'bg-brand'}`}
          />
        </div>
      </div>

      {goal.targetDate && (
        <div className="mt-6 flex items-center gap-2 text-xs text-text-3">
          <Clock className="w-3.5 h-3.5" />
          Target: {format(new Date(goal.targetDate), "MMM d, yyyy")}
        </div>
      )}
    </motion.div>
  )
}
