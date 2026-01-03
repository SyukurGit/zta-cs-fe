'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/app/lib/axios';
import { ChatInterface } from '@/app/components/chat/ChatInterface';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { ShieldAlert, ShieldCheck, Lock, Unlock, Zap, Activity, History } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function CSTicketWorkspace() {
  const params = useParams();
  const ticketId = params.id as string;

  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'SENT' | 'PASSED' | 'FAILED'>('IDLE');
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [logs, setLogs] = useState<{time: string, msg: string}[]>([]);

  // Simulasi Log: Tambah pesan ke log box
  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ time, msg }, ...prev]);
  };

  const handleStartVerification = async () => {
    setLoadingAction('VERIFY');
    try {
      const res = await api.post(`/api/cs/tickets/${ticketId}/start-verification`);
      const verificationUrl = res.data.verification_url;
      
      await api.post(`/api/cs/tickets/${ticketId}/chat`, {
        message: `🔐 Verifikasi diperlukan. Klik link ini: \n${verificationUrl}`
      });

      setVerificationStatus('SENT');
      addLog("Link verifikasi dikirim ke User.");
    } catch (err: any) {
      setActionError(err.response?.data?.error || 'Gagal memulai verifikasi');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateResetLink = async () => {
    setLoadingAction('RESET');
    try {
      const res = await api.post(`/api/cs/tickets/${ticketId}/reset-password`);
      const link = res.data; // Sekarang berupa link
      
      await api.post(`/api/cs/tickets/${ticketId}/chat`, {
        message: `✅ Verifikasi Sukses. Silakan setel password baru Anda di sini: \n${link}`
      });

      setResetLink(link);
      addLog("Link Reset Sandi telah dikirim ke User.");
    } catch (err: any) {
      setActionError("Akses Ditolak: User belum menyelesaikan verifikasi.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 h-full">
        <ChatInterface ticketId={ticketId} className="h-full" />
      </div>

      <div className="space-y-6 overflow-y-auto">
        {/* LOG BOX: Pemantau Aktivitas User */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="bg-slate-50 py-3 border-b">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-700">
              <History size={16} /> Verification Activity Log
            </h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-48 overflow-y-auto p-3 space-y-2">
              {logs.length === 0 && <p className="text-xs text-slate-400 text-center mt-4">Belum ada aktivitas.</p>}
              {logs.map((log, i) => (
                <div key={i} className="text-[11px] border-l-2 border-blue-500 pl-2 py-1 bg-slate-50">
                  <span className="text-slate-400 font-mono">{log.time}</span>
                  <p className="text-slate-700 font-medium">{log.msg}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CONTROL PANEL */}
        <Card className="border-t-4 border-t-blue-600 shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShieldAlert className="text-blue-600" /> ZTA Actions
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {actionError && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-xs border border-red-200">
                {actionError}
              </div>
            )}

            <Button
              variant="outline"
              className={cn('w-full justify-start gap-2', verificationStatus === 'SENT' && 'bg-blue-50')}
              onClick={handleStartVerification}
              isLoading={loadingAction === 'VERIFY'}
              disabled={verificationStatus === 'SENT'}
            >
              <Zap size={16} /> 1. Start Verification
            </Button>

            <Button
              className="w-full justify-start gap-2 bg-slate-900"
              onClick={handleGenerateResetLink}
              isLoading={loadingAction === 'RESET'}
            >
              <Unlock size={16} /> 2. Send Reset Link to User
            </Button>

            <p className="text-[10px] text-slate-400">
              *CS tidak dapat melihat password User. Link reset hanya aktif jika verifikasi passed.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}