import mongoose from "mongoose"

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name:       { type: String, required: true, trim: true, maxlength: 100 },
  category:   {
    type: String,
    enum: ["routine","health","study","diet","custom"],
    default: "custom"
  },
  targetDays: {
    type: [String],
    enum: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    default: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  },
  color:    { type: String, default: "#6366f1" },
  icon:     { type: String, default: "circle" },
  isActive: { type: Boolean, default: true },
  order:    { type: Number, default: 0 },

  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalCompleted:{ type: Number, default: 0 },
}, {
  timestamps: true,
})

HabitSchema.index({ userId: 1, isActive: 1 })

export default mongoose.models.Habit ||
  mongoose.model("Habit", HabitSchema)
