"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar as CalendarIcon } from "lucide-react"

export default function GoalForm({ initialData = null, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "Other",
    type: initialData?.type || "Long-term",
    progress: initialData?.progress || 0,
    targetDate: initialData?.targetDate ? new Date(initialData.targetDate).toISOString().split('T')[0] : "",
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(formData)
    setLoading(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text-3 hover:text-text-1 hover:bg-surface-3 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-text-1 mb-6">
              {initialData ? "Edit Goal" : "Create New Goal"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-2 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-1 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                  placeholder="e.g. Learn Next.js"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-2 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-1 focus:outline-none focus:ring-2 focus:ring-brand transition-all min-h-25 resize-none"
                  placeholder="Details about your goal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-1 focus:outline-none focus:ring-2 focus:ring-brand appearance-none"
                  >
                    <option value="Health">Health</option>
                    <option value="Career">Career</option>
                    <option value="Finance">Finance</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-2 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-1 focus:outline-none focus:ring-2 focus:ring-brand appearance-none"
                  >
                    <option value="Short-term">Short-term</option>
                    <option value="Long-term">Long-term</option>
                    <option value="Habit">Habit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {initialData && (
                  <div>
                    <label className="block text-sm font-medium text-text-2 mb-1">Progress (%)</label>
                    <input
                      type="number"
                      min="0" max="100"
                      value={formData.progress}
                      onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                      className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-1 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                    />
                  </div>
                )}
                <div className={initialData ? "" : "col-span-2"}>
                  <label className="block text-sm font-medium text-text-2 mb-1">Target Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 pl-10 text-text-1 focus:outline-none focus:ring-2 focus:ring-brand transition-all"
                    />
                    <CalendarIcon className="w-4 h-4 text-text-3 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl font-medium text-text-2 hover:bg-surface-3 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-medium bg-brand text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Goal"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
