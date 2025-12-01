"use client";

import { useEffect, useState } from "react";

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("/api/admin/requests") // backend next
      .then((res) => res.json())
      .then(setRequests);
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/request/update", {
      method: "POST",
      body: JSON.stringify({
        requestId: id,
        status,
        issueDate: new Date(),
        returnDate: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 1 week
      }),
    });

    alert("Updated!");
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Manage Requests</h1>

      {requests.map((r: any) => (
        <div className="border p-4 mb-3 rounded" key={r._id}>
          <p>Book: {r.bookId.title}</p>
          <p>Student: {r.studentId.name}</p>
          <p>Status: {r.status}</p>

          <button
            className="bg-green-700 text-white px-3 py-1 mr-3"
            onClick={() => updateStatus(r._id, "approved")}
          >
            Approve
          </button>

          <button
            className="bg-red-600 text-white px-3 py-1"
            onClick={() => updateStatus(r._id, "rejected")}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
