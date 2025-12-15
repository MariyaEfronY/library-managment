"use client";

import { useEffect, useState } from "react";

export default function RequestStatus() {
  const [requests, setRequests] = useState<any[]>([]); // ✅ array by default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          "/api/requests/my?userId=LOGGED_IN_USER_ID"
        );
        const data = await res.json();

        // ✅ SAFETY CHECK
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

  if (loading) return <p>Loading requests...</p>;

  if (requests.length === 0)
    return <p className="text-gray-500">No requests found</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">My Requests</h2>

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
              <td>{req.bookId?.title || "N/A"}</td>
              <td className="capitalize">{req.status}</td>
              <td>
                {req.status === "approved" && req.returnDate
                  ? new Date(req.returnDate).toDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
