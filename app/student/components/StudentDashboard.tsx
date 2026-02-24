"use client";

import { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import { BookOpen, User, Activity, Clock, BarChart3, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function StudentDashboard() {
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, profileRes, activityRes] = await Promise.all([
          fetch("/api/requests/my"),
          fetch("/api/auth/me"),
          fetch("/api/student/activity")
        ]);

        if (reqRes.ok) {
          const reqData = await reqRes.json();
          if (reqData.success) setTotalRequests(reqData.requests.length);
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success) setUser(profileData.user);
        }

        if (activityRes.ok) {
          const actData = await activityRes.json();
          if (actData.success) {
            const formatted = actData.data.slice(0, 7).reverse().map((item: any) => ({
              name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
              hours: item.totalHours,
            }));
            setChartData(formatted);
          }
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      <StudentSidebar />

      <main className="flex-1 lg:ml-64 p-4 md:p-10 transition-all duration-300">

        {/* --- DYNAMIC HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-10 lg:pt-0">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Analytics Hub <BarChart3 className="text-indigo-600" />
            </h1>
            <p className="text-slate-500 font-medium">Monitoring library engagement for <span className="text-indigo-600 font-bold">{user?.name}</span></p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Activity size={20} />
            </div>
            <div className="pr-4 pl-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
              <p className="text-xs font-bold text-slate-700">Live Connection</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* --- LEFT COLUMN: ANALYTICS & STATS --- */}
          <div className="xl:col-span-2 space-y-8">

            {/* CAPSULE BAR CHART CARD */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-lg font-black text-slate-800">Learning Distribution</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Study hours per session</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-indigo-600">
                    {chartData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1)}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Weekly Total</p>
                </div>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }}
                      dy={15}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                    <Bar
                      dataKey="hours"
                      radius={[20, 20, 20, 20]} // This makes the bars "Rounded/Capsule"
                      barSize={32}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === chartData.length - 1 ? '#4f46e5' : '#E2E8F0'}
                          className="hover:fill-indigo-400 transition-all duration-300"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* QUICK STATS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-white shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <BookOpen size={28} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">{totalRequests}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Requests</p>
                </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-400">
                  <Clock size={28} />
                </div>
                <div>
                  <p className="text-2xl font-black">2026</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Year</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: PROFILE & NOTIFICATIONS --- */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border-4 border-white shadow-inner">
                  <User size={40} />
                </div>
                <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{user?.name}</h4>
                <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-full mt-2">
                  {user?.rollNumber || "Student ID"}
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-indigo-600 transition-all duration-300">
                  <span className="text-xs font-bold text-slate-500 group-hover:text-white uppercase tracking-widest">Library Rules</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-white" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-indigo-600 transition-all duration-300">
                  <span className="text-xs font-bold text-slate-500 group-hover:text-white uppercase tracking-widest">Issue Policy</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-white" />
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all" />
              <h4 className="text-sm font-black uppercase tracking-widest mb-4">Latest Notice</h4>
              <p className="text-indigo-100 text-xs leading-relaxed font-medium">
                The Digital Archive is now open for students with more than 10 total study hours. Check your Hub for eligibility.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}