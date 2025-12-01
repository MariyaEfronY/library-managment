export default function StudentDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Student Dashboard</h1>

      <ul className="space-y-4">
        <li>
          <a href="/student/books" className="text-blue-600 underline">
            View Available Books
          </a>
        </li>
        <li>
          <a href="/student/requests" className="text-blue-600 underline">
            View Issue Requests
          </a>
        </li>
        <li>
          <a href="/student/borrowed" className="text-blue-600 underline">
            View Borrowed Books
          </a>
        </li>
        <li>
          <a href="/student/hours" className="text-blue-600 underline">
            Library Hours
          </a>
        </li>
      </ul>
    </div>
  );
}
