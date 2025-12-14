import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  await connectToDB();

  const requests = await Request.find({ requestedBy: params.userId })
    .populate("bookId");

  return NextResponse.json(requests);
}
