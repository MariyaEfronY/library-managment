"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BookMarked,
  AlertCircle,
  ArrowUpRight,
  Library
} from "lucide-react";

export default function StudentDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests/my")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRequests(data.requests);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return { label: "Approved", color: "bg-emerald-500", icon: <CheckCircle size={10} /> };
      case "rejected":
        return { label: "Declined", color: "bg-rose-500", icon: <XCircle size={10} /> };
      default:
        return { label: "Pending", color: "bg-amber-500", icon: <Clock size={10} /> };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 lg:ml-64 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 lg:pt-12">
        
        {/* HEADER SECTION WITH STATS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <Library size={16} />
              </div>
              <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">Student Library</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">
              My Study Shelf
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Manage your active borrowings and track request history.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6 bg-white px-8 py-4 rounded-[24px] border border-slate-100 shadow-sm"
          >
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total</p>
              <p className="text-2xl font-black text-slate-900">{requests.length}</p>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active</p>
              <p className="text-2xl font-black text-emerald-600">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </motion.div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            <AnimatePresence>
              {requests.map((req, index) => {
                const config = getStatusConfig(req.status);
                const isApproved = req.status === "approved";

                return (
                  <motion.div
                    key={req._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex flex-col"
                  >
                    {/* BOOK COVER ART */}
                    <div className="relative aspect-[2/3] rounded-[32px] overflow-hidden bg-white shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <img
                        src={req.bookId?.imageUrl || "https://via.placeholder.com/400x600"}
                        alt={req.bookId?.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* STATUS OVERLAY (Always Visible) */}
                      <div className="absolute top-4 left-4">
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter backdrop-blur-md shadow-lg text-white ${config.color}`}>
                          {config.icon} {config.label}
                        </span>
                      </div>

                      {/* RETURN DATE PILL (Always Visible on Mobile/Desktop if Approved) */}
                      {isApproved && req.returnDate && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <motion.div 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white/90 backdrop-blur-xl border border-white/20 p-3 rounded-2xl flex items-center justify-between shadow-2xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                                <Calendar size={14} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-black uppercase leading-none mb-1">Return By</span>
                                <span className="text-xs text-slate-900 font-black leading-none">
                                  {new Date(req.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <AlertCircle size={14} className="text-rose-500 animate-pulse" />
                          </motion.div>
                        </div>
                      )}

                      {/* HOVER SEARCH ICON (Desktop) */}
                      <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="bg-white p-3 rounded-full text-indigo-600 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                            <ArrowUpRight size={24} />
                         </div>
                      </div>
                    </div>

                    {/* BOOK INFO */}
                    <div className="mt-6 px-1">
                      <h3 className="text-slate-900 font-black text-lg leading-tight truncate group-hover:text-indigo-600 transition-colors">
                        {req.bookId?.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-slate-400 text-sm font-bold italic flex items-center">
                           <span className="w-4 h-[2px] bg-slate-200 mr-2 group-hover:w-6 group-hover:bg-indigo-400 transition-all"></span>
                           {req.bookId?.author}
                        </p>
                        <span className="text-[10px] font-mono text-slate-300">ID-{req._id.slice(-4)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && requests.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-24 flex flex-col items-center justify-center text-center"
          >
            <div className="w-24 h-24 rounded-[32px] bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-200 mb-6">
              <BookMarked size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Shelf is Empty</h3>
            <p className="text-slate-500 max-w-xs mb-8">You haven't requested any books yet. Visit the catalog to add items to your shelf.</p>
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95">
              Explore Library
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}