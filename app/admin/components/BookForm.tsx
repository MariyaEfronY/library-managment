"use client";
import { useState, useEffect } from "react";
import { 
  Upload, 
  BookOpen, 
  User, 
  Tag, 
  Copy, 
  ArrowLeft,
  Save
} from "lucide-react";

interface BookFormProps {
  editBook?: any;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function BookForm({ editBook, onSuccess, onCancel }: BookFormProps) {
  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState(""); // Changed to empty string
  const [availableCopies, setAvailableCopies] = useState(1);
  const [status, setStatus] = useState("valid");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editBook) {
      setBookId(editBook.bookId);
      setTitle(editBook.title);
      setAuthor(editBook.author);
      setCategory(editBook.category);
      setAvailableCopies(editBook.availableCopies);
      setStatus(editBook.status);
      setImage(null);
      if (editBook.imageUrl) {
        setImagePreview(editBook.imageUrl);
      }
    } else {
      // Generate new book ID if not editing
      setBookId(`BOOK-${Date.now().toString().slice(-6)}`);
    }
  }, [editBook]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("bookId", bookId);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("availableCopies", availableCopies.toString());
    formData.append("status", status);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(
        editBook ? `/api/books/${bookId}` : "/api/books",
        {
          method: editBook ? "PUT" : "POST",
          body: formData,
        }
      );
      const data = await res.json();
      alert(data.message);
      if (data.success) onSuccess();
    } catch (err) {
      alert("Error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 
                       hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {editBook ? "Edit Book" : "Add New Book"}
          </h2>
          <p className="text-gray-600 mt-2">
            {editBook ? "Update book information" : "Fill in the book details"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Book ID
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                disabled={!!editBook}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 
                         rounded-xl focus:outline-none focus:border-blue-500 
                         focus:ring-2 focus:ring-blue-200 transition-all duration-300
                         text-gray-800 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 
                         rounded-xl focus:outline-none focus:border-blue-500 
                         focus:ring-2 focus:ring-blue-200 transition-all duration-300
                         text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Author *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 
                         rounded-xl focus:outline-none focus:border-blue-500 
                         focus:ring-2 focus:ring-blue-200 transition-all duration-300
                         text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Two Column Grid for Category and Copies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category - Now as Text Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter category (e.g., Fiction, Science, History)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:outline-none focus:border-blue-500 
                           focus:ring-2 focus:ring-blue-200 transition-all duration-300
                           text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Available Copies */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Copies *
              </label>
              <div className="relative">
                <Copy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={availableCopies}
                  onChange={(e) => setAvailableCopies(Number(e.target.value))}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 
                           rounded-xl focus:outline-none focus:border-blue-500 
                           focus:ring-2 focus:ring-blue-200 transition-all duration-300
                           text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setStatus("valid")}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all
                         ${status === "valid" 
                           ? 'border-green-500 bg-green-50 text-green-700' 
                           : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                         }`}
              >
                <div className={`w-2 h-2 rounded-full ${status === "valid" ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium">Valid</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus("invalid")}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all
                         ${status === "invalid" 
                           ? 'border-red-500 bg-red-50 text-red-700' 
                           : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                         }`}
              >
                <div className={`w-2 h-2 rounded-full ${status === "invalid" ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium">Invalid</span>
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Book Cover Image
            </label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 
                            border-2 border-dashed border-gray-300 rounded-xl 
                            flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 
                                border-2 border-gray-200 rounded-xl cursor-pointer 
                                hover:border-blue-500 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 font-medium">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  JPEG, PNG or WebP. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              * Required fields
            </div>
            <div className="flex items-center gap-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 text-gray-700 hover:text-gray-900 
                           hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {editBook ? "Update Book" : "Add Book"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}