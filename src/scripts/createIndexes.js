import connectDB from "../lib/db.js"
import DayLog    from "../models/DayLog.js"

async function run() {
  await connectDB()
  await DayLog.createIndexes()
  console.log("Indexes created")
  process.exit(0)
}
run()
