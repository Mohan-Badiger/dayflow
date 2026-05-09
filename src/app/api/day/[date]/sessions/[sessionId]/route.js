import { auth }        from "@/lib/auth"
import connectDB       from "@/lib/db"
import User            from "@/models/User"
import DayLog          from "@/models/DayLog"
import { recalcAndSave, calcDuration } from "@/lib/daylogHelpers"
import { schemas }     from "@/lib/validations"
import { ok, err, unauthorized, notFound, serverError }
  from "@/lib/apiResponse"

export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date, sessionId } = await params

    const body   = await req.json()
    const parsed = schemas.addWorkSession.partial().safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const log = await DayLog.findOne({ userId: session.user.id, date })
    if (!log) return notFound("Day log")

    const ws = log.workSessions.id(sessionId)
    if (!ws) return notFound("Session")

    Object.assign(ws, parsed.data)
    if (ws.startTime && ws.endTime) {
      ws.durationMinutes = calcDuration(ws.startTime, ws.endTime)
    }
    log.markModified("workSessions")

    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)
    return ok(updated.workSessions.id(sessionId), "Session updated")
  } catch (e) { return serverError(e) }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date, sessionId } = await params

    await connectDB()
    const log = await DayLog.findOne({ userId: session.user.id, date })
    if (!log) return notFound("Day log")

    log.workSessions = log.workSessions.filter(
      s => s._id.toString() !== sessionId
    )
    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)
    return ok(null, "Session deleted")
  } catch (e) { return serverError(e) }
}
