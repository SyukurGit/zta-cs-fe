'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/useAuthStore';
import api from '@/app/lib/axios';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Sesuai struct LoginInput di backend: { email, password }
      const res = await api.post('/login', formData);

      // Backend return: { token: "...", role: "..." }
      const { token, role } = res.data;

      // Simpan ke state global
      login(token, role);

      // Routing Logic berdasarkan Role (sesuai constants di domain/models.go)
      switch (role) {
        case 'CS':
          router.push('/cs/dashboard');
          break;
        case 'USER':
          router.push('/user/dashboard');
          break;
        case 'AUDITOR':
          router.push('/auditor/logs');
          break;
        default:
          setError('Role tidak dikenali. Hubungi admin.');
      }
    } catch (err: any) {
      // Backend return 401: { error: "Invalid email or password" }
      setError(err.response?.data?.error || 'Gagal login. Cek koneksi server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">ZTA Helpdesk</h1>
          <p className="text-sm text-slate-500">Zero Trust Access Login</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}