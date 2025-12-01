"use client";

import { useState, useEffect } from "react";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    totalCopies: 1,
  });

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    const res = await fetch("/api/books");
    setBooks(await res.json());
  }

  async function addBook() {
    await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        availableCopies: form.totalCopies,
      }),
    });

    loadBooks();
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Manage Books</h1>

      <div className="border p-5 rounded mb-6">
        <h2 className="font-semibold mb-3">Add Book</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Author"
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          placeholder="Category"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-2"
          type="number"
          placeholder="Total Copies"
          onChange={(e) =>
            setForm({ ...form, totalCopies: parseInt(e.target.value) })
          }
        />

        <button
          onClick={addBook}
          className="bg-green-700 text-white px-4 py-1 rounded"
        >
          Add Book
        </button>
      </div>

      <h2 className="font-semibold mt-5 mb-2">Current Books</h2>

      {books.map((b: any) => (
        <div key={b._id} className="border p-4 my-2 rounded">
          <h3>{b.title}</h3>
          <p>{b.author}</p>
          <p>Available: {b.availableCopies}</p>
        </div>
      ))}
    </div>
  );
}
