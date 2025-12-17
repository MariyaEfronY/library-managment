import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: NextRequest) {
  await connectToDB();

  const authUser = getAuthUser(req);
  if (!authUser) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // 🔐 ONLY by USER ID (role ignored for filtering)
  const requests = await Request.find({
    requestedBy: authUser.id,
  })
    .populate("bookId", "title author imageUrl availableCopies")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    success: true,
    requests,
  });
}
