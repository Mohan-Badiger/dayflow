import { auth }        from "@/lib/auth"
import connectDB       from "@/lib/db"
import User            from "@/models/User"
import DayTemplate     from "@/models/DayTemplate"
import { getOrCreateDayLog, recalcAndSave, calcDuration }
  from "@/lib/daylogHelpers"
import { schemas }     from "@/lib/validations"
import { ok, err, unauthorized, notFound, serverError }
  from "@/lib/apiResponse"

export async function POST(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { id } = await params

    const body   = await req.json()
    const parsed = schemas.applyTemplate.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    const { date } = parsed.data

    await connectDB()
    const template = await DayTemplate.findOne({
      _id: id, userId: session.user.id
    })
    if (!template) return notFound("Template")

    const log = await getOrCreateDayLog(session.user.id, date)

    const newBlocks = template.blocks.map(b => ({
      title:           b.title,
      category:        b.category,
      startTime:       b.startTime,
      endTime:         b.endTime,
      durationMinutes: calcDuration(b.startTime, b.endTime),
      notes:           b.notes || "",
      status:          "planned",
    }))

    log.timetable = newBlocks
    log.markModified("timetable")

    await DayTemplate.findByIdAndUpdate(id, { $inc: { usageCount: 1 } })

    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)
    return ok(updated.timetable, `Template applied to ${date}`)
  } catch (e) { return serverError(e) }
}
