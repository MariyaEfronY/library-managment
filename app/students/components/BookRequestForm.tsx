"use client";

import { useState } from "react";

export default function BookRequestForm() {
  const [form, setForm] = useState({ studentId: "", bookId: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/student/book-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Request failed");
        return;
      }

      setMessage("Book request sent!");
    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input name="studentId" placeholder="Student ID" value={form.studentId} onChange={handleChange} required />
      <input name="bookId" placeholder="Book ID" value={form.bookId} onChange={handleChange} required />
      <button type="submit">Send Request</button>
      {message && <p>{message}</p>}
    </form>
  );
}
