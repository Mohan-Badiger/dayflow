import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import Habit         from "@/models/Habit"
import { schemas }   from "@/lib/validations"
import { ok, unauthorized, serverError, err } from "@/lib/daylogHelpers"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    await connectDB()
    const habits = await Habit.find({
      userId: session.user.id, isActive: true
    }).sort({ order: 1, createdAt: 1 }).lean()
    return ok(habits)
  } catch (e) { return serverError(e) }
}

export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const body   = await req.json()
    const parsed = schemas.createHabit.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const habit = await Habit.create({
      ...parsed.data,
      userId: session.user.id,
    })
    return ok(habit, "Habit created", 201)
  } catch (e) { return serverError(e) }
}
