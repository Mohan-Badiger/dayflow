import { auth }    from "@/lib/auth"
import connectDB   from "@/lib/db"
import User        from "@/models/User"
import { ok, unauthorized, serverError } from "@/lib/apiResponse"

import { updateStreak } from "@/lib/streak"
import { format } from "date-fns"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    await connectDB()
    
    // Automatically update the streak for today when they fetch it
    const today = format(new Date(), "yyyy-MM-dd")
    await updateStreak(session.user.id, today)

    const user = await User.findById(session.user.id)
      .select("streak longestStreak lastActiveDate totalDaysLogged").lean()
    return ok(user)
  } catch (e) { return serverError(e) }
}
