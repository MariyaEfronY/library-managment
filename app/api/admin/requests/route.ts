import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";

export async function GET() {
  try {
    await connectToDB();

    const requests = await Request.find({ status: "pending" })
      .populate({
        path: "requestedBy",
        select: "name email role",
      })
      .populate({
        path: "bookId",
        select: "bookId title author availableCopies status",
      })
      .sort({ requestDate: -1 });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}
