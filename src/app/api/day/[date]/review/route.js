import { auth }        from "@/lib/auth"
import connectDB       from "@/lib/db"
import User            from "@/models/User"
import { getOrCreateDayLog, recalcAndSave } from "@/lib/daylogHelpers"
import { schemas }     from "@/lib/validations"
import { updateStreak } from "@/lib/streak"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"

export async function GET(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await params
    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    return ok(log.eveningReview)
  } catch (e) { return serverError(e) }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await params

    const body   = await req.json()
    const parsed = schemas.updateReview.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    Object.assign(log.eveningReview, parsed.data)
    log.eveningReview.completedAt = new Date()
    log.markModified("eveningReview")

    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)
    await updateStreak(session.user.id, date)

    return ok(
      { eveningReview: updated.eveningReview, dayScore: updated.dayScore,
        scoreLabel: updated.scoreLabel },
      "Review saved"
    )
  } catch (e) { return serverError(e) }
}
