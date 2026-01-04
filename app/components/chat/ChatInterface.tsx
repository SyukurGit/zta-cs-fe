'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Send, User, Headset, MessageSquare, XCircle, LockKeyhole } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useAuthStore } from '@/app/store/useAuthStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket } from '@/types'; 

interface ChatMessage {
  ID: number;
  SenderRole: 'USER' | 'CS' | 'SYSTEM'; 
  Message: string;
  CreatedAt: string;
}

interface ChatInterfaceProps {
  ticketId: string;
  className?: string;
}

export function ChatInterface({ ticketId, className }: ChatInterfaceProps) {
  const router = useRouter();
  const { role } = useAuthStore();
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const chatEndpoint = role === 'CS'
    ? `/api/cs/tickets/${ticketId}/chat`
    : `/api/user/tickets/${ticketId}/chat`;

  // --- 1. QUERY TIKET DETAIL (Untuk cek Status Realtime) ---
  const { data: ticket } = useQuery<Ticket>({
    queryKey: ['ticket-detail', ticketId],
    queryFn: async () => {
       const url = role === 'CS' ? `/api/cs/tickets/${ticketId}` : `/api/user/tickets/${ticketId}`;
       try {
         const res = await api.get(url);
         return res.data;
       } catch (e) {
         return null;
       }
    },
    refetchInterval: 3000, 
  });

  // --- 2. QUERY CHAT ---
  const { data: messages = [], isLoading: isInitialLoading } = useQuery<ChatMessage[]>({
    queryKey: ['chat', ticketId],
    queryFn: async () => {
      if (!role) return [];
      const res = await api.get(chatEndpoint);
      return res.data || [];
    },
    enabled: !!role,
    refetchInterval: 3000,
  });

  // --- MUTATION: KIRIM PESAN ---
  const sendMessageMutation = useMutation({
    mutationFn: async (msg: string) => {
      await api.post(chatEndpoint, { message: msg });
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['chat', ticketId] });
    },
  });

  // --- MUTATION: CLOSE TICKET ---
  const closeTicketMutation = useMutation({
    mutationFn: async () => {
      const systemMessage = role === 'USER' ? "Chat diakhiri oleh User" : "Chat diakhiri oleh CS";
      await api.post(chatEndpoint, { message: systemMessage });

      const closeUrl = role === 'CS'
        ? `/api/cs/tickets/${ticketId}/close`
        : `/api/user/tickets/${ticketId}/close`;
      
      await api.post(closeUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-detail', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['chat', ticketId] });
      
      if (role === 'CS') {
        alert("Tiket ditutup. Kembali ke History.");
        router.push('/cs/history');
      } else {
        alert("Tiket telah ditutup.");
      }
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.error || "Gagal menutup tiket.";
      alert(`Gagal: ${errorMsg}`);
    }
  });

  // Auto scroll
  useEffect(() => {
    if (messages.length > 0) {
       bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !role) return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleClose = () => {
    if (!role) return;
    const confirmMsg = role === 'CS'
      ? "Yakin tutup tiket? Pastikan Zero Trust Passed."
      : "Masalah sudah selesai? Chat akan diakhiri.";

    if (window.confirm(confirmMsg)) {
      closeTicketMutation.mutate();
    }
  };

  // Helper untuk mengubah URL dalam teks menjadi link <a>
  const renderMessageWithLink = (text: string) => {
    // Regex sederhana untuk mendeteksi URL (http/https)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split pesan berdasarkan URL
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white underline font-bold hover:text-blue-100 break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const isTicketClosed = ticket?.Status === 'CLOSED';

  return (
    <Card className={cn('flex flex-col h-[600px] shadow-md border-t-4 border-t-blue-500', className)}>
      
      <CardHeader className="border-b px-4 py-3 bg-slate-50 flex flex-row items-center justify-between sticky top-0 z-10">
        <h3 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-600"/> 
          Live Chat {isTicketClosed && <span className="text-red-500 font-bold">(CLOSED)</span>}
        </h3>

        {!isTicketClosed && (
          <Button 
            className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white gap-1 px-3"
            onClick={handleClose}
            disabled={closeTicketMutation.isPending}
          >
            {closeTicketMutation.isPending ? "Closing..." : <><XCircle size={14} /> End Chat</>}
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {isInitialLoading && <div className="text-center text-slate-400 text-sm mt-10">Memuat percakapan...</div>}

        {messages.map((msg) => {
          const isMe = msg.SenderRole === role;
          const isSystemMessage = msg.Message.toLowerCase().includes("chat diakhiri oleh");

          if (isSystemMessage) {
            return (
              <div key={msg.ID} className="flex w-full justify-center my-4">
                 <div className="bg-slate-200 text-slate-600 text-xs font-bold px-4 py-1.5 rounded-full border border-slate-300 shadow-sm flex items-center gap-2">
                    <LockKeyhole size={12} />
                    {msg.Message}
                 </div>
              </div>
            );
          }

          return (
            <div key={msg.ID} className={cn('flex w-full', isMe ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2 text-sm shadow-sm',
                  isMe ? 'bg-blue-600 text-white' : 'bg-white border text-slate-800'
                )}>
                <div className="flex items-center gap-2 mb-1 opacity-80 text-xs border-b border-white/20 pb-1">
                  {msg.SenderRole === 'CS' ? <Headset size={12} /> : <User size={12} />}
                  <span className="font-bold">{msg.SenderRole}</span>
                  <span>• {new Date(msg.CreatedAt).toLocaleTimeString()}</span>
                </div>
                {/* Gunakan helper renderMessageWithLink di sini */}
                <p className="whitespace-pre-wrap break-words">
                  {isMe ? renderMessageWithLink(msg.Message) : renderMessageWithLink(msg.Message)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </CardContent>

      <div className="p-3 border-t bg-white">
        {isTicketClosed ? (
          <div className="bg-slate-100 border border-slate-200 text-slate-500 rounded-md p-3 text-center text-sm font-medium flex items-center justify-center gap-2">
             <LockKeyhole size={16} />
             Sesi chat ini telah berakhir. Tidak dapat mengirim pesan baru.
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              disabled={sendMessageMutation.isPending || closeTicketMutation.isPending}
            />
            <Button type="submit" disabled={sendMessageMutation.isPending || closeTicketMutation.isPending} className="p-2">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}