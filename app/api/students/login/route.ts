import { NextRequest, NextResponse } from 'next/server';
import Student from '@/models/Student';
import { connectToDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  await connectToDB();
  const { email, password } = await req.json();

  const student = await Student.findOne({ email });
  if (student && (await student.matchPassword(password))) {
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return NextResponse.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      token,
    });
  }
  return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
}
