import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DayTemplate from "@/models/DayTemplate";
import { auth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const template = await DayTemplate.findOne({ _id: id, userId: session.user.id });
    if (!template) return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    await connectDB();
    const template = await DayTemplate.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: body },
      { new: true }
    );

    if (!template) return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    await DayTemplate.findOneAndDelete({ _id: id, userId: session.user.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
