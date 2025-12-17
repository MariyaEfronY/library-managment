"use client";
import { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  BookOpen, 
  User, 
  Hash, 
  Calendar, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Eye
} from "lucide-react";

export default function StudentRequests() {
  const [books, setBooks] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "available">("all");
  const [selectedBook, setSelectedBook] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/books")
      .then(res => res.json())
      .then(data => {
        setBooks(data.books || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
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

      // Update local state
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book._id === bookId
            ? { ...book, availableCopies: book.availableCopies - 1 }
            : book
        )
      );

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "fixed top-4 right-4 z-50 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg animate-slide-in";
      successMessage.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Book request submitted successfully!</span>
        </div>
      `;
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
      
    } catch {
      const errorMessage = document.createElement("div");
      errorMessage.className = "fixed top-4 right-4 z-50 px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg animate-slide-in";
      errorMessage.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>Failed to submit request. Please try again.</span>
        </div>
      `;
      document.body.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn?.includes(searchQuery);
    
    const matchesFilter = filter === "all" || book.availableCopies > 0;
    
    return matchesSearch && matchesFilter;
  });

  const availableBooks = books.filter(b => b.availableCopies > 0).length;
  const totalBooks = books.length;

  return (
    <><main className="flex-1 p-6 lg:p-10 lg:ml-64 transition-all duration-300">
      {/* Toast Container (for messages) */}
      <style jsx>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 lg:p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Books</h1>
                <p className="text-gray-600">Browse and request books from the library collection</p>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Library Status</p>
                  <p className="text-lg font-semibold text-gray-900">
                    <span className="text-green-600">{availableBooks}</span> of {totalBooks} books available
                  </p>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search by title, author, ISBN, or genre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 text-black pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 w-full lg:w-auto">
                  <button
                    onClick={() => setFilter("all")}
                    className={`flex-1 lg:flex-none px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      filter === "all"
                        ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <BookOpen size={16} />
                    All Books
                  </button>
                  <button
                    onClick={() => setFilter("available")}
                    className={`flex-1 lg:flex-none px-4 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      filter === "available"
                        ? "bg-green-50 border-green-200 text-green-700 shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <CheckCircle size={16} />
                    Available Only
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    Showing <span className="font-semibold text-gray-900">{filteredBooks.length}</span> books
                  </span>
                  {searchQuery && (
                    <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      "{searchQuery}"
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Available</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{availableBooks}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm font-medium">Total</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{totalBooks}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading library catalog...</p>
              <p className="text-sm text-gray-500 mt-2">Fetching the latest book collection</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchQuery ? "No matching books found" : "No books in catalog"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchQuery
                  ? "Try adjusting your search terms or browse all available books."
                  : "The library catalog is currently empty. Check back later."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Availability Ribbon */}
                  {book.availableCopies === 0 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}

                  {/* Book Cover */}
                  <div className="h-56 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-6">
                        <BookOpen className="text-blue-300 mb-3" size={48} />
                        <span className="text-sm text-gray-400">No cover image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                    
                    {/* Quick Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-white font-bold text-lg line-clamp-1">{book.title}</h3>
                      <p className="text-gray-200 text-sm line-clamp-1">{book.author}</p>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="p-5">
                    {/* Title and Author */}
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 h-14">
                      {book.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <User size={14} className="mr-2 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">{book.author}</span>
                    </div>

                    {/* Book Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      
                      <div className={`rounded-lg p-3 ${
                        book.availableCopies > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}>
                        <div className="flex items-center mb-1">
                          <BookOpen size={12} className="mr-1" />
                          <span className="text-xs">Available</span>
                        </div>
                        <p className="font-bold text-lg">{book.availableCopies}</p>
                      </div>
                    </div>

                    

                    {/* Request Button */}
                    <button
                      onClick={() => requestBook(book._id)}
                      disabled={loadingId === book._id || book.availableCopies === 0}
                      className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        book.availableCopies === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : loadingId === book._id
                          ? "bg-blue-400 text-white cursor-wait"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg active:scale-95"
                      }`}
                    >
                      {loadingId === book._id ? (
                        <>
                          <Loader2 className="animate-spin" size={18} />
                          Processing...
                        </>
                      ) : book.availableCopies === 0 ? (
                        <>
                          <AlertCircle size={18} />
                          Unavailable
                        </>
                      ) : (
                        <>
                          <Calendar size={18} />
                          Request Book
                        </>
                      )}
                    </button>

                    {/* Status Indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-1.5 text-sm ${
                          book.availableCopies > 3
                            ? "text-green-600"
                            : book.availableCopies > 0
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            book.availableCopies > 3
                              ? "bg-green-500"
                              : book.availableCopies > 0
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}></div>
                          <span>
                            {book.availableCopies > 3
                              ? "In Stock"
                              : book.availableCopies > 0
                              ? "Limited Stock"
                              : "Out of Stock"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {book.availableCopies > 0 ? "Ready to borrow" : "Check back later"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

       
      </div>
      </main>
    </>
  );
}