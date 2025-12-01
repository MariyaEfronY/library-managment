import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });

  const existing = await Student.findOne({ email });
  if (existing)
    return NextResponse.json({ error: "Student already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await Student.create({ name, email, password: hashedPassword });

  return NextResponse.json({ message: "Student registered", student }, { status: 201 });
}
