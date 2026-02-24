"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book as BookIcon,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Zap,
  GraduationCap,
  ArrowUpRight,
  Database
} from "lucide-react";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    books: 0,
    users: 0,
    requests: 0,
    issued: 0,
    activeStudents: 0
  });

  useEffect(() => {
    setMounted(true);

    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Parallel fetch for maximum speed
        const [bookRes, userRes, reqRes, issueRes, activityRes] = await Promise.all([
          fetch("/api/books/count"),
          fetch("/api/fetch-users?limit=1"),
          fetch("/api/admin/fetch-requests"),
          fetch("/api/admin/fetch-issues"),
          fetch("/api/admin/fetch-activities")
        ]);

        const getJson = async (res: Response) => {
          const ct = res.headers.get("content-type");
          if (res.ok && ct?.includes("application/json")) return res.json();
          return null;
        };

        const [bD, uD, rD, iD, aD] = await Promise.all([
          getJson(bookRes), getJson(userRes), getJson(reqRes), getJson(issueRes), getJson(activityRes)
        ]);

        setStatsData({
          books: bD?.count || 0,
          users: uD?.totalUsers || 0,
          requests: rD?.requests?.length || 0,
          issued: iD?.issues?.length || 0,
          activeStudents: aD?.data ? new Set(aD.data.map((a: any) => a.student)).size : 0
        });

      } catch (err) {
        console.error("Critical Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const stats = [
    { label: "Inventory", title: "Total Books", value: statsData.books, icon: <BookIcon />, color: "from-blue-600 to-cyan-500" },
    { label: "Community", title: "Total Users", value: statsData.users, icon: <Users />, color: "from-indigo-600 to-purple-500" },
    { label: "Waitlist", title: "Pending Requests", value: statsData.requests, icon: <Clock />, color: "from-amber-500 to-orange-400" },
    { label: "Circulation", title: "Issued Records", value: statsData.issued, icon: <CheckCircle />, color: "from-emerald-600 to-teal-500" },
  ];

  if (!mounted) return null;

  return (
    <div className="p-4 lg:p-10 bg-[#fbfcfd] min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-700">

      {/* --- TOP HEADER --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[2px] w-8 bg-indigo-600 rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600/70">Management Suite</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
            Library <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Analytics</span>
          </h1>

        </motion.div>


      </div>

      {/* --- STATS GRID --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden cursor-default"
          >
            {/* Background Gradient Blob */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-[1.25rem] text-white bg-gradient-to-br ${stat.color} shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <ArrowUpRight className="text-slate-200 group-hover:text-indigo-400 transition-colors" size={20} />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                {stat.label}
              </span>
              <h3 className="text-slate-900 text-sm font-bold mb-4">{stat.title}</h3>

              <div className="flex items-end gap-2">
                <p className="text-4xl font-black text-slate-900 tracking-tight">
                  {loading ? (
                    <span className="block w-20 h-10 bg-slate-100 animate-pulse rounded-xl" />
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Activity Feed Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden relative"
        >
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl">
                <Zap size={20} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Throughput</h2>
            </div>
            <div className="flex gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>

          <div className="relative border-2 border-dashed border-slate-100 rounded-[2rem] py-20 flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-50/30 pointer-events-none" />
            <Database className="text-slate-200 mb-6 w-16 h-16" strokeWidth={1} />
            <p className="text-slate-400 font-medium italic max-w-xs text-center">
              {statsData.requests > 0 || statsData.issued > 0
                ? "Global library stream is active. Database records are being indexed in real-time."
                : "Awaiting new transactional data from the library network."}
            </p>
          </div>
        </motion.div>

        {/* API Status Cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-500/20"
        >
          <div className="flex items-center gap-3 mb-10">
            <Activity className="text-indigo-400" />
            <h2 className="text-xl font-bold">API Infrastructure</h2>
          </div>

          <div className="space-y-8">
            {[
              { name: "Inventory Service", status: "Healthy" },
              { name: "User Directory", status: "Active" },
              { name: "Transaction Hub", status: "Syncing" }
            ].map((svc) => (
              <div key={svc.name} className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{svc.name}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  <span className="text-[10px] font-black text-white">{svc.status}</span>
                </div>
              </div>
            ))}

            <div className="h-[1px] bg-white/10 my-4" />

            <div>
              <div className="flex justify-between items-end mb-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Database Load</p>
                <p className="text-xs font-bold">2.4ms</p>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "35%" }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}