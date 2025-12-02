import { NextResponse } from "next/server";
import Book from "@/models/Book";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { bookId, change } = await req.json(); 
    // change = -1 (issue), +1 (return)

    const book = await Book.findOne({ bookId });
    if (!book)
      return NextResponse.json({ message: "Book not found" }, { status: 404 });

    book.availableCopies += change;

    if (book.availableCopies < 0)
      return NextResponse.json({ message: "No copies left" }, { status: 400 });

    await book.save();

    return NextResponse.json(
      { message: "Book availability updated", book },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
