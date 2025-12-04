"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BooksPage() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    const res = await fetch("/api/books");
    const data = await res.json();
    setBooks(data.books);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">📚 Books List</h1>
        <Link href="/books/add">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            ➕ Add Book
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book: any) => (
          <div
            key={book._id}
            className="border rounded-lg shadow p-4 bg-white"
          >
            <img
              src={book.image || "/no-book.png"}
              className="w-full h-48 object-cover rounded"
              alt="Book"
            />
            <h2 className="text-xl font-semibold mt-3">{book.title}</h2>
            <p className="text-gray-600">Author: {book.author}</p>
            <p className="text-gray-600">Category: {book.category}</p>
            <p className="text-sm mt-1">
              Status:
              <span
                className={`ml-2 px-2 py-1 rounded text-white ${
                  book.status === "valid" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {book.status}
              </span>
            </p>

            <Link href={`/books/edit/${book._id}`}>
              <button className="mt-4 px-3 py-2 bg-yellow-500 text-white w-full rounded">
                ✏️ Edit
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
