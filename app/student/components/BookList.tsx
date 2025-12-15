"use client";

import { useEffect, useState } from "react";

export default function BookList() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/books")
      .then(res => res.json())
      .then(data => setBooks(data.books));
  }, []);

const requestBook = async (bookMongoId: string) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user?._id) {
    alert("User not logged in");
    return;
  }

  try {
    const res = await fetch("/api/requests/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,          // ✅ REAL ObjectId
        role: "student",
        bookId: bookMongoId,       // ✅ REAL ObjectId
      }),
    });

    const data = await res.json();
    console.log("Request response:", data);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Request sent successfully");
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Available Books</h2>
      <table className="w-full border">
        <thead>
          <tr>
             <th>Image</th>
    <th>Title</th>
    <th>Author</th>
    <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {books.map((book) => (
    <tr key={book._id} className="border-b">
      <td className="p-2">
        {book.imageUrl ? (
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-16 h-20 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </td>

      <td className="p-2">{book.title}</td>
      <td className="p-2">{book.author}</td>

      <td className="p-2">
        <button
          onClick={() => requestBook(book._id)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Request
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
