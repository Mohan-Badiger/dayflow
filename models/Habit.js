import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true }, // "routine", "health", "study", "diet", "custom"
    targetDays: { type: [String], required: true }, // ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    color: { type: String, default: "#7F77DD" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Habit || mongoose.model("Habit", habitSchema);
