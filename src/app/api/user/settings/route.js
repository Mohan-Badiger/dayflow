import { auth }        from "@/lib/auth"
import connectDB       from "@/lib/db"
import User            from "@/models/User"
import { schemas }     from "@/lib/validations"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"

export async function PATCH(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const body   = await req.json()
    const update = {}

    if (body.settings) {
      const parsed = schemas.updateSettings.safeParse(body.settings)
      if (!parsed.success)
        return err("Invalid settings", 400, parsed.error.flatten())
      Object.entries(parsed.data).forEach(([k, v]) => {
        if (v !== undefined) update[`settings.${k}`] = v
      })
    }

    if (body.jobGoal) {
      const parsed = schemas.updateJobGoal.safeParse(body.jobGoal)
      if (!parsed.success)
        return err("Invalid job goal", 400, parsed.error.flatten())
      Object.entries(parsed.data).forEach(([k, v]) => {
        if (v !== undefined) update[`jobGoal.${k}`] = v
      })
    }

    await connectDB()
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: update },
      { new: true }
    ).lean()
    return ok(user, "Settings updated")
  } catch (e) { return serverError(e) }
}
