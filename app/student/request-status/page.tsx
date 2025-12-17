"use client";

import { useEffect, useState } from "react";
import { 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BookMarked,
  AlertCircle 
} from "lucide-react";

export default function StudentDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/requests/my")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.requests);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Status helper for consistent colors
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return { color: "bg-emerald-500/90", icon: <CheckCircle className="w-3 h-3 mr-1" /> };
      case "rejected":
        return { color: "bg-rose-500/90", icon: <XCircle className="w-3 h-3 mr-1" /> };
      default:
        return { color: "bg-amber-500/90", icon: <Clock className="w-3 h-3 mr-1" /> };
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-10 lg:ml-64 transition-all duration-300">
        
        {/* HEADER SECTION */}
        <header className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-medium text-slate-900 tracking-tight">
              My Study Shelf
            </h1>
            <p className="text-slate-500 mt-2 font-light">
              Manage your active borrowings and track your request history.
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Requests</p>
              <p className="text-xl font-semibold text-indigo-600">{requests.length}</p>
            </div>
            <div className="w-px h-8 bg-slate-100"></div>
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Borrowing</p>
              <p className="text-xl font-semibold text-emerald-600">
                {requests.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </header>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-400 animate-pulse text-sm">Organizing your library...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && requests.length === 0 && (
          <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
            <BookMarked className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-slate-900 font-medium text-lg">Your shelf is empty</h3>
            <p className="text-slate-500 text-sm mt-1">Ready to start learning? Browse our collection.</p>
            <button className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Browse Books
            </button>
          </div>
        )}

        {/* CARD GRID */}
        {!loading && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
            {requests.map((req) => {
              const config = getStatusConfig(req.status);
              return (
                <div key={req._id} className="group relative flex flex-col">
                  {/* IMAGE & TRIGGER OVERLAY */}
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-md bg-slate-200 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                    <img
                      src={req.bookId?.imageUrl || "https://via.placeholder.com/400x600?text=No+Cover"}
                      alt={req.bookId?.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* STATUS FLOATING BADGE */}
                    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm flex items-center ${config.color} text-white`}>
                      {config.icon}
                      {req.status}
                    </div>

                    {/* HOVER TRIGGER: REVEAL AUTHOR & RETURN DATE */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                      <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center text-slate-200 text-sm mb-2">
                          <User className="w-4 h-4 mr-2 text-indigo-400" />
                          <span>{req.bookId?.author}</span>
                        </div>
                        
                        {req.returnDate && req.status === "approved" && (
                          <div className="flex items-center text-rose-300 text-xs font-medium">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            <span>Return by: {new Date(req.returnDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-slate-400 text-[10px] mt-4 uppercase tracking-widest font-bold">
                          <Calendar className="w-3 h-3 mr-2" />
                          Requested: {new Date(req.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM TITLE SECTION */}
                  <div className="mt-5 px-1">
                    <h3 className="text-slate-900 font-medium text-lg truncate group-hover:text-indigo-600 transition-colors">
                      {req.bookId?.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 flex items-center">
                      <span className="w-5 h-px bg-slate-200 mr-2 group-hover:w-8 group-hover:bg-indigo-300 transition-all"></span>
                      {req.bookId?.author}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}