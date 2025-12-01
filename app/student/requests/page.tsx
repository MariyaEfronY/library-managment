"use client";

import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("/api/student/requests") // create backend later
      .then((res) => res.json())
      .then(setRequests);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Your Requests</h1>

      {requests.map((r: any) => (
        <div className="border p-3 mb-3 rounded" key={r._id}>
          <p>Book: {r.bookId.title}</p>
          <p>Status: {r.status}</p>

          {r.status === "approved" && (
            <>
              <p>Issue Date: {r.issueDate}</p>
              <p>Return Date: {r.returnDate}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
