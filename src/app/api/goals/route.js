import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import Goal from "@/models/Goal"
import { schemas } from "@/lib/validations"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"

export async function GET(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    await connectDB()
    const goals = await Goal.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean()
    
    return ok(goals)
  } catch (e) {
    return serverError(e)
  }
}

export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const body = await req.json()
    const parsed = schemas.createGoal.safeParse(body)
    if (!parsed.success) {
      return err("Validation failed", 400, parsed.error.flatten())
    }

    const goalData = { ...parsed.data }
    if (goalData.subTasks && goalData.subTasks.length > 0) {
      const completedCount = goalData.subTasks.filter(st => st.completed).length
      goalData.progress = Math.round((completedCount / goalData.subTasks.length) * 100)
      if (goalData.progress === 100) {
        goalData.status = "Completed"
      } else if (goalData.progress > 0) {
        goalData.status = "In Progress"
      } else {
        goalData.status = "Not Started"
      }
    } else {
      goalData.progress = goalData.progress || 0
      if (goalData.progress === 100) {
        goalData.status = "Completed"
      } else if (goalData.progress > 0) {
        goalData.status = "In Progress"
      }
    }

    await connectDB()
    const newGoal = await Goal.create({
      ...goalData,
      userId: session.user.id
    })

    return ok(newGoal, "Goal created successfully")
  } catch (e) {
    return serverError(e)
  }
}
