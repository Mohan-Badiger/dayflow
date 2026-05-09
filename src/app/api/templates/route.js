import { auth }      from "@/lib/auth"
import connectDB     from "@/lib/db"
import DayTemplate   from "@/models/DayTemplate"
import { schemas }   from "@/lib/validations"
import { ok, err, unauthorized, serverError } from "@/lib/apiResponse"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()
    await connectDB()
    const templates = await DayTemplate.find({ userId: session.user.id })
      .sort({ isDefault: -1, createdAt: -1 }).lean()
    return ok(templates)
  } catch (e) { return serverError(e) }
}

export async function POST(req) {
  try {
    const session = await auth()
    if (!session?.user?.id) return unauthorized()

    const body   = await req.json()
    const parsed = schemas.createTemplate.safeParse(body)
    if (!parsed.success)
      return err("Validation failed", 400, parsed.error.flatten())

    await connectDB()
    if (parsed.data.isDefault) {
      await DayTemplate.updateMany(
        { userId: session.user.id },
        { isDefault: false }
      )
    }
    const template = await DayTemplate.create({
      ...parsed.data,
      userId: session.user.id,
    })
    return ok(template, "Template created", 201)
  } catch (e) { return serverError(e) }
}
