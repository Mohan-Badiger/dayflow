import { z } from "zod"

const timeStr = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Must be HH:MM format")
  .optional()
  .or(z.literal(""))

const dateStr = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")

export const schemas = {

  // ─ User ─────────────────────────────────────────────
  updateSettings: z.object({
    theme:               z.string().optional(),
    wakeTarget:          timeStr,
    sleepTarget:         timeStr,
    studyGoalHours:      z.number().min(0).max(24).optional(),
    waterGoal:           z.number().min(1).max(20).optional(),
    timezone:            z.string().max(50).optional(),
    weekStartsOn:        z.enum(["monday","sunday"]).optional(),
  }),

  updateJobGoal: z.object({
    role:                  z.string().max(200).optional(),
    targetDate:            z.string().optional().nullable(),
    weeklyHours:           z.number().min(0).optional(),
    totalTargetHours:      z.number().min(0).optional(),
  }),

  // ─ DayLog ───────────────────────────────────────────
  updateRoutine: z.object({
    wakeTime:  timeStr,
    sleepTime: timeStr,
    morningChecklist: z.object({
      exercise:         z.boolean().optional(),
      meditation:       z.boolean().optional(),
      coldShower:       z.boolean().optional(),
      breakfast:        z.boolean().optional(),
      reviewedPlan:     z.boolean().optional(),
      noPhoneFirstHour: z.boolean().optional(),
    }).optional(),
    nightChecklist: z.object({
      reviewedDay:       z.boolean().optional(),
      plannedTomorrow:   z.boolean().optional(),
      readingOrLearning: z.boolean().optional(),
      screenOffBy:       timeStr,
    }).optional(),
  }),

  addWorkSession: z.object({
    topic:           z.string().max(200).optional(),
    platform:        z.string().max(100).optional(),
    startTime:       timeStr,
    endTime:         timeStr,
    durationMinutes: z.number().min(0).optional(),
    notes:           z.string().max(1000).optional(),
    quality:         z.number().min(1).max(5).optional(),
  }),

  updateDiet: z.object({
    waterGlasses: z.number().min(0).max(20).optional(),
    junkFood:     z.boolean().optional(),
    notes:        z.string().max(500).optional(),
  }),

  addMeal: z.object({
    type:        z.enum(["Breakfast","Lunch","Dinner","Snack"]),
    description: z.string().max(300).optional(),
    time:        timeStr,
    isHealthy:   z.boolean().optional(),
  }),


  updateReview: z.object({
    wins:             z.string().max(1000).optional(),
    blockers:         z.string().max(1000).optional(),
    tomorrowPriority: z.string().max(500).optional(),
    reflection:       z.string().max(2000).optional(),
    gratitude:        z.string().max(500).optional(),
  }),

  // ─ Timetable ────────────────────────────────────────
  addBlock: z.object({
    title:    z.string().min(1).max(200),
    category: z.enum(["study","exercise","meal",
                       "routine","break","personal"]),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime:   z.string().regex(/^\d{2}:\d{2}$/),
    notes:     z.string().max(500).optional(),
    status:    z.enum(["planned","in-progress","done","skipped"])
                .optional(),
  }),

  updateBlock: z.object({
    title:     z.string().min(1).max(200).optional(),
    category:  z.enum(["study","exercise","meal",
                        "routine","break","personal"]).optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    endTime:   z.string().regex(/^\d{2}:\d{2}$/).optional(),
    notes:     z.string().max(500).optional(),
    status:    z.enum(["planned","in-progress","done","skipped"])
                .optional(),
  }),


  // ─ Template ─────────────────────────────────────────
  createTemplate: z.object({
    name:        z.string().min(1).max(100),
    description: z.string().max(300).optional(),
    isDefault:   z.boolean().optional(),
    blocks: z.array(z.object({
      title:     z.string().min(1).max(200),
      category:  z.enum(["study","exercise","meal",
                          "routine","break","personal"]),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      endTime:   z.string().regex(/^\d{2}:\d{2}$/),
      notes:     z.string().max(300).optional(),
    })).optional(),
  }),

  applyTemplate: z.object({
    date: dateStr,
  }),

  // ─ Weekly ────────────────────────────────────────────
  createWeekly: z.object({
    weekStartDate: dateStr,
    theme:         z.string().max(200).optional(),
    priorities:    z.array(z.string().max(200)).max(3).optional(),
    goals: z.array(z.object({
      category:       z.string().max(100),
      targetHours:    z.number().min(0),
      targetSessions: z.number().min(0),
      notes:          z.string().max(200).optional(),
    })).optional(),
  }),

  // ─ Goal ──────────────────────────────────────────────
  createGoal: z.object({
    title:       z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    category:    z.enum(["Health", "Career", "Finance", "Personal", "Other"]).optional(),
    type:        z.enum(["Short-term", "Long-term", "Habit"]).optional(),
    progress:    z.number().min(0).max(100).optional(),
    targetDate:  dateStr.optional().nullable(),
    subTasks: z.array(z.object({
      title: z.string().min(1),
      completed: z.boolean().optional(),
    })).optional(),
  }),

  updateGoal: z.object({
    title:       z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    category:    z.enum(["Health", "Career", "Finance", "Personal", "Other"]).optional(),
    type:        z.enum(["Short-term", "Long-term", "Habit"]).optional(),
    status:      z.enum(["Not Started", "In Progress", "Completed", "Paused"]).optional(),
    progress:    z.number().min(0).max(100).optional(),
    targetDate:  dateStr.optional().nullable(),
    subTasks: z.array(z.object({
      _id: z.string().optional(),
      title: z.string().min(1),
      completed: z.boolean().optional(),
    })).optional(),
  }),
}
