"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, Calendar, Zap, TrendingUp, ShieldCheck } from "lucide-react";

// --- COMPONENTS ---

const StatsSection = ({ hours = 0, visits = 0 }: { hours: number; visits: number }) => {
    const goal = 100;
    const percentage = Math.min((hours / goal) * 100, 100);
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Animated Time Chart Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200"
            >
                <div className="relative z-10 flex items-center justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-indigo-200 fill-indigo-200" />
                            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em]">Total Time Spent</p>
                        </div>
                        <div>
                            <div className="flex items-baseline gap-1">
                                <h2 className="text-5xl font-black tracking-tighter">{hours.toFixed(1)}</h2>
                                <span className="text-lg font-bold opacity-60">Hrs</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                                <TrendingUp size={14} className="text-emerald-400" />
                                <span className="text-[10px] font-bold text-indigo-100 uppercase">{percentage.toFixed(0)}% of goal</span>
                            </div>
                        </div>
                    </div>

                    {/* SVG Progress Circle */}
                    <div className="relative w-28 h-28">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-500/30" />
                            <motion.circle
                                cx="50%" cy="50%" r={radius} stroke="white" strokeWidth="8" fill="transparent"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Clock size={20} className="opacity-60" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Visits Counter Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><BookOpen size={24} /></div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active Member</span>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Library Visits</p>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight">{visits} Sessions</h3>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "65%" }} className="h-full bg-indigo-600" />
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN PAGE ---

export default function StudentActivityPage() {
    const [activities, setActivities] = useState<any[]>([]);
    const [studentName, setStudentName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await axios.get("/api/student/activity");
                if (res.data.success) {
                    setActivities(res.data.data || []);
                    setStudentName(res.data.studentName || "Student");
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Calculate Aggregates Safely
    const totalHours = activities?.reduce((acc, curr) => acc + (curr.totalHours || 0), 0) || 0;
    const totalVisits = activities?.reduce((acc, curr) => acc + (curr.visitCount || 0), 0) || 0;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Syncing Library Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12">
            <div className="max-w-5xl mx-auto">

                {/* Profile Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={16} className="text-indigo-600" />
                            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em]">Verified Student</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hello, {studentName}</h1>
                        <p className="text-slate-500 font-medium">Your library performance and time logs.</p>
                    </div>
                </header>

                {/* Stats Section with safety values */}
                <StatsSection hours={totalHours} visits={totalVisits} />

                {/* History Table */}
                <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Attendance History</h3>

                    <AnimatePresence>
                        {activities.length > 0 ? (
                            activities.map((day, idx) => (
                                <motion.div
                                    key={day._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm"
                                >
                                    <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-50 pb-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-900 text-white p-2.5 rounded-xl"><Calendar size={18} /></div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                                    {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recorded Session</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg uppercase">
                                                {day.totalHours?.toFixed(2) || "0.00"} HRS
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {day.visitLogs?.map((log: any, lIdx: number) => (
                                            <div key={lIdx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                                    <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{log.startTime} — {log.endTime}</span>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${log.behavior === 'Bad' ? 'bg-rose-100 text-rose-500' : 'bg-emerald-100 text-emerald-600'}`}>
                                                    {log.behavior}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No activity found yet</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}