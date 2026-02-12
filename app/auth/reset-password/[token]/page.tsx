"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPassword() {
    const { token } = useParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ token, password }),
        });
        const data = await res.json();
        if (data.success) {
            alert("Success! Login with your new password.");
            router.push("/auth/login");
        } else {
            alert(data.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-xl w-96">
                <h1 className="text-xl font-bold mb-4">Create New Password</h1>
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-3 border rounded mb-4 text-black"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="w-full bg-black text-white p-3 rounded font-bold">
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}