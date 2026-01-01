import axios from 'axios';

// Ganti sesuai URL backend Go-mu
const BASE_URL = 'http://localhost:8080'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Setiap mau request, cek ada token nggak di penyimpanan lokal?
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor: Kalau response 401 (Unauthorized), lempar keluar (Logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // ❗ Abaikan 401 dari /login
    if (status === 401 && !url?.includes('/login')) {
      console.error("Session expired or unauthorized");

      // optional:
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);


export default api;