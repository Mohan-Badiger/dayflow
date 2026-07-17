import mongoose from "mongoose"

const WorkSessionSchema = new mongoose.Schema({
  topic:           { type: String, trim: true, maxlength: 200 },
  platform:        { type: String, trim: true, maxlength: 100 },
  startTime:       { type: String },  // "09:00"
  endTime:         { type: String },  // "11:30"
  durationMinutes: { type: Number, min: 0, default: 0 },
  notes:           { type: String, maxlength: 1000 },
  quality:         { type: Number, min: 1, max: 5, default: 3 },
}, { _id: true })

const TimetableBlockSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true, maxlength: 200 },
  category: {
    type: String,
    enum: ["study","exercise","meal","routine","break","personal"],
    default: "study"
  },
  startTime:       { type: String, required: true },
  endTime:         { type: String, required: true },
  durationMinutes: { type: Number, min: 0, default: 0 },
  notes:  { type: String, maxlength: 500 },
  status: {
    type: String,
    enum: ["planned","in-progress","done","skipped"],
    default: "planned"
  },
  color: { type: String, default: "" },
}, { _id: true })

const MealSchema = new mongoose.Schema({
  type:        { type: String,
                 enum: ["Breakfast","Lunch","Dinner","Snack"],
                 required: true },
  description: { type: String, trim: true, maxlength: 300 },
  time:        { type: String },
  isHealthy:   { type: Boolean, default: true },
}, { _id: true })

const DayLogSchema = new mongoose.Schema({
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

  routine: {
    wakeTime:  { type: String, default: "" },
    sleepTime: { type: String, default: "" },
    morningChecklist: {
      exercise:         { type: Boolean, default: false },
      meditation:       { type: Boolean, default: false },
      coldShower:       { type: Boolean, default: false },
      breakfast:        { type: Boolean, default: false },
      reviewedPlan:     { type: Boolean, default: false },
      noPhoneFirstHour: { type: Boolean, default: false },
    },
    nightChecklist: {
      reviewedDay:      { type: Boolean, default: false },
      plannedTomorrow:  { type: Boolean, default: false },
      readingOrLearning:{ type: Boolean, default: false },
      screenOffBy:      { type: String, default: "" },
    },
  },

  timetable:    { type: [TimetableBlockSchema], default: [] },
  workSessions: { type: [WorkSessionSchema],   default: [] },

  diet: {
    meals:        { type: [MealSchema], default: [] },
    waterGlasses: { type: Number, default: 0, min: 0, max: 20 },
    junkFood:     { type: Boolean, default: false },
    notes:        { type: String, maxlength: 500 },
  },

  eveningReview: {
    wins:              { type: String, maxlength: 1000 },
    blockers:          { type: String, maxlength: 1000 },
    tomorrowPriority:  { type: String, maxlength: 500 },
    reflection:        { type: String, maxlength: 2000 },
    gratitude:         { type: String, maxlength: 500 },
    completedAt:       { type: Date },
  },

  dayScore: { type: Number, default: 0, min: 0, max: 100 },
  scoreBreakdown: {
    routineScore:   { type: Number, default: 0 },
    timetableScore: { type: Number, default: 0 },
    healthScore:    { type: Number, default: 0 },
  },
  scoreLabel: { type: String, default: "No data" },

}, {
  timestamps: true,
  toJSON:   { virtuals: true },
  toObject: { virtuals: true },
})

DayLogSchema.index({ userId: 1, date: 1 }, { unique: true })
DayLogSchema.index({ userId: 1, date: -1 })

export default mongoose.models.DayLog ||
  mongoose.model("DayLog", DayLogSchema)
