"use client"

import { useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"

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
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={initialData ? "Edit Goal" : "Create New Goal"}
    >
      <div className="space-y-4 sm:space-y-5 p-1">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-surface-2 border border-border rounded-sm px-4 py-2.5 text-sm text-text-1 focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              placeholder="e.g. Learn Next.js"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-surface-2 border border-border rounded-sm px-4 py-2.5 text-sm text-text-1 focus:outline-none focus:ring-1 focus:ring-brand transition-all min-h-20 resize-none"
              placeholder="Details about your goal..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2.5 text-sm text-text-1 focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="Health">Health</option>
                <option value="Career">Career</option>
                <option value="Finance">Finance</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2.5 text-sm text-text-1 focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="Short-term">Short-term</option>
                <option value="Long-term">Long-term</option>
                <option value="Habit">Habit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {initialData && (
              <div>
                <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2">Progress (%)</label>
                <input
                  type="number"
                  min="0" max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                  className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2.5 text-sm text-text-1 focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                />
              </div>
            )}
            <div className={initialData ? "" : "col-span-2"}>
              <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2">Target Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2.5 pl-9 text-sm text-text-1 focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                />
                <CalendarIcon className="w-4 h-4 text-text-3 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Saving..." : "Save Goal"}
          </Button>
        </form>
      </div>
    </Modal>
  )
}
