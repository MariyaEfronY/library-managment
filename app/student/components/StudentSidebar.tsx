"use client";

export default function StudentSidebar() {
  return (
    <aside className="w-64 bg-indigo-700 text-white p-6 space-y-6">
      <h2 className="text-xl font-bold">📘 Student Panel</h2>

      <nav className="space-y-3">
        <p className="font-semibold cursor-pointer">Dashboard</p>
        <p className="opacity-80 cursor-pointer">My Requests</p>
        <p className="opacity-80 cursor-pointer">Issued Books</p>
        <p className="opacity-80 cursor-pointer">Logout</p>
      </nav>
    </aside>
  );
}
