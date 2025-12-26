// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import api from '../api/axios'; 
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!id || !password) {
      setError('กรุณากรอก Admin ID และ Password');
      return;
    }

    try {
      const res = await api.post('/api/admin/login', { id, password });

      if (res.data.message) {
        localStorage.setItem('admin', 'true');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Admin ID หรือ Password ไม่ถูกต้อง');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">SafeLocker System</h2>
        <p className="login-sub">เลือกการใช้งานของคุณ</p>

        {/* ===== ปุ่มสำหรับลูกบ้าน ===== */}
        <Link to="/deposit" className="btn-deposit">
          ฝากของใน Locker
        </Link>

        <div className="divider">
          <span>หรือ</span>
        </div>

        {/* ===== ฟอร์ม login แอดมิน ===== */}
        <h3 className="admin-section-title">สำหรับแอดมิน</h3>

        {error && <div className="login-error">{error}</div>}

        <div className="login-group">
          <label>Admin ID</label>
          <input
            type="text"
            placeholder="Enter admin ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div className="login-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          เข้าสู่ระบบ
        </button>

        <div className="login-footer">© 2025 SafeLocker System</div>
      </div>
    </div>
  );
}

export default Login;