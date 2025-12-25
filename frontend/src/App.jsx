// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DepositPage from './pages/DepositPage.jsx';

// Component สำหรับ Private Route (เฉพาะแอดมิน)
const PrivateRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('admin') === 'true';
  return isAdminLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      {/* หน้าแรก: ไปที่ Login เสมอ (public) */}
      <Route path="/" element={<Login />} />

      {/* หน้าฝากของ: public ใครก็เข้าได้ ไม่ตรวจ login */}
      <Route path="/deposit" element={<DepositPage />} />

      {/* Dashboard และหน้าอื่นๆ ของแอดมิน: ต้อง login ก่อน */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* ถ้าเข้าผิด path → กลับไปหน้า login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;