// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// ตั้งค่า Global Axios Interceptor เพื่อตรวจจับ session หมดอายุ
axios.defaults.withCredentials = true; // สำคัญ! ให้ส่ง cookie/session ไปด้วยทุก request

axios.interceptors.response.use(
  (response) => response, // ถ้าสำเร็จ ส่งต่อปกติ
  (error) => {
    // ถ้า backend ส่ง 401 กลับมา (session หมดอายุหรือไม่ได้ login)
    if (error.response?.status === 401) {
      // ล้างสถานะ login
      localStorage.removeItem('admin');

      // ถ้าไม่ได้อยู่หน้า login อยู่แล้ว ให้ redirect ไป login
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);