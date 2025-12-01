import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Book from "@/models/Book";

// POST — Add new book
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { bookId, title, author, category, availableCopies, imageUrl } = body;

    if (!bookId || !title || !author || !category || !availableCopies) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const newBook = await Book.create({
      bookId,
      title,
      author,
      category,
      availableCopies,
      imageUrl,
    });

    return NextResponse.json({ success: true, book: newBook });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// GET — Fetch all books
export async function GET() {
  try {
    await connectDB();
    const books = await Book.find();
    return NextResponse.json({ success: true, books });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
