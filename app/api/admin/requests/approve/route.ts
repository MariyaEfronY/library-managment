import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Books";
import IssueRecord from "@/models/IssueRecord";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { requestId, returnDate } = await req.json();

    if (!requestId || !returnDate) {
      return NextResponse.json(
        { message: "Request ID and return date required" },
        { status: 400 }
      );
    }

    const request = await Request.findById(requestId);
    if (!request)
      return NextResponse.json({ message: "Request not found" }, { status: 404 });

    if (request.status !== "pending")
      return NextResponse.json(
        { message: "Request already processed" },
        { status: 400 }
      );

    const book = await Book.findById(request.bookId);
    if (!book)
      return NextResponse.json({ message: "Book not found" }, { status: 404 });

    if (book.availableCopies < 1) {
      book.status = "invalid";
      await book.save();

      return NextResponse.json(
        { message: "Book unavailable" },
        { status: 400 }
      );
    }

    // 🔻 reduce count
    book.availableCopies -= 1;
    if (book.availableCopies === 0) {
      book.status = "invalid";
    }
    await book.save();

    // ✅ create issue record
    await IssueRecord.create({
      studentId: request.requestedBy,
      bookId: request.bookId,
      returnDate: new Date(returnDate),
    });

    request.status = "approved";
    await request.save();

    return NextResponse.json({
      success: true,
      message: "Request approved",
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
