"use client";

import { useState } from "react";
import {
  UserPlus, Eye, EyeOff, Phone, ArrowRight, ArrowLeft,
  CheckCircle2, Mail, User, ShieldCheck, BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [staffId, setStaffId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const body: any = { name, phone, email, password, role };
    if (role === "student") body.rollNumber = rollNumber;
    if (role === "staff") body.staffId = staffId;
    if (role === "admin") body.adminId = adminId;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      setSuccess("Account Created Successfully!");
      setTimeout(() => (window.location.href = "/auth/login"), 2000);
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Role", icon: <ShieldCheck size={18} /> },
    { id: 2, title: "Identity", icon: <User size={18} /> },
    { id: 3, title: "Security", icon: <BadgeCheck size={18} /> },
    { id: 4, title: "Review", icon: <CheckCircle2 size={18} /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
      <div className="w-full max-w-xl">

        {/* Progress Bar */}
        <div className="mb-8 px-4">
          <div className="flex justify-between mb-2">
            {steps.map((s) => (
              <div key={s.id} className={`flex flex-col items-center gap-1 transition-all duration-500 ${step >= s.id ? 'text-emerald-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= s.id ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'}`}>
                  {step > s.id ? <CheckCircle2 size={16} /> : s.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: "25%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <form onSubmit={handleRegister} className="p-8">
            <AnimatePresence mode="wait">

              {/* STEP 1: ROLE SELECTION */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-4">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Choose Your Role</h2>
                    <p className="text-slate-500 text-sm">How will you be using the portal?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {['student', 'staff', 'admin'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => { setRole(r); nextStep(); }}
                        className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between group
                          ${role === r ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${role === r ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400'}`}>
                            {r === 'student' && <User size={24} />}
                            {r === 'staff' && <ShieldCheck size={24} />}
                            {r === 'admin' && <BadgeCheck size={24} />}
                          </div>
                          <span className="font-bold text-slate-700 capitalize text-lg">{r}</span>
                        </div>
                        <ArrowRight size={20} className={role === r ? 'text-emerald-500' : 'text-slate-300'} />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PERSONAL IDENTITY */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="mb-4">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Personal Details</h2>
                    <p className="text-slate-500 text-sm">Tell us who you are</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 text-black rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        required
                      />
                    </div>

                    {role === "student" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Roll Number</label>
                        <input
                          type="text"
                          value={rollNumber}
                          onChange={(e) => setRollNumber(e.target.value)}
                          placeholder="e.g. 21CS101"
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                          required
                        />
                      </div>
                    )}

                    {role === "staff" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Staff ID</label>
                        <input
                          type="text"
                          value={staffId}
                          onChange={(e) => setStaffId(e.target.value)}
                          placeholder="STF-990"
                          className="w-full px-5 text-black py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                          required
                        />
                      </div>
                    )}

                    {role === "admin" && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Admin ID</label>
                        <input
                          type="text"
                          value={adminId}
                          onChange={(e) => setAdminId(e.target.value)}
                          placeholder="ADM-001"
                          className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">Back</button>
                    <button type="button" onClick={nextStep} disabled={!name} className="flex-[2] py-4 px-6 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50">Continue</button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CONTACT & SECURITY */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="mb-4">
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Contact & Security</h2>
                    <p className="text-slate-500 text-sm">Almost there, secure your account</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-black pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 outline-none"
                          placeholder="name@university.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="w-full text-black pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 outline-none"
                          placeholder="9876543210"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full text-black px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 outline-none"
                          placeholder="••••••••"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">Back</button>
                    <button type="button" onClick={nextStep} disabled={!email || !password || phone.length < 10} className="flex-[2] py-4 px-6 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50">Review Data</button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: REVIEW & SUBMIT */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full items-center justify-center mb-3">
                      <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Final Review</h2>
                    <p className="text-slate-500 text-sm">Check your details before we create your account</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase">Role</span>
                      <span className="font-bold text-emerald-600 uppercase text-sm tracking-wider">{role}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase">Name</span>
                      <span className="font-bold text-slate-700 text-sm">{name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase">ID / Roll</span>
                      <span className="font-bold text-slate-700 text-sm">{rollNumber || staffId || adminId}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-400 uppercase">Email</span>
                      <span className="font-bold text-slate-700 text-sm">{email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Phone</span>
                      <span className="font-bold text-slate-700 text-sm">{phone}</span>
                    </div>
                  </div>

                  {(error || success) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl text-center text-sm font-bold ${error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}
                    >
                      {error || success}
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={prevStep} className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">Edit</button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-[2] py-4 px-6 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Complete Registration <ArrowRight size={18} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="bg-slate-50 p-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <a href="/auth/login" className="text-emerald-600 font-black uppercase tracking-tighter hover:underline">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}