import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();

  const requests = await Request.find()
    .populate("requestedBy")
    .populate("bookId");

  return NextResponse.json(requests);
}
