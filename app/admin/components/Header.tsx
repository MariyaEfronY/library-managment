"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Header user fetch failed", err);
      }
    }

    fetchUser();
  }, []);

  return (
    <header className="bg-slate-900 text-white px-6 py-4 shadow-md flex items-center justify-between">
      {/* Title */}
      <h1 className="text-lg font-semibold">
        Library Admin Dashboard
      </h1>

      {/* User Info */}
      <div className="text-right">
        {user ? (
          <>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-slate-300 capitalize">
              {user.role}
            </p>
            
          </>
        ) : (
          <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
        )}
      </div>
    </header>
  );
}
