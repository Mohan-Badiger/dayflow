import { auth }        from "@/lib/auth"
import connectDB       from "@/lib/db"
import User            from "@/models/User"
import { getOrCreateDayLog, recalcAndSave } from "@/lib/daylogHelpers"
import { schemas }     from "@/lib/validations"
import { updateStreak } from "@/lib/streak"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"

export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await params

    const body   = await req.json()
    const parsed = schemas.updateRoutine.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)

    const d = parsed.data
    if (d.wakeTime  !== undefined) log.routine.wakeTime  = d.wakeTime
    if (d.sleepTime !== undefined) log.routine.sleepTime = d.sleepTime
    if (d.morningChecklist) {
      Object.assign(log.routine.morningChecklist, d.morningChecklist)
    }
    if (d.nightChecklist) {
      Object.assign(log.routine.nightChecklist, d.nightChecklist)
    }
    log.markModified("routine")

    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)
    await updateStreak(session.user.id, date)

    return ok(updated, "Routine updated")
  } catch (e) { return serverError(e) }
}
