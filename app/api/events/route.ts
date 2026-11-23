
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find({});

    return NextResponse.json(
      { events },
      { status: 200 }
    );

  } catch (error) {
    console.error("EVENT FETCH ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
