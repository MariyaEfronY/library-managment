"use client";

import { useState } from "react";
import BooksTable from "./components/BooksTable";
import BookForm from "./components/BookForm";

export default function AdminPage() {
  const [editBook, setEditBook] = useState<any>(null);

  const handleSuccess = () => {
    setEditBook(null); // reset form after add/update
  };

  return (
    <div className="w-full">
      {!editBook ? (
        <BooksTable onEdit={(book) => setEditBook(book)} />
      ) : (
        <BookForm editBook={editBook} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
