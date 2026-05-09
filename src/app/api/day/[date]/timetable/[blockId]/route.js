import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import User          from "@/models/User"
import DayLog        from "@/models/DayLog"
import { recalcAndSave, calcDuration } from "@/lib/daylogHelpers"
import { schemas }   from "@/lib/validations"
import { ok, err, unauthorized, notFound, serverError }
  from "@/lib/apiResponse"

export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date, blockId } = await params

    const body   = await req.json()
    const parsed = schemas.updateBlock.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const log   = await DayLog.findOne({ userId: session.user.id, date })
    if (!log)   return notFound("Day log")
    const block = log.timetable.id(blockId)
    if (!block) return notFound("Block")

    Object.assign(block, parsed.data)
    if (block.startTime && block.endTime) {
      block.durationMinutes = calcDuration(block.startTime, block.endTime)
    }
    log.markModified("timetable")

    const user = await User.findById(session.user.id).select("settings").lean()
    const updated = await recalcAndSave(log, user?.settings)
    return ok(updated.timetable.id(blockId), "Block updated")
  } catch (e) { return serverError(e) }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date, blockId } = await params

    await connectDB()
    const log = await DayLog.findOne({ userId: session.user.id, date })
    if (!log) return notFound("Day log")

    log.timetable = log.timetable.filter(
      b => b._id.toString() !== blockId
    )
    log.markModified("timetable")

    const user = await User.findById(session.user.id).select("settings").lean()
    await recalcAndSave(log, user?.settings)
    return ok(null, "Block deleted")
  } catch (e) { return serverError(e) }
}
