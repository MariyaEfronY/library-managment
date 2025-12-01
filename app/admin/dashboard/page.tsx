export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <ul className="space-y-4 mt-4">
        <li><a className="text-blue-600 underline" href="/admin/books">Manage Books</a></li>
        <li><a className="text-blue-600 underline" href="/admin/requests">Manage Requests</a></li>
        <li><a className="text-blue-600 underline" href="/admin/hours">Edit Library Hours</a></li>
      </ul>
    </div>
  );
}
