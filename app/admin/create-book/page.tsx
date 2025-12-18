"use client";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BookForm from "../components/BookForm";
import { useState } from "react";
import { CheckCircle, BookPlus } from "lucide-react";

export default function CreateBookPage() {
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
     
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-6 animate-fade-in">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 
                            rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Book created successfully!</p>
                </div>
              </div>
            </div>
          )}

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 
                            rounded-xl flex items-center justify-center">
                <BookPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Create New Book</h1>
                <p className="text-gray-600 mt-1">
                  Add a new book to the library collection
                </p>
              </div>
            </div>
          </div>

          {/* Book Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <BookForm onSuccess={handleSuccess} />
          </div>

          {/* Quick Tip */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              All fields marked with * are required
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}