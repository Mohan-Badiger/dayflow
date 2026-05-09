import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import { EXERCISE_LIBRARY } from "@/lib/exerciseData"
import { ok, unauthorized, serverError } from "@/lib/apiResponse"

// GET /api/exercises — return full exercise library (server-side filtered)
export async function GET(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const environment = searchParams.get("environment")
    const difficulty = searchParams.get("difficulty")
    const search = searchParams.get("q")

    let exercises = [...EXERCISE_LIBRARY]

    if (category && category !== "all") {
      exercises = exercises.filter(e => e.category === category)
    }
    if (environment && environment !== "all") {
      exercises = exercises.filter(e => e.environment === environment || e.environment === "anywhere")
    }
    if (difficulty && difficulty !== "all") {
      exercises = exercises.filter(e => e.difficulty === difficulty)
    }
    if (search) {
      const q = search.toLowerCase()
      exercises = exercises.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.muscleGroups.some(m => m.toLowerCase().includes(q)) ||
        e.equipment.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      )
    }

    return ok(exercises)
  } catch (e) {
    return serverError(e)
  }
}
