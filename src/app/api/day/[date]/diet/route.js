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
    return ok(log.diet)
  } catch (e) { return serverError(e) }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await params

    const body   = await req.json()
    const parsed = schemas.updateDiet.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    Object.assign(log.diet, parsed.data)
    log.markModified("diet")

    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)
    return ok({ diet: updated.diet, dayScore: updated.dayScore }, "Diet updated")
  } catch (e) { return serverError(e) }
}
