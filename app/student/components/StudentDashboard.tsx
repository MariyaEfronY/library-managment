"use client";

import { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import { BookOpen } from "lucide-react";

export default function StudentDashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests/my")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTotalRequests(data.requests.length);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-6 lg:ml-64">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of your library activity
          </p>
        </div>

        {/* Total Requests Card */}
        <div className="max-w-sm">
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Book Requests
              </p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2" />
              ) : (
                <h2 className="text-3xl font-bold text-indigo-600 mt-2">
                  {totalRequests}
                </h2>
              )}
            </div>

            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
              <BookOpen className="text-indigo-600" size={28} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
