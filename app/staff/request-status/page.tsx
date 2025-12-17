"use client";
import { useEffect, useState } from "react";

export default function StaffDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests/my")
      .then(res => res.json())
      .then(data => {
        if (data.success) setRequests(data.requests);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Book Requests (Staff)</h1>

      {loading && <p>Loading...</p>}

      {!loading && requests.length === 0 && (
        <p className="text-gray-500">No requests found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {requests.map(req => (
          <div key={req._id} className="bg-white p-4 shadow rounded">
            <img
              src={req.bookId?.imageUrl}
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="mt-2 font-semibold">{req.bookId?.title}</h3>
            <p className="text-sm">{req.bookId?.author}</p>
            <p className="mt-2 font-bold">{req.status.toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
