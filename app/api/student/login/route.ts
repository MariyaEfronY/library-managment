import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const student = await Student.findOne({ email });
  if (!student) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const valid = await bcrypt.compare(password, student.password);
  if (!valid) return NextResponse.json({ error: "Invalid password" }, { status: 400 });

  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

  return NextResponse.json({ message: "Login success", token, student });
}
