"use client";
import { useEffect, useState } from "react";
// Assuming Link is imported from 'next/link' if needed for navigation

// Helper to format date (optional)
const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
};

export default function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for date input: which request is active, and what date is selected
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [tempReturnDate, setTempReturnDate] = useState("");

  const fetchRequests = async () => {
    try {
      // FIX: Assuming GET /api/requests is the route for fetching all requests
      const res = await fetch("/api/requests"); 
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch requests");
      }
      setRequests(data.requests || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    
    // Set default return date (14 days from now)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 14);
    setTempReturnDate(defaultDate.toISOString().split('T')[0]);
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    let returnDate = null;
    if (status === "approved") {
      returnDate = tempReturnDate;
      if (!returnDate) {
        alert("Please select a valid return date before confirming approval.");
        return;
      }
    }

    try {
      // FIX: Corrected API call path
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, returnDate }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(`Failed to update: ${data.message}`);
        return;
      }

      // Refresh the list after success (safer than trying to update individual objects)
      await fetchRequests(); 
      
      // Clear active state after success
      setActiveRequestId(null);

    } catch (err) {
      console.error(err);
      alert("Something went wrong during update.");
    }
  };

  if (loading) return <div className="p-6">Loading requests...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">📚 Book Requests Management</h2>

      {requests.length === 0 && <p className="text-gray-500">No requests found</p>}

      <div className="space-y-4">
        {requests.map(req => (
          <div key={req._id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-lg">Book:{req.bookId?.bookId || "Unknown"} <br />
              Title:{req.bookId?.title || "Unknown"}  <br />
              Auther: {req.bookId?.author || "Unknown"}</p> <br />
              Available Copies: {req.bookId?.availableCopies ?? "N/A"}
            <p className="text-sm text-gray-700">
  User: {req.requestedBy?.name} <br />
  Email : {req.requestedBy?.email}
</p>

{req.requestedBy?.role === "student" && (
  <p className="text-sm text-blue-600 font-medium">
    Roll No: {req.requestedBy?.rollNumber || "N/A"}
  </p>
)}

{req.requestedBy?.role === "staff" && (
  <p className="text-sm text-purple-600 font-medium">
    Staff ID: {req.requestedBy?.staffId || "N/A"}
  </p>
)}

            <p className={`mt-1 font-bold ${req.status === 'pending' ? 'text-yellow-600' : req.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                Status: {req.status.toUpperCase()}
            </p>

            {req.status === "pending" && (
              <div className="mt-3">
                
                {activeRequestId === req._id ? (
                  // Date Picker View
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-gray-50 p-3 rounded">
                    <label className="text-sm font-medium">Return Date:</label>
                    <input
                      type="date"
                      value={tempReturnDate}
                      onChange={(e) => setTempReturnDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]} 
                      className="border p-1 rounded text-sm w-full sm:w-auto"
                    />
                    <button 
                      onClick={() => updateStatus(req._id, "approved")} 
                      className="bg-green-600 px-3 py-1 text-white text-sm font-semibold rounded hover:bg-green-700 transition"
                    >
                      Confirm Approve
                    </button>
                    <button 
                      onClick={() => setActiveRequestId(null)} 
                      className="bg-gray-400 px-3 py-1 text-white text-sm font-semibold rounded hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // Initial Button View
                  <>
                    <button 
                      onClick={() => setActiveRequestId(req._id)} 
                      className="bg-indigo-500 px-3 py-1 text-white mr-2 rounded hover:bg-indigo-600 transition font-semibold"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateStatus(req._id, "rejected")} 
                      className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600 transition font-semibold"
                    >
                      Reject
                    </button>
                  </>
                )}
                
              </div>
            )}
            
            {req.status === "approved" && req.returnDate && (
              <p className="mt-2 font-semibold text-red-700">
                Loaned: Return By {formatDate(req.returnDate)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}