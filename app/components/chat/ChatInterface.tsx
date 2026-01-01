'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/app/lib/axios';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Send, User, Headset } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useAuthStore } from '@/app/store/useAuthStore';

interface ChatMessage {
  ID: number;
  SenderRole: 'USER' | 'CS';
  Message: string;
  CreatedAt: string;
}

interface ChatInterfaceProps {
  ticketId: string;
  className?: string;
}

export function ChatInterface({ ticketId, className }: ChatInterfaceProps) {
  const { role } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);

  // --- FETCH CHAT (GUARDED & SAFE) ---
  const fetchChat = async () => {
    if (!role) return;

    try {
      const endpoint =
        role === 'CS'
          ? `/api/cs/tickets/${ticketId}/chat`
          : `/api/user/tickets/${ticketId}/chat`;

      const res = await api.get(endpoint);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Gagal load chat:', err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  // --- INITIAL LOAD + POLLING ---
  useEffect(() => {
    if (!role) return; // ⛔ WAJIB

    fetchChat();

    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [ticketId, role]);

  // --- AUTO SCROLL ---
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

  // --- SEND MESSAGE ---
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !role) return;

    try {
      setIsLoading(true);

      const endpoint =
        role === 'CS'
          ? `/api/cs/tickets/${ticketId}/chat`
          : `/api/user/tickets/${ticketId}/chat`;

      await api.post(endpoint, { message: newMessage });
      setNewMessage('');
      fetchChat();
    } catch (err) {
      console.error('Gagal kirim pesan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      <CardHeader className="border-b px-4 py-3 bg-slate-50">
        <h3 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
          <MessageSquareIcon /> Live Chat
        </h3>
      </CardHeader>

      {/* CHAT AREA */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {isInitialLoading && (
          <div className="text-center text-slate-400 text-sm mt-10">
            Memuat percakapan…
          </div>
        )}

        {!isInitialLoading && messages.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-10">
            Belum ada percakapan. Mulai sapa{' '}
            {role === 'CS' ? 'User' : 'CS'}!
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.SenderRole === role;

          return (
            <div
              key={msg.ID}
              className={cn(
                'flex w-full',
                isMe ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2 text-sm shadow-sm',
                  isMe
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border text-slate-800'
                )}
              >
                <div className="flex items-center gap-2 mb-1 opacity-80 text-xs border-b border-white/20 pb-1">
                  {msg.SenderRole === 'CS' ? (
                    <Headset size={12} />
                  ) : (
                    <User size={12} />
                  )}
                  <span className="font-bold">{msg.SenderRole}</span>
                  <span>
                    • {new Date(msg.CreatedAt).toLocaleTimeString()}
                  </span>
                </div>

                {/* MESSAGE (LINK SAFE) */}
                <p className="whitespace-pre-wrap break-words">
                  {msg.Message.split(/(https?:\/\/\S+)/g).map((part, i) =>
                    part.startsWith('http') ? (
                      <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'underline',
                          isMe ? 'text-white' : 'text-blue-600'
                        )}
                      >
                        {part}
                      </a>
                    ) : (
                      part
                    )
                  )}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </CardContent>

      {/* INPUT */}
      <div className="p-3 border-t bg-white">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="p-2">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

function MessageSquareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
