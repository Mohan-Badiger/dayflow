export function calculateDayScore(dayLog, userSettings) {
  const settings = userSettings || {}
  const wakeTarget  = settings.wakeTarget  || "06:30"
  const sleepTarget = settings.sleepTarget || "22:30"
  const waterGoal   = settings.waterGoalGlasses || 8
  const studyGoal   = (settings.dailyStudyGoalHours || 6) * 60

  // ── Routine score (max 35) ──────────────────────────
  let routineScore = 0

  const timeToMins = (t) => {
    if (!t || !t.includes(":")) return null
    const [h, m] = t.split(":").map(Number)
    return h * 60 + m
  }

  const wakeActual  = timeToMins(dayLog.routine?.wakeTime)
  const wakeGoal    = timeToMins(wakeTarget)
  const sleepActual = timeToMins(dayLog.routine?.sleepTime)
  const sleepGoal   = timeToMins(sleepTarget)

  if (wakeActual !== null && wakeGoal !== null && wakeActual <= wakeGoal)
    routineScore += 7
  if (sleepActual !== null && sleepGoal !== null && sleepActual <= sleepGoal)
    routineScore += 7

  const mc = dayLog.routine?.morningChecklist || {}
  const morningDone = Object.values(mc).filter(Boolean).length
  if (morningDone >= 4) routineScore += 7
  else if (morningDone >= 2) routineScore += 3

  const nc = dayLog.routine?.nightChecklist || {}
  const nightDone = Object.values(nc).filter(v =>
    typeof v === "boolean" ? v : Boolean(v)
  ).length
  if (nightDone >= 3) routineScore += 7
  else if (nightDone >= 1) routineScore += 3

  const review = dayLog.eveningReview || {}
  if (review.reflection && review.reflection.trim().length > 20)
    routineScore += 7

  // ── Timetable score (max 35) ────────────────────────
  let timetableScore = 35
  const blocks = dayLog.timetable || []
  if (blocks.length > 0) {
    const done    = blocks.filter(b => b.status === "done").length
    const skipped = blocks.filter(b => b.status === "skipped").length
    const total   = blocks.length
    const completed = done
    const relevant  = total - skipped
    timetableScore = relevant > 0
      ? Math.round((completed / relevant) * 35)
      : 35
  }

  // ── Health score (max 30) ───────────────────────────
  let healthScore = 0

  const water = dayLog.diet?.waterGlasses || 0
  if (water >= waterGoal) healthScore += 10
  else if (water >= waterGoal * 0.5) healthScore += 5

  if (dayLog.exercise?.done) healthScore += 10

  const meals = dayLog.diet?.meals || []
  if (meals.length >= 3) healthScore += 5
  else if (meals.length >= 1) healthScore += 2

  if (!dayLog.diet?.junkFood) healthScore += 5

  // ── Total ───────────────────────────────────────────
  const total = routineScore + timetableScore + healthScore

  const label =
    total >= 90 ? "Perfect day"  :
    total >= 75 ? "Great day"    :
    total >= 60 ? "Good day"     :
    total >= 40 ? "Average day"  :
                  "Rough day"

  return {
    dayScore: Math.min(100, Math.max(0, total)),
    scoreBreakdown: { routineScore, timetableScore, healthScore },
    scoreLabel: label,
  }
}
