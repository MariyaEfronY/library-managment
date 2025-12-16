import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    // 1️⃣ Get logged-in user
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    /**
     * 2️⃣ Build query dynamically
     * This makes it work for:
     * - student
     * - staff
     * - admin (optional)
     */
    const query: any = {};

    // Students & staff should see ONLY their own requests
    if (authUser.role === "student" || authUser.role === "staff") {
      query.requestedBy = authUser.id;
      query.requestedRole = authUser.role;
    }

    // Admin can see all (optional behavior)
    if (authUser.role === "admin") {
      // no filter → all requests
    }

    // 3️⃣ Fetch requests
    const requests = await Request.find(query)
      .populate({
        path: "bookId",
        select: "title author imageUrl availableCopies",
      })
      .sort({ createdAt: -1 })
      .lean(); // ✅ important for performance & frontend safety

    return NextResponse.json({
      success: true,
      requests,
    });

  } catch (err: any) {
    console.error("GET /api/requests/my ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
