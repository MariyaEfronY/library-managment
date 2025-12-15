// src/app/api/user/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request from "@/models/Request";
import IssueRecord from "@/models/IssueRecord";
import Book from "@/models/Books";
import mongoose from "mongoose";

// Helper function (You'll need a mechanism to get the current user's ID and role from the session/token)
// For this example, let's assume we pass a mock user ID and role for testing.
// In a real app, this MUST be extracted from the request's authentication token.
const getMockUser = (req: NextRequest) => {
  // *** Replace this mock logic with actual authentication/session logic ***
  // e.g. from a JWT token
  const headers = req.headers;
  const mockUserId = headers.get("x-user-id"); // Temporary header for testing
  const mockUserRole = headers.get("x-user-role"); // Temporary header for testing

  if (!mockUserId || !mockUserRole) {
    // In a real app, this should throw an authentication error
    return null;
  }
  return { id: mockUserId, role: mockUserRole as "student" | "staff" };
};

// POST a new book request (for Student/Staff)
export const POST = async (req: NextRequest) => {
  try {
    const mockUser = getMockUser(req);
    if (!mockUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDB();
    const { bookId } = await req.json();

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: "Book ID is required" },
        { status: 400 }
      );
    }

    // 1. Check if a pending request already exists for this book/user
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
    
    // 2. Check if the book is currently issued to the user
    const alreadyIssued = await IssueRecord.findOne({
        studentId: mockUser.id,
        bookId: bookId,
        returnDate: { $gte: new Date() } // Assuming we track returns and remove old records, or check a proper 'returned' flag (not in your current model)
    });
    
    if (alreadyIssued) {
        return NextResponse.json(
          { success: false, message: "This book is currently issued to you." },
          { status: 400 }
        );
    }

    // 3. Create the request
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
    if (!mockUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDB();

    const userRequests = await Request.find({ requestedBy: mockUser.id })
      .sort({ requestDate: -1 })
      .populate("bookId", "bookId title author imageUrl"); // Fetch book details

    // Additionally, check for approved requests and merge with issue record details
    const requestsWithReturnDate = await Promise.all(
      userRequests.map(async (request) => {
        const reqObj = request.toObject();
        if (reqObj.status === "approved") {
          // Find the corresponding IssueRecord
          const issueRecord = await IssueRecord.findOne({
            studentId: mockUser.id,
            bookId: reqObj.bookId._id,
          })
            .sort({ issueDate: -1 }) // Get the latest one
            .limit(1);

          if (issueRecord) {
            reqObj.returnDate = issueRecord.returnDate; // Add the return date to the request object
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