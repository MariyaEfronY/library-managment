import { NextRequest, NextResponse } from 'next/server';
import Student from '@/models/Student';
import { connectToDB } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  await connectToDB();
  const { studentId, bookId } = await req.json();

  const student = await Student.findById(studentId);
  if (!student) return NextResponse.json({ message: 'Student not found' }, { status: 404 });

  student.requests.push({ bookId, status: 'Pending' });
  await student.save();

  return NextResponse.json({ message: 'Book request sent', requests: student.requests });
}
