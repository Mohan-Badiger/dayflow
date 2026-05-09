import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import DayLog        from "@/models/DayLog"
import Habit         from "@/models/Habit"
import HabitLog      from "@/models/HabitLog"
import WeeklyGoal    from "@/models/WeeklyGoal"
import DayTemplate   from "@/models/DayTemplate"
import { unauthorized, serverError } from "@/lib/apiResponse"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    await connectDB()
    const uid = session.user.id

    const [dayLogs, habits, habitLogs, weeklyGoals, templates] =
      await Promise.all([
        DayLog.find({ userId: uid }).sort({ date: -1 }).lean(),
        Habit.find({ userId: uid }).lean(),
        HabitLog.find({ userId: uid }).lean(),
        WeeklyGoal.find({ userId: uid }).lean(),
        DayTemplate.find({ userId: uid }).lean(),
      ])

    const exportData = {
      exportedAt: new Date().toISOString(),
      dayLogs, habits, habitLogs, weeklyGoals, templates,
    }

    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition":
          `attachment; filename="dayflow-export-${Date.now()}.json"`,
      },
    })
  } catch (e) { return serverError(e) }
}
