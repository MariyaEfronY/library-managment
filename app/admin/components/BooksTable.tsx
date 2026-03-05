"use client";
import { useEffect, useState } from "react";
import { Edit2, Trash2, BookOpen, Search, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DataSkeleton from "../../components/SkeletonLoader"; // We use the shimmer logic from here

interface Book {
  bookId: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
  status: "available" | "borrowed" | "reserved" | "maintenance";
  imageUrl?: string;
}

interface BooksTableProps {
  onEdit: (book: Book) => void;
}

export default function BooksTable({ onEdit }: BooksTableProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      if (data.success) setBooks(data.books);
    } catch (err) {
      console.error(err);
    } finally {
      // Small delay to ensure the smooth emotional transition
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.bookId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- INTERNAL TABLE SKELETON ROW ---
  const TableRowSkeleton = () => (
    <tr className="border-b border-gray-50">
      {Array(7).fill(0).map((_, i) => (
        <td key={i} className="p-4">
          <div className="relative h-6 w-full bg-slate-100 rounded-lg overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </td>
      ))}
    </tr>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "borrowed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "reserved": return "bg-amber-100 text-amber-800 border-amber-200";
      case "maintenance": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Fiction": "bg-purple-50 text-purple-700 border-purple-200",
      "Non-Fiction": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Science": "bg-cyan-50 text-cyan-700 border-cyan-200",
      "Technology": "bg-blue-50 text-blue-700 border-blue-200",
      "History": "bg-amber-50 text-amber-700 border-amber-200",
      "Biography": "bg-emerald-50 text-emerald-700 border-emerald-200",
      "Literature": "bg-rose-50 text-rose-700 border-rose-200",
      "Academic": "bg-violet-50 text-violet-700 border-violet-200",
    };
    return colors[category] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Table Header with Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Books Library</h2>
            <p className="text-gray-500 text-sm mt-1">
              Total {books.length} books • {filteredBooks.length} filtered
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent 
             rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 
             outline-none transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              {["Book ID", "Title", "Author", "Category", "Copies", "Status", "Actions"].map((header) => (
                <th key={header} className="p-4 text-left text-xs font-bold text-white uppercase tracking-widest opacity-80">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence mode="popLayout">
              {loading ? (
                // Show 5 skeleton rows while loading
                [...Array(5)].map((_, i) => <TableRowSkeleton key={`skeleton-${i}`} />)
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-200" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No books found</h3>
                    <p className="mt-2 text-gray-500">Try a different search term</p>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book, idx) => (
                  <motion.tr
                    key={book.bookId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mr-3 border border-indigo-100">
                          <span className="text-indigo-600 font-bold text-sm">B</span>
                        </div>
                        <span className="font-bold text-gray-700 tracking-tight">{book.bookId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 truncate max-w-[200px]">{book.title}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-600 font-medium">{book.author}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColor(book.category)}`}>
                        {book.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-indigo-600">{book.availableCopies}</span>
                        <span className="text-gray-400 text-xs font-medium uppercase">Units</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(book.status)}`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(book)}
                          className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all border border-amber-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.bookId)}
                          className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-rose-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Footer remains exact same */}
      {!loading && filteredBooks.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Showing {filteredBooks.length} of {books.length} entries
          </div>
          <button
            onClick={fetchBooks}
            className="px-4 py-2 text-xs bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Sync Database
          </button>
        </div>
      )}
    </div>
  );
}