"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

export default function StudentDashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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

  useEffect(() => {
      async function fetchProfile() {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
        setLoading(false);
      }
      fetchProfile();
    }, []);
  

  return (
  <div className="min-h-screen bg-gray-100">
    {/* Main Content */}
    <main className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Staff Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Overview of staff library activities
        </p>
      </div>

      {/* Profile + Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Staff Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Overview
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Name:</span> {user?.name}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user?.role}
            </p>

            {user?.role === "staff" && (
              <p>
                <span className="font-medium">Staff ID:</span>{" "}
                {user.staffId}
              </p>
            )}
          </div>
        </div>

        {/* Total Requests Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Total Book Requests
            </p>

            {loading ? (
              <div className="h-9 w-20 bg-gray-200 rounded animate-pulse mt-3" />
            ) : (
              <h2 className="text-4xl font-bold text-indigo-600 mt-2">
                {totalRequests}
              </h2>
            )}
          </div>

          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <BookOpen className="text-indigo-600" size={30} />
          </div>
        </div>

        {/* Placeholder / Future Card */}
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 flex items-center justify-center text-gray-400">
          Staff Actions Coming Soon
        </div>
      </div>

      

    </main>
  </div>
);

}
