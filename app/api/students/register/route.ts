// app/api/students/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Student from '@/models/Student';
import { connectToDB } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { name, email, password } = await req.json();

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return NextResponse.json({ message: 'Student already exists' }, { status: 400 });
    }

    const student = await Student.create({ name, email, password });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    return NextResponse.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong' }, { status: 500 });
  }
}
