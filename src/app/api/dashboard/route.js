import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import User          from "@/models/User"
import Habit         from "@/models/Habit"
import HabitLog      from "@/models/HabitLog"
import DayLog        from "@/models/DayLog"
import { getOrCreateDayLog } from "@/lib/daylogHelpers"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"
import { format } from "date-fns"

export async function GET(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date") || format(new Date(), "yyyy-MM-dd")

    await connectDB()

    const [user, dayLog, habits, habitLogs] = await Promise.all([
      User.findById(session.user.id)
        .select("name image streak longestStreak settings jobGoal totalDaysLogged")
        .lean(),
      getOrCreateDayLog(session.user.id, date),
      Habit.find({ userId: session.user.id, isActive: true })
        .sort({ order: 1 }).lean(),
      HabitLog.find({ userId: session.user.id, date }).lean(),
    ])

    // Merge habit completion status into habits
    const habitsWithStatus = habits.map(h => ({
      ...h,
      completed: habitLogs.some(
        l => l.habitId.toString() === h._id.toString() && l.completed
      ),
    }))

    // Job goal progress
    const jobGoalProgress = user.jobGoal?.totalTargetHours
      ? await calcJobProgress(session.user.id, user.jobGoal.totalTargetHours)
      : null

    return ok({
      user,
      dayLog,
      habits: habitsWithStatus,
      jobGoalProgress,
    })
  } catch (e) { return serverError(e) }
}

async function calcJobProgress(userId, target) {
  const logs  = await DayLog.find({ userId }).lean()
  const total = logs.reduce((s, l) =>
    s + (l.workSessions || []).reduce(
      (ss, w) => ss + (w.durationMinutes || 0), 0
    ), 0
  )
  const hours = +(total / 60).toFixed(1)
  return {
    logged:  hours,
    target,
    percent: Math.min(100, Math.round((hours / target) * 100)),
  }
}
