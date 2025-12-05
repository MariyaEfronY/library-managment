"use client";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BooksTable from "./components/BooksTable";
import BookForm from "./components/BookForm";
import { useState } from "react";

export default function AdminPage() {
  const [editBook, setEditBook] = useState<any>(null);

  const handleSuccess = () => {
    setEditBook(null); // reset form after add/update
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 flex-1 overflow-auto">
          {!editBook ? (
            <BooksTable onEdit={(book) => setEditBook(book)} />
          ) : (
            <BookForm editBook={editBook} onSuccess={handleSuccess} />
          )}
        </main>
      </div>
    </div>
  );
}
