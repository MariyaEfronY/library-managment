"use client";

import { motion } from "framer-motion";
import {
  Book as BookIcon,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  // These would ideally come from an API
  const stats = [
    { label: "Total Books", value: "1,240", icon: <BookIcon />, color: "bg-blue-500", trend: "+12%" },
    { label: "Active Users", value: "458", icon: <Users />, color: "bg-indigo-500", trend: "+5%" },
    { label: "Pending Requests", value: "12", icon: <Clock />, color: "bg-amber-500", trend: "Action required" },
    { label: "Issued Today", value: "24", icon: <CheckCircle />, color: "bg-emerald-500", trend: "Normal" },
  ];

  return (
    <div className="p-6 lg:p-10 bg-[#FAFBFF] min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-slate-900 tracking-tight"
        >
          System Overview
        </motion.h1>
        <p className="text-slate-500 font-medium">Welcome back, Administrator. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group hover:border-indigo-500 transition-all cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl text-white ${stat.color} shadow-lg shadow-indigo-100`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Areas (Placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-900">Recent Transactions</h2>
            <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
          </div>

          {/* Empty State / Placeholder */}
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="text-slate-300 w-8 h-8" />
            </div>
            <p className="text-slate-400 font-medium italic">No recent activity recorded in the last 24 hours.</p>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200/20">
          <h2 className="text-lg font-bold mb-6">Database Status</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium opacity-80">Cloud Sync: Active</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium opacity-80">Inventory API: Stable</span>
            </div>
            <hr className="border-slate-800" />
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-indigo-400 mb-2 uppercase">Storage Usage</p>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[65%]" />
              </div>
              <p className="text-[10px] mt-2 opacity-50">65% of 500GB utilized</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}