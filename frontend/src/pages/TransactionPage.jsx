// frontend/src/pages/TransactionPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios'; 
import './TransactionPage.css';

function TransactionPage() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/lockers');
      const lockers = res.data;

      const fakeTransactions = [];

      lockers.forEach(locker => {
        // การฝากของ (มี deposit_time)
        if (locker.deposit_time) {
          fakeTransactions.push({
            timestamp: locker.deposit_time,
            locker_id: locker.locker_id,
            phone: locker.phone_owner || '-',
            fullname: locker.fullname || '-',
            room_number: locker.room_number || '-',
            action: 'deposit',
            detail: 'ฝากของโดยผู้ใช้งาน'
          });
        }

        if (locker.update_time && locker.update_time !== locker.deposit_time) {
          // มีการเปิดตู้ (update_time ต่างจาก deposit_time)
          fakeTransactions.push({
            timestamp: locker.update_time,
            locker_id: locker.locker_id,
            phone: '-',
            fullname: '-',
            room_number: '-',
            action: 'open',
            detail: 'เปิดตู้โดยแอดมิน'
          });
        }
      });

      // เรียงล่าสุดก่อน
      fakeTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setHistory(fakeTransactions);
      setFilteredHistory(fakeTransactions);
    } catch (error) {
      alert('ไม่สามารถดึงประวัติได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="transaction-page">
      <h2 className="page-title">ประวัติการทำรายการ (จากข้อมูล Locker)</h2>

      <button className="refresh-btn" onClick={fetchHistory}>
        รีเฟรชข้อมูล
      </button>

      {loading ? (
        <div className="loading">กำลังโหลด...</div>
      ) : history.length === 0 ? (
        <div className="no-data">ยังไม่มีประวัติการใช้งาน Locker</div>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>เวลา</th>
              <th>ตู้</th>
              <th>ห้อง</th>
              <th>ชื่อ-สกุล</th>
              <th>เบอร์โทร</th>
              <th>การกระทำ</th>
              <th>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item, index) => (
              <tr key={index}>
                <td>{formatDate(item.timestamp)}</td>
                <td>{item.locker_id}</td>
                <td>{item.room_number}</td>
                <td>{item.fullname}</td>
                <td>{item.phone}</td>
                <td>
                  <span className={`action-badge ${item.action}`}>
                    {item.action === 'deposit' ? 'ฝากของ' : 'เปิดตู้'}
                  </span>
                </td>
                <td>{item.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionPage;