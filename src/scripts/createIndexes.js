import connectDB from "../lib/db.js"
import DayLog    from "../models/DayLog.js"
import Habit     from "../models/Habit.js"
import HabitLog  from "../models/HabitLog.js"

async function run() {
  await connectDB()
  await DayLog.createIndexes()
  await Habit.createIndexes()
  await HabitLog.createIndexes()
  console.log("Indexes created")
  process.exit(0)
}
run()
