import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import IssuedBook from "@/models/IssuedBook";
import Book from "@/models/Book";

export async function POST(req: Request) {
  try {
    const { issueId } = await req.json();

    if (!issueId) {
      return NextResponse.json({ message: "Missing issueId" }, { status: 400 });
    }

    await connectToDB();

    const issued = await IssuedBook.findById(issueId);
    if (!issued) {
      return NextResponse.json({ message: "Issue record not found" }, { status: 404 });
    }

    if (issued.status === "returned") {
      return NextResponse.json(
        { message: "Book already returned" },
        { status: 400 }
      );
    }

    // Update issued status
    issued.status = "returned";
    await issued.save();

    // Increase book availability
    const book = await Book.findById(issued.bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    return NextResponse.json(
      { message: "Book returned successfully", issued },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error returning book", error: error.message },
      { status: 500 }
    );
  }
}
