"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ShieldCheck,
    Trash2,
    Edit3,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    Mail,
    Phone,
    Filter
} from "lucide-react";

interface User {
    _id: string;
    name: string;
    email: string;
    phone: number;
    role: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [role, setRole] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/fetch-users?page=${page}&search=${debouncedSearch}&role=${role}`);
            const data = await res.json();
            setUsers(data.users || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, debouncedSearch, role]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
        const res = await fetch(`/api/fetch-users/${id}`, { method: "DELETE" });
        if (res.ok) fetchUsers();
    };

    const handleUpdate = async () => {
        if (!editingUser) return;
        const res = await fetch(`/api/fetch-users/${editingUser._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingUser),
        });
        if (res.ok) {
            setEditingUser(null);
            fetchUsers();
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-900">
            <div className="max-w-6xl mx-auto">
                {/* Header & Stats Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                            Account Management
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Manage, filter, and update user access levels.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-3 w-full md:w-auto"
                    >
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                placeholder="Search by name or email..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-72 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <select
                                className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer text-sm appearance-none font-medium"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="student">Students</option>
                                <option value="staff">Staff Members</option>
                                <option value="admin">Administrators</option>
                            </select>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Table */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="p-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">User Details</th>
                                    <th className="p-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Contact Info</th>
                                    <th className="p-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Access Level</th>
                                    <th className="p-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={4} className="p-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="w-8 h-8 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-sm font-semibold text-slate-400">Syncing database...</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ) : users.length === 0 ? (
                                        <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <td colSpan={4} className="p-24 text-center text-slate-400 font-medium">
                                                No users found matching these filters.
                                            </td>
                                        </motion.tr>
                                    ) : (
                                        users.map((user, index) => (
                                            <motion.tr
                                                key={user._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="hover:bg-indigo-50/30 transition-colors group"
                                            >
                                                <td className="p-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${user.role === 'admin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 leading-none mb-1">{user.name}</p>
                                                            <p className="text-[11px] text-slate-400 font-mono tracking-tighter uppercase">ID: {user._id.slice(-8)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                                            <Mail className="w-3.5 h-3.5 text-slate-300" /> {user.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <Phone className="w-3.5 h-3.5 text-slate-300" /> {user.phone}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                                                        user.role === 'staff' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {user.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-5 text-right">
                                                    {user.role === 'admin' ? (
                                                        <span className="text-[10px] font-bold text-slate-300 italic px-3">System Protected</span>
                                                    ) : (
                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                            <button
                                                                onClick={() => setEditingUser(user)}
                                                                className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-500 hover:text-indigo-600 transition-all"
                                                                title="Edit User"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(user._id)}
                                                                className="p-2 hover:bg-red-50 hover:shadow-sm rounded-lg text-slate-400 hover:text-red-600 transition-all"
                                                                title="Delete User"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="p-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Page <span className="text-indigo-600">{page}</span> of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 disabled:opacity-30 shadow-sm transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="p-2 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 disabled:opacity-30 shadow-sm transition-all"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {editingUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white"
                        >
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-900">Modify User Access</h2>
                                <p className="text-sm text-slate-400 mt-1 font-medium">Updating details for {editingUser.email}</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity Name</label>
                                    <input
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Reference (Phone)</label>
                                    <input
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                        value={editingUser.phone}
                                        onChange={(e) => setEditingUser({ ...editingUser, phone: Number(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assigned Privilege</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                                        value={editingUser.role}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="staff">Staff Member</option>
                                        <option value="admin">System Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="flex-1 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                                >
                                    Confirm Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}