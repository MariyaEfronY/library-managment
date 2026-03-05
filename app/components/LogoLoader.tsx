"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LogoLoader() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fdfdff] backdrop-blur-md">
            <div className="relative flex items-center justify-center">

                {/* WAVE 1: The Deep Breath (Slowest & Largest) */}
                <motion.div
                    className="absolute w-48 h-48 rounded-full bg-indigo-500/5"
                    animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* WAVE 2: The Soft Pulse */}
                <motion.div
                    className="absolute w-36 h-36 rounded-full bg-indigo-500/10"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                />

                {/* WAVE 3: Inner Core Glow */}
                <motion.div
                    className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/20 to-blue-400/20 blur-xl"
                    animate={{
                        opacity: [0.4, 0.8, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* THE LOGO: Floating Organically */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -12, 0], // Gentle vertical float
                        rotate: [-1, 1, -1], // Barely perceptible sway
                    }}
                    transition={{
                        opacity: { duration: 1 },
                        y: {
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                        rotate: {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                    }}
                    className="relative z-10"
                >
                    <Image
                        src="/login-card-bg.png"
                        alt="Institution Logo"
                        width={90}
                        height={90}
                        priority
                        className="drop-shadow-[0_15px_30px_rgba(79,70,229,0.15)] brightness-110"
                    />
                </motion.div>

                {/* SUBTLE PROGRESS DOTS (No Text) */}
                <div className="absolute -bottom-16 flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-indigo-200"
                            animate={{
                                scale: [1, 1.5, 1],
                                backgroundColor: ["#e0e7ff", "#6366f1", "#e0e7ff"],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}