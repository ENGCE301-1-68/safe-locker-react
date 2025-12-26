// frontend/src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import api from '../api/axios'; // เรียกใช้ Axios ที่ตั้งค่าไว้
import '../App.css';

function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id.trim() || !password.trim()) {
      setError('กรุณากรอก Admin ID และ Password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post(
        '/api/admin/login',
        { id, password }
      );

      if (res.data.message) {
        // ใช้ session จาก backend เท่านั้น (ไม่ใช้ localStorage)
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Admin ID หรือ Password ไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">เข้าสู่ระบบแอดมิน</h2>

        <Link to="/" className="back-to-main-btn">
          ← กลับหน้าหลัก
        </Link>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="login-group">
            <label>Admin ID</label>
            <input
              type="text"
              placeholder="กรอก Admin ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="login-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="login-footer">© 2025 SafeLocker System</div>
      </div>
    </div>
  );
}

export default AdminLogin;