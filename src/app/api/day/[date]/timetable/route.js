import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DayLog from "@/models/DayLog";
import { auth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { date } = await params;
    await connectDB();

    const dayLog = await DayLog.findOne({ userId: session.user.id, date });
    const timetable = dayLog?.timetable || [];

    return NextResponse.json({ success: true, data: timetable });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { date } = await params;
    const body = await req.json();

    await connectDB();
    let dayLog = await DayLog.findOne({ userId: session.user.id, date });
    if (!dayLog) {
      dayLog = new DayLog({ userId: session.user.id, date, timetable: [] });
    }

    // Auto-calculate duration
    const [startH, startM] = body.startTime.split(':').map(Number);
    const [endH, endM] = body.endTime.split(':').map(Number);
    const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);

    const newBlock = { ...body, durationMinutes: Math.max(0, durationMinutes) };
    dayLog.timetable.push(newBlock);
    
    // Sort by start time
    dayLog.timetable.sort((a, b) => a.startTime.localeCompare(b.startTime));

    await dayLog.save();

    return NextResponse.json({ success: true, data: dayLog.timetable });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
