"use client";

import { useEffect, useState } from "react";

export default function BorrowedBooks() {
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch("/api/borrowed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id }),
    })
      .then(res => res.json())
      .then(data => setRecords(data.records));
  }, [user]);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Borrowed Books</h1>

      {records.length === 0 && <p>No borrowed books</p>}

      {records.map(r => (
        <div key={r._id} className="border p-4 mb-3 rounded">
          <p><b>Book ID:</b> {r.bookId.bookId}</p>
          <p><b>Title:</b> {r.bookId.title}</p>
          <p><b>Author:</b> {r.bookId.author}</p>
          <p><b>Issue Date:</b> {new Date(r.issueDate).toDateString()}</p>
          <p><b>Return Date:</b> {new Date(r.returnDate).toDateString()}</p>
        </div>
      ))}
    </div>
  );
}
