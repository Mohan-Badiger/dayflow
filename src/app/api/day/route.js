import { auth }          from "@/lib/auth"
import connectDB         from "@/lib/db"
import User              from "@/models/User"
import { 
  getOrCreateDayLog, 
  recalcAndSave,
  ok,
  err,
  unauthorized,
  serverError
} from "@/lib/daylogHelpers"

export async function GET(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
      return err("Valid date (YYYY-MM-DD) required")

    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    return ok(log)
  } catch (e) { return serverError(e) }
}

export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { date } = await req.json()
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
      return err("Valid date required")
    await connectDB()
    const log = await getOrCreateDayLog(session.user.id, date)
    return ok(log, "Day log ready", 201)
  } catch (e) { return serverError(e) }
}
