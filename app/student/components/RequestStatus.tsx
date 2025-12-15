"use client";

import { useEffect, useState } from "react";

export default function RequestStatus() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 💡 Improvement: Better safe parsing and check
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user?._id) {
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      // ... (fetch logic remains the same)
      try {
        const res = await fetch(
          `/api/requests/my?userId=${user._id}`,
          { cache: "no-store" } // ✅ IMPORTANT
        );

        const data = await res.json();

        if (data.success && Array.isArray(data.requests)) {
          setRequests(data.requests);
        } else {
          setRequests([]);
        }
      } catch (err) {
        console.error(err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">My Requests</h2>

      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Book</th>
              <th>Status</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.bookId?.title}</td>
                <td className="capitalize">{req.status}</td>
                <td>
                  {/* ✅ CORRECT: Display returnDate only if approved and present */}
                  {req.status === "approved" && req.returnDate
                    ? new Date(req.returnDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}