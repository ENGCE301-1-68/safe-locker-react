// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DepositPage from './pages/DepositPage.jsx';

function App() {
  // ตรวจสอบว่ามี session แอดมินหรือไม่ (จาก localStorage)
  const isAdminLoggedIn = localStorage.getItem('admin') === 'true';

  return (
    <Routes>
      {/* หน้าแรก: ถ้าเป็นแอดมินที่ login แล้ว → ไป Dashboard ทันที */}
      <Route
        path="/"
        element={isAdminLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* หน้าฝากของสำหรับลูกบ้าน (public ไม่ต้อง login) */}
      <Route path="/deposit" element={<DepositPage />} />

      {/* Dashboard สำหรับแอดมิน (ต้อง login ก่อน) */}
      <Route
        path="/dashboard/*"
        element={isAdminLoggedIn ? <Dashboard /> : <Navigate to="/" replace />}
      />

      {/* ถ้าเข้าผิด path → กลับไปหน้า login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;