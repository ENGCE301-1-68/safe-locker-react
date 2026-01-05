// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DepositLogin from './pages/DepositLogin.jsx';     // หน้าแรกผู้ใช้
import DepositPage from './pages/DepositPage.jsx';       // หน้าฝากของ
import AdminLogin from './pages/AdminLogin.jsx';         // หน้า Admin Login
import Dashboard from './pages/Dashboard.jsx';

const PrivateRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('admin') === 'true';
  return isAdminLoggedIn ? children : <Navigate to="/admin-login" replace />;
};

function App() {
  return (
    <Routes>
      {/* หน้าแรก: ผู้ใช้ฝากของ */}
      <Route path="/" element={<DepositLogin />} />

      {/* หน้าฝากของ */}
      <Route path="/deposit" element={<DepositPage />} />

      {/* Admin Login */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Dashboard - ต้อง login admin ก่อน */}
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* ผิด path → กลับหน้าแรก */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;