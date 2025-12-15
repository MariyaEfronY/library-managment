import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    const requests = await Request.find({ requestedBy: userId })
      .populate("bookId", "title author category")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
