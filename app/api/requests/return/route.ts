import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request"; // 👈 Crucial: Using the Request model
import Book from "@/models/Books";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { issueId } = await req.json();

    // 1. Find the record in the Request collection
    const requestRecord = await Request.findById(issueId);

    if (!requestRecord) {
      return NextResponse.json(
        { success: false, message: "Request record not found" },
        { status: 404 },
      );
    }

    // 2. Prevent double-returning
    if (requestRecord.returned) {
      return NextResponse.json(
        { success: false, message: "Book has already been returned" },
        { status: 400 },
      );
    }

    // 3. Calculate Fine ($5 per day)
    const today = new Date();
    const dueDate = requestRecord.returnDate
      ? new Date(requestRecord.returnDate)
      : null;
    let fine = 0;

    if (dueDate && today > dueDate) {
      const diffTime = today.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 5;
    }

    // 4. Update the Request record fields
    requestRecord.returned = true;
    requestRecord.actualReturnDate = today;
    requestRecord.fineAmount = fine;
    requestRecord.finePaid = fine === 0; // Automatically paid if no fine exists

    await requestRecord.save();

    // 5. Increase Book Inventory
    await Book.findByIdAndUpdate(requestRecord.bookId, {
      $inc: { availableCopies: 1 },
    });

    return NextResponse.json({
      success: true,
      fineAmount: fine,
      message: "Book returned and inventory updated",
    });
  } catch (err: any) {
    console.error("RETURN_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
