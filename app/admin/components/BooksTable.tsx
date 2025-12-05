"use client";
import { useEffect, useState } from "react";
import { Edit2, Trash2, Eye, BookOpen, Search, Filter } from "lucide-react";
import { RefreshCw } from "lucide-react";

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
      setLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message);
      if (data.success) fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.bookId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h2 className="text-2xl font-bold text-gray-800">Books Library</h2>
            <p className="text-gray-600 text-sm mt-1">
              Total {books.length} books • {filteredBooks.length} filtered
            </p>
          </div>
          
         <div className="relative w-full md:w-64">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
  <input
    type="text"
    placeholder="Search books..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 
             rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
             outline-none transition-colors text-gray-900 placeholder:text-gray-500"
  />
</div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No books found</h3>
            <p className="mt-2 text-gray-600">
              {searchTerm ? "Try a different search term" : "No books available"}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Book ID
                </th>
                <th className="p-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="p-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Author
                </th>
                <th className="p-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="p-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Copies
                </th>
                <th className="p-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.map((book) => (
                <tr 
                  key={book.bookId}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 
                                    rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-800 font-bold text-sm">B</span>
                      </div>
                      <span className="font-medium text-gray-800">{book.bookId}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs">
                      <p className="font-semibold text-gray-800 truncate">{book.title}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-700">{book.author}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full 
                                   text-xs font-medium border ${getCategoryColor(book.category)}`}>
                      {book.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-12 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-700">{book.availableCopies}</span>
                      </div>
                      <span className="text-gray-500 text-sm ml-2">copies</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full 
                                   text-xs font-medium border ${getStatusColor(book.status)}`}>
                      {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(book)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 
                                 text-amber-700 hover:bg-amber-100 border border-amber-200 
                                 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(book.bookId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 
                                 text-red-700 hover:bg-red-100 border border-red-200 
                                 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Footer */}
      {!loading && filteredBooks.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredBooks.length}</span> of{" "}
              <span className="font-semibold">{books.length}</span> books
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchTerm("")}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 
                         hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Search
              </button>
              <button
                onClick={fetchBooks}
                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 
                         hover:bg-blue-100 border border-blue-200 rounded-lg 
                         transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

