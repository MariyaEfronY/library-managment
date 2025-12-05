"use client";
export default function Header() {
  return (
    <header className="w-full h-16 bg-slate-800 text-white flex items-center justify-between px-6">
      <h1 className="text-lg font-bold">Library Admin Dashboard</h1>
      <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
        Logout
      </button>
    </header>
  );
}
