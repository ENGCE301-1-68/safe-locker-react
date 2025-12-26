// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // เปลี่ยนเป็น URL server จริงตอน deploy (เช่น 'https://your-server.com')
  withCredentials: true // เพื่อส่ง cookie/session ไปด้วยทุก request
});

export default api;