"use client";
import { useEffect, useState } from "react";

export default function StudentRequests() {
  const [books, setBooks] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/books")
      .then(res => res.json())
      .then(data => setBooks(data.books || []));
  }, []);

  const requestBook = async (bookId: string) => {
    setLoadingId(bookId);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Request sent successfully");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Available Books</h2>

      {books.length === 0 && <p>No books available</p>}

      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map(book => (
          <div
            key={book._id}
            className="border rounded-lg p-4 shadow-sm bg-white flex gap-4"
          >
            {/* BOOK IMAGE */}
            <div className="w-24 h-32 flex-shrink-0">
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded text-sm text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* BOOK INFO */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                <p className="font-semibold text-lg">{book.title}</p>
                <p className="text-sm text-gray-600">by {book.author}</p>

                <p className="text-sm mt-2 text-gray-500">
                  Available copies:{" "}
                  <span className="font-medium text-black">
                    {book.availableCopies}
                  </span>
                </p>
              </div>

              {/* REQUEST BUTTON */}
              <button
                disabled={loadingId === book._id || book.availableCopies === 0}
                onClick={() => requestBook(book._id)}
                className={`mt-3 px-3 py-1 text-white rounded text-sm ${
                  book.availableCopies === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loadingId === book._id ? "Requesting..." : "Request"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
