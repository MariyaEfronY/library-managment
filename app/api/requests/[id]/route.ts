// app/api/requests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Request, { IRequest } from "@/models/Request";
import Book, { IBook } from "@/models/Books"; 
import IssueRecord from "@/models/IssueRecord";
import mongoose from "mongoose";

// Helper function to reliably extract ID from the URL path
function extractIdFromUrl(req: NextRequest): string | null {
    // The URL is like: http://localhost:3000/api/requests/693f9d216ba04b665d918727
    const urlParts = req.url.split('/');
    // The ID should be the last part of the path (urlParts.at(-1) in modern JS)
    // Using simple array indexing for compatibility:
    const id = urlParts[urlParts.length - 1];
    
    // Simple check to ensure it looks like an ObjectId (24 hex characters)
    if (id && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
        return id;
    }
    return null;
}

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

    
    if (!id) {
        return NextResponse.json(
            { success: false, message: "Invalid or missing Request ID in URL path." },
            { status: 400 }
        );
    }
    
    const { status, returnDate: inputReturnDate } = await req.json();
    let session: mongoose.ClientSession | null = null;

    try {
        await connectToDB();

        if (!["approved", "rejected"].includes(status)) {
            return NextResponse.json(
                { success: false, message: "Invalid status provided." },
                { status: 400 }
            );
        }
        
        // 1. Start Transaction
        session = await mongoose.startSession();
        session.startTransaction();

        // 2. Find the Request (Populate Book for inventory check)
        // Use the extracted ID instead of params.id
        const request = await Request.findById(id).session(session).populate("bookId");
        
        if (!request) {
            await session.abortTransaction(); session.endSession();
            return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 });
        }
        if (request.status !== "pending") {
            await session.abortTransaction(); session.endSession();
            return NextResponse.json(
                { success: false, message: `Request is already ${request.status}` },
                { status: 400 }
            );
        }

        const book = request.bookId as unknown as IBook; // Get populated book data

        // --- APPROVAL LOGIC (Inventory Management) ---
        if (status === "approved") {
            if (!inputReturnDate) {
                await session.abortTransaction(); session.endSession();
                return NextResponse.json(
                    { success: false, message: "Return date is required for approval." },
                    { status: 400 }
                );
            }
            
            const returnDate = new Date(inputReturnDate);
            if (book.availableCopies <= 0) {
                await session.abortTransaction(); session.endSession();
                return NextResponse.json(
                    { success: false, message: `Book '${book.title}' is currently out of stock.` },
                    { status: 400 }
                );
            }

            // a) Decrement Inventory 
            await Book.findByIdAndUpdate(
                book._id, 
                { $inc: { availableCopies: -1 } }, 
                { new: true, session }
            );

            // b) Create Issue Record
            await IssueRecord.create(
                [
                    {
                        studentId: request.requestedBy, 
                        bookId: request.bookId._id,
                        issueDate: new Date(),
                        returnDate: returnDate,
                    },
                ],
                { session }
            );
            
            // c) Update Request Status and Return Date
            request.status = "approved";
            request.returnDate = returnDate;
        } 
        
        // --- REJECTION LOGIC ---
        else if (status === "rejected") {
            request.status = "rejected";
            request.returnDate = undefined;
        }
        
        // Save the final request status change
        await request.save({ session });

        // 3. Commit Transaction
        await session.commitTransaction();
        session.endSession();

        // 4. Return the updated request
        return NextResponse.json({ success: true, request: request.toObject() });

    } catch (err: any) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        console.error("PATCH REQUEST ERROR:", err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}