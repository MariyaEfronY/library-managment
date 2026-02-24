"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface IStudent {
    _id: string;
    name: string;
    rollNumber: string;
}

export default function LibraryEntryForm() {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search & Suggestion States
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        rollNumber: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "17:00",
        behavior: "Good",
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get("/api/admin/library?mode=students");
                setStudents(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to load students", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Logic: Filter students while typing
    const filteredSuggestions = students.filter(s =>
        s.rollNumber.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to top 5 for cleaner UI

    const handleSelectStudent = (student: IStudent) => {
        setFormData({ ...formData, rollNumber: student.rollNumber });
        setQuery(`${student.rollNumber} — ${student.name}`);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.rollNumber) return alert("Please select a student from the list!");

        setIsSubmitting(true);
        try {
            const res = await axios.post("/api/admin/library", formData);
            alert(`✅ Success! ${res.data.data.name} logged.`);

            // Reset
            setFormData(prev => ({ ...prev, rollNumber: "", startTime: "09:00", endTime: "17:00", behavior: "Good" }));
            setQuery("");
        } catch (err: any) {
            alert(err.response?.data?.error || "Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-indigo-600 animate-pulse">Loading Students...</div>;

    return (
        <div className="max-w-2xl mx-auto my-12 px-4">
            <div className="bg-white shadow-2xl rounded-[2.5rem] border border-slate-100 overflow-visible">

                <div className="bg-slate-900 p-8 text-white rounded-t-[2.5rem]">
                    <h2 className="text-2xl font-black">Library Entry</h2>
                    <p className="text-slate-400 text-sm">Type Roll Number or Name to search</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-visible">

                    {/* Searchable Autocomplete Input */}
                    <div className="relative" ref={suggestionRef}>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">Search Student</label>
                        <input
                            type="text"
                            placeholder="Type Roll No or Name..."
                            autoComplete="off"
                            className="w-full p-5 bg-slate-50 border-none rounded-3xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={query}
                            onFocus={() => setShowSuggestions(true)}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowSuggestions(true);
                                if (e.target.value === "") setFormData({ ...formData, rollNumber: "" });
                            }}
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && query.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
                                {filteredSuggestions.length > 0 ? (
                                    filteredSuggestions.map((s) => (
                                        <div
                                            key={s._id}
                                            onClick={() => handleSelectStudent(s)}
                                            className="p-4 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-none flex justify-between items-center transition-colors"
                                        >
                                            <div>
                                                <p className="font-black text-slate-800">{s.name}</p>
                                                <p className="text-xs text-indigo-500 font-mono uppercase">{s.rollNumber}</p>
                                            </div>
                                            <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-400">SELECT</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-slate-400 text-sm italic">No student found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Time Controls */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">In</label>
                            <input
                                type="time"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Out</label>
                            <input
                                type="time"
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Behavior Tiles */}
                    <div className="space-y-3">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Behavior Analytics</label>
                        <div className="flex flex-wrap gap-2">
                            {["Excellent", "Good", "Average", "Bad"].map((b) => (
                                <button
                                    key={b}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, behavior: b })}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.behavior === b
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                        : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                        }`}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.rollNumber}
                        className="w-full h-16 bg-slate-900 text-white rounded-[1.5rem] font-black tracking-widest uppercase hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 shadow-xl"
                    >
                        {isSubmitting ? "Syncing..." : "Submit Entry"}
                    </button>
                </form>
            </div>
        </div>
    );
}