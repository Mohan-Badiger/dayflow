import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import User          from "@/models/User"
import DayLog        from "@/models/DayLog"
import { recalcAndSave } from "@/lib/daylogHelpers"
import { schemas }   from "@/lib/validations"
import { ok, err, unauthorized, notFound, serverError }
  from "@/lib/apiResponse"

export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date, mealId } = await params

    const body   = await req.json()
    const parsed = schemas.addMeal.partial().safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const log  = await DayLog.findOne({ userId: session.user.id, date })
    if (!log)  return notFound("Day log")
    const meal = log.diet.meals.id(mealId)
    if (!meal) return notFound("Meal")

    Object.assign(meal, parsed.data)
    log.markModified("diet")

    const user = await User.findById(session.user.id).select("settings").lean()
    await recalcAndSave(log, user?.settings)
    return ok(meal, "Meal updated")
  } catch (e) { return serverError(e) }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date, mealId } = await params

    await connectDB()
    const log = await DayLog.findOne({ userId: session.user.id, date })
    if (!log) return notFound("Day log")

    log.diet.meals = log.diet.meals.filter(
      m => m._id.toString() !== mealId
    )
    log.markModified("diet")
    const user = await User.findById(session.user.id).select("settings").lean()
    await recalcAndSave(log, user?.settings)
    return ok(null, "Meal deleted")
  } catch (e) { return serverError(e) }
}
