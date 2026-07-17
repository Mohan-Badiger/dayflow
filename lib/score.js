export function calculateDayScore(dayLog, userSettings) {
  let routineScore = 0;
  let timetableScore = 0;
  let healthScore = 0;

  // 1. Routine Score (Max 35)
  if (dayLog.routine) {
    if (dayLog.routine.wakeTime && dayLog.routine.wakeTime <= userSettings.wakeTarget) routineScore += 7;
    if (dayLog.routine.sleepTime && dayLog.routine.sleepTime <= userSettings.sleepTarget) routineScore += 7;

    const morningList = dayLog.routine.morningChecklist;
    if (morningList) {
      const morningChecked = Object.values(morningList).filter(Boolean).length;
      if (morningChecked >= 4) routineScore += 7;
    }

    const nightList = dayLog.routine.nightChecklist;
    if (nightList) {
      const nightChecked = Object.values(nightList).filter(Boolean).length;
      if (nightChecked >= 3) routineScore += 7;
    }
  }

  if (dayLog.eveningReview && dayLog.eveningReview.reflection) {
    routineScore += 7;
  }

  // 2. Timetable Score (Max 35)
  const blocks = dayLog.timetable || [];
  const plannedBlocks = blocks.filter(b => b.status !== 'skipped'); // Assuming skipped might not count towards planned, wait, user said "completedBlocks / totalPlannedBlocks". Or all blocks are planned unless skipped. Let's assume all non-skipped blocks were planned? No, "planned" is a status.
  // "completedBlocks / totalPlannedBlocks * 35"
  // Actually, status can be 'planned', 'in-progress', 'done', 'skipped'. Let's say total planned is all blocks.
  if (blocks.length === 0) {
    timetableScore = 35; // Default if no blocks
  } else {
    const doneBlocks = blocks.filter(b => b.status === 'done').length;
    timetableScore = Math.round((doneBlocks / blocks.length) * 35);
  }

  // 3. Health Score (Max 30)
  if (dayLog.diet) {
    const waterGoal = userSettings.waterGoalGlasses || 8;
    const water = dayLog.diet.waterGlasses || 0;
    if (water >= waterGoal) healthScore += 15;
    else if (water >= waterGoal * 0.5) healthScore += 7;

    const meals = dayLog.diet.meals || [];
    if (meals.length >= 3) healthScore += 5;
    else if (meals.length >= 1) healthScore += 2;

    const allMealsHealthy = meals.length === 0 || meals.every(m => m.isHealthy);
    const noJunk = dayLog.diet.junkFood === false;
    if (noJunk && allMealsHealthy) healthScore += 10;
    else if (noJunk || allMealsHealthy) healthScore += 5;
  }

  const totalScore = Math.min(100, routineScore + timetableScore + healthScore);

  let label = "Rough day";
  if (totalScore >= 90) label = "Perfect day";
  else if (totalScore >= 75) label = "Great day";
  else if (totalScore >= 60) label = "Good day";
  else if (totalScore >= 40) label = "Average day";

  return {
    dayScore: totalScore,
    scoreBreakdown: {
      routineScore,
      timetableScore,
      healthScore
    },
    label
  };
}
