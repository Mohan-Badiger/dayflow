import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import Habit         from "@/models/Habit"
import { schemas }   from "@/lib/validations"
import { ok, err, unauthorized, notFound, serverError }
  from "@/lib/apiResponse"

export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { id } = await params

    const body   = await req.json()
    const parsed = schemas.createHabit.partial().safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      parsed.data,
      { new: true }
    )
    if (!habit) return notFound("Habit")
    return ok(habit, "Habit updated")
  } catch (e) { return serverError(e) }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { id } = await params

    await connectDB()
    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { isActive: false },
      { new: true }
    )
    if (!habit) return notFound("Habit")
    return ok(null, "Habit archived")
  } catch (e) { return serverError(e) }
}
