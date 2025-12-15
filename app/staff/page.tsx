"use client";

import BookList from "./components/BookList";
import RequestStatus from "./components/RequestStatus";

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Staff Dashboard</h1>
      <BookList />
      <RequestStatus />
    </div>
  );
}
