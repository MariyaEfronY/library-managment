import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Books";
import IssueRecord from "@/models/IssueRecord";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { requestId, action, returnDate } = await req.json();

    const request = await Request.findById(requestId);
    if (!request)
      return NextResponse.json({ message: "Request not found" }, { status: 404 });

    if (request.status !== "pending")
      return NextResponse.json({ message: "Already processed" }, { status: 400 });

    const book = await Book.findById(request.bookId);
    if (!book)
      return NextResponse.json({ message: "Book not found" }, { status: 404 });

    // ❌ Reject
    if (action === "reject") {
      request.status = "rejected";
      await request.save();

      return NextResponse.json({ success: true, message: "Request rejected" });
    }

    // ❌ No copies
    if (book.availableCopies <= 0) {
      book.status = "invalid";
      await book.save();

      return NextResponse.json(
        { message: "Book unavailable" },
        { status: 400 }
      );
    }

    // ✅ Approve
    request.status = "approved";
    await request.save();

    book.availableCopies -= 1;
    if (book.availableCopies === 0) book.status = "invalid";
    await book.save();

    await IssueRecord.create({
      studentId: request.requestedBy,
      bookId: request.bookId,
      returnDate,
    });

    return NextResponse.json({
      success: true,
      message: "Book issued successfully",
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
