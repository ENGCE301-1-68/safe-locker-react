// src/pages/DepositLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './DepositLogin.css';

function DepositLogin() {
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !passcode.trim()) {
      setMessage('กรุณากรอกเบอร์โทรศัพท์และรหัสผ่าน');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/api/deposit/check', {
        phone: phone.trim(),
        passcode: passcode.trim()
      });

      const { user, current_lockers, available_lockers } = res.data;

      // ส่งข้อมูลไป DepositPage เพื่อแสดงขั้นตอนที่ 2 ทันที
      navigate('/deposit', {
        state: {
          user,
          currentLockers: current_lockers || [],
          availableLockers: available_lockers || [],
          phone: phone.trim(),
          passcode: passcode.trim()
        }
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-login-wrapper">
      <div className="deposit-login-card">
        <h1 className="deposit-login-title">ฝากของใน Locker</h1>
        <p className="deposit-login-subtitle">กรุณากรอกข้อมูลเพื่อเริ่มใช้งาน</p>

        {message && (
          <div className={`deposit-login-message ${message.includes('สำเร็จ') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="deposit-login-form">
          <div className="deposit-login-input-group">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="text"
              placeholder="เช่น 0812345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="deposit-login-input-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              placeholder="รหัสที่ได้รับจากแอดมิน"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="deposit-login-btn" disabled={loading}>
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <div className="deposit-login-footer">© 2025 SafeLocker</div>
      </div>
    </div>
  );
}

export default DepositLogin;