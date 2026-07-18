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
    const existingGoal = await Goal.findOne({ _id: id, userId: session.user.id })
    if (!existingGoal) return notFound("Goal not found")

    const updateData = { ...parsed.data }

    // If subtasks are provided in the update
    if (updateData.subTasks) {
      if (updateData.subTasks.length > 0) {
        const completedCount = updateData.subTasks.filter(st => st.completed).length
        updateData.progress = Math.round((completedCount / updateData.subTasks.length) * 100)
        if (updateData.progress === 100) {
          updateData.status = "Completed"
        } else if (updateData.progress > 0) {
          if (updateData.status !== "Paused") {
            updateData.status = "In Progress"
          }
        } else {
          if (updateData.status !== "Paused") {
            updateData.status = "Not Started"
          }
        }
      } else {
        updateData.progress = 0
        if (updateData.status !== "Paused") {
          updateData.status = "Not Started"
        }
      }
    } 
    // If subtasks are NOT provided in the update, but exist in the database
    else if (existingGoal.subTasks && existingGoal.subTasks.length > 0) {
      if (updateData.status === "Completed") {
        updateData.subTasks = existingGoal.subTasks.map(st => ({
          _id: st._id,
          title: st.title,
          completed: true
        }))
        updateData.progress = 100
      } else if ((updateData.status === "In Progress" || updateData.status === "Not Started") && existingGoal.progress === 100) {
        if (updateData.status === "Not Started") {
          updateData.subTasks = existingGoal.subTasks.map(st => ({
            _id: st._id,
            title: st.title,
            completed: false
          }))
          updateData.progress = 0
        } else {
          // Uncheck the last subtask
          updateData.subTasks = existingGoal.subTasks.map((st, index) => ({
            _id: st._id,
            title: st.title,
            completed: index === existingGoal.subTasks.length - 1 ? false : st.completed
          }))
          const completedCount = updateData.subTasks.filter(st => st.completed).length
          updateData.progress = Math.round((completedCount / updateData.subTasks.length) * 100)
        }
      }
    } else {
      // No subtasks in body or db
      if (updateData.status === "Completed") {
        updateData.progress = 100
      } else if (updateData.status === "In Progress" && existingGoal.progress === 100 && updateData.progress === undefined) {
        updateData.progress = 99
      }
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updateData },
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
