import mongoose from "mongoose"

const HabitLogSchema = new mongoose.Schema({
  userId:    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  habitId:   {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  date:        { type: String, required: true },
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date },
  notes:       { type: String, maxlength: 300 },
}, {
  timestamps: true,
})

HabitLogSchema.index({ userId: 1, date: 1 })
HabitLogSchema.index({ habitId: 1, date: 1 }, { unique: true })

export default mongoose.models.HabitLog ||
  mongoose.model("HabitLog", HabitLogSchema)
