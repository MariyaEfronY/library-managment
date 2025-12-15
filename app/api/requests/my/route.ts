import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    // ✅ Get logged-in user from token
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Fetch requests for this user
    const requests = await Request.find({ requestedBy: authUser.id })
      .populate("bookId", "title author availableCopies") // fetch book details
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    console.error("GET /my REQUESTS ERROR:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
