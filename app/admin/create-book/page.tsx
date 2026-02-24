"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  BookPlus,
  Plus,
  X,
  Library,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BookForm from "../components/BookForm";
import BooksTable from "../components/BooksTable";

export default function CreateBookPage() {
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Triggered when a book is added or updated
  const handleSuccess = () => {
    setSuccess(true);
    setShowForm(false);
    setEditBook(null);
    setRefreshKey(prev => prev + 1); // Forces BooksTable to re-fetch
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleEditRequest = (book: any) => {
    setEditBook(book);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditBook(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
      <div className="max-w-[1400px] mx-auto">

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Inventory Control
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Monitor, edit, and expand your library collection.
            </p>
          </motion.div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Asset
          </button>
        </div>

        {/* SUCCESS TOAST */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 shadow-sm"
            >
              <CheckCircle className="text-emerald-600 w-5 h-5" />
              <p className="font-bold text-emerald-800 text-sm">
                Database Synced: Book record has been successfully processed.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN DATA TABLE */}
        <motion.div
          key={refreshKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <BooksTable onEdit={handleEditRequest} />
        </motion.div>



        {/* SLIDE-OVER FORM PANEL */}
        <AnimatePresence>
          {showForm && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeForm}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60]"
              />

              {/* Form Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-[70] shadow-2xl overflow-y-auto"
              >
                <div className="p-8 lg:p-12">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                        <BookPlus className="text-white w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">
                          {editBook ? "Modify Record" : "New Entry"}
                        </h2>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                          {editBook ? `ID: ${editBook.bookId}` : "Library Asset"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeForm}
                      className="p-3 hover:bg-slate-100 rounded-2xl transition-colors group"
                    >
                      <X className="w-6 h-6 text-slate-400 group-hover:rotate-90 transition-transform" />
                    </button>
                  </div>

                  <div className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                    <BookForm
                      editBook={editBook}
                      onSuccess={handleSuccess}
                    />
                  </div>

                  <button
                    onClick={closeForm}
                    className="mt-8 w-full py-4 text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:text-slate-600 transition-colors"
                  >
                    <ArrowLeft size={16} /> Discard and Return to Catalog
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}