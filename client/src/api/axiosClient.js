import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn JWT vào mọi request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('nike-auth');
  if (raw) {
    try {
      const token = JSON.parse(raw)?.state?.user?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* bỏ qua nếu JSON lỗi */
    }
  }
  return config;
});

// 401 → xoá auth + redirect login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nike-auth');
      if (!window.location.pathname.includes('/auth'))
        window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);

export default api;
