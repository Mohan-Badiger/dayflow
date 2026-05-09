import connectDB from "@/lib/db"
import { ok, serverError } from "@/lib/apiResponse"

export async function GET() {
  try {
    await connectDB()
    return ok({ status: "ok", time: new Date().toISOString() })
  } catch (e) { return serverError(e) }
}
