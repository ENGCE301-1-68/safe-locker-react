import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LockersPage.css';

function LockersPage() {
  const [lockers, setLockers] = useState([]);

  const fetchLockers = async () => {
    const res = await axios.get('http://localhost:3000/api/lockers', { withCredentials: true });
    setLockers(res.data);
  };

  useEffect(() => {
    fetchLockers();
  }, []);

  const handleOpen = async (id) => {
    await axios.put('http://localhost:3000/api/lockers/open', { locker_id: id }, { withCredentials: true });
    fetchLockers();
  };

  const formatThaiTime = (timeStr) => {
    if (!timeStr) return '-';
    const date = new Date(timeStr);
    // เวลาไทย GMT+7
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
    <div className="lockers-card">
      <h2>จัดการ Locker</h2>
      <table className="lockers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Phone Owner</th>
            <th>User ID</th>
            <th>Deposit Time</th>
            <th>Update Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lockers.map(locker => (
            <tr key={locker.locker_id} className={locker.status ? 'occupied' : 'empty'}>
              <td>{locker.locker_id}</td>
              <td>{locker.status ? 'Occupied' : 'Empty'}</td>
              <td>{locker.phone_owner || '-'}</td>
              <td>{locker.user_id || '-'}</td>
              <td>{formatThaiTime(locker.deposit_time)}</td>
              <td>{formatThaiTime(locker.update_time)}</td>
              <td>
                {locker.status === 1 && (
                  <button className="btn-open" onClick={() => handleOpen(locker.locker_id)}>Open</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LockersPage;
