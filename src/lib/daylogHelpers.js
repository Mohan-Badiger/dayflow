import DayLog from "@/models/DayLog"
import { calculateDayScore } from "./score"
import { updateStreak } from "./streak"
import connectDB from "./db"

export async function getOrCreateDayLog(userId, date) {
  await connectDB()
  let log = await DayLog.findOne({ userId, date })
  if (!log) {
    log = await DayLog.create({ userId, date })
  }
  return log
}

export async function recalcAndSave(log, userSettings) {
  const { dayScore, scoreBreakdown, scoreLabel } =
    calculateDayScore(log, userSettings)
  log.dayScore        = dayScore
  log.scoreBreakdown  = scoreBreakdown
  log.scoreLabel      = scoreLabel
  await log.save()
  return log
}

export function calcDuration(startTime, endTime) {
  if (!startTime || !endTime) return 0
  const [sh, sm] = startTime.split(":").map(Number)
  const [eh, em] = endTime.split(":").map(Number)
  const diff = (eh * 60 + em) - (sh * 60 + sm)
  return diff > 0 ? diff : 0
}

// API Response Helpers
export function ok(data, message = "Success", status = 200) {
  return Response.json(
    { success: true, data, message },
    { status }
  )
}

export function err(message = "Error", status = 400, details = null) {
  const body = { success: false, error: message }
  if (details) body.details = details
  return Response.json(body, { status })
}

export function unauthorized() {
  return Response.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  )
}

export function notFound(resource = "Resource") {
  return Response.json(
    { success: false, error: `${resource} not found` },
    { status: 404 }
  )
}

export function serverError(error) {
  console.error("Server error:", error)
  return Response.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  )
}
