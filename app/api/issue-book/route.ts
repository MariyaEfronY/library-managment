import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import IssuedBook from "@/models/IssuedBook";
import Book from "@/models/Book";

export async function POST(req: Request) {
  try {
    const { bookId, userId, userType, returnDate } = await req.json();

    if (!bookId || !userId || !userType || !returnDate) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await connectToDB();

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (book.availableCopies < 1) {
      return NextResponse.json({ message: "No copies available" }, { status: 400 });
    }

    // Reduce available copy
    book.availableCopies -= 1;
    await book.save();

    const issue = await IssuedBook.create({
      bookId,
      issuedTo: userId,
      userType,
      returnDate,
    });

    return NextResponse.json(
      { message: "Book issued successfully", issue },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error issuing book", error: error.message },
      { status: 500 }
    );
  }
}
