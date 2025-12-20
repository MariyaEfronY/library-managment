import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Books"; // 👈 CRITICAL: Must import to register the model
import User from "@/models/User";   // 👈 CRITICAL: Must import to register the model
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use an object for populate to be extra safe with Next.js model resolution
    const requests = await Request.find({
      requestedBy: authUser.id,
    })
      .populate({
        path: "bookId",
        model: Book, // Use the actual model object
        select: "title author imageUrl availableCopies"
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      requests: requests || [],
    });
  } catch (err: any) {
    console.error("MY_REQUESTS_GET_ERROR:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}