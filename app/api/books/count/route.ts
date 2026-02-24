import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Book from "@/models/Books";

export async function GET() {
  try {
    await connectToDB();

    // countDocuments is much faster than fetching the whole list
    const totalCount = await Book.countDocuments();

    return NextResponse.json({
      success: true,
      count: totalCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
