import { auth }        from "@/lib/auth"
import connectDB       from "@/lib/db"
import User            from "@/models/User"
import { getOrCreateDayLog, recalcAndSave } from "@/lib/daylogHelpers"
import { schemas }     from "@/lib/validations"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"

export async function GET(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await params
    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    return ok(log.diet.meals)
  } catch (e) { return serverError(e) }
}

export async function POST(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await params

    const body   = await req.json()
    const parsed = schemas.addMeal.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    log.diet.meals.push(parsed.data)
    log.markModified("diet")

    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)
    return ok(
      updated.diet.meals[updated.diet.meals.length - 1],
      "Meal added", 201
    )
  } catch (e) { return serverError(e) }
}
