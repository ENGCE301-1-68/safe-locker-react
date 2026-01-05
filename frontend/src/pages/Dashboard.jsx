// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';
import UsersPage from './UsersPage.jsx';
import LockersPage from './LockersPage.jsx';
import TransactionPage from './TransactionPage.jsx';
import './Dashboard.css';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom'; // เพิ่ม useNavigate

function Dashboard() {
  const [page, setPage] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalLockers: 0,
    availableLockers: 0,
    usedLockers: 0,
  });

  const navigate = useNavigate(); // สำหรับ redirect

  // อัปเดตเวลาเรียลไทม์
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ดึงข้อมูลสรุป
  const fetchSummary = async () => {
    try {
      const res = await api.get('/api/summary');
      setSummary(res.data);
      setShowSummary(true);
    } catch (error) {
      alert('ไม่สามารถดึงข้อมูลสรุปได้');
    }
  };

  // ออกจากระบบ - กลับไปหน้า Admin Login
  const handleLogout = async () => {
    try {
      await api.post('/api/admin/logout', {});
    } catch (err) {
      console.log('Logout error:', err);
    }
    // ล้างสถานะ login
    localStorage.removeItem('admin');
    
    // กลับไปหน้า Admin Login เท่านั้น
    navigate('/admin-login', { replace: true });
  };

  // ชื่อหน้าปัจจุบันสำหรับ Navbar
  const getPageTitle = () => {
    const titles = {
      users: 'จัดการผู้ใช้',
      lockers: 'จัดการ Locker',
      transactions: 'ประวัติการทำรายการ',
    };
    return titles[page] || 'แดชบอร์ด';
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar
        sidebarOpen={sidebarOpen}
        currentPage={page}
        setPage={setPage}
        fetchSummary={fetchSummary}
        handleLogout={handleLogout}
      />

      <div className={`main-content ${!sidebarOpen ? 'collapsed' : ''}`}>
        <Navbar
          currentTime={currentTime}
          pageTitle={getPageTitle()}
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="content-area">
          <div className="content-container">
            {page === 'users' && <UsersPage />}
            {page === 'lockers' && <LockersPage />}
            {page === 'transactions' && <TransactionPage />}
          </div>
        </main>
      </div>

      {/* Modal สรุปข้อมูลระบบ */}
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