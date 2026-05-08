import mongoose from "mongoose";

const dayLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"

    routine: {
      wakeTime: { type: String },
      sleepTime: { type: String },
      morningChecklist: {
        exercise: { type: Boolean, default: false },
        meditation: { type: Boolean, default: false },
        coldShower: { type: Boolean, default: false },
        breakfast: { type: Boolean, default: false },
        reviewedPlan: { type: Boolean, default: false },
        noPhoneFirstHour: { type: Boolean, default: false },
      },
      nightChecklist: {
        reviewedDay: { type: Boolean, default: false },
        plannedTomorrow: { type: Boolean, default: false },
        readingOrLearning: { type: Boolean, default: false },
        screenOffBy: { type: String },
      },
    },

    workSessions: [
      {
        category: { type: String },
        topic: { type: String },
        platform: { type: String },
        startTime: { type: String },
        endTime: { type: String },
        durationMinutes: { type: Number },
        notes: { type: String },
        quality: { type: Number }, // 1-5
      },
    ],

    diet: {
      meals: [
        {
          type: { type: String }, // "Breakfast", "Lunch", "Dinner", "Snack"
          description: { type: String },
          time: { type: String },
          isHealthy: { type: Boolean, default: true },
        },
      ],
      waterGlasses: { type: Number, default: 0 },
      junkFood: { type: Boolean, default: false },
      notes: { type: String },
    },

    exercise: {
      done: { type: Boolean, default: false },
      type: { type: String },
      durationMinutes: { type: Number, default: 0 },
      notes: { type: String },
    },

    timetable: [{
      title: { type: String },               // "React study", "Lunch", "Evening walk"
      category: {
        type: String,
        enum: ['study','exercise','meal','routine','break','personal'],
        default: 'study'
      },
      startTime: { type: String },           // "09:00" (24hr format)
      endTime: { type: String },           // "11:00"
      durationMinutes: { type: Number },     // auto-calculated on save
      notes: { type: String },
      status: {
        type: String,
        enum: ['planned','in-progress','done','skipped'],
        default: 'planned'
      },
      color: { type: String },               // optional override hex
    }],

    eveningReview: {
      wins: { type: String },
      blockers: { type: String },
      tomorrowTopPriority: { type: String },
      reflection: { type: String },
      gratitude: { type: String },
    },

    dayScore: { type: Number, default: 0 }, // 0-100
    scoreBreakdown: {
      routineScore: { type: Number, default: 0 },
      timetableScore: { type: Number, default: 0 },
      healthScore: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

dayLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.DayLog || mongoose.model("DayLog", dayLogSchema);
