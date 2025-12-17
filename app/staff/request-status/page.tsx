"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Calendar, 
  ChevronRight, 
  Info,
  Clock,
  CheckCircle,
  XCircle,
  BookMarked
} from "lucide-react";

export default function StaffDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests/my")
      .then(res => res.json())
      .then(data => {
        if (data.success) setRequests(data.requests);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved": return "bg-emerald-500/90 text-white";
      case "rejected": return "bg-rose-500/90 text-white";
      default: return "bg-amber-500/90 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-medium text-slate-900">Reading Room</h1>
          <p className="text-slate-500 mt-2 font-light">Manage your personal book collection and active requests.</p>
        </div>
        <div className="text-right hidden md:block">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Requests</span>
          <p className="text-2xl font-semibold text-indigo-600">{requests.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {requests.map((req) => (
            <div key={req._id} className="group relative flex flex-col bg-transparent">
              {/* Image & Overlay Container */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-lg bg-slate-200 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                
                {/* Book Image */}
                <img
                  src={req.bookId?.imageUrl || "https://via.placeholder.com/400x600?text=No+Cover"}
                  alt={req.bookId?.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Status Floating Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter backdrop-blur-md shadow-sm ${getStatusStyle(req.status)}`}>
                  {req.status}
                </div>

                {/* Hover Triggered Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center text-slate-300 text-xs mb-2">
                      <User className="w-3 h-3 mr-2" />
                      <span>{req.bookId?.author}</span>
                    </div>
                    <div className="flex items-center text-slate-300 text-xs">
                      <Calendar className="w-3 h-3 mr-2" />
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs rounded-lg transition-colors border border-white/30">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Visible Text Content */}
              <div className="mt-4 px-1">
                <h3 className="text-slate-900 font-medium text-lg truncate leading-tight">
                  {req.bookId?.title}
                </h3>
                {/* Author Name visible even without hover but in a subtler way */}
                <p className="text-slate-500 text-sm mt-1 flex items-center">
                  <span className="w-4 h-px bg-slate-300 mr-2"></span>
                  {req.bookId?.author}
                </p>
              </div>
            </div>
          ))}

          {/* Empty State Card */}
          {!loading && requests.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
              <BookMarked className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500">Your library shelf is empty.</p>
              <button className="mt-4 text-indigo-600 font-medium hover:underline">Browse Catalog</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}