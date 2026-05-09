import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import Habit         from "@/models/Habit"
import HabitLog      from "@/models/HabitLog"
import { schemas }   from "@/lib/validations"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"

export async function GET(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")
    if (!date) return err("date required")
    await connectDB()
    const logs = await HabitLog.find({ userId: session.user.id, date }).lean()
    return ok(logs)
  } catch (e) { return serverError(e) }
}

export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const body   = await req.json()
    const parsed = schemas.toggleHabit.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    const { habitId, date, completed, notes } = parsed.data

    await connectDB()

    // Verify habit belongs to user
    const habit = await Habit.findOne({
      _id: habitId, userId: session.user.id
    })
    if (!habit) return err("Habit not found", 404)

    const log = await HabitLog.findOneAndUpdate(
      { habitId, date },
      {
        userId: session.user.id,
        habitId, date, completed,
        notes: notes || "",
        completedAt: completed ? new Date() : null,
      },
      { upsert: true, new: true }
    )

    // Update habit streak
    await updateHabitStreak(habit, session.user.id)

    return ok(log, completed ? "Habit completed!" : "Habit unchecked")
  } catch (e) { return serverError(e) }
}

async function updateHabitStreak(habit, userId) {
  const logs = await HabitLog.find({
    habitId: habit._id, completed: true
  }).sort({ date: -1 }).limit(100).lean()

  let streak = 0
  const today = new Date()
  for (let i = 0; i < logs.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    const expectedStr = expected.toISOString().split("T")[0]
    if (logs[i]?.date === expectedStr) streak++
    else break
  }

  await Habit.findByIdAndUpdate(habit._id, {
    currentStreak:  streak,
    longestStreak:  Math.max(streak, habit.longestStreak || 0),
    totalCompleted: await HabitLog.countDocuments({
      habitId: habit._id, completed: true
    }),
  })
}
