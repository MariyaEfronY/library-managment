"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"; // npm install lucide-react

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            setMsg(data.message);
            if (data.success) setIsSuccess(true);
        } catch (err) {
            setMsg("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] p-4 sm:p-6">
            <div className="w-full max-w-[440px] space-y-8">

                {/* Brand/Logo Area */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-black rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/10">
                        <span className="text-white font-bold text-xl">SL</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Forgot password?
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    {!isSuccess ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-black hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin mr-2" size={18} />
                                ) : null}
                                {loading ? "Sending link..." : "Reset password"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-2">
                            <div className="flex justify-center">
                                <CheckCircle2 className="text-green-500" size={48} />
                            </div>
                            <p className="text-gray-700 font-medium">{msg}</p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="text-sm font-semibold text-gray-500 hover:text-black transition"
                            >
                                Didn't receive email? Try again.
                            </button>
                        </div>
                    )}

                    {/* Feedback message for errors */}
                    {!isSuccess && msg && (
                        <p className="mt-4 text-center text-sm font-medium text-red-500 animate-pulse">
                            {msg}
                        </p>
                    )}
                </div>

                {/* Back to Login Link */}
                <div className="text-center">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to login</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}