import connectDB from "@/lib/db"
import User from "@/models/User"
import { ok, serverError } from "@/lib/apiResponse"

export async function GET() {
  try {
    await connectDB()
    // Fetch first 3 registered users, only selecting name and image
    const users = await User.find({})
      .sort({ createdAt: 1 })
      .limit(3)
      .select("name image")
      .lean()

    // Transform users to mask full names (First Name only) for absolute privacy & security
    const safeUsers = users.map(user => ({
      name: user.name ? user.name.trim().split(/\s+/)[0] : "Achiever",
      image: user.image || null
    }))

    return ok(safeUsers)
  } catch (e) {
    return serverError(e)
  }
}
