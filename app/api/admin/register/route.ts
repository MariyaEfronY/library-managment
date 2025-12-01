import { NextResponse } from "next/server";
import {connectDB }from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });

  const existing = await Admin.findOne({ email });
  if (existing) return NextResponse.json({ error: "Admin already exists" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({ name, email, password: hashedPassword });

  return NextResponse.json({ message: "Admin registered", admin }, { status: 201 });
}
