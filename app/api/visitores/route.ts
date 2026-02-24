import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Visitors from "@/models/Visitores";

// This runs when the page is refreshed
export async function POST() {
  await connectToDB();
  const data = await Visitors.findOneAndUpdate(
    { name: "total_visitors" },
    { $inc: { count: 1 } }, // Adds 1
    { upsert: true, new: true },
  );
  return NextResponse.json({ total: data.count });
}

// This just gets the number for the dashboard
export async function GET() {
  await connectToDB();
  const data = await Visitors.findOne({ name: "total_visitors" });
  return NextResponse.json({ total: data?.count || 0 });
}
