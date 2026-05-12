import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true,
           lowercase: true, trim: true },
  image: { type: String, default: "" },
  emailVerified: { type: Date, default: null },

  streak:         { type: Number, default: 0, min: 0 },
  longestStreak:  { type: Number, default: 0, min: 0 },
  lastActiveDate: { type: String, default: null }, // "YYYY-MM-DD"
  totalDaysLogged:{ type: Number, default: 0 },

  settings: {
    theme:               { type: String, default: "system" },
    wakeTarget:          { type: String, default: "06:30" },
    sleepTarget:         { type: String, default: "23:00" },
    studyGoalHours:      { type: Number, default: 4, min: 0, max: 24 },
    waterGoal:           { type: Number, default: 8, min: 1, max: 20 },
    timezone:            { type: String, default: "Asia/Kolkata" },
    weekStartsOn:        { type: String, default: "monday", enum: ["monday","sunday"] },
  },

  jobGoal: {
    role:                  { type: String, default: "React / Next.js Developer", trim: true },
    targetDate:            { type: Date,   default: null },
    weeklyHours:           { type: Number, default: 28, min: 0 },
    totalTargetHours:      { type: Number, default: 500, min: 0 },
  },
}, {
  timestamps: true,
  toJSON:   { virtuals: true },
  toObject: { virtuals: true },
})

UserSchema.virtual("id").get(function() {
  return this._id.toHexString()
})


export default mongoose.models.User ||
  mongoose.model("User", UserSchema)
