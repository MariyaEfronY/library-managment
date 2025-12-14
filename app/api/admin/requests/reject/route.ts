import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { requestId } = await req.json();

    const request = await Request.findById(requestId);
    if (!request)
      return NextResponse.json({ message: "Request not found" }, { status: 404 });

    request.status = "rejected";
    await request.save();

    return NextResponse.json({ success: true, message: "Request rejected" });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
