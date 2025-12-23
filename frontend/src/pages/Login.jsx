import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/admin/login',
        { id, password },
        { withCredentials: true }
      );
      if (res.data.message) {
        localStorage.setItem('admin', true);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">SafeLocker Admin</h2>
        <p className="login-sub">เข้าสู่ระบบเพื่อจัดการตู้ล็อกเกอร์</p>

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
          Login
        </button>

        <div className="login-footer">© 2025 SafeLocker System</div>
      </div>
    </div>
  );
}

export default Login;
