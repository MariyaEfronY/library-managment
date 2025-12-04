"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditBookPage({ params }: any) {
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const fetchBook = async () => {
    const res = await fetch(`/api/books/${params.id}`);
    const data = await res.json();
    setBook(data);
    setPreview(data.image);
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const updateBook = async (e: any) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", book.title);
    fd.append("author", book.author);
    fd.append("category", book.category);
    fd.append("availableCopies", book.availableCopies);
    fd.append("status", book.status);

    if (newImage) fd.append("image", newImage);

    const res = await fetch(`/api/books/update/${params.id}`, {
      method: "PUT",
      body: fd,
    });

    if (res.ok) router.push("/books");
  };

  if (!book) return <p className="p-8">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">✏️ Edit Book</h1>

      <form onSubmit={updateBook} className="space-y-4">

        <input
          className="w-full border p-2 rounded"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          value={book.author}
          onChange={(e) => setBook({ ...book, author: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          value={book.category}
          onChange={(e) => setBook({ ...book, category: e.target.value })}
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          value={book.availableCopies}
          onChange={(e) =>
            setBook({ ...book, availableCopies: Number(e.target.value) })
          }
        />

        <select
          className="w-full border p-2 rounded"
          value={book.status}
          onChange={(e) =>
            setBook({ ...book, status: e.target.value })
          }
        >
          <option value="valid">Valid</option>
          <option value="invalid">Invalid</option>
        </select>

        <div>
          <label>Change Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e: any) => {
              setNewImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </div>

        {preview && (
          <img
            src={preview}
            className="mt-3 w-40 h-40 object-cover rounded"
          />
        )}

        <button className="w-full bg-yellow-500 text-white p-2 rounded">
          Update Book
        </button>
      </form>
    </div>
  );
}
