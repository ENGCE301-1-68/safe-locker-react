// src/components/NotificationBell.jsx
import React, { useState } from 'react';
import './NotificationBell.css';

function NotificationBell() {
  const [hasNotification, setHasNotification] = useState(true); // ตัวอย่าง: มีแจ้งเตือน
  const [isOpen, setIsOpen] = useState(false);

  // ตัวอย่างข้อมูลแจ้งเตือน (สามารถดึงจาก API จริงได้)
  const notifications = [
    { id: 1, message: 'มีผู้ใช้ใหม่ลงทะเบียน', time: '5 นาทีที่แล้ว' },
    { id: 2, message: 'Locker #105 ถูกใช้งาน', time: '20 นาทีที่แล้ว' },
    { id: 3, message: 'ระบบสำรองข้อมูลเสร็จสิ้น', time: '1 ชั่วโมงที่แล้ว' },
  ];

  const unreadCount = notifications.length;

  return (
    <div className="notification-wrapper">
      <button
        className="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`แจ้งเตือน ${unreadCount} รายการ`}
      >
        🔔
        {hasNotification && unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>แจ้งเตือน</h4>
            {unreadCount > 0 && (
              <button className="mark-read-btn" onClick={() => setHasNotification(false)}>
                เคลียร์ทั้งหมด
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="notification-item">
                  <p className="notification-message">{notif.message}</p>
                  <span className="notification-time">{notif.time}</span>
                </div>
              ))
            ) : (
              <div className="notification-empty">ไม่มีแจ้งเตือนใหม่</div>
            )}
          </div>

          <div className="notification-footer">
            <button className="view-all-btn">ดูทั้งหมด</button>
          </div>
        </div>
      )}

      {/* คลิกนอก dropdown เพื่อปิด */}
      {isOpen && (
        <div
          className="notification-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default NotificationBell;