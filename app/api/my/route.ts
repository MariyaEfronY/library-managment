import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import IssueRecord from "@/models/IssueRecord";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const userId = req.headers.get("x-user-id");
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const requests = await Request.find({ requestedBy: userId })
      .populate("bookId", "title author imageUrl")
      .sort({ createdAt: -1 });

    const issued = await IssueRecord.find({ studentId: userId });

    const issuedMap = new Map(
      issued.map(i => [i.bookId.toString(), i.returnDate])
    );

    const response = requests.map(r => ({
      _id: r._id,
      status: r.status,
      book: r.bookId,
      returnDate: issuedMap.get(r.bookId._id.toString()) || null,
    }));

    return NextResponse.json({ success: true, requests: response });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
