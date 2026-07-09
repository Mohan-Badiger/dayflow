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

    await connectDB()
    const newGoal = await Goal.create({
      ...parsed.data,
      userId: session.user.id
    })

    return ok(newGoal, "Goal created successfully")
  } catch (e) {
    return serverError(e)
  }
}
