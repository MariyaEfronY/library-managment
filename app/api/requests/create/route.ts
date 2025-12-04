import { NextRequest, NextResponse } from "next/server";
import Request from "@/models/Request";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { userId, role, bookId } = await req.json();

    if (role === "admin") {
      return NextResponse.json(
        { error: "Admin cannot request books" },
        { status: 403 }
      );
    }

    const request = await Request.create({
      requestedBy: userId,
      requestedRole: role,
      bookId,
    });

    return NextResponse.json(
      { message: "Book request sent", request },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
