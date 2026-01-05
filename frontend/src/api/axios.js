// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  // backend URL
  withCredentials: true  // สำคัญมาก! ส่ง session cookie ไปด้วย
});

// Response Interceptor - ตรวจจับ 401 แล้วเด้งไป login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // ล้างสถานะ admin
      localStorage.removeItem('admin');

      // เด้งไปหน้า login ทันที (พร้อม refresh หน้าเพื่อให้แน่ใจ)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;