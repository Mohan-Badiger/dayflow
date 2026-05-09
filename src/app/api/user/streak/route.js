import { auth }    from "@/lib/auth"
import connectDB   from "@/lib/db"
import User        from "@/models/User"
import { ok, unauthorized, serverError } from "@/lib/apiResponse"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    await connectDB()
    const user = await User.findById(session.user.id)
      .select("streak longestStreak lastActiveDate totalDaysLogged").lean()
    return ok(user)
  } catch (e) { return serverError(e) }
}
