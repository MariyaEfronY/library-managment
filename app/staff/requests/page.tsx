"use client";
import { useEffect, useState } from "react";
import { 
  Search, 
  BookOpen, 
  User, 
  Calendar, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function StaffRequests() {
  const [books, setBooks] = useState<any[]>([]);
  // 1. New state to track request statuses for the logged-in staff
  const [myRequestStatuses, setMyRequestStatuses] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "available">("all");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 2. Fetch both books and staff's personal requests in parallel
        const [booksRes, myReqsRes] = await Promise.all([
          fetch("/api/books"),
          fetch("/api/requests/my") // Ensure this endpoint returns staff's requests
        ]);

        const booksData = await booksRes.json();
        const myReqsData = await myReqsRes.json();

        if (booksData.success) setBooks(booksData.books || []);
        
        if (myReqsData.success) {
          // 3. Create a map of BookID -> Current Status (pending/approved/rejected)
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

      // 4. Update UI immediately to show 'Pending'
      setMyRequestStatuses(prev => ({ ...prev, [bookId]: "pending" }));
      
      // Update local copy count
      setBooks(prev => prev.map(b => b._id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));

      alert("Staff request submitted successfully!");
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
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Portal: Book Request</h1>
          <p className="text-gray-600">Borrow resources for your teaching requirements.</p>
        </header>

        {/* Search Bar (Same as Student for consistency) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl text-black focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="p-3 border rounded-xl bg-white text-black min-w-[150px]"
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Books</option>
            <option value="available">Available</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const status = myRequestStatuses[book._id];
              const isOutOfStock = book.availableCopies <= 0;

              return (
                <div key={book._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  {/* Book Image */}
                  <div className="h-48 bg-gray-100 relative">
                    {book.imageUrl && <img src={book.imageUrl} className="w-full h-full object-cover" alt={book.title} />}
                    {status && (
                       <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          status === 'approved' ? 'bg-green-500 text-white' : 
                          status === 'rejected' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {status}
                        </span>
                       </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{book.author}</p>
                    
                    <div className="mt-auto">
                      {/* 5. Logic-aware Button */}
                      <button
                        onClick={() => requestBook(book._id)}
                         disabled={loadingId === book._id || isOutOfStock || !!(status && status !== "rejected")}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          status === "approved" ? "bg-green-100 text-green-700 cursor-default" :
                          status === "pending" ? "bg-amber-100 text-amber-700 cursor-default" :
                          status === "rejected" ? "bg-red-600 text-white hover:bg-red-700" :
                          isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                          "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm active:scale-95"
                        }`}
                      >
                        {loadingId === book._id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : status === "approved" ? (
                          <><CheckCircle size={18} /> Approved</>
                        ) : status === "pending" ? (
                          <><Clock size={18} /> Pending</>
                        ) : status === "rejected" ? (
                          "Try Again"
                        ) : isOutOfStock ? (
                          "Out of Stock"
                        ) : (
                          "Request as Staff"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}