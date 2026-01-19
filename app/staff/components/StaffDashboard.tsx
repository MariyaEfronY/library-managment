"use client";

import { useEffect, useState } from "react";
import { BookOpen, UserCheck, ShieldCheck, ArrowRight, BarChart3, Bell } from "lucide-react";
import StaffSidebar from "./StaffSidebar";

export default function StaffDashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
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
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <StaffSidebar />
      {/* TOP WELCOME HEADER - Matching Student Style */}
      <div className="mb-10 pt-12 lg:pt-0"> {/* Space for mobile burger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Staff Dashboard
              </h1>
            </div>
            <p className="text-slate-500 text-sm sm:text-base ml-4">
              Welcome back, <span className="text-indigo-600 font-semibold">{user?.name || "Staff Member"}</span>. Managing library operations.
            </p>
          </div>
          
          
        </div>
      </div>

      {/* STATS & PROFILE GRID - Same layout as Student Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        {/* 1. PROFESSIONAL STAFF PROFILE CARD */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <ShieldCheck size={80} />
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <UserCheck size={24} />
            </div>
            <div>
              <h2 className="text-slate-900 font-bold">Staff Overview</h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Staff Details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Employee Name</p>
              <p className="text-sm text-slate-700 font-semibold">{user?.name || "---"}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Staff ID</p>
                <p className="text-sm text-slate-700 font-semibold">{user?.staffId || "---"}</p>
              </div>
              
            </div>
          </div>
        </div>

        {/* 2. ADVANCED STATS CARD - Deep Navy/Slate for Staff Authority */}
        <div className="bg-[#1e293b] rounded-[24px] shadow-xl shadow-slate-200 p-8 flex flex-col justify-between relative group overflow-hidden">
          {/* Background Watermark */}
          <div className="absolute -bottom-4 -right-4 text-white/5 group-hover:scale-110 transition-transform">
             <BookOpen size={140} />
          </div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Global Book Requests</p>
              {loading ? (
                <div className="h-10 w-16 bg-white/10 rounded-lg animate-pulse" />
              ) : (
                <h2 className="text-5xl font-extrabold text-white tracking-tighter">
                  {totalRequests}
                </h2>
              )}
            </div>
            
          </div>

          
        </div>

        {/* 3. ANALYTICS FEED PLACEHOLDER */}
        <div className="bg-white rounded-[24px] border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-300 transition-colors">
          <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:bg-indigo-50 transition-all mb-4">
             <BarChart3 size={28} />
          </div>
          <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest">Analytics Feed</h3>
          <p className="text-slate-300 text-xs mt-2">Inventory insights coming soon</p>
        </div>

      </div>

      {/* SECONDARY SECTION: SYSTEM NOTIFICATION */}
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-800">Operational Log</h3>
              </div>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-tighter">Admin View</span>
          </div>
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm text-slate-600 leading-relaxed">
                  System check complete. All server-side requests are performing within the 200ms threshold. Staff members can now approve or reject book requests from the <b>Active Requests</b> tab.
              </p>
          </div>
      </div>

    </div>
  );
}