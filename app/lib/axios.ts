// app/lib/axios.ts
import axios from 'axios';

// Gunakan Env Variable, fallback ke localhost jika tidak ada
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Note: Nanti kita akan migrasi ke Cookie untuk Middleware, 
    // tapi untuk sekarang kita dukung keduanya (localStorage/Cookie) jika perlu.
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && !url?.includes('/login')) {
      console.error("Session expired or unauthorized");
      // Kita biarkan logic logout di handle komponen atau store
    }
    return Promise.reject(error);
  }
);

export default api;