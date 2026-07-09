import { auth } from "@/lib/auth"
import connectDB from "@/lib/db"
import Goal from "@/models/Goal"
import { schemas } from "@/lib/validations"
import { ok, err, unauthorized, notFound, serverError } from "@/lib/apiResponse"

export async function PUT(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const { id } = await params
    const body = await req.json()
    const parsed = schemas.updateGoal.safeParse(body)
    
    if (!parsed.success) {
      return err("Validation failed", 400, parsed.error.flatten())
    }

    await connectDB()
    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: parsed.data },
      { new: true }
    )

    if (!goal) return notFound("Goal not found")

    return ok(goal, "Goal updated successfully")
  } catch (e) {
    return serverError(e)
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const { id } = await params
    await connectDB()
    
    const goal = await Goal.findOneAndDelete({ _id: id, userId: session.user.id })
    if (!goal) return notFound("Goal not found")

    return ok(null, "Goal deleted successfully")
  } catch (e) {
    return serverError(e)
  }
}
