// src/pages/DepositPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './DepositPage.css';

function DepositPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // รับข้อมูลจาก DepositLogin ผ่าน state
  const {
    user,
    currentLockers: initialCurrent = [],
    availableLockers: initialAvailable = [],
    phone,
    passcode
  } = location.state || {};

  const [userInfo, setUserInfo] = useState(user || null);
  const [currentLockers, setCurrentLockers] = useState(initialCurrent);
  const [availableLockers, setAvailableLockers] = useState(initialAvailable);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ถ้าไม่มีข้อมูลผู้ใช้ → กลับไปหน้า login
  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleDeposit = async () => {
    if (!selectedLocker) {
      setMessage('กรุณาเลือกตู้');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await api.post('/api/deposit/confirm', {
        phone,
        passcode,
        locker_id: selectedLocker
      });

      setMessage(res.data.message || 'ฝากของสำเร็จ!');

      // รีเฟรชข้อมูลตู้
      const refreshRes = await api.post('/api/deposit/check', { phone, passcode });
      const { current_lockers, available_lockers } = refreshRes.data;
      setCurrentLockers(current_lockers || []);
      setAvailableLockers(available_lockers || []);
      setSelectedLocker(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'ไม่สามารถฝากของได้');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '-';
    return new Intl.DateTimeFormat('th-TH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timeStr));
  };

  return (
    <div className="deposit-page">
      <div className="deposit-container">
        <h1 className="deposit-title">ฝากของใน Locker</h1>

        {message && (
          <div className={`deposit-message ${message.includes('สำเร็จ') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {userInfo && (
          <div className="deposit-main-section">
            {/* ส่วนหัว: ชื่อผู้ใช้ + ปุ่มออกจากระบบ */}
            <div className="deposit-header-bar">
              <div className="deposit-user-info">
                <span className="user-name">{userInfo.fullname || 'ลูกบ้าน'}</span>
                <span className="user-room">ห้อง {userInfo.room_number || '-'}</span>
              </div>
              <button onClick={handleLogout} className="deposit-logout-btn">
                ออกจากระบบ
              </button>
            </div>

            {/* ตู้ที่ใช้งานอยู่ */}
            <section className="deposit-current-section">
              <h2 className="section-title">ตู้ที่คุณกำลังใช้งาน ({currentLockers.length} ตู้)</h2>
              {currentLockers.length === 0 ? (
                <p className="no-items-text">คุณยังไม่มีของฝากในตู้ใด</p>
              ) : (
                <div className="current-lockers-grid">
                  {currentLockers.map((locker) => (
                    <div key={locker.locker_id} className="current-locker-card">
                      <div className="locker-number">Locker #{locker.locker_id}</div>
                      <div className="deposit-time">ฝากเมื่อ {formatTime(locker.deposit_time)}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* เลือกตู้ว่าง */}
            {availableLockers.length > 0 ? (
              <section className="deposit-available-section">
                <h2 className="section-title">เลือกตู้ว่างเพื่อฝากของ</h2>
                <div className="available-lockers-grid">
                  {availableLockers.map((id) => (
                    <div
                      key={id}
                      className={`available-locker-card ${selectedLocker === id ? 'selected' : ''}`}
                      onClick={() => setSelectedLocker(id)}
                    >
                      <div className="locker-number">Locker #{id}</div>
                      <div className="status-text">ว่าง</div>
                      <div className="select-hint">
                        {selectedLocker === id ? 'เลือกแล้ว' : 'คลิกเพื่อเลือก'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="confirm-button-wrapper">
                  <button
                    onClick={handleDeposit}
                    className="deposit-btn-primary"
                    disabled={!selectedLocker || loading}
                  >
                    {loading ? 'กำลังฝาก...' : 'ยืนยันฝากของ'}
                  </button>
                </div>
              </section>
            ) : (
              <section className="no-available-section">
                <p className="no-items-text">ขออภัย ไม่มีตู้ว่างในขณะนี้</p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DepositPage;