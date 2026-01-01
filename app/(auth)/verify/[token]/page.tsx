'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/app/lib/axios'; // Pastikan axios ini bisa handle public route (tanpa token user)
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ShieldCheck, ShieldAlert, LockKeyhole, CheckCircle2 } from 'lucide-react';

interface Question {
  ID: number;
  Category: string;
  QuestionText: string;
}

export default function VerificationPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'FAILED' | 'EXPIRED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Load Pertanyaan saat halaman dibuka
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // GET /verify/:token
        const res = await api.get(`/verify/${token}`);
        // Backend return: { questions: [...] }
        setQuestions(res.data.questions || []);
      } catch (err: any) {
        setStatus('EXPIRED');
        setErrorMessage(err.response?.data?.error || "Sesi verifikasi tidak valid atau sudah kadaluarsa.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchQuestions();
  }, [token]);

  // 2. Handle Perubahan Input Jawaban
  const handleInputChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // 3. Submit Jawaban
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // POST /verify/:token
      // Format Body: { answers: { 1: "Jawab A", 2: "Jawab B" } }
      await api.post(`/verify/${token}`, { answers });
      
      setStatus('SUCCESS');
    } catch (err: any) {
      // Jika salah, backend tidak error 500 tapi return success:false logic? 
      // Atau return 400? Sesuai handler standar biasanya throw error kalau gagal logic.
      // Di sini kita asumsi jika gagal verifikasi -> 400/403
      setStatus('FAILED');
      setErrorMessage(err.response?.data?.error || "Verifikasi Gagal. Jawaban Anda salah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER STATES ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center animate-pulse">
          <ShieldCheck className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <p className="text-slate-500 font-medium">Memverifikasi Sesi...</p>
        </div>
      </div>
    );
  }

  if (status === 'EXPIRED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <Card className="max-w-md w-full border-red-200">
          <CardHeader className="text-center text-red-600">
            <ShieldAlert className="mx-auto h-12 w-12 mb-2" />
            <CardTitle>Akses Ditolak</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">{errorMessage}</p>
            <p className="text-xs text-slate-400">Silakan hubungi CS Anda untuk meminta link baru.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'SUCCESS') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <Card className="max-w-md w-full border-green-200 shadow-lg">
          <CardHeader className="text-center text-green-600">
            <CheckCircle2 className="mx-auto h-16 w-16 mb-2" />
            <CardTitle className="text-2xl">Verifikasi Berhasil</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-700 text-lg">
              Identitas Anda telah terkonfirmasi.
            </p>
            <p className="text-slate-500 text-sm">
              Agen CS kami kini memiliki akses sementara untuk membantu reset password Anda. 
              Silakan kembali ke chat.
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700 mt-4" onClick={() => window.close()}>
              Tutup Halaman Ini
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- RENDER FORM ---
  
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
            <LockKeyhole size={24} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Verifikasi Keamanan
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Untuk melindungi akun Anda, jawab pertanyaan berikut dengan benar.
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-t-4 border-t-blue-600">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {status === 'FAILED' && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2 border border-red-100">
                  <ShieldAlert size={16} />
                  {errorMessage}
                </div>
              )}

              {questions.map((q, index) => (
                <div key={q.ID} className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">
                    {index + 1}. {q.QuestionText}
                  </label>
                  <Input 
                    type="text"
                    placeholder="Ketik jawaban Anda..."
                    value={answers[q.ID] || ''}
                    onChange={(e) => handleInputChange(q.ID, e.target.value)}
                    required
                    className="focus:ring-blue-500"
                    autoComplete="off"
                  />
                </div>
              ))}

              <Button 
                type="submit" 
                className="w-full h-11 text-base bg-blue-700 hover:bg-blue-800"
                isLoading={isSubmitting}
              >
                Konfirmasi Identitas
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          ZTA Secure Verification System • Sesi ID: <span className="font-mono">{token.substring(0,8)}...</span>
        </p>

      </div>
    </div>
  );
}