import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import IssuedBook from "@/models/IssuedBook";
import Book from "@/models/Book";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();

    const list = await IssuedBook.find({
      issuedTo: context.params.id,
      userType: "student",
    }).populate("bookId");

    return NextResponse.json(list, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}
