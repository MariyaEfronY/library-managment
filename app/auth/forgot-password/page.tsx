"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setMsg(data.message);
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md">
                <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                <p className="text-gray-500 mb-6 text-sm">Enter your email to receive a reset link.</p>
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full p-3 border rounded-lg mb-4 outline-none focus:ring-2 focus:ring-black text-black"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    disabled={loading}
                    className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
                {msg && <p className="mt-4 text-center text-blue-600 font-medium text-sm">{msg}</p>}
                <div className="mt-6 text-center">
                    <Link href="/auth/login" className="text-sm text-gray-400 hover:text-black">Back to Login</Link>
                </div>
            </form>
        </div>
    );
}