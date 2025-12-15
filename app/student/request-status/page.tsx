"use client";
import { useEffect, useState } from "react";

interface Request {
  _id: string;
  status: string;
  returnDate?: string;
  bookId: { title: string; author: string } | null;
}

export default function StudentRequestStatus() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/requests/my");
        const data = await res.json();

        if (data.success) {
          setRequests(data.requests);
        } else {
          alert(data.message || "Failed to fetch requests");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p className="p-6">Loading requests...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Book Requests</h2>

      {requests.length === 0 && <p>No requests found</p>}

      {requests.map(req => (
        <div key={req._id} className="border p-4 mb-3 rounded">
          <p>
            Book: {req.bookId?.title || "Unknown"} — {req.bookId?.author || "Unknown"}
          </p>
          <p>Status: {req.status}</p>
          {req.status === "approved" && req.returnDate && (
            <p>Return Date: {new Date(req.returnDate).toLocaleDateString()}</p>
          )}
        </div>
      ))}
    </div>
  );
}
