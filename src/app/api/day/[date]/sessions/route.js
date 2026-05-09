import { auth }        from "@/lib/auth"
import connectDB       from "@/lib/db"
import User            from "@/models/User"
import { 
  getOrCreateDayLog, recalcAndSave, calcDuration,
  ok, err, unauthorized, serverError 
} from "@/lib/daylogHelpers"
import { schemas }     from "@/lib/validations"

export async function GET(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await params
    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    return ok(log.workSessions)
  } catch (e) { return serverError(e) }
}

export async function POST(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await params

    const body   = await req.json()
    const parsed = schemas.addWorkSession.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    const d = parsed.data
    if (!d.durationMinutes && d.startTime && d.endTime) {
      d.durationMinutes = calcDuration(d.startTime, d.endTime)
    }

    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    log.workSessions.push(d)

    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)

    return ok(
      updated.workSessions[updated.workSessions.length - 1],
      "Session added", 201
    )
  } catch (e) { return serverError(e) }
}
