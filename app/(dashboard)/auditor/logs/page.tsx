'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table'; // Opsional: kalau belum ada komponen Table, pakai div biasa
import { Shield, CheckCircle, XCircle } from 'lucide-react';

interface AuditLog {
  ID: number;
  Timestamp: string;
  ActorRole: string;
  ActorHash: string; // ID Anonim
  Action: string;
  Result: 'SUCCESS' | 'DENIED' | 'FAILED';
  Context: string;
}

// Komponen Table Sederhana (Inline)
function SimpleTable({ children }: { children: React.ReactNode }) {
    return <div className="w-full overflow-auto"><table className="w-full caption-bottom text-sm text-left">{children}</table></div>
}

export default function AuditorLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/api/auditor/logs');
        setLogs(res.data || []);
      } catch (err) {
        console.error("Failed logs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Audit Logs</h1>
          <p className="text-slate-500">Pantau semua aktivitas sensitif dan keputusan Zero Trust.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="p-8 text-center text-slate-500">Loading audit trail...</div>
          ) : (
            <SimpleTable>
                <thead className="[&_tr]:border-b bg-slate-50">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Time</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Role</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Anon ID (Hash)</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Action</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Result</th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Context / Reason</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {logs.map((log) => (
                        <tr key={log.ID} className="border-b transition-colors hover:bg-slate-50">
                            <td className="p-4 align-middle font-mono text-xs">
                                {new Date(log.Timestamp).toLocaleString()}
                            </td>
                            <td className="p-4 align-middle font-bold text-xs uppercase text-slate-600">
                                {log.ActorRole}
                            </td>
                            <td className="p-4 align-middle font-mono text-xs text-slate-500" title={log.ActorHash}>
                                {log.ActorHash.substring(0, 12)}...
                            </td>
                            <td className="p-4 align-middle font-semibold text-blue-700">
                                {log.Action}
                            </td>
                            <td className="p-4 align-middle">
                                {log.Result === 'SUCCESS' ? (
                                    <span className="flex items-center text-green-600 text-xs font-bold gap-1">
                                        <CheckCircle size={14} /> ALLOWED
                                    </span>
                                ) : (
                                    <span className="flex items-center text-red-600 text-xs font-bold gap-1">
                                        <XCircle size={14} /> DENIED
                                    </span>
                                )}
                            </td>
                            <td className="p-4 align-middle text-xs text-slate-600 max-w-xs truncate">
                                {log.Context}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </SimpleTable>
          )}
        </CardContent>
      </Card>
    </div>
  );
}