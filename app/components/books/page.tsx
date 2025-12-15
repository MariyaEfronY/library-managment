// src/app/dashboard/books/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Book {
  _id: string;
  bookId: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  imageUrl?: string;
  status: "valid" | "invalid";
}

const UserBookListPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<{ [key: string]: string | boolean }>({});
  
  // !!! IMPORTANT: Replace with actual user ID/Role from session/context
  const mockUserId = "60c72b8f9d846b0015f8a0a1"; // Example User ID
  const mockUserRole = "student"; // Example Role

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books"); // Assuming you have a GET /api/books route
        if (!response.ok) throw new Error("Failed to fetch books");
        const data = await response.json();
        setBooks(data.books || []);
      } catch (err: any) {
        setError(err.message || "Failed to load books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleRequest = async (bookId: string) => {
    setRequestStatus((prev) => ({ ...prev, [bookId]: true })); // Set loading
    
    try {
      const response = await fetch("/api/user/requests", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "x-user-id": mockUserId, // Pass mock user details for the API to process
            "x-user-role": mockUserRole,
        },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }
      
      // Success
      setRequestStatus((prev) => ({ ...prev, [bookId]: "Requested" }));
    } catch (err: any) {
      // Error
      setRequestStatus((prev) => ({ ...prev, [bookId]: err.message || "Error" }));
    } finally {
      // Clear loading state and message after a short delay
      setTimeout(() => {
         setRequestStatus((prev) => ({ ...prev, [bookId]: false }));
      }, 3000);
    }
  };

  if (loading) return <div className="p-8">Loading available books...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  const availableBooks = books.filter(b => b.availableCopies > 0 && b.status === 'valid');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        Available Books for Request
      </h1>
      
      {availableBooks.length === 0 ? (
        <p className="text-gray-500">No books currently available for request.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableBooks.map((book) => (
            <div key={book._id} className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col justify-between transition transform hover:scale-[1.02]">
              <div>
                {book.imageUrl ? (
                  <div className="w-full h-48 relative bg-gray-200">
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-500">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    {book.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    by {book.author}
                  </p>
                  <p className="text-xs text-indigo-500 mb-4">
                    Category: {book.category}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    Copies:{" "}
                    <span className="text-green-600">
                      {book.availableCopies}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="p-4 border-t">
                {typeof requestStatus[book._id] === 'string' ? (
                   <p className={`text-sm font-medium ${requestStatus[book._id] === 'Requested' ? 'text-green-600' : 'text-red-600'}`}>
                      {requestStatus[book._id]}
                   </p>
                ) : (
                    <button
                        onClick={() => handleRequest(book._id)}
                        disabled={!!requestStatus[book._id]}
                        className={`w-full py-2 rounded-md font-bold transition duration-150 ${
                            requestStatus[book._id] === true
                            ? "bg-indigo-300 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                    >
                        {requestStatus[book._id] === true ? "Requesting..." : "Request Book"}
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookListPage;