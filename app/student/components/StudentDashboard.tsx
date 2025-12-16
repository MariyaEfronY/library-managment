"use client";

import { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";

export default function StudentDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests/my")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.requests);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <StudentSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">My Book Requests</h1>

        {loading && <p>Loading...</p>}

        {!loading && requests.length === 0 && (
          <p className="text-gray-500">No book requests found</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-lg shadow p-4 border"
            >
              {/* IMAGE */}
              {req.bookId?.imageUrl ? (
                <img
                  src={req.bookId.imageUrl}
                  alt={req.bookId.title}
                  className="w-full h-48 object-cover rounded"
                />
              ) : (
                <div className="h-48 flex items-center justify-center bg-gray-200 rounded">
                  No Image
                </div>
              )}

              {/* DETAILS */}
              <h3 className="mt-3 text-lg font-semibold">
                {req.bookId?.title}
              </h3>

              <p className="text-sm text-gray-600">
                Author: {req.bookId?.author}
              </p>

              <p className="mt-2 font-semibold">
                Status:{" "}
                <span
                  className={
                    req.status === "approved"
                      ? "text-green-600"
                      : req.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {req.status.toUpperCase()}
                </span>
              </p>

              {req.returnDate && (
                <p className="text-sm text-red-600 mt-1">
                  Return By:{" "}
                  {new Date(req.returnDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
