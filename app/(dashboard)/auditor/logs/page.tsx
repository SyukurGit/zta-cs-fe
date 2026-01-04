// app/(dashboard)/auditor/logs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Shield, FileText, ChevronRight, MessageCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function AuditorDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketLogs, setTicketLogs] = useState<any[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [view, setView] = useState<'LIST' | 'DETAIL' | 'CHAT'>('LIST');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await api.get('/api/auditor/reports');
    setReports(res.data || []);
  };

  const openDetail = async (ticket: any) => {
    setSelectedTicket(ticket);
    const logRes = await api.get(`/api/auditor/tickets/${ticket.ID}/logs`);
    setTicketLogs(logRes.data || []);
    setView('DETAIL');
  };

  const openChat = async () => {
    const chatRes = await api.get(`/api/auditor/tickets/${selectedTicket.ID}/chat`);
    setChatHistory(chatRes.data || []);
    setView('CHAT');
  };

  if (view === 'LIST') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold">ZTA Audit Reports</h1>
        </div>
        <div className="grid gap-4">
          {reports.map((t) => (
            <Card key={t.ID} className="hover:shadow-md cursor-pointer transition-all border-l-4 border-l-indigo-500" onClick={() => openDetail(t)}>
              <CardContent className="p-5 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-1 rounded">#{t.ID}</span>
                    <h3 className="font-semibold text-lg">{t.Subject}</h3>
                  </div>
                  <p className="text-sm text-slate-500">User: {t.User?.Email} | Status Akhir: <b>{t.Status}</b></p>
                </div>
                <ChevronRight className="text-slate-300" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'DETAIL') {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setView('LIST')}>← Kembali ke Daftar</Button>
        <Card className="border-t-4 border-t-indigo-600">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Audit Trail: #{selectedTicket.ID}</CardTitle>
            <Button className="gap-2 text-sm px-3 py-1" onClick={openChat}><MessageCircle size={16}/> Lihat Riwayat Chat</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border text-sm grid grid-cols-2 gap-4">
               <div><p className="text-slate-500">User</p><p className="font-bold">{selectedTicket.User?.Email}</p></div>
               <div><p className="text-slate-500">Status Terakhir</p><p className="font-bold">{selectedTicket.Status}</p></div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-slate-700 flex items-center gap-2"><Clock size={16}/> Timeline Aktivitas (Per Menit)</h4>
              <div className="border-l-2 border-slate-200 ml-2 space-y-4 pt-2">
                {ticketLogs.map((log) => (
                  <div key={log.ID} className="relative pl-6 pb-2">
                    <div className={cn("absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white", log.Result === 'SUCCESS' ? "bg-green-500" : "bg-red-500")}></div>
                    <div className="text-xs text-slate-400 font-mono">{new Date(log.Timestamp).toLocaleString()}</div>
                    <div className="font-bold text-sm text-slate-800">{log.Action} <span className="font-normal text-slate-500">by</span> {log.ActorHash.substring(0,10)}...</div>
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2 mt-1 rounded border border-slate-100">{log.Context}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tampilan Riwayat Chat (ZTA Auditor View)
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => setView('DETAIL')}>← Kembali ke Detail Log</Button>
      <Card className="max-w-4xl mx-auto h-[600px] flex flex-col shadow-2xl border-t-4 border-t-blue-500">
         <CardHeader className="bg-slate-50 border-b py-3 font-bold text-center">Chat History Archive (Ticket #{selectedTicket.ID})</CardHeader>
         <CardContent className="flex-1 overflow-y-auto p-6 bg-slate-50/30 space-y-4">
            {chatHistory.map((msg) => (
               <div key={msg.ID} className={cn("flex w-full", msg.SenderRole === 'CS' ? "justify-start" : "justify-end")}>
                  <div className={cn("max-w-[70%] p-3 rounded-lg text-sm shadow-sm", msg.SenderRole === 'CS' ? "bg-white border text-slate-800" : "bg-blue-600 text-white")}>
                    <div className="text-[10px] font-bold opacity-70 mb-1 uppercase tracking-wider">{msg.SenderRole} • {new Date(msg.CreatedAt).toLocaleTimeString()}</div>
                    <p>{msg.Message}</p>
                  </div>
               </div>
            ))}
         </CardContent>
      </Card>
    </div>
  );
}