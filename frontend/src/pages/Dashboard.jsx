// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import UsersPage from './UsersPage.jsx';
import LockersPage from './LockersPage.jsx';
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
      // ดึงข้อมูลผู้ใช้
      const usersRes = await axios.get('http://localhost:3000/api/users', { withCredentials: true });
      const users = usersRes.data;

      // ดึงข้อมูล Locker
      const lockersRes = await axios.get('http://localhost:3000/api/lockers', { withCredentials: true });
      const lockers = lockersRes.data;

      const totalLockers = lockers.length;
      const usedLockers = lockers.filter(l => l.status == 1).length; // status=1 = ใช้งาน
      const availableLockers = totalLockers - usedLockers;

      setSummary({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.active == 1).length,
        inactiveUsers: users.filter(u => u.active == 0).length,
        totalLockers,
        availableLockers,
        usedLockers
      });

      setShowSummary(true);
    } catch (error) {
      console.error('Error fetching summary:', error);
      alert('ไม่สามารถดึงข้อมูลสรุปได้ กรุณาตรวจสอบการเชื่อมต่อ');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/admin/logout', {}, { withCredentials: true });
    } catch (err) {
      console.log('Logout error:', err);
    }
    localStorage.removeItem('admin');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-menu">
        <button className="user-btn"onClick={() => setPage('users')}>
          จัดการผู้ใช้
        </button>
        <button className="locker-btn" onClick={() => setPage('lockers')}>
          จัดการ Locker
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
      </div>

      {/* ===== MODAL สรุปข้อมูล ===== */}
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