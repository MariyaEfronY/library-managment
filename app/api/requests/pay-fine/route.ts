import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { issueId } = await req.json();

    const updated = await Request.findByIdAndUpdate(
      issueId,
      { finePaid: true },
      { new: true },
    );

    if (!updated)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 },
      );

    return NextResponse.json({ success: true, message: "Fine marked as paid" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 },
    );
  }
}
