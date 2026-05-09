import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import WorkoutLog from "@/models/WorkoutLog"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"

// GET /api/workouts — get user's workout history
export async function GET(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "30")
    const date = searchParams.get("date")

    await connectDB()

    const query = { userId: session.user.id }
    if (date) query.date = date

    const workouts = await WorkoutLog.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .lean()

    // Compute weekly stats
    const now = new Date()
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)
    const weekStartStr = weekStart.toISOString().split("T")[0]

    const weeklyWorkouts = workouts.filter(w => w.date >= weekStartStr)
    const stats = {
      totalWorkouts: workouts.length,
      weeklyWorkouts: weeklyWorkouts.length,
      weeklyMinutes: weeklyWorkouts.reduce((s, w) => s + (w.totalDurationMin || 0), 0),
      weeklyCalories: weeklyWorkouts.reduce((s, w) => s + (w.caloriesBurned || 0), 0),
      streak: calculateStreak(workouts),
    }

    return ok({ workouts, stats })
  } catch (e) {
    return serverError(e)
  }
}

// POST /api/workouts — log a new workout
export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const body = await req.json()
    await connectDB()

    const workout = await WorkoutLog.create({
      userId: session.user.id,
      date: body.date || new Date().toISOString().split("T")[0],
      workoutName: body.workoutName || "Custom Workout",
      category: body.category || "full-body",
      environment: body.environment || "gym",
      exercises: body.exercises || [],
      totalDurationMin: body.totalDurationMin || 0,
      caloriesBurned: body.caloriesBurned || 0,
      feeling: body.feeling || 3,
      notes: body.notes || "",
      completed: body.completed || false,
    })

    return ok(workout, "Workout logged", 201)
  } catch (e) {
    return serverError(e)
  }
}

function calculateStreak(workouts) {
  if (!workouts.length) return 0
  const dates = [...new Set(workouts.map(w => w.date))].sort().reverse()
  let streak = 0
  const today = new Date().toISOString().split("T")[0]

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date()
    expected.setDate(expected.getDate() - i)
    const expectedStr = expected.toISOString().split("T")[0]
    if (dates[i] === expectedStr || (i === 0 && dates[i] === today)) {
      streak++
    } else if (i === 0) {
      // Allow today to not have a workout yet
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (dates[i] === yesterday.toISOString().split("T")[0]) {
        streak++
      } else break
    } else break
  }
  return streak
}
