"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// --- INTERFACES ---
interface VisitLog {
    _id: string;
    startTime: string;
    endTime: string;
    behavior: string;
    sessionHours: number;
}

interface LibraryActivity {
    _id: string;
    name: string;
    rollNumber: string;
    date: string;
    visitLogs: VisitLog[];
    totalHours: number;
    visitCount: number;
}

export default function LibraryManagement() {
    const [activities, setActivities] = useState<LibraryActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingLog, setEditingLog] = useState<any>(null);

    const fetchLogs = async () => {
        try {
            const res = await axios.get<LibraryActivity[]>("/api/admin/library");
            setActivities(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLogs(); }, []);

    // --- ACTIONS ---
    const handleDelete = async (activityId: string, logId: string) => {
        if (!confirm("Remove this entry? This will update the student's daily totals.")) return;
        try {
            await axios.delete(`/api/admin/library?activityId=${activityId}&logId=${logId}`);
            fetchLogs();
        } catch (err) { alert("Delete failed"); }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.patch("/api/admin/library", editingLog);
            setEditingLog(null);
            fetchLogs();
        } catch (err) { alert("Update failed"); }
    };

    const filteredData = useMemo(() => {
        return activities.filter(a =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activities, searchTerm]);

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Library Visitor Report", 14, 15);
        const tableRows = filteredData.flatMap((a) =>
            (a.visitLogs || []).map((log) => [
                new Date(a.date).toLocaleDateString(),
                a.name,
                a.rollNumber,
                `${log.startTime} - ${log.endTime}`,
                log.sessionHours.toFixed(2),
                a.totalHours.toFixed(2),
                log.behavior
            ])
        );
        autoTable(doc, {
            head: [["Date", "Name", "Roll", "Time", "Session", "Total", "Behavior"]],
            body: tableRows,
            startY: 25,
            theme: 'striped'
        });
        doc.save("Library_Report.pdf");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase text-xs">Loading Analytics...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER & TOP ACTIONS --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Library Analytics</h1>
                        <p className="text-slate-500 font-medium mt-1 text-lg">Detailed visitor logs and time metrics.</p>
                    </div>
                    <button
                        onClick={exportToPDF}
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-xl shadow-slate-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Download PDF
                    </button>
                </div>

                {/* --- SEARCH BAR --- */}
                <div className="relative mb-10 group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by student name or roll number..."
                        className="text-black w-full pl-14 pr-6 py-6 bg-white border-none rounded-[2.5rem] shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg font-medium"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* --- DATA TABLE --- */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Visitor Info</th>
                                    <th className="p-8 text-[11px] font-black uppercase text-slate-400 tracking-widest text-center">Duration</th>
                                    <th className="p-8 text-[11px] font-black uppercase text-indigo-400 tracking-widest text-center">Daily Aggregate</th>
                                    <th className="p-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Behavior</th>
                                    <th className="p-8 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredData.map((activity) =>
                                    activity.visitLogs.map((log) => (
                                        <tr key={log._id} className="group hover:bg-slate-50/80 transition-all">
                                            <td className="p-8">
                                                <div className="font-extrabold text-slate-800 text-lg leading-tight">{activity.name}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-tighter">{activity.rollNumber}</span>
                                                    <span className="text-xs text-slate-300">•</span>
                                                    <span className="text-xs font-bold text-slate-400">{new Date(activity.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-center">
                                                <div className="inline-flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-slate-100 min-w-[120px]">
                                                    <div className="text-xs font-black text-slate-800 tracking-tighter uppercase">{log.startTime} - {log.endTime}</div>
                                                    <div className="text-[10px] font-bold text-indigo-500 mt-0.5">{log.sessionHours.toFixed(2)} Hrs</div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl font-black text-indigo-600">{activity.totalHours.toFixed(2)}</span>
                                                        <span className="text-[10px] font-black text-indigo-300 uppercase">Hrs Total</span>
                                                    </div>
                                                    <div className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">
                                                        {activity.visitCount} SESSIONS TODAY
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${log.behavior === 'Bad' || log.behavior === 'Needs Improvement'
                                                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${log.behavior === 'Bad' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                                    {log.behavior}
                                                </span>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button
                                                        onClick={() => setEditingLog({ activityId: activity._id, logId: log._id, ...log })}
                                                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(activity._id, log._id)}
                                                        className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODERN EDIT MODAL --- */}
            {editingLog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={() => setEditingLog(null)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-10">
                            <h3 className="text-3xl font-black text-slate-900 mb-2">Edit Session</h3>
                            <p className="text-slate-500 font-medium mb-10">Updating metrics for {editingLog.startTime}</p>

                            <form onSubmit={handleUpdate} className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Arrival</label>
                                        <input type="time" className="w-full p-5 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-800" value={editingLog.startTime} onChange={(e) => setEditingLog({ ...editingLog, startTime: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Departure</label>
                                        <input type="time" className="w-full p-5 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-800" value={editingLog.endTime} onChange={(e) => setEditingLog({ ...editingLog, endTime: e.target.value })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Student Behavior</label>
                                    <select className="w-full p-5 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-800 appearance-none" value={editingLog.behavior} onChange={(e) => setEditingLog({ ...editingLog, behavior: e.target.value })}>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Average">Average</option>
                                        <option value="Bad">Bad</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setEditingLog(null)} className="flex-1 py-5 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-all">Dismiss</button>
                                    <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 transform active:scale-95 transition-all">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}