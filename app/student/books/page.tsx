"use client";

import { useEffect, useState } from "react";

export default function StudentBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then(setBooks);
  }, []);

  async function requestBook(bookId: string) {
    const token = localStorage.getItem("studentToken");

    const res = await fetch("/api/request", {
      method: "POST",
      body: JSON.stringify({ bookId, studentId: token }),
    });

    const data = await res.json();
    alert("Book Requested!");
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Available Books</h1>

      {books.map((b: any) => (
        <div key={b._id} className="border p-4 mb-3 rounded">
          <h3 className="font-semibold">{b.title}</h3>
          <p className="text-sm">{b.author}</p>
          <p className="text-sm">Available: {b.availableCopies}</p>

          <button
            onClick={() => requestBook(b._id)}
            className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
          >
            Request Issue
          </button>
        </div>
      ))}
    </div>
  );
}
