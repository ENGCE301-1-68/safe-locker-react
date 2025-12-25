// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import UsersPage from './UsersPage.jsx';
import LockersPage from './LockersPage.jsx';
import TransactionPage from './TransactionPage.jsx'; // เพิ่ม import นี้
import './Dashboard.css';
import axios from 'axios';

function Dashboard() {
  const [page, setPage] = useState('users');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalLockers: 0,
    availableLockers: 0,
    usedLockers: 0
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/summary', {
        withCredentials: true
      });
      setSummary(res.data);
      setShowSummary(true);
    } catch (error) {
      alert('ไม่สามารถดึงข้อมูลสรุปได้');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/admin/logout', {}, { withCredentials: true });
    } catch (err) {}
    localStorage.removeItem('admin');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-menu">
        <button className={`user-btn ${page === 'users' ? 'active' : ''}`} onClick={() => setPage('users')}>
          จัดการผู้ใช้
        </button>
        <button className={`locker-btn ${page === 'lockers' ? 'active' : ''}`} onClick={() => setPage('lockers')}>
          จัดการ Locker
        </button>
        <button className={`transaction-btn ${page === 'transactions' ? 'active' : ''}`} onClick={() => setPage('transactions')}>
          ประวัติการทำรายการ
        </button>
        <button className="summary-btn" onClick={fetchSummary}>
          ดูสรุปทั้งหมด
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          ออกจากระบบ
        </button>
      </div>

      <div className="dashboard-time">
        {currentTime.toLocaleString('th-TH', { dateStyle: 'full', timeStyle: 'medium' })}
      </div>

      <div className="dashboard-content">
        {page === 'users' && <UsersPage />}
        {page === 'lockers' && <LockersPage />}
        {page === 'transactions' && <TransactionPage />} {/* เพิ่มบรรทัดนี้ */}
      </div>

      {/* MODAL สรุปข้อมูล */}
      {showSummary && (
        <div className="modal-overlay" onClick={() => setShowSummary(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>สรุปข้อมูลระบบ</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <h3>ผู้ใช้ทั้งหมด</h3>
                <p className="big-number">{summary.totalUsers}</p>
              </div>
              <div className="summary-card active">
                <h3>ใช้งานอยู่</h3>
                <p className="big-number">{summary.activeUsers}</p>
              </div>
              <div className="summary-card inactive">
                <h3>ไม่ใช้งาน</h3>
                <p className="big-number">{summary.inactiveUsers}</p>
              </div>
              <div className="summary-card">
                <h3>Locker ทั้งหมด</h3>
                <p className="big-number">{summary.totalLockers}</p>
              </div>
              <div className="summary-card available">
                <h3>ว่าง</h3>
                <p className="big-number">{summary.availableLockers}</p>
              </div>
              <div className="summary-card used">
                <h3>ใช้งานอยู่</h3>
                <p className="big-number">{summary.usedLockers}</p>
              </div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowSummary(false)}>
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
