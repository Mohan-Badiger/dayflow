import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DayTemplate from "@/models/DayTemplate";
import DayLog from "@/models/DayLog";
import { auth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { date } = await req.json();

    await connectDB();
    const template = await DayTemplate.findOne({ _id: id, userId: session.user.id });
    if (!template) return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });

    let dayLog = await DayLog.findOne({ userId: session.user.id, date });
    if (!dayLog) {
      dayLog = new DayLog({ userId: session.user.id, date, timetable: [] });
    }

    const newBlocks = template.blocks.map(b => {
      const [startH, startM] = b.startTime.split(':').map(Number);
      const [endH, endM] = b.endTime.split(':').map(Number);
      const durationMinutes = Math.max(0, (endH * 60 + endM) - (startH * 60 + startM));

      return {
        title: b.title,
        category: b.category,
        startTime: b.startTime,
        endTime: b.endTime,
        durationMinutes,
        notes: b.notes,
        status: 'planned'
      };
    });

    dayLog.timetable.push(...newBlocks);
    dayLog.timetable.sort((a, b) => a.startTime.localeCompare(b.startTime));

    await dayLog.save();

    return NextResponse.json({ success: true, data: dayLog });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
