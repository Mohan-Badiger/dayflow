import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DayTemplate from "@/models/DayTemplate";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const templates = await DayTemplate.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();

    const template = new DayTemplate({
      ...body,
      userId: session.user.id
    });

    await template.save();
    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
