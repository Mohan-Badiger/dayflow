import mongoose from "mongoose";

const SubTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a goal title"],
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  category: {
    type: String,
    enum: ["Health", "Career", "Finance", "Personal", "Other"],
    default: "Other",
  },
  type: {
    type: String,
    enum: ["Short-term", "Long-term", "Habit"],
    default: "Long-term",
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed", "Paused"],
    default: "Not Started",
  },
  progress: {
    type: Number, // Percentage (0-100)
    default: 0,
    min: 0,
    max: 100,
  },
  targetDate: {
    type: Date,
  },
  subTasks: [SubTaskSchema],
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
