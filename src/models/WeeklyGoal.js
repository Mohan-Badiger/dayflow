import mongoose from "mongoose"

const WeeklyGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  weekStartDate: { type: String, required: true }, // "YYYY-MM-DD" Monday
  weekEndDate:   { type: String, required: true }, // "YYYY-MM-DD" Sunday

  theme:       { type: String, trim: true, maxlength: 200 },
  priorities:  { type: [String], maxlength: 3 },

  goals: [{
    category:       { type: String },
    targetHours:    { type: Number, default: 0, min: 0 },
    targetSessions: { type: Number, default: 0, min: 0 },
    notes:          { type: String, maxlength: 200 },
  }],

  reflection:      { type: String, maxlength: 2000 },
  nextWeekFocus:   { type: String, maxlength: 500 },
  completedAt:     { type: Date },

  actualHours:    { type: Number, default: 0 },
  actualSessions: { type: Number, default: 0 },
  avgDayScore:    { type: Number, default: 0 },
}, {
  timestamps: true,
})

WeeklyGoalSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true })

export default mongoose.models.WeeklyGoal ||
  mongoose.model("WeeklyGoal", WeeklyGoalSchema)
