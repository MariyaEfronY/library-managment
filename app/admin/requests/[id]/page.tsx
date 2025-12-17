"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AdminRequestPage() {
  const { id } = useParams();
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/requests/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRequest(data.request);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!request) return <p>No request found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Request Details</h1>

      <p><b>Status:</b> {request.status}</p>
      <p><b>User:</b> {request.requestedBy?.name}</p>
      <p><b>Book:</b> {request.bookId?.title}</p>
      <p><b>Requested Date:</b> {new Date(request.requestDate).toDateString()}</p>
    </div>
  );
}
