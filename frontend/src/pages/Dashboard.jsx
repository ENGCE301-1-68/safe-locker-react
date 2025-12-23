import React, { useState, useEffect } from 'react';
import UsersPage from './UsersPage.jsx';
import LockersPage from './LockersPage.jsx';
import './Dashboard.css';
import axios from 'axios';

function Dashboard() {
  const [page, setPage] = useState('users');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await axios.post('http://localhost:3000/api/admin/logout', {}, { withCredentials: true });
    localStorage.removeItem('admin');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-menu">
        <button className={page==='users'?'active':''} onClick={() => setPage('users')}>จัดการผู้ใช้</button>
        <button className={page==='lockers'?'active':''} onClick={() => setPage('lockers')}>จัดการ Locker</button>
        <button className="logout-btn" onClick={handleLogout}>ออกจากระบบ</button>
      </div>

      <div className="dashboard-time">{currentTime.toLocaleString()}</div>

      <div className="dashboard-content">
        {page === 'users' && <UsersPage />}
        {page === 'lockers' && <LockersPage />}
      </div>
    </div>
  );
}

export default Dashboard;
