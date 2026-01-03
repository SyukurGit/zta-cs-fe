// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Pastikan QueryClient dibuat sekali per instance browser
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Default: jangan refetch otomatis saat ganti window fokus (opsional)
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}