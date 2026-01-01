'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import api from '@/app/lib/axios';
import { ChatInterface } from '@/app/components/chat/ChatInterface';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { ShieldAlert, ShieldCheck, Lock, Unlock, Zap } from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function CSTicketWorkspace() {
  const params = useParams();
  const ticketId = params.id as string;

  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'SENT'>('IDLE');
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // --- ACTION 1: START VERIFICATION (FINAL VERSION) ---
  const handleStartVerification = async () => {
    setLoadingAction('VERIFY');
    setActionError(null);

    try {
      // 1. Start verification → backend return verification_url
      const res = await api.post(
        `/api/cs/tickets/${ticketId}/start-verification`
      );

      const verificationUrl: string = res.data.verification_url;

      if (!verificationUrl) {
        throw new Error('Verification URL not returned by server');
      }

      // 2. Kirim link sebagai chat message dari CS
      await api.post(
        `/api/cs/tickets/${ticketId}/chat`,
        {
          message:
            `🔐 Untuk melanjutkan verifikasi identitas, silakan klik link berikut:\n\n${verificationUrl}`,
        }
      );

      setVerificationStatus('SENT');
    } catch (err: any) {
      setActionError(
        err.response?.data?.error || 'Gagal memulai verifikasi'
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // --- ACTION 2: RESET PASSWORD (TIDAK DIUBAH) ---
  const handleResetPassword = async () => {
    setLoadingAction('RESET');
    setActionError(null);
    setNewPassword(null);

    try {
      const res = await api.post(
        `/api/cs/tickets/${ticketId}/reset-password`
      );
      setNewPassword(res.data.new_password);
    } catch (err: any) {
      setActionError(
        err.response?.data?.error ||
          'Akses Ditolak: Privilege tidak valid.'
      );
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* LEFT PANEL: CHAT */}
      <div className="md:col-span-2 h-full">
        <ChatInterface ticketId={ticketId} className="h-full" />
      </div>

      {/* RIGHT PANEL */}
      <div className="space-y-6">
        
        {/* Status Panel */}
        <Card className="border-t-4 border-t-blue-600 shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShieldAlert className="text-blue-600" /> Control Panel
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-slate-500">
              Tiket ID:{' '}
              <span className="font-mono font-bold text-slate-900">
                #{ticketId}
              </span>
            </div>

            {actionError && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm border border-red-200">
                <strong>Error:</strong> {actionError}
              </div>
            )}

            {newPassword && (
              <div className="bg-green-50 text-green-700 p-3 rounded text-sm border border-green-200 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldCheck size={16} /> Success!
                </div>
                <p>Password baru user:</p>
                <code className="block bg-black text-green-400 p-2 rounded text-center font-mono text-lg tracking-widest">
                  {newPassword}
                </code>
                <p className="text-xs text-green-800 opacity-70">
                  Segera informasikan ke user lewat chat.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader className="pb-2">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Verification Flow
            </h4>
          </CardHeader>
          <CardContent className="space-y-3">
            
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start gap-2',
                verificationStatus === 'SENT'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : ''
              )}
              onClick={handleStartVerification}
              isLoading={loadingAction === 'VERIFY'}
              disabled={verificationStatus === 'SENT'}
            >
              <Zap size={16} />
              {verificationStatus === 'SENT'
                ? 'Verification Sent'
                : '1. Start Verification'}
            </Button>

            <Button
              className="w-full justify-start gap-2 bg-slate-900 hover:bg-slate-800"
              onClick={handleResetPassword}
              isLoading={loadingAction === 'RESET'}
            >
              {newPassword ? <Unlock size={16} /> : <Lock size={16} />}
              2. Execute Reset Password
            </Button>

            <p className="text-xs text-slate-400 mt-2">
              *Reset Password hanya akan berhasil jika user telah menyelesaikan
              verifikasi dan skor risiko rendah.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
