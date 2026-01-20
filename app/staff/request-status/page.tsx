"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  BookMarked,
  ArrowUpRight,
  User
} from "lucide-react";

export default function ReadingRoom() {
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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved": 
        return { label: "Approved", icon: <CheckCircle size={10} />, class: "bg-emerald-500 text-white" };
      case "rejected": 
        return { label: "Declined", icon: <XCircle size={10} />, class: "bg-rose-500 text-white" };
      default: 
        return { label: "Pending", icon: <Clock size={10} />, class: "bg-amber-500 text-white" };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 lg:ml-64 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 lg:pt-12">
        
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
            Reading Room
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Your personal library activity and active loans.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Clock className="animate-spin text-indigo-600" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            <AnimatePresence>
              {requests.map((req, index) => {
                const status = getStatusConfig(req.status);
                const isApproved = req.status === "approved";

                return (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex flex-col"
                  >
                    {/* BOOK COVER CONTAINER */}
                    <div className="relative aspect-[2/3] rounded-[24px] overflow-hidden bg-white shadow-md group-hover:shadow-xl transition-all duration-500">
                      <img
                        src={req.bookId?.imageUrl || "https://via.placeholder.com/400x600"}
                        alt={req.bookId?.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* TOP BADGE: STATUS (Always Visible) */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${status.class}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>

                      {/* BOTTOM BADGE: RETURN DATE (Always Visible on Mobile/Desktop if Approved) */}
                      {isApproved && req.returnDate && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="bg-white/90 backdrop-blur-md border border-white p-2 rounded-xl flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-rose-100 text-rose-600 rounded-md">
                                <Calendar size={12} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] text-slate-400 font-bold uppercase leading-none mb-0.5">Return Date</span>
                                <span className="text-[10px] text-slate-900 font-black leading-none">
                                  {new Date(req.returnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </span>
                              </div>
                            </div>
                            <AlertCircle size={12} className="text-rose-500 animate-pulse" />
                          </div>
                        </div>
                      )}

                      {/* DESKTOP HOVER OVERLAY (Additional Details) */}
                      <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="bg-white p-2 rounded-full text-indigo-600 transform scale-0 group-hover:scale-100 transition-transform">
                            <ArrowUpRight size={20} />
                         </div>
                      </div>
                    </div>

                    {/* TEXT CONTENT */}
                    <div className="mt-4 px-1">
                      <h3 className="text-slate-900 font-bold text-base truncate mb-0.5">
                        {req.bookId?.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-slate-500 text-xs font-medium flex items-center gap-1">
                          <User size={10} /> {req.bookId?.author}
                        </p>
                        <span className="text-[10px] text-slate-300 font-mono">#{req._id.slice(-4)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}