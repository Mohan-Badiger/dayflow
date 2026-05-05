import mongoose from "mongoose";

const weeklyGoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weekStartDate: { type: String, required: true }, // "YYYY-MM-DD" (Monday)
    goals: [
      {
        category: { type: String },
        targetHours: { type: Number },
        targetSessions: { type: Number },
        notes: { type: String },
      },
    ],
    reflection: { type: String },
    nextWeekFocus: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

weeklyGoalSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

export default mongoose.models.WeeklyGoal || mongoose.model("WeeklyGoal", weeklyGoalSchema);
