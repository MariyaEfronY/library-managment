import { NextRequest, NextResponse } from "next/server";
import Request from "@/models/Request";
import IssueRecord from "@/models/IssueRecord";
import Book from "@/models/Books";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { requestId, returnDate } = await req.json();

    const request = await Request.findById(requestId).populate("bookId");
    if (!request)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });

    // Update Request status
    request.status = "approved";
    await request.save();

    // Reduce book copies
    await Book.findByIdAndUpdate(request.bookId._id, {
      $inc: { availableCopies: -1 },
    });

    // Create an issue record
    const issueRecord = await IssueRecord.create({
      studentId: request.requestedBy,
      bookId: request.bookId._id,
      returnDate,
    });

    return NextResponse.json({
      message: "Request approved, book issued",
      issueRecord,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
