import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'USER' | 'CS' | 'AUDITOR' | null;

interface AuthState {
  token: string | null;
  role: Role;
  login: (token: string, role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,

      login: (token, role) => {
        // Simpan ke localStorage (via persist) & set state
        set({ token, role });
        // Simpan token mentah untuk Axios (opsional, karena persist handle storage)
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },

      logout: () => {
        set({ token: null, role: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      },
    }),
    {
      name: 'auth-storage', // Nama key di localStorage
    }
  )
);