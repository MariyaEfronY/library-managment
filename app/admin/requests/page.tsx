"use client";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Calendar,
  User,
  BookOpen,
  Mail,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  RefreshCw,
  Shield,
  Users
} from "lucide-react";
import React from "react";


const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  // State for date input
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [tempReturnDate, setTempReturnDate] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch requests");
      }
      setRequests(data.requests || []);
      setFilteredRequests(data.requests || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    
    // Set default return date (14 days from now)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 14);
    setTempReturnDate(defaultDate.toISOString().split('T')[0]);
  }, []);

  // Filter and sort requests
  useEffect(() => {
    let result = [...requests];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(req => 
        req.bookId?.title?.toLowerCase().includes(searchLower) ||
        req.bookId?.author?.toLowerCase().includes(searchLower) ||
        req.requestedBy?.name?.toLowerCase().includes(searchLower) ||
        req.requestedBy?.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(req => req.status === statusFilter);
    }

    // Apply user type filter
    if (userTypeFilter !== "all") {
      result = result.filter(req => req.requestedBy?.role === userTypeFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
        case "oldest":
          return new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime();
        case "title":
          return (a.bookId?.title || "").localeCompare(b.bookId?.title || "");
        case "user":
          return (a.requestedBy?.name || "").localeCompare(b.requestedBy?.name || "");
        default:
          return 0;
      }
    });

    setFilteredRequests(result);
  }, [requests, searchTerm, statusFilter, userTypeFilter, sortBy]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    let returnDate = null;
    if (status === "approved") {
      returnDate = tempReturnDate;
      if (!returnDate) {
        alert("Please select a valid return date before confirming approval.");
        return;
      }
    }

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, returnDate }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(`Failed to update: ${data.message}`);
        return;
      }

      await fetchRequests();
      setActiveRequestId(null);

    } catch (err) {
      console.error(err);
      alert("Something went wrong during update.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getRequestStats = () => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === "pending").length;
    const approved = requests.filter(r => r.status === "approved").length;
    const rejected = requests.filter(r => r.status === "rejected").length;
    const students = requests.filter(r => r.requestedBy?.role === "student").length;
    const staff = requests.filter(r => r.requestedBy?.role === "staff").length;

    return { total, pending, approved, rejected, students, staff };
  };

  const stats = getRequestStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm border">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Requests</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-8 h-8 text-indigo-600" />
              Book Requests Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and approve book borrowing requests</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRequests}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{stats.approved}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{stats.students}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Staff</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{stats.staff}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by book, author, or user..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="staff">Staff</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Book Title</option>
                <option value="user">User Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || userTypeFilter !== "all"
                ? "Try adjusting your filters or search"
                : "No book requests have been made yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Book Details</th>
                  <th className="text-left p-4 font-semibold text-gray-700">User Details</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
  <React.Fragment key={req._id}>
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <div className="flex items-start gap-3">
          {req.bookId?.imageUrl ? (
            <img
              src={req.bookId.imageUrl}
              alt={req.bookId.title}
              className="w-12 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 line-clamp-1">
              {req.bookId?.title || "Unknown Book"}
            </p>
            <p className="text-sm text-gray-600">
              by {req.bookId?.author || "Unknown Author"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Copies: {req.bookId?.availableCopies ?? "N/A"}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{req.requestedBy?.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            req.requestedBy?.role === "student" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-purple-100 text-purple-800"
          }`}>
            {req.requestedBy?.role}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-3 h-3" />
          {req.requestedBy?.email}
        </div>
        {req.requestedBy?.rollNumber && (
          <p className="text-xs text-gray-500 mt-1">
            Roll No: {req.requestedBy.rollNumber}
          </p>
        )}
        {req.requestedBy?.staffId && (
          <p className="text-xs text-gray-500 mt-1">
            Staff ID: {req.requestedBy.staffId}
          </p>
        )}
      </td>
      <td className="p-4">
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-gray-600">Requested:</span>
            <span className="ml-2 font-medium">
              {formatDate(req.requestDate)}
            </span>
          </p>
          {req.returnDate && (
            <p className="text-sm">
              <span className="text-gray-600">Return:</span>
              <span className="ml-2 font-medium text-red-600">
                {formatDate(req.returnDate)}
              </span>
            </p>
          )}
        </div>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(req.status)}`}>
          {getStatusIcon(req.status)}
          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
        </span>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          {req.status === "pending" && activeRequestId === req._id ? (
            <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={tempReturnDate}
                  onChange={(e) => setTempReturnDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(req._id, "approved")}
                  className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setActiveRequestId(null)}
                  className="px-3 py-1.5 bg-gray-400 text-white text-sm font-medium rounded hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : req.status === "pending" ? (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveRequestId(req._id)}
                className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(req._id, "rejected")}
                className="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          ) : (
            <button
              onClick={() => setExpandedRequest(expandedRequest === req._id ? null : req._id)}
              className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              Details
              {expandedRequest === req._id ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
    
    {/* Expanded Details */}
    {expandedRequest === req._id && (
      <tr>
        <td colSpan={5} className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2">Book Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Title:</span> {req.bookId?.title}</p>
                <p><span className="text-gray-600">Author:</span> {req.bookId?.author}</p>
                <p><span className="text-gray-600">Book Id:</span> {req.bookId?.bookId || "N/A"}</p>
                <p><span className="text-gray-600">Category:</span> {req.bookId?.category || "N/A"}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2">User Information</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Name:</span> {req.requestedBy?.name}</p>
                <p><span className="text-gray-600">Email:</span> {req.requestedBy?.email}</p>
                <p><span className="text-gray-600">Role:</span> {req.requestedBy?.role}</p>
                <p><span className="text-gray-600">Contact:</span> {req.requestedBy?.contact || "N/A"}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-2">Request Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Request ID:</span> {req._id}</p>
                <p><span className="text-gray-600">Request Date:</span> {formatDate(req.requestDate)}</p>
                <p><span className="text-gray-600">Status Updated:</span> {formatDate(req.updatedAt)}</p>
                {req.returnDate && (
                  <p><span className="text-gray-600">Return Date:</span> {formatDate(req.returnDate)}</p>
                )}
              </div>
            </div>
          </div>
        </td>
      </tr>
    )}
  </React.Fragment>
))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination (Optional) */}
      {filteredRequests.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing {filteredRequests.length} of {requests.length} requests
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}