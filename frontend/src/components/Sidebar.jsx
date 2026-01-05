// src/components/Sidebar.jsx
import React from 'react';
import './Sidebar.css';

function Sidebar({ sidebarOpen, currentPage, setPage, fetchSummary, handleLogout }) {
  const menuItems = [
    { key: 'users', label: 'จัดการผู้ใช้' },
    { key: 'lockers', label: 'จัดการ Locker' },
    { key: 'transactions', label: 'ประวัติการทำรายการ' },
  ];

  return (
    <aside className={`dashboard-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={currentPage === item.key ? 'active' : ''}
            onClick={() => setPage(item.key)}
            data-title={item.label}
          >
            {item.label}
          </button>
        ))}

        <button className="summary-btn" onClick={fetchSummary} data-title="ดูสรุปทั้งหมด">
          ดูสรุปทั้งหมด
        </button>

        <button className="logout-btn" onClick={handleLogout} data-title="ออกจากระบบ">
          ออกจากระบบ
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;