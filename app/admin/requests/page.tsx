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


interface Book {
  _id: string;
  bookId?: string;
  title?: string;
  author?: string;
  imageUrl?: string;
  availableCopies?: number;
  category?: string;
}

interface RequestedBy {
  _id: string;
  name?: string;
  email?: string;
  phone?: string | number;
  role?: "student" | "staff";
  rollNumber?: string;
  staffId?: string;
  contact?: string;
}

interface RequestItem {
  _id: string;
  bookId?: Book;
  requestedBy?: RequestedBy;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  returnDate?: string;
  actualReturnDate?: string; // New
  returned?: boolean;        // New
  fineAmount?: number;       // New
  finePaid?: boolean;        // New
  updatedAt?: string;
}


const formatDate = (date: string | Date | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export default function AdminRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestItem[]>([]);
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

  //Return Date and PayAmount
  const [isProcessingAction, setIsProcessingAction] = useState<string | null>(null);


  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/requests", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await res.json();
      console.log("API DATA:", data);


      // ✅ HANDLE BOTH API RESPONSE SHAPES
      const requestsData = data.requests ?? data;

      setRequests(requestsData);
      setFilteredRequests(requestsData);
      setError(null);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      // 🔑 THIS WAS NEVER REACHED BEFORE
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

  const handleReturn = async (id: string) => {
    if (!window.confirm("Confirm book return?")) return;

    setIsProcessingAction(id);
    try {
      const res = await fetch(`/api/requests/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId: id }), // Send 'issueId' to match API
      });

      const data = await res.json();
      if (data.success) {
        alert(`Success! Fine: $${data.fineAmount}`);
        fetchRequests(); // Refresh the UI
      } else {
        console.log("Server Error Message:", data.message);
        alert(data.message);
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setIsProcessingAction(null);
    }
  };

  const handlePayFine = async (id: string) => {
    try {
      const res = await fetch(`/api/requests/pay-fine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId: id }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Fine marked as paid");
        fetchRequests();
      }
    } catch (err) {
      alert("Error processing payment");
    }
  };

  const calculateDaysLate = (dueDate: string | Date, actualReturnDate?: string | Date) => {
    const due = new Date(dueDate);
    const finish = actualReturnDate ? new Date(actualReturnDate) : new Date();

    if (finish <= due) return 0;

    const diffTime = Math.abs(finish.getTime() - due.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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
          <p className="mt-4 text-black">Loading requests...</p>
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

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold mt-1 text-pink-500">{stats.total}</p>
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
            <div className="flex-1 ">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by book, author, or user..."
                  className="w-full pl-10 pr-4 text-black py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                className="px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="px-3 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="student">Students</option>
                <option value="staff">Staff</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  <th className="text-left p-4 font-semibold text-gray-700">Status & Actions</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Date Info</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Fine Status</th>
                  <th className="text-center p-4 font-semibold text-gray-700">View</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <React.Fragment key={req._id}>
                    <tr className="border-b hover:bg-gray-50/80 transition-all">
                      {/* 1. BOOK DETAILS */}
                      <td className="p-4 align-top">
                        <div className="flex items-start gap-3">
                          {req.bookId?.imageUrl ? (
                            <img src={req.bookId.imageUrl} alt="Book" className="w-12 h-16 object-cover rounded shadow-sm" />
                          ) : (
                            <div className="w-12 h-16 bg-slate-100 rounded flex items-center justify-center border border-slate-200">
                              <BookOpen className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 line-clamp-1">{req.bookId?.title ?? "Unknown Book"}</span>
                            <span className="text-xs text-slate-500">by {req.bookId?.author ?? "Unknown Author"}</span>
                            <div className="mt-2 inline-flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                              Copies: {req.bookId?.availableCopies ?? "0"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. USER DETAILS */}
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{req.requestedBy?.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${req.requestedBy?.role === "student" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                              }`}>
                              {req.requestedBy?.role}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 flex flex-col gap-0.5">
                            <span className="flex items-center gap-1"><Mail size={12} /> {req.requestedBy?.email}</span>
                            <span className="font-mono text-slate-400">ID: {req.requestedBy?.rollNumber || req.requestedBy?.staffId || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      {/* 3. STATUS & MAIN ACTIONS */}
                      <td className="p-4 align-top min-w-[160px]">
                        {req.status === "pending" ? (
                          activeRequestId === req._id ? (
                            <div className="flex flex-col gap-2 bg-white p-2 rounded-xl border border-indigo-100 shadow-sm">
                              <label className="text-[10px] font-bold text-indigo-600 uppercase">Set Return Date</label>
                              <input
                                type="date"
                                value={tempReturnDate}
                                onChange={(e) => setTempReturnDate(e.target.value)}
                                className="text-xs p-1.5 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              <div className="flex gap-1">
                                <button onClick={() => updateStatus(req._id, "approved")} className="bg-emerald-600 text-white flex-1 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider">Confirm</button>
                                <button onClick={() => setActiveRequestId(null)} className="bg-slate-100 text-slate-400 px-2 py-1.5 rounded-md hover:bg-slate-200">X</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <button onClick={() => setActiveRequestId(req._id)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg shadow-md transition-all">APPROVE REQUEST</button>
                              <button onClick={() => updateStatus(req._id, "rejected")} className="w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-bold rounded-lg transition-all">REJECT</button>
                            </div>
                          )
                        ) : req.status === "approved" && !req.returned ? (
                          <button
                            disabled={isProcessingAction === req._id}
                            onClick={() => handleReturn(req._id)}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-50"
                          >
                            <RefreshCw size={14} className={isProcessingAction === req._id ? "animate-spin" : ""} />
                            Return Book
                          </button>
                        ) : req.returned && req.fineAmount! > 0 && !req.finePaid ? (
                          <button
                            disabled={isProcessingAction === req._id}
                            onClick={() => handlePayFine(req._id)}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-100"
                          >
                            <AlertCircle size={14} />
                            Pay ${req.fineAmount} Fine
                          </button>
                        ) : (
                          <div className={`text-center py-2 rounded-lg font-bold text-[11px] uppercase tracking-widest ${req.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {req.status === 'rejected' ? 'Rejected' : 'Completed'}
                          </div>
                        )}
                      </td>

                      {/* 4. DATES */}
                      <td className="p-4 align-top text-xs">
                        <div className="flex flex-col gap-2">
                          <div>
                            <span className="block text-[10px] text-slate-400 uppercase font-black">Requested</span>
                            <span className="font-bold text-slate-700">{formatDate(req.requestDate)}</span>
                          </div>
                          {req.returnDate && (
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-black">Due Date</span>
                              <span className={`font-bold ${!req.returned && new Date(req.returnDate) < new Date() ? "text-red-600 animate-pulse" : "text-slate-700"}`}>
                                {formatDate(req.returnDate)}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 5. FINE CALCULATION */}
                      <td className="p-4 align-top text-center">
                        {req.returnDate ? (
                          calculateDaysLate(req.returnDate, req.actualReturnDate) > 0 ? (
                            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase">
                              {calculateDaysLate(req.returnDate, req.actualReturnDate)} Days Late
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                              On Time
                            </span>
                          )
                        ) : <span className="text-slate-300">--</span>}
                      </td>

                      {/* 6. UNIQUE DETAILS BUTTON */}
                      <td className="p-4 align-top text-center">
                        <button
                          onClick={() => setExpandedRequest(expandedRequest === req._id ? null : req._id)}
                          className={`p-2.5 rounded-full transition-all duration-300 ${expandedRequest === req._id
                            ? "bg-slate-800 text-white rotate-180 shadow-inner"
                            : "bg-white text-slate-400 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 shadow-sm"
                            }`}
                        >
                          {expandedRequest === req._id ? <ChevronUp size={18} /> : <Eye size={18} />}
                        </button>
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
                                <p className="text-gray-600"><span className="text-black">Title:</span>  {req.bookId?.title}</p>
                                <p className="text-gray-600"><span className="text-black">Author:</span> {req.bookId?.author}</p>
                                <p className="text-gray-600"><span className="text-black">Book Id:</span> {req.bookId?.bookId || "N/A"}</p>
                                <p className="text-gray-600"><span className="text-black">Category:</span> {req.bookId?.category || "N/A"}</p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border">
                              <h4 className="font-semibold text-gray-900 mb-2">User Information</h4>
                              <div className="space-y-2 text-sm">
                                <p className="text-gray-600"><span className="text-black">Name:</span> {req.requestedBy?.name}</p>
                                <p className="text-gray-600"><span className="text-black">Email:</span> {req.requestedBy?.email}</p>
                                <p className="text-gray-600"><span className="text-black">Role:</span> {req.requestedBy?.role}</p>
                                <p className="text-gray-600"><span className="text-black">Contact:</span> {req.requestedBy?.phone || "N/A"}</p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border">
                              <h4 className="font-semibold text-gray-900 mb-2">Request Details</h4>
                              <div className="space-y-2 text-sm">
                                <p className="text-gray-600"><span className="text-black">Request ID:</span> {req._id}</p>
                                <p className="text-gray-600"><span className="text-black">Request Date:</span> {formatDate(req.requestDate)}</p>
                                <p className="text-gray-600"><span className="text-black">Status Updated:</span> {formatDate(req.updatedAt)}</p>
                                {req.returnDate && (
                                  <p className="text-gray-600"><span className="text-black">Return Date:</span> {formatDate(req.returnDate)}</p>
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
        <div className="flex items-center justify-between mt-6 text-black">
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