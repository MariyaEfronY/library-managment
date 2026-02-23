import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";

export async function GET() {
  try {
    await connectToDB();

    const requests = await Request.find()
      .populate({
        path: "requestedBy",
        select: "name email role phone rollNumber staffId adminId",
      })
      .populate({
        path: "bookId",
        select: "title author bookId category availableCopies",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}
