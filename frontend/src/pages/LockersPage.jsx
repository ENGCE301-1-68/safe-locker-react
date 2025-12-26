// frontend/src/pages/LockersPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios'; 
import './LockersPage.css';

function LockersPage() {
  const [lockers, setLockers] = useState([]);

  const fetchLockers = async () => {
    try {
      const res = await api.get('/api/lockers');
      setLockers(res.data);
    } catch (error) {
      alert('ไม่สามารถดึงข้อมูล Locker ได้');
    }
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  const handleOpen = async (id) => {
    if (!window.confirm(`คุณต้องการเปิดตู้ Locker ID: ${id} หรือไม่?`)) return;

    try {
      await api.put('/api/lockers/open', { locker_id: id });
      alert(`เปิดตู้ ${id} สำเร็จ`);
      fetchLockers();
    } catch (error) {
      alert('ไม่สามารถเปิดตู้ได้');
    }
  };

  const formatThaiTime = (timeStr) => {
    if (!timeStr) return '-';
    const date = new Date(timeStr);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok'
    }).format(date);
  };

  return (
    <div className="lockers-page">
      <h2 className="page-title">จัดการ Locker</h2>

      <div className="lockers-grid">
        {lockers.length === 0 ? (
          <p className="no-data">ยังไม่มีข้อมูล Locker</p>
        ) : (
          lockers.map(locker => (
            <div
              key={locker.locker_id}
              className={`locker-card ${locker.status === 1 ? 'occupied' : 'empty'}`}
            >
              <div className="locker-header">
                <h3>Locker #{locker.locker_id}</h3>
                <span className="status-badge">
                  {locker.status === 1 ? 'ใช้งานอยู่' : 'ว่าง'}
                </span>
              </div>

              <div className="locker-info">
                <p><strong>ห้อง:</strong> {locker.room_number || '-'}</p>
                <p><strong>ชื่อ-สกุล:</strong> {locker.fullname || '-'}</p>
                <p><strong>เบอร์โทร:</strong> {locker.phone_owner || '-'}</p>
                <p><strong>เวลาฝาก:</strong> {formatThaiTime(locker.deposit_time)}</p>
                <p><strong>อัปเดตล่าสุด:</strong> {formatThaiTime(locker.update_time)}</p>
              </div>

              <div className="locker-action">
                {locker.status === 1 && (
                  <button
                    className="btn-open"
                    onClick={() => handleOpen(locker.locker_id)}
                  >
                    เปิดตู้
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LockersPage;