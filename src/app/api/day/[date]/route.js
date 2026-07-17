import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import DayLog from "@/models/DayLog";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const { date } = await params;
    await connectDB();

    let dayLog = await DayLog.findOne({ userId: session.user.id, date });
    if (!dayLog) {
      dayLog = await DayLog.create({
        userId: session.user.id,
        date,
      });
    }

    return NextResponse.json(dayLog);
  } catch (error) {
    console.error("GET dayLog error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    const { date } = await params;
    const { action, payload } = await req.json();
    await connectDB();

    let updateQuery = {};
    if (action === "ADD_SESSION") {
      updateQuery = { $push: { workSessions: payload } };
    } else if (action === "ADD_MEAL") {
      updateQuery = { $push: { "diet.meals": payload } };
    } else if (action === "UPDATE_WATER") {
      updateQuery = { $set: { "diet.waterGlasses": payload } };
    } else if (action === "UPDATE_TIMETABLE") {
      updateQuery = { $push: { timetable: payload } };
    } else if (action === "UPDATE_MOOD") {
      // If we had a mood field
      updateQuery = { $set: { mood: payload } };
    } else {
      updateQuery = { $set: payload }; // Generic update
    }

    const dayLog = await DayLog.findOneAndUpdate(
      { userId: session.user.id, date },
      updateQuery,
      { new: true, upsert: true }
    );

    return NextResponse.json(dayLog);
  } catch (error) {
    console.error("PATCH dayLog error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
