'use client';

import { useParams } from 'next/navigation';
import { ChatInterface } from '@/app/components/chat/ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from 'lucide-react';

export default function UserTicketPage() {
  const params = useParams();
  const ticketId = params.id as string;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)]">
      <div className="mb-4 flex items-center justify-between">
         <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Ticket <span className="text-slate-400 font-mono">#{ticketId}</span>
         </h1>
         <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-200">
            OPEN / IN PROGRESS
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {/* Chat Component (Full Height) */}
        <div className="md:col-span-2 h-full">
          <ChatInterface ticketId={ticketId} className="h-full shadow-md border-t-4 border-t-blue-500" />
        </div>

        {/* Info Panel Sederhana */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-wider text-slate-500">
                Panduan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-3">
              <p>1. Jelaskan masalah Anda kepada CS di kolom chat.</p>
              <p>2. Jika CS meminta verifikasi, link akan dikirimkan lewat chat atau email.</p>
              <p>3. <strong>JANGAN</strong> berikan password Anda di chat.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}