import User from "@/models/User"
import { format, subDays, parseISO, isBefore } from "date-fns"

export async function updateStreak(userId, activityDate) {
  const user = await User.findById(userId)
  if (!user) return

  const today     = activityDate
  const yesterday = format(subDays(parseISO(activityDate), 1), "yyyy-MM-dd")
  const last      = user.lastActiveDate

  let streak = user.streak || 0
  let isNewDay = false;

  if (last === today) {
    // same day, no change
  } else if (!last) {
    streak = 1
    isNewDay = true;
  } else {
    const actDate = parseISO(activityDate);
    const lstDate = parseISO(last);
    if (isBefore(actDate, lstDate)) {
      // Historical date update. Don't touch streak.
      return { streak: user.streak, longestStreak: user.longestStreak }
    }
    
    if (last === yesterday) {
      streak += 1
    } else {
      streak = 1
    }
    isNewDay = true;
  }

  const longest = Math.max(streak, user.longestStreak || 0)

  if (isNewDay || !last) {
    await User.findByIdAndUpdate(userId, {
      streak,
      longestStreak:  longest,
      lastActiveDate: today,
      $inc: { totalDaysLogged: 1 },
    })
  }

  return { streak, longestStreak: longest }
}
