import { NextResponse } from "next/server";
import Book from "@/models/Book";
import { connectToDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDB();
    const books = await Book.find();

    return NextResponse.json(books, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
