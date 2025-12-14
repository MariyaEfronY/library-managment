"use client";

export default function BookCard({
  book,
  onRequest,
}: {
  book: any;
  onRequest: () => void;
}) {
  const unavailable =
    book.availableCopies === 0 || book.status === "invalid";

  return (
    <div className="border rounded p-4 shadow">
      <img
        src={book.imageUrl || "/book.png"}
        className="h-40 w-full object-cover mb-2 rounded"
      />

      <h3 className="font-bold">{book.title}</h3>
      <p className="text-sm">Author: {book.author}</p>
      <p className="text-sm">Category: {book.category}</p>
      <p className="text-sm">
        Available: {book.availableCopies}
      </p>

      {unavailable ? (
        <button
          disabled
          className="mt-3 w-full bg-gray-400 text-white py-1 rounded cursor-not-allowed"
        >
          Unavailable
        </button>
      ) : (
        <button
          onClick={onRequest}
          className="mt-3 w-full bg-blue-600 text-white py-1 rounded"
        >
          Request Book
        </button>
      )}
    </div>
  );
}
