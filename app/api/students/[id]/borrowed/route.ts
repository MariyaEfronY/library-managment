import { NextRequest, NextResponse } from 'next/server';
import Student from '@/models/Student';
import { connectToDB } from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const student = await Student.findById(params.id).populate('borrowedBooks.bookId');
  if (!student) return NextResponse.json({ message: 'Student not found' }, { status: 404 });

  return NextResponse.json(student.borrowedBooks);
}
