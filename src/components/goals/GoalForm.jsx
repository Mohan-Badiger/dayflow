"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, Plus, Trash2, Check } from "lucide-react"
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
    subTasks: initialData?.subTasks || [],
  })

  const [loading, setLoading] = useState(false)

  const calculateProgress = (subTasks) => {
    if (!subTasks || subTasks.length === 0) return formData.progress
    const completed = subTasks.filter(st => st.completed).length
    return Math.round((completed / subTasks.length) * 100)
  }

  const handleAddSubTask = () => {
    const updatedSubTasks = [...formData.subTasks, { title: "", completed: false }]
    setFormData({
      ...formData,
      subTasks: updatedSubTasks,
      progress: calculateProgress(updatedSubTasks)
    })
  }

  const handleRemoveSubTask = (index) => {
    const updatedSubTasks = formData.subTasks.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      subTasks: updatedSubTasks,
      progress: calculateProgress(updatedSubTasks)
    })
  }

  const handleSubTaskTitleChange = (index, value) => {
    const updatedSubTasks = formData.subTasks.map((sub, i) => 
      i === index ? { ...sub, title: value } : sub
    )
    setFormData({
      ...formData,
      subTasks: updatedSubTasks
    })
  }

  const handleSubTaskCheckboxChange = (index, checked) => {
    const updatedSubTasks = formData.subTasks.map((sub, i) => 
      i === index ? { ...sub, completed: checked } : sub
    )
    setFormData({
      ...formData,
      subTasks: updatedSubTasks,
      progress: calculateProgress(updatedSubTasks)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(formData)
    setLoading(false)
    onClose()
  }

  const hasSubTasks = formData.subTasks && formData.subTasks.length > 0

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

          {/* Subtasks Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs sm:text-sm font-bold text-text-2">Subtasks</label>
              <button
                type="button"
                onClick={handleAddSubTask}
                className="text-xs font-semibold text-brand hover:opacity-85 transition-opacity flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Subtask
              </button>
            </div>
            
            {formData.subTasks.length === 0 ? (
              <p className="text-xs text-text-3 italic bg-surface-3 p-3 rounded-sm border border-border/50 text-center">
                No subtasks added yet. Add subtasks to track progress automatically.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {formData.subTasks.map((sub, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSubTaskCheckboxChange(index, !sub.completed)}
                      className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-all cursor-pointer ${
                        sub.completed 
                          ? 'bg-brand border-brand text-text-1' 
                          : 'border-border-2 hover:border-brand bg-surface-2'
                      }`}
                    >
                      {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <input
                      type="text"
                      required
                      value={sub.title}
                      onChange={(e) => handleSubTaskTitleChange(index, e.target.value)}
                      placeholder="Subtask title"
                      className="flex-1 bg-surface-2 border border-border rounded-sm px-3 py-1.5 text-xs sm:text-sm text-text-1 focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubTask(index)}
                      className="p-1.5 rounded-sm hover:bg-danger/10 text-text-3 hover:text-danger transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {!hasSubTasks ? (
              initialData && (
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
              )
            ) : (
              <div>
                <label className="block text-xs sm:text-sm font-bold mb-1.5 text-text-2">Progress (%)</label>
                <div className="w-full bg-surface-3 border border-border rounded-sm px-3 py-2.5 text-sm text-text-3 font-semibold select-none">
                  {formData.progress}% (Auto)
                </div>
              </div>
            )}
            <div className={(!hasSubTasks && !initialData) ? "col-span-2" : ""}>
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

          <Button type="submit" disabled={loading} className="w-full mt-4 cursor-pointer">
            {loading ? "Saving..." : "Save Goal"}
          </Button>
        </form>
      </div>
    </Modal>
  )
}
