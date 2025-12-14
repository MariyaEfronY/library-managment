"use client";

import { useEffect, useState } from "react";
import BookCard from "@/app/components/BookCard";

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch("/api/books")
      .then(res => res.json())
      .then(data => setBooks(data.books));
  }, [user]);

  const requestBook = async (bookId: string) => {
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestedBy: user._id,
        requestedRole: "student",
        bookId,
      }),
    });

    const data = await res.json();
    alert(data.message || "Request sent");
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {books.map(book => (
          <BookCard
            key={book._id}
            book={book}
            onRequest={() => requestBook(book._id)}
          />
        ))}
      </div>
    </div>
  );
}
