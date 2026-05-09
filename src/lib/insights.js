export function generateInsights(logs) {
  const insights = []
  if (!logs || logs.length < 3) return insights

  // Exercise vs study correlation
  const exDays  = logs.filter(l => l.exercise?.done)
  const noExDays = logs.filter(l => !l.exercise?.done)
  const exStudy  = avg(exDays,   l => totalStudyMins(l))
  const noExStudy= avg(noExDays, l => totalStudyMins(l))
  if (exStudy > noExStudy * 1.2 && exDays.length >= 3) {
    const pct = Math.round(((exStudy - noExStudy) / noExStudy) * 100)
    insights.push({
      type: "correlation",
      icon: "exercise",
      text: `You study ${pct}% more on days you exercise.`,
    })
  }

  // Wake time vs score
  const earlyDays = logs.filter(l => {
    const t = timeToMins(l.routine?.wakeTime)
    return t !== null && t <= 7 * 60
  })
  const lateDays = logs.filter(l => {
    const t = timeToMins(l.routine?.wakeTime)
    return t !== null && t > 7 * 60
  })
  if (earlyDays.length >= 3 && lateDays.length >= 3) {
    const earlyScore = avg(earlyDays, l => l.dayScore)
    const lateScore  = avg(lateDays,  l => l.dayScore)
    if (earlyScore > lateScore + 8) {
      insights.push({
        type: "routine",
        icon: "wake",
        text: `Your day score is ${Math.round(earlyScore - lateScore)} pts higher when you wake before 7am.`,
      })
    }
  }

  // Water goal consistency
  const waterDays = logs.filter(l => l.diet?.waterGlasses >= 8)
  const waterPct  = Math.round((waterDays.length / logs.length) * 100)
  if (waterPct < 50) {
    insights.push({
      type: "health",
      icon: "water",
      text: `You hit your water goal only ${waterPct}% of days. Try keeping a bottle visible.`,
    })
  } else if (waterPct >= 80) {
    insights.push({
      type: "health",
      icon: "water",
      text: `Great hydration — you hit your water goal ${waterPct}% of days this period.`,
    })
  }

  // Timetable completion
  const planDays = logs.filter(l => (l.timetable || []).length > 0)
  if (planDays.length >= 3) {
    const planScore = avg(planDays, l => l.dayScore)
    const noPlanScore = avg(
      logs.filter(l => (l.timetable || []).length === 0),
      l => l.dayScore
    )
    if (planScore > noPlanScore + 10) {
      insights.push({
        type: "timetable",
        icon: "calendar",
        text: `Days when you plan your timetable score ${Math.round(planScore - noPlanScore)} pts higher.`,
      })
    }
  }

  // Evening review
  const reviewDays = logs.filter(l =>
    l.eveningReview?.reflection?.trim()?.length > 0
  )
  if (reviewDays.length / logs.length < 0.4) {
    insights.push({
      type: "routine",
      icon: "review",
      text: `You completed evening reviews on only ${reviewDays.length}/${logs.length} days. Reflection builds momentum.`,
    })
  }

  // Study streak
  const todayIdx = logs.length - 1
  let studyStreak = 0
  for (let i = todayIdx; i >= 0; i--) {
    if (totalStudyMins(logs[i]) > 0) studyStreak++
    else break
  }
  if (studyStreak >= 3) {
    insights.push({
      type: "study",
      icon: "fire",
      text: `You've logged study sessions ${studyStreak} days in a row. Keep it up!`,
    })
  }

  return insights.slice(0, 6)
}

function avg(arr, fn) {
  if (!arr.length) return 0
  return arr.reduce((s, i) => s + (fn(i) || 0), 0) / arr.length
}

function totalStudyMins(log) {
  return (log.workSessions || []).reduce(
    (s, w) => s + (w.durationMinutes || 0), 0
  )
}

function timeToMins(t) {
  if (!t || !t.includes(":")) return null
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}
