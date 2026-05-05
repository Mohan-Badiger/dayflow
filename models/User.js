import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    settings: {
      wakeTarget: { type: String, default: "06:30" },
      sleepTarget: { type: String, default: "23:00" },
      dailyStudyGoalHours: { type: Number, default: 4 },
      waterGoalGlasses: { type: Number, default: 8 },
      timezone: { type: String },
      reminderTime: { type: String, default: "20:00" },
    },
    jobGoal: {
      role: { type: String, default: "React / Next.js Developer" },
      targetDate: { type: Date },
      weeklyStudyHourTarget: { type: Number, default: 28 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
