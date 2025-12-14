"use client";

import { useEffect, useState } from "react";

export default function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/requests")
      .then(res => res.json())
      .then(data => setRequests(data.requests));
  }, []);

  const updateStatus = async (id: string, action: "approve" | "reject") => {
    await fetch("/api/admin/requests/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId: id,
        action,
        returnDate: new Date(Date.now() + 7 * 86400000),
      }),
    });

    setRequests(prev => prev.filter(r => r._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Requests</h1>

      {requests.map(req => (
        <div key={req._id} className="border p-4 rounded mb-3">
          <p><b>Name:</b> {req.requestedBy.name}</p>
          <p><b>Email:</b> {req.requestedBy.email}</p>
          <p><b>Book:</b> {req.bookId.title}</p>
          <p><b>Available:</b> {req.bookId.availableCopies}</p>

          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => updateStatus(req._id, "approve")}
            >
              Approve
            </button>

            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => updateStatus(req._id, "reject")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
