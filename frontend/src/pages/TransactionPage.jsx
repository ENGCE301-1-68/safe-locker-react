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
      const res = await api.get('api/lockers', { withCredentials: true });
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

        // การเปิดตู้ (มี update_time และต่างจาก deposit_time หรือไม่มี deposit_time)
        if (locker.update_time && (locker.update_time !== locker.deposit_time || !locker.deposit_time)) {
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

  // ค้นหาแบบ real-time
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHistory(history);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = history.filter(item =>
        item.locker_id.toString().includes(searchTerm) ||
        (item.room_number && item.room_number.toLowerCase().includes(lowerSearch)) ||
        (item.fullname && item.fullname.toLowerCase().includes(lowerSearch)) ||
        (item.phone && item.phone.toLowerCase().includes(lowerSearch))
      );
      setFilteredHistory(filtered);
    }
  }, [searchTerm, history]);

  // Export เป็น CSV (แก้ไขตรงนี้เพื่อรักษาเลข 0 ในเบอร์โทร)
  const handleExport = () => {
    if (filteredHistory.length === 0) {
      alert('ไม่มีข้อมูลให้ export');
      return;
    }

    const headers = ['เวลา', 'ตู้', 'ห้อง', 'ชื่อ-สกุล', 'เบอร์โทร', 'การกระทำ', 'รายละเอียด'];

    const rows = filteredHistory.map(item => {
      // แปลงเบอร์โทรให้เป็น text อย่างปลอดภัยใน Excel
      const formattedPhone = item.phone === '-' 
        ? '-' 
        : `="${item.phone}"`;  // ใช้ ="0812345678" เพื่อบังคับให้ Excel เป็น text

      return [
        new Date(item.timestamp).toLocaleString('th-TH'),
        item.locker_id,
        item.room_number,
        item.fullname,
        formattedPhone,
        item.action === 'deposit' ? 'ฝากของ' : 'เปิดตู้',
        item.detail
      ];
    });

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"
      + headers.join(",") + "\n"
      + rows.map(row => 
          row.map(cell => 
            // ห่อด้วย " ถ้ามี comma หรือ quote
            typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          ).join(",")
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const dateStr = new Date().toLocaleDateString('th-TH').replace(/\//g, '-');
    link.setAttribute("download", `ประวัติ_Locker_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="transaction-page">
      <div className="page-header">
        <div className="header-left">
          <h2 className="page-title">ประวัติการทำรายการ</h2>
          <p className="record-count">พบ {filteredHistory.length} รายการ</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="ค้นหา ตู้/ห้อง/ชื่อ/เบอร์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="icon-btn refresh" onClick={fetchHistory} title="รีเฟรช">
            ↻
          </button>
          <button className="icon-btn export" onClick={handleExport} title="Export เป็น Excel">
            📥
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">กำลังโหลดข้อมูล...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="no-data">
          <p>ไม่พบประวัติการทำรายการ</p>
          {searchTerm && <p>ลองค้นหาคำอื่นหรือรีเฟรชข้อมูลใหม่</p>}
        </div>
      ) : (
        <div className="transaction-table-container">
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
        </div>
      )}
    </div>
  );
}

export default TransactionPage;