import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DayLog from "@/models/DayLog";
import { auth } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { date, blockId } = await params;
    const body = await req.json();

    await connectDB();
    const dayLog = await DayLog.findOne({ userId: session.user.id, date });
    if (!dayLog) return NextResponse.json({ success: false, error: "Day log not found" }, { status: 404 });

    const block = dayLog.timetable.id(blockId);
    if (!block) return NextResponse.json({ success: false, error: "Block not found" }, { status: 404 });

    Object.assign(block, body);

    if (body.startTime || body.endTime) {
      const [startH, startM] = block.startTime.split(':').map(Number);
      const [endH, endM] = block.endTime.split(':').map(Number);
      block.durationMinutes = Math.max(0, (endH * 60 + endM) - (startH * 60 + startM));
      dayLog.timetable.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    await dayLog.save();
    return NextResponse.json({ success: true, data: block });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { date, blockId } = await params;
    await connectDB();

    const dayLog = await DayLog.findOne({ userId: session.user.id, date });
    if (!dayLog) return NextResponse.json({ success: false, error: "Day log not found" }, { status: 404 });

    dayLog.timetable.pull({ _id: blockId });
    await dayLog.save();

    return NextResponse.json({ success: true, data: dayLog.timetable });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
