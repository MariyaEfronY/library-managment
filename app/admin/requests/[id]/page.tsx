// app/api/admin/requests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Books";
import IssueRecord from "@/models/IssueRecord";
import mongoose from "mongoose";

// PATCH/PUT to update request status and issue the book
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params; 
  let session: mongoose.ClientSession | null = null;

  try {
    await connectToDB();
    const { status, returnDate } = await req.json();

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      );
    }
    
    // Check Request ID validity
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: "Invalid Request ID format" },
            { status: 400 }
        );
    }


    // 1. Start Transaction
    session = await mongoose.startSession();
    session.startTransaction();

    const request = await Request.findById(id).session(session);

    if (!request) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 }
      );
    }

    if (request.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: `Request is already ${request.status}` },
        { status: 400 }
      );
    }

    // 2. Update Request Status
    request.status = status;
    await request.save({ session });

    // 3. Handle Approval Logic (Book Issue)
    if (status === "approved") {
      if (!returnDate) {
        // If approval logic is handled here, throw error if date is missing
         await session.abortTransaction();
         session.endSession();
         return NextResponse.json(
           { success: false, message: "Return date is required for approval" },
           { status: 400 }
         );
      }
      
      const book = await Book.findById(request.bookId).session(session);

      if (!book) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, message: "Associated book not found" },
          { status: 404 }
        );
      }

      if (book.availableCopies <= 0) {
        // Revert status to maintain integrity and abort
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, message: "No available copies of this book." },
          { status: 400 }
        );
      }

      // Decrement availableCopies
      book.availableCopies -= 1;
      await book.save({ session });

      // Create new IssueRecord
      const newIssueRecord = await IssueRecord.create(
        [
          {
            studentId: request.requestedBy,
            bookId: request.bookId,
            issueDate: new Date(), 
            returnDate: new Date(returnDate), 
          },
        ],
        { session }
      );
      
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json(
        {
          success: true,
          message: "Request approved and book issued successfully!",
          issueRecord: newIssueRecord[0],
        },
        { status: 200 }
      );
    }

    // 4. Handle Rejection Logic
    if (status === "rejected") {
      await session.commitTransaction();
      session.endSession();
      return NextResponse.json(
        { success: true, message: "Request rejected successfully." },
        { status: 200 }
      );
    }

    // 5. If status is invalid
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      { success: false, message: "Invalid status provided." },
      { status: 400 }
    );
  } catch (err: any) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error("Error processing request:", err);
    return NextResponse.json(
      { success: false, message: "Error processing request: " + err.message },
      { status: 500 }
    );
  }
};