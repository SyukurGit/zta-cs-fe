'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import api from '@/app/lib/axios';
import { ChatInterface } from '@/app/components/chat/ChatInterface';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { ShieldAlert, ShieldCheck, Lock, Unlock, Zap, History, RefreshCw } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// 1. Interface untuk data log dari Database
interface AuditLog {
  ID: number;
  Timestamp: string;
  Action: string;
  Result: string;
  Context: string;
}

export default function CSTicketWorkspace() {
  const params = useParams();
  const ticketId = params.id as string;
  const queryClient = useQueryClient();

  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'SENT' | 'PASSED' | 'FAILED'>('IDLE');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // --- 2. FETCH LOGS DARI DATABASE (Real-time & Persisten) ---
  const { data: serverLogs = [], refetch: refetchLogs } = useQuery<AuditLog[]>({
    queryKey: ['ticket-logs', ticketId],
    queryFn: async () => {
      // Pastikan backend sudah ada endpoint: GET /api/audit/tickets/:id
      const res = await api.get(`/api/audit/tickets/${ticketId}`);
      return res.data || [];
    },
    refetchInterval: 3000, // Refresh otomatis setiap 3 detik untuk memantau sisa percobaan user
  });

  // Helper format waktu
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  const formatDate = (dateStr: string) => {
     const d = new Date(dateStr);
     return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  // --- ACTIONS ---

  const handleStartVerification = async () => {
    setLoadingAction('VERIFY');
    setActionError(null);
    try {
      const res = await api.post(`/api/cs/tickets/${ticketId}/start-verification`);
      const verificationUrl = res.data.verification_url;
      
      await api.post(`/api/cs/tickets/${ticketId}/chat`, {
        message: `🔐 Verifikasi diperlukan. Silakan klik link berikut untuk melanjutkan: \n\n${verificationUrl}`
      });

      setVerificationStatus('SENT');
      // Invalidate agar log langsung terupdate
      queryClient.invalidateQueries({ queryKey: ['ticket-logs', ticketId] });
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Gagal memulai verifikasi');
    } finally {
      setLoadingAction(null);
    }
  };

 const handleGenerateResetLink = async () => {
    setLoadingAction('RESET');
    setActionError(null);
    try {
      const res = await api.post(`/api/cs/tickets/${ticketId}/reset-password`);
      
      // FIX: Extract the link from the JSON response
      // Backend returns: { "status": "...", "message": "...", "new_user_password": "http://...", "info": "..." }
      const link = res.data.new_user_password; 

      await api.post(`/api/cs/tickets/${ticketId}/chat`, {
        message: `✅ Identitas Terverifikasi. Silakan gunakan link berikut untuk mengatur ulang password Anda (Berlaku 10 Menit): \n\n${link}`
      });
      
      // Update local state if needed, though strictly not used for the chat itself
      // setResetLink(link); 

      queryClient.invalidateQueries({ queryKey: ['ticket-logs', ticketId] });
    } catch (err: any) {
      setActionError("Akses Ditolak: User belum menyelesaikan verifikasi atau sesi telah dikunci.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
      
      {/* LEFT PANEL: CHAT */}
      <div className="md:col-span-2 h-full">
        <ChatInterface ticketId={ticketId} className="h-full shadow-lg" />
      </div>

      {/* RIGHT PANEL: LOGS & ACTIONS */}
      <div className="space-y-6 flex flex-col h-full overflow-hidden">
        
        {/* LOG BOX: Menampilkan data dari Database */}
        <Card className="shadow-sm border-slate-200 flex flex-col flex-1 overflow-hidden">
          <CardHeader className="bg-slate-50 py-3 border-b flex flex-row justify-between items-center">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700">
              <History size={16} /> Verification Activity Log
            </h3>
            <Button variant="ghost" className="h-7 w-7 p-0" onClick={() => refetchLogs()}>
                <RefreshCw size={14} className={cn(loadingAction ? "animate-spin" : "")} />
            </Button>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto bg-white flex-1">
            <div className="p-4 space-y-4">
              {serverLogs.length === 0 && (
                <p className="text-xs text-slate-400 text-center mt-10">Belum ada aktivitas verifikasi terekam.</p>
              )}
              {serverLogs.map((log) => (
                <div key={log.ID} className={cn(
                  "text-xs border-l-4 pl-3 py-2 shadow-sm rounded-r-md transition-all",
                  log.Result === 'FAILED' ? "border-red-500 bg-red-50" : 
                  log.Result === 'PASSED' ? "border-green-500 bg-green-50" : 
                  "border-blue-500 bg-blue-50/30"
                )}>
                  <div className="flex justify-between items-center mb-1 text-[10px] text-slate-400 font-mono">
                     <span>{log.Action.replace(/_/g, ' ')}</span>
                     <span>{formatTime(log.Timestamp)} | {formatDate(log.Timestamp)}</span>
                  </div>
                  <p className="text-slate-800 font-semibold leading-relaxed">
                    {log.Context}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CONTROL PANEL */}
        <Card className="border-t-4 border-t-blue-600 shadow-lg shrink-0">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShieldAlert className="text-blue-600" size={20} /> ZTA Control
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {actionError && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-xs border border-red-200 font-medium">
                {actionError}
              </div>
            )}

            <Button
              variant="outline"
              className={cn(
                'w-full justify-start gap-3 h-11 transition-all',
                verificationStatus === 'SENT' ? 'border-blue-400 bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
              )}
              onClick={handleStartVerification}
              isLoading={loadingAction === 'VERIFY'}
              disabled={verificationStatus === 'SENT'}
            >
              <Zap size={18} className={verificationStatus === 'SENT' ? "fill-blue-500" : ""} />
              {verificationStatus === 'SENT' ? 'Verif Link Active' : '1. Start Verification'}
            </Button>

            <Button
              className="w-full justify-start gap-3 h-11 bg-slate-900 hover:bg-slate-800 shadow-md"
              onClick={handleGenerateResetLink}
              isLoading={loadingAction === 'RESET'}
            >
              <Unlock size={18} />
              2. Send Reset Link
            </Button>

            <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
               <p className="text-[10px] text-slate-500 leading-relaxed italic">
                 *Aksi hanya dapat dilanjutkan jika status log menunjukkan <strong>PASSED</strong>. 
                 Sistem akan mengunci akses otomatis jika user gagal menjawab 3 kali.
               </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}