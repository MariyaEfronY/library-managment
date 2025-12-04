import { NextRequest, NextResponse } from "next/server";
import Request from "@/models/Request";
import { connectToDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { requestId } = await req.json();

    const request = await Request.findById(requestId);
    if (!request)
      return NextResponse.json({ error: "Request not found" }, { status: 404 });

    request.status = "rejected";
    await request.save();

    return NextResponse.json({ message: "Request rejected" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
