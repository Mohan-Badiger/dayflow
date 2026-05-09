import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import DayLog        from "@/models/DayLog"
import HabitLog      from "@/models/HabitLog"
import Habit         from "@/models/Habit"
import { generateInsights } from "@/lib/insights"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"
import { format, subDays } from "date-fns"

export async function GET(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") || "30")
    const to   = searchParams.get("to")   || format(new Date(), "yyyy-MM-dd")
    const from = searchParams.get("from") ||
      format(subDays(new Date(), days - 1), "yyyy-MM-dd")

    await connectDB()

    const logs = await DayLog.find({
      userId: session.user.id,
      date: { $gte: from, $lte: to }
    }).sort({ date: 1 }).lean()

    // ── Day score trend ──────────────────────────────
    const scoreTrend = logs.map(l => ({
      date:       l.date,
      score:      l.dayScore,
      label:      l.scoreLabel,
      routine:    l.scoreBreakdown?.routineScore   || 0,
      timetable:  l.scoreBreakdown?.timetableScore || 0,
      health:     l.scoreBreakdown?.healthScore    || 0,
    }))

    // ── Study hours per day ──────────────────────────
    const studyByDay = logs.map(l => ({
      date: l.date,
      totalMins: (l.workSessions || []).reduce(
        (s, w) => s + (w.durationMinutes || 0), 0
      ),
      byCategory: (l.workSessions || []).reduce((acc, w) => {
        acc[w.category] = (acc[w.category] || 0) + (w.durationMinutes || 0)
        return acc
      }, {}),
    }))

    // ── Category totals ──────────────────────────────
    const categoryTotals = {}
    logs.forEach(l => {
      ;(l.workSessions || []).forEach(w => {
        categoryTotals[w.category] =
          (categoryTotals[w.category] || 0) + (w.durationMinutes || 0)
      })
    })

    // ── Timetable completion ─────────────────────────
    const timetableStats = logs.map(l => {
      const blocks   = l.timetable || []
      const total    = blocks.length
      const done     = blocks.filter(b => b.status === "done").length
      const skipped  = blocks.filter(b => b.status === "skipped").length
      const planned  = blocks.filter(b => b.status === "planned").length
      return { date: l.date, total, done, skipped, planned,
               pct: total > 0 ? Math.round((done/total)*100) : null }
    })

    // ── Habit consistency ────────────────────────────
    const habits    = await Habit.find({
      userId: session.user.id, isActive: true
    }).lean()
    const habitLogs = await HabitLog.find({
      userId: session.user.id,
      date: { $gte: from, $lte: to }
    }).lean()

    const habitStats = habits.map(h => {
      const hLogs = habitLogs.filter(
        l => l.habitId.toString() === h._id.toString()
      )
      const completed = hLogs.filter(l => l.completed).length
      const rate = hLogs.length > 0
        ? Math.round((completed / hLogs.length) * 100) : 0
      return {
        _id:  h._id, name: h.name, color: h.color,
        completed, total: hLogs.length, rate,
        currentStreak: h.currentStreak,
      }
    }).sort((a, b) => b.rate - a.rate)

    // ── Water & exercise ─────────────────────────────
    const totalExerciseDays = logs.filter(l => l.exercise?.done).length
    const avgWater = logs.length
      ? +(logs.reduce((s, l) =>
          s + (l.diet?.waterGlasses || 0), 0) / logs.length
        ).toFixed(1)
      : 0

    // ── Overall stats ────────────────────────────────
    const totalStudyMins = Object.values(categoryTotals)
      .reduce((s, v) => s + v, 0)
    const avgScore = logs.length
      ? Math.round(logs.reduce((s, l) => s + l.dayScore, 0) / logs.length)
      : 0
    const bestDay  = logs.reduce(
      (b, l) => l.dayScore > (b?.dayScore || 0) ? l : b, null
    )
    const worstDay = logs.filter(l => l.dayScore > 0).reduce(
      (b, l) => !b || l.dayScore < b.dayScore ? l : b, null
    )

    // ── Insights ─────────────────────────────────────
    const insights = generateInsights(logs)

    return ok({
      period: { from, to, days: logs.length },
      scoreTrend,
      studyByDay,
      categoryTotals,
      timetableStats,
      habitStats,
      health: { totalExerciseDays, avgWater },
      summary: {
        avgScore, bestDay, worstDay,
        totalStudyHours: +(totalStudyMins / 60).toFixed(1),
        daysLogged: logs.length,
      },
      insights,
    })
  } catch (e) { return serverError(e) }
}
