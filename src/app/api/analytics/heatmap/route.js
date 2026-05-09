import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import DayLog        from "@/models/DayLog"
import { ok, unauthorized, serverError } from "@/lib/apiResponse"
import { format, subDays } from "date-fns"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const to   = format(new Date(), "yyyy-MM-dd")
    const from = format(subDays(new Date(), 89), "yyyy-MM-dd")

    await connectDB()
    const logs = await DayLog.find({
      userId: session.user.id,
      date: { $gte: from, $lte: to }
    }).select("date dayScore scoreLabel").sort({ date: 1 }).lean()

    const map = {}
    logs.forEach(l => { map[l.date] = { score: l.dayScore, label: l.scoreLabel } })

    return ok({ from, to, data: map })
  } catch (e) { return serverError(e) }
}
