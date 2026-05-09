import User from "@/models/User"
import { format, subDays, parseISO } from "date-fns"

export async function updateStreak(userId, activityDate) {
  const user = await User.findById(userId)
  if (!user) return

  const today     = activityDate
  const yesterday = format(subDays(parseISO(activityDate), 1), "yyyy-MM-dd")
  const last      = user.lastActiveDate

  let streak = user.streak

  if (last === today) {
    // same day, no change
  } else if (last === yesterday) {
    streak += 1
  } else if (!last) {
    streak = 1
  } else {
    streak = 1
  }

  const longest = Math.max(streak, user.longestStreak || 0)

  await User.findByIdAndUpdate(userId, {
    streak,
    longestStreak:  longest,
    lastActiveDate: today,
    $inc: { totalDaysLogged: last === today ? 0 : 1 },
  })

  return { streak, longestStreak: longest }
}
