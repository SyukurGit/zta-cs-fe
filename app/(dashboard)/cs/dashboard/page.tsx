'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Activity
} from "lucide-react";

export default function CSDashboard() {
  
  // MOCK DATA: Performance CS
  const stats = {
    todayResolved: 12,
    avgResponseTime: "2m 30s",
    customerSatisfaction: "4.9/5.0",
    totalTicketsThisMonth: 145,
    recentActivity: [
      { id: 102, action: "Solved Ticket", time: "10 mins ago", detail: "Login issue resolved" },
      { id: 105, action: "Verification Failed", time: "45 mins ago", detail: "User failed ZTA check" },
      { id: 99,  action: "Ticket Claimed", time: "1 hour ago", detail: "Printer error" },
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Selamat datang kembali! Berikut performa kerja Anda hari ini.</p>
        </div>
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           System Operational
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <Card className="border-t-4 border-t-blue-500">
          <CardContent className="p-6">
             <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-500">Tiket Selesai (Hari Ini)</p>
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
             </div>
             <div className="text-3xl font-bold text-slate-900">{stats.todayResolved}</div>
             <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
               <TrendingUp size={12} /> +2 dari kemarin
             </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-t-4 border-t-indigo-500">
          <CardContent className="p-6">
             <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-500">Avg. Response Time</p>
                <Clock className="h-5 w-5 text-indigo-500" />
             </div>
             <div className="text-3xl font-bold text-slate-900">{stats.avgResponseTime}</div>
             <p className="text-xs text-green-600 mt-1">Sangat Cepat</p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-t-4 border-t-yellow-500">
          <CardContent className="p-6">
             <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-500">CSAT Score</p>
                <Users className="h-5 w-5 text-yellow-500" />
             </div>
             <div className="text-3xl font-bold text-slate-900">{stats.customerSatisfaction}</div>
             <p className="text-xs text-slate-400 mt-1">Berdasarkan 50 feedback</p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-t-4 border-t-emerald-500">
          <CardContent className="p-6">
             <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-slate-500">Total Bulan Ini</p>
                <BarChart3 className="h-5 w-5 text-emerald-500" />
             </div>
             <div className="text-3xl font-bold text-slate-900">{stats.totalTicketsThisMonth}</div>
             <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
               <TrendingUp size={12} /> Top 10% CS
             </p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION BAWAH */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CHART PLACEHOLDER */}
        <Card className="md:col-span-2">
           <CardHeader>
             <CardTitle className="text-lg text-slate-700">Performance Chart</CardTitle>
           </CardHeader>
           <CardContent className="h-[200px] flex items-center justify-center bg-slate-50 border-dashed border mx-6 mb-6 rounded">
              <span className="text-slate-400 text-sm">Grafik mingguan akan muncul di sini...</span>
           </CardContent>
        </Card>

        {/* RECENT ACTIVITY */}
        <Card className="md:col-span-1">
           <CardHeader>
             <CardTitle className="text-lg text-slate-700 flex items-center gap-2">
                <Activity size={18} /> Aktivitas Terkini
             </CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-6">
                 {stats.recentActivity.map((act, idx) => (
                    <div key={idx} className="flex gap-3 relative pb-6 last:pb-0 border-l last:border-0 border-slate-200 ml-2 pl-4">
                       <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                       <div>
                          <p className="text-sm font-medium text-slate-900">{act.action}</p>
                          <p className="text-xs text-slate-500 mb-1">{act.detail}</p>
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                             {act.time}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
           </CardContent>
        </Card>

      </div>
    </div>
  );
}