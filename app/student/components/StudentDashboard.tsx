"use client";

import { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import { BookOpen, User, GraduationCap, ArrowUpRight, Activity } from "lucide-react";

export default function StudentDashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Combined fetching for cleaner performance
    const fetchData = async () => {
      try {
        const [reqRes, profileRes] = await Promise.all([
          fetch("/api/requests/my"),
          fetch("/api/auth/me")
        ]);

        if (reqRes.ok) {
          const reqData = await reqRes.json();
          if (reqData.success) setTotalRequests(reqData.requests.length);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success) setUser(profileData.user);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <StudentSidebar />

      {/* Main Content - Notice the dynamic margin/padding for mobile burger menu */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-12 transition-all duration-300">
        
        {/* TOP WELCOME HEADER */}
        <div className="mb-10 pt-12 lg:pt-0"> {/* pt-12 for mobile burger space */}
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Student Dashboard
            </h1>
          </div>
          <p className="text-slate-500 text-sm sm:text-base ml-4">
            Welcome back, <span className="text-indigo-600 font-semibold">{user?.name || "Student"}</span>. Here is your library activity overview.
          </p>
        </div>

        {/* STATS & PROFILE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

          {/* 1. PROFESSIONAL PROFILE CARD */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <GraduationCap size={80} />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-slate-900 font-bold">Profile Overview</h2>
                <p className="text-xs text-slate-400 uppercase tracking-widest">Identity verified</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Full Name</p>
                <p className="text-sm text-slate-700 font-semibold">{user?.name || "---"}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Department ID</p>
                <p className="text-sm text-slate-700 font-semibold">{user?.rollNumber || user?.id || "---"}</p>
              </div>
            </div>
          </div>

          {/* 2. ADVANCED STATS CARD */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[24px] shadow-lg shadow-indigo-100 p-8 flex flex-col justify-between relative group overflow-hidden">
            <div className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform">
               <BookOpen size={140} />
            </div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-indigo-100/80 text-sm font-medium mb-1">Total Book Requests</p>
                {loading ? (
                  <div className="h-10 w-16 bg-white/20 rounded-lg animate-pulse" />
                ) : (
                  <h2 className="text-5xl font-extrabold text-white tracking-tighter">
                    {totalRequests}
                  </h2>
                )}
              </div>
             
            </div>

          
          </div>

          {/* 3. ACTIVITY FEED PLACEHOLDER */}
          <div className="bg-white rounded-[24px] border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-300 transition-colors">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:bg-indigo-50 transition-all mb-4">
               <Activity size={28} />
            </div>
            <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest">Activity Feed</h3>
            <p className="text-slate-300 text-xs mt-2">Real-time book tracking coming soon</p>
          </div>

        </div>

        {/* SECONDARY SECTION: RECENT ACTIVITY UI */}
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">System Notification</h3>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-tighter">Status: Live</span>
            </div>
            <div className="flex items-start gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <p className="text-sm text-slate-600 leading-relaxed">
                    Welcome to the 2026 Library Management System. You can now browse available books and track your requests in real-time. Contact the IT desk for any access issues.
                </p>
            </div>
        </div>

      </main>
    </div>
  );
}