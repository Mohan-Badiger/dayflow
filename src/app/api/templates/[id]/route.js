import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import DayTemplate   from "@/models/DayTemplate"
import { schemas }   from "@/lib/validations"
import { ok, err, unauthorized, notFound, serverError }
  from "@/lib/apiResponse"

export async function GET(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { id } = await params
    await connectDB()
    const t = await DayTemplate.findOne({ _id: id, userId: session.user.id }).lean()
    if (!t) return notFound("Template")
    return ok(t)
  } catch (e) { return serverError(e) }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { id } = await params

    const body   = await req.json()
    const parsed = schemas.createTemplate.partial().safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    const t = await DayTemplate.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      parsed.data,
      { new: true }
    )
    if (!t) return notFound("Template")
    return ok(t, "Template updated")
  } catch (e) { return serverError(e) }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    const { id } = await params
    await connectDB()
    const t = await DayTemplate.findOneAndDelete({
      _id: id, userId: session.user.id
    })
    if (!t) return notFound("Template")
    return ok(null, "Template deleted")
  } catch (e) { return serverError(e) }
}
