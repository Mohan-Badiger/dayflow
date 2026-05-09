import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import WeeklyGoal    from "@/models/WeeklyGoal"
import DayLog        from "@/models/DayLog"
import { schemas }   from "@/lib/validations"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"
import { format, addDays, startOfWeek, endOfWeek, parseISO } from "date-fns"

export async function GET(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const { searchParams } = new URL(req.url)
    const week = searchParams.get("week")
    if (!week) return err("week date required")

    await connectDB()
    let goal = await WeeklyGoal.findOne({
      userId: session.user.id, weekStartDate: week
    }).lean()

    // Also compute actual hours from DayLogs for this week
    const weekEnd = format(
      endOfWeek(parseISO(week), { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    )
    const logs = await DayLog.find({
      userId: session.user.id,
      date: { $gte: week, $lte: weekEnd }
    }).lean()

    const actualMins = logs.reduce((sum, l) =>
      sum + (l.workSessions || []).reduce(
        (s, w) => s + (w.durationMinutes || 0), 0
      ), 0
    )
    const avgScore = logs.length
      ? Math.round(logs.reduce((s, l) => s + l.dayScore, 0) / logs.length)
      : 0

    return ok({ goal, actualHours: +(actualMins/60).toFixed(1),
                avgDayScore: avgScore, logs: logs.length })
  } catch (e) { return serverError(e) }
}

export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const body   = await req.json()
    const parsed = schemas.createWeekly.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    const weekStart = parsed.data.weekStartDate
    const weekEnd   = format(
      addDays(parseISO(weekStart), 6), "yyyy-MM-dd"
    )

    await connectDB()
    const goal = await WeeklyGoal.findOneAndUpdate(
      { userId: session.user.id, weekStartDate: weekStart },
      { ...parsed.data, weekEndDate: weekEnd, userId: session.user.id },
      { upsert: true, new: true }
    )
    return ok(goal, "Weekly goal saved")
  } catch (e) { return serverError(e) }
}
