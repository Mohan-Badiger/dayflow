import mongoose from "mongoose"

const WorkoutSetSchema = new mongoose.Schema({
  exerciseName: { type: String },
  sets: [{
    reps:      { type: Number, min: 0 },
    weight:    { type: Number, min: 0, default: 0 },
    duration:  { type: Number, min: 0, default: 0 },
    completed: { type: Boolean, default: false },
  }],
  restBetweenSets: { type: Number, default: 60 },
  notes: { type: String, maxlength: 500 },
}, { _id: true })

const WorkoutLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  workoutName:     { type: String, default: "Custom Workout", maxlength: 200 },
  category:        { type: String, default: "full-body" },
  environment:     { type: String, enum: ["gym", "home", "outdoor", "anywhere"], default: "gym" },
  exercises:       { type: [WorkoutSetSchema], default: [] },
  totalDurationMin:{ type: Number, default: 0 },
  caloriesBurned:  { type: Number, default: 0 },
  feeling:         { type: Number, min: 1, max: 5, default: 3 },
  notes:           { type: String, maxlength: 1000 },
  completed:       { type: Boolean, default: false },
}, { timestamps: true })

WorkoutLogSchema.index({ userId: 1, date: -1 })

export default mongoose.models.WorkoutLog ||
  mongoose.model("WorkoutLog", WorkoutLogSchema)
