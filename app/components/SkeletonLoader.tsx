"use client";

import { motion } from "framer-motion";

export default function DataSkeleton() {
    // Skeleton for a single card
    const CardSkeleton = () => (
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm overflow-hidden relative">
            {/* Image Area Skeleton */}
            <div className="aspect-[3/4] bg-slate-50 rounded-2xl mb-4 relative overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Text Lines */}
            <div className="space-y-3">
                <div className="h-4 w-3/4 bg-slate-100 rounded-full" />
                <div className="h-3 w-1/2 bg-slate-50 rounded-full" />
            </div>

            {/* Button Skeleton */}
            <div className="mt-6 h-12 w-full bg-slate-50 rounded-2xl" />
        </div>
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <CardSkeleton />
                </motion.div>
            ))}
        </div>
    );
}