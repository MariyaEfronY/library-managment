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
        body: JSON.stringify({ bookId }), // ✅ ONLY bookId
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
      <h2 className="text-xl font-bold mb-4">Available Books</h2>

      {books.length === 0 && <p>No books available</p>}

      {books.map(book => (
        <div key={book._id} className="border p-4 my-2 rounded">
          <p>
            <b>{book.title}</b> — {book.author}
          </p>

          <p className="text-sm text-gray-500">
            Available copies: {book.availableCopies}
          </p>

          <button
            disabled={loadingId === book._id || book.availableCopies === 0}
            onClick={() => requestBook(book._id)}
            className={`mt-2 px-3 py-1 text-white rounded ${
              book.availableCopies === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500"
            }`}
          >
            {loadingId === book._id ? "Requesting..." : "Request"}
          </button>
        </div>
      ))}
    </div>
  );
}
