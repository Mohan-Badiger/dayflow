import { auth }        from "@/lib/auth"
import connectDB       from "@/lib/db"
import User            from "@/models/User"
import { ok, err, unauthorized, notFound, serverError } from "@/lib/apiResponse"
import mongoose from "mongoose"
import DayLog from "@/models/DayLog"
import DayTemplate from "@/models/DayTemplate"
import WeeklyGoal from "@/models/WeeklyGoal"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    await connectDB()
    const user = await User.findById(session.user.id)
      .select("-__v").lean()
    if (!user) return notFound("User")
    return ok(user)
  } catch (e) { return serverError(e) }
}

export async function PATCH(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const body = await req.json()
    const allowed = {}
    if (body.name)  allowed.name  = body.name.trim().slice(0, 100)
    if (body.image) allowed.image = body.image
    await connectDB()
    const user = await User.findByIdAndUpdate(
      session.user.id, allowed, { new: true }
    ).lean()
    return ok(user)
  } catch (e) { return serverError(e) }
}

export async function DELETE(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    
    await connectDB()
    const userId = session.user.id
    
    // Delete all user data
    await Promise.all([
      User.findByIdAndDelete(userId),
      DayLog.deleteMany({ userId }),
      DayTemplate.deleteMany({ userId }),
      WeeklyGoal.deleteMany({ userId })
    ])
    
    // NextAuth MongoDB Adapter uses raw collections for accounts and sessions
    const db = mongoose.connection.db
    const objId = new mongoose.Types.ObjectId(userId)
    
    await Promise.all([
      db.collection('accounts').deleteMany({ userId: objId }),
      db.collection('sessions').deleteMany({ userId: objId })
    ])
    
    return ok({ success: true }, "Account permanently deleted")
  } catch (e) { 
    return serverError(e) 
  }
}
