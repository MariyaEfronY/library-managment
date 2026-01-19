"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  BookOpen, 
  Loader2, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  Bookmark
} from "lucide-react";

export default function StaffRequests() {
  const [books, setBooks] = useState<any[]>([]);
  const [myRequestStatuses, setMyRequestStatuses] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "available">("all");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [booksRes, myReqsRes] = await Promise.all([
          fetch("/api/books"),
          fetch("/api/requests/my")
        ]);
        const booksData = await booksRes.json();
        const myReqsData = await myReqsRes.json();

        if (booksData.success) setBooks(booksData.books || []);
        
        if (myReqsData.success) {
          const statusMap: Record<string, string> = {};
          myReqsData.requests.forEach((req: any) => {
            if (req.bookId) {
              const bId = typeof req.bookId === 'object' ? req.bookId._id : req.bookId;
              statusMap[bId] = req.status;
            }
          });
          setMyRequestStatuses(statusMap);
        }
      } catch (err) {
        console.error("Failed to load library data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const requestBook = async (bookId: string) => {
    setLoadingId(bookId);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message);
        return;
      }
      setMyRequestStatuses(prev => ({ ...prev, [bookId]: "pending" }));
      setBooks(prev => prev.map(b => b._id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    } catch (err) {
      alert("Failed to submit request.");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || book.availableCopies > 0;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        
        {/* HEADER SECTION */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <BookOpen size={18} />
            </span>
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Academic Resources</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Staff Library Portal
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
            Reserve teaching materials and institutional resources. Requests are prioritized for active curriculum requirements.
          </p>
        </motion.header>

        {/* SEARCH & FILTER BAR */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="sticky top-4 z-30 mb-12"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-slate-200/50 rounded-[24px] p-3 sm:p-4 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1 md:flex-none">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                <select 
                  className="w-full md:w-[180px] pl-11 pr-4 py-3 sm:py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold text-sm appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="all">All Catalog</option>
                  <option value="available">Available Now</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CONTENT GRID */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-400 font-bold animate-pulse text-sm uppercase tracking-widest">Indexing Library...</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredBooks.map((book, index) => {
                const status = myRequestStatuses[book._id];
                const isOutOfStock = book.availableCopies <= 0;

                return (
                  <motion.div
                    key={book._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col h-full overflow-hidden"
                  >
                    {/* Book Visual */}
                    <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                      {book.imageUrl ? (
                        <img 
                          src={book.imageUrl} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                          alt={book.title} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <BookOpen size={48} strokeWidth={1} />
                        </div>
                      )}
                      
                      {/* Floating Status Badge */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                        {status && (
                          <motion.span 
                            initial={{ x: 20 }} animate={{ x: 0 }}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg backdrop-blur-md ${
                              status === 'approved' ? 'bg-emerald-500 text-white' : 
                              status === 'rejected' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                            }`}
                          >
                            {status}
                          </motion.span>
                        )}
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter backdrop-blur-md border ${
                          isOutOfStock ? 'bg-slate-800 text-white' : 'bg-white/90 text-slate-900 border-white'
                        }`}>
                          {book.availableCopies} Copies Left
                        </span>
                      </div>
                    </div>

                    {/* Book Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="font-black text-slate-900 text-lg leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 font-medium">{book.author}</p>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-50">
                        <button
                          onClick={() => requestBook(book._id)}
                          disabled={loadingId === book._id || isOutOfStock || !!(status && status !== "rejected")}
                          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            status === "approved" ? "bg-emerald-50 text-emerald-600 cursor-default" :
                            status === "pending" ? "bg-amber-50 text-amber-600 cursor-default" :
                            status === "rejected" ? "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200 shadow-lg" :
                            isOutOfStock ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                            "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-xl active:scale-95"
                          }`}
                        >
                          {loadingId === book._id ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : status === "approved" ? (
                            <><CheckCircle size={16} /> Secured</>
                          ) : status === "pending" ? (
                            <><Clock size={16} /> In Review</>
                          ) : status === "rejected" ? (
                            "Re-Submit Request"
                          ) : isOutOfStock ? (
                            "Unavailable"
                          ) : (
                            <span className="flex items-center gap-2">Request Access <ArrowRight size={14} /></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}