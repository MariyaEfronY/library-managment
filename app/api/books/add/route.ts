import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Book from "@/models/Books";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const body = await req.json();
    const book = await Book.create(body);

    return NextResponse.json({ message: "Book Added", book });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
