// app/api/user/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import IssueRecord from "@/models/IssueRecord";
import Book from "@/models/Books";
import mongoose from "mongoose";

// --- MOCK AUTH LOGIC ---
const getMockUser = (req: NextRequest) => {
  // Replace this with your actual authentication logic (e.g., reading a JWT)
  const headers = req.headers;
  const mockUserId = headers.get("x-user-id"); 
  const mockUserRole = headers.get("x-user-role"); 

  // Hardcode a valid ID for testing if headers are not set, 
  // but ensure it's a valid ObjectId string from your 'User' collection.
  const TEST_USER_ID = "60c72b8f9d846b0015f8a0a1"; 
  const TEST_USER_ROLE = "student";

  if (!mockUserId || !mockUserRole) {
    // Fallback for simple testing
    return { id: TEST_USER_ID, role: TEST_USER_ROLE as "student" | "staff" };
  }
  return { id: mockUserId, role: mockUserRole as "student" | "staff" };
};

// POST a new book request (for Student/Staff)
export const POST = async (req: NextRequest) => {
  try {
    const mockUser = getMockUser(req);
    
    await connectToDB();
    const { bookId } = await req.json();

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "Book ID is required" },
        { status: 400 }
      );
    }
    
    // Check if the book ID is a valid Mongoose ObjectId before proceeding
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return NextResponse.json(
            { success: false, message: "Invalid Book ID format" },
            { status: 400 }
        );
    }


    // 1. Check for existing pending request
    const existingRequest = await Request.findOne({
      requestedBy: mockUser.id,
      bookId: bookId,
      status: "pending",
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, message: "You already have a pending request for this book." },
        { status: 400 }
      );
    }
    
    // 2. Create the request
    const newRequest = await Request.create({
      requestedBy: mockUser.id,
      requestedRole: mockUser.role,
      bookId: bookId,
      status: "pending",
    });

    return NextResponse.json(
      { success: true, message: "Book request submitted successfully", request: newRequest },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error submitting request:", err);
    return NextResponse.json(
      { success: false, message: "Error submitting request: " + err.message },
      { status: 500 }
    );
  }
};

// GET all requests for the logged-in user (Student/Staff)
export const GET = async (req: NextRequest) => {
  try {
    const mockUser = getMockUser(req);
    
    await connectToDB();

    const userRequests = await Request.find({ requestedBy: mockUser.id })
      .sort({ requestDate: -1 })
      .populate("bookId", "bookId title author imageUrl"); 

    const requestsWithReturnDate = await Promise.all(
      userRequests.map(async (request) => {
        const reqObj = request.toObject();
        if (reqObj.status === "approved") {
          const issueRecord = await IssueRecord.findOne({
            studentId: mockUser.id,
            bookId: reqObj.bookId._id,
          })
            .sort({ issueDate: -1 }) 
            .limit(1);

          if (issueRecord) {
            reqObj.returnDate = issueRecord.returnDate; 
          }
        }
        return reqObj;
      })
    );

    return NextResponse.json(
      { success: true, requests: requestsWithReturnDate },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error fetching user requests:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching user requests: " + err.message },
      { status: 500 }
    );
  }
};