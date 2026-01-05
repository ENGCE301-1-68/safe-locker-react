// src/components/Navbar.jsx
import React from 'react';
import './Navbar.css';


function Navbar({ currentTime, pageTitle, sidebarOpen, toggleSidebar }) {
  return (
    <header className={`dashboard-navbar ${!sidebarOpen ? 'collapsed' : ''}`}>
      <div className="navbar-left">
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'ยุบเมนูด้านข้าง' : 'ขยายเมนูด้านข้าง'}
        >
          {sidebarOpen ? (
            // เมื่อ Sidebar กางอยู่ → แสดง hamburger (กดเพื่อหุบ)
            <>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </>
          ) : (
            // เมื่อ Sidebar หุบอยู่ → แสดงลูกศรชี้ขวา (กดเพื่อกาง)
            <span className="arrow-icon">→</span>
          )}
        </button>
        <h1 className="navbar-title">{pageTitle}</h1>
      </div>

      <div className="navbar-time">
        {currentTime.toLocaleString('th-TH', {
          dateStyle: 'full',
          timeStyle: 'medium',
        })}
      </div>
    </header>
  );
}

export default Navbar;