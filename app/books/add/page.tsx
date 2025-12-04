"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    availableCopies: "",
    status: "valid",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, (form as any)[key]));
    if (image) fd.append("image", image);

    const res = await fetch("/api/books/add", {
      method: "POST",
      body: fd,
    });

    if (res.ok) {
      router.push("/books");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">➕ Add Book</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Title"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="author"
          placeholder="Author"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          name="availableCopies"
          placeholder="Available Copies"
          type="number"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />

        <select
          name="status"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        >
          <option value="valid">Valid</option>
          <option value="invalid">Invalid</option>
        </select>

        <div>
          <label className="font-medium">Book Image</label>
          <input type="file" accept="image/*" onChange={handleImage} />

          {preview && (
            <img
              src={preview}
              className="mt-3 w-40 h-40 object-cover rounded"
            />
          )}
        </div>

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Add Book
        </button>
      </form>
    </div>
  );
}
