"use client";
import { useEffect, useState } from "react";
import { 
  Search, BookOpen, User, Calendar, Loader2, CheckCircle, AlertCircle, Clock, XCircle 
} from "lucide-react";

export default function StudentRequests() {
  const [books, setBooks] = useState<any[]>([]);
  // Store full objects to track specific statuses per book
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
          // Create a mapping of bookId -> status
          const statusMap: Record<string, string> = {};
          myReqsData.requests.forEach((req: any) => {
            if (req.bookId) {
              const bId = typeof req.bookId === 'object' ? req.bookId._id : req.bookId;
              statusMap[bId] = req.status; // e.g., "pending", "approved", "rejected"
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

      // Update local status map to "pending" immediately
      setMyRequestStatuses(prev => ({ ...prev, [bookId]: "pending" }));
      setBooks(prev => prev.map(b => b._id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));

      alert("Request submitted successfully!");
    } catch (err) {
      alert("Something went wrong. Please try again.");
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
    <main className="flex-1 p-6 lg:p-10 lg:ml-64 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Library Catalog</h1>
          <p className="text-gray-600">Search and request books for borrowing.</p>
        </header>

        {/* Search Bar UI (unchanged) */}
        <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4">
          <input 
            type="text"
            placeholder="Search books..."
            className="flex-1 p-3 border rounded-lg text-black outline-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="p-3 border rounded-lg bg-white text-black"
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Books</option>
            <option value="available">Available Only</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const status = myRequestStatuses[book._id];
              const isOutOfStock = book.availableCopies <= 0;

              return (
                <div key={book._id} className="bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200">
                    {book.imageUrl && <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{book.author}</p>
                    
                    <div className="mt-auto">
                      {/* STATUS-BASED BUTTON LOGIC */}
                      <button
                        onClick={() => requestBook(book._id)}
                        disabled={loadingId === book._id || isOutOfStock || !!(status && status !== "rejected")}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          status === "approved" ? "bg-green-100 text-green-700 cursor-default" :
                          status === "pending" ? "bg-amber-100 text-amber-700 cursor-default" :
                          status === "rejected" ? "bg-red-600 text-white hover:bg-red-700" : // Re-request allowed if rejected
                          isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" :
                          "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {loadingId === book._id ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : status === "approved" ? (
                          <><CheckCircle size={18} /> Approved</>
                        ) : status === "pending" ? (
                          <><Clock size={18} /> Pending</>
                        ) : status === "rejected" ? (
                          "Try Again" // You can allow re-request or just show "Rejected"
                        ) : isOutOfStock ? (
                          "Out of Stock"
                        ) : (
                          "Request Book"
                        )}
                      </button>

                      {/* Small Status Badge for clarity */}
                      {status === "rejected" && (
                        <p className="text-[10px] text-red-500 mt-2 text-center font-medium uppercase tracking-wider">
                          Last request was rejected
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}