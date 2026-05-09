import { auth }        from "@/lib/auth"
import connectDB       from "@/lib/db"
import User            from "@/models/User"
import { getOrCreateDayLog, recalcAndSave } from "@/lib/daylogHelpers"
import { schemas }     from "@/lib/validations"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"

export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await params

    const body   = await req.json()
    const parsed = schemas.updateExercise.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    Object.assign(log.exercise, parsed.data)
    log.markModified("exercise")

    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)
    return ok(
      { exercise: updated.exercise, dayScore: updated.dayScore },
      "Exercise updated"
    )
  } catch (e) { return serverError(e) }
}
