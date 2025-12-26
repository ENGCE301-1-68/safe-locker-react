// frontend/src/pages/DepositPage.jsx
import React, { useState } from 'react';
import api from '../api/axios'; 
import { Link } from 'react-router-dom';
import './DepositPage.css';

function DepositPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [availableLockers, setAvailableLockers] = useState([]);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckUser = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !passcode.trim()) {
      setMessage('กรุณากรอกเบอร์โทรศัพท์และรหัสผ่าน');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/api/deposit/available', {
        phone: phone.trim(),
        passcode: passcode.trim()
      });

      const lockers = res.data.availableLockers || [];

      if (lockers.length === 0) {
        setMessage('ขออภัย ไม่มีตู้ว่างในขณะนี้');
      } else {
        setAvailableLockers(lockers);
        setStep(2);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!selectedLocker) {
      setMessage('กรุณาเลือกตู้');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/api/deposit/confirm', {
        phone: phone.trim(),
        passcode: passcode.trim(),
        locker_id: selectedLocker
      });

      setMessage(res.data.message);
      setPhone('');
      setPasscode('');
      setAvailableLockers([]);
      setSelectedLocker(null);
      setStep(1);
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'ไม่สามารถฝากของได้'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setMessage('');
    setSelectedLocker(null);
  };

  return (
    <div className="deposit-page">
      <Link to="/" className="back-button">
        ← กลับหน้าหลัก
      </Link>

      <div className="deposit-container">
        <h1 className="deposit-title">ฝากของใน Locker</h1>

        {message && (
          <div className={`message ${message.includes('สำเร็จ') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleCheckUser} className="deposit-form">
            <div className="input-group">
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

            <div className="input-group">
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

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบและเลือกตู้'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="select-locker-step">
            <h2 className="select-title">เลือกตู้ว่าง (มี {availableLockers.length} ตู้)</h2>

            <div className="lockers-grid">
              {availableLockers.map((id) => (
                <div
                  key={id}
                  className={`locker-card empty ${selectedLocker === id ? 'selected' : ''}`}
                  onClick={() => setSelectedLocker(id)}
                >
                  <div className="locker-header">
                    <h3>Locker #{id}</h3>
                    <span className="status-badge">ว่าง</span>
                  </div>
                  <div className="select-hint">
                    {selectedLocker === id ? '✓ เลือกแล้ว' : 'คลิกเพื่อเลือก'}
                  </div>
                </div>
              ))}
            </div>

            <div className="action-buttons">
              <button onClick={handleBack} className="btn-secondary" disabled={loading}>
                กลับ
              </button>
              <button
                onClick={handleDeposit}
                className="btn-primary"
                disabled={!selectedLocker || loading}
              >
                {loading ? 'กำลังฝาก...' : 'ยืนยันฝากของ'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DepositPage;