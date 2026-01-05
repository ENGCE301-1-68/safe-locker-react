// frontend/src/pages/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import './UsersPage.css';

const emptyForm = {
  room_number: '',
  phone: '',
  passcode: '',
  fullname: '',
  note: '',
  active: 1
};

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = users.filter(user =>
        String(user.room_number || '').toLowerCase().includes(lowerSearch) ||
        String(user.phone || '').toLowerCase().includes(lowerSearch) ||
        String(user.fullname || '').toLowerCase().includes(lowerSearch) ||
        String(user.note || '').toLowerCase().includes(lowerSearch) ||
        String(user.passcode || '').toLowerCase().includes(lowerSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleEdit = (user) => {
    setEditUserId(user.user_id);
    setFormData({
      room_number: user.room_number || '',
      phone: user.phone || '',
      passcode: user.passcode || '',
      fullname: user.fullname || '',
      note: user.note || '',
      active: user.active ? 1 : 0
    });
    setShowAddForm(false);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put('/api/users', { ...formData, user_id: editUserId });
      alert('แก้ไขผู้ใช้สำเร็จ');
      setEditUserId(null);
      setFormData(emptyForm);
      fetchUsers();
    } catch (error) {
      alert('ไม่สามารถแก้ไขผู้ใช้ได้');
    }
  };

  const handleAddUser = async () => {
    if (!formData.room_number.trim() || !formData.phone.trim() || !formData.passcode.trim() || !formData.fullname.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบ: ห้อง, เบอร์โทร, รหัสผ่าน, ชื่อ-นามสกุล');
      return;
    }

    try {
      await api.post('/api/users', formData);
      alert('เพิ่มผู้ใช้สำเร็จ!');
      setFormData(emptyForm);
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'เกิดข้อผิดพลาด';
      alert('ไม่สามารถเพิ่มผู้ใช้ได้: ' + msg);
    }
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) return;
    try {
      await api.delete(`/api/users/${user_id}`);
      alert('ลบผู้ใช้สำเร็จ');
      fetchUsers();
    } catch (error) {
      alert('ไม่สามารถลบผู้ใช้ได้');
    }
  };

  return (
    <div className="users-page-container">
      <h2 className="users-page-title">จัดการข้อมูลผู้ใช้</h2>

      <div className="users-controls-bar">
        <input
          type="text"
          className="search-input"
          placeholder="ค้นหา (ห้อง, เบอร์โทร, ชื่อ, โน๊ต...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn-add-user"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditUserId(null);
            setFormData(emptyForm);
          }}
        >
          + เพิ่มผู้ใช้
        </button>
      </div>

      {showAddForm && (
        <div className="add-form-card">
          <h3>เพิ่มผู้ใช้ใหม่</h3>
          <div className="form-grid">
            <input placeholder="Room Number" value={formData.room_number} onChange={e => setFormData({ ...formData, room_number: e.target.value })} />
            <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            <input placeholder="Passcode" value={formData.passcode} onChange={e => setFormData({ ...formData, passcode: e.target.value })} />
            <input placeholder="Full Name" value={formData.fullname} onChange={e => setFormData({ ...formData, fullname: e.target.value })} />
            <input placeholder="Note" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} />
            <select value={formData.active} onChange={e => setFormData({ ...formData, active: Number(e.target.value) })}>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
          <div className="form-buttons">
            <button className="btn-save" onClick={handleAddUser}>บันทึก</button>
            <button className="btn-cancel" onClick={() => setShowAddForm(false)}>ยกเลิก</button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Phone</th>
              <th>Passcode</th>
              <th>Name</th>
              <th>Note</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {searchTerm ? `ไม่พบข้อมูลที่ตรงกับ "${searchTerm}"` : 'ไม่มีข้อมูลผู้ใช้'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  {editUserId === user.user_id ? (
                    <>
                      <td><input value={formData.room_number} onChange={e => setFormData({ ...formData, room_number: e.target.value })} /></td>
                      <td><input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></td>
                      <td><input value={formData.passcode} onChange={e => setFormData({ ...formData, passcode: e.target.value })} /></td>
                      <td><input value={formData.fullname} onChange={e => setFormData({ ...formData, fullname: e.target.value })} /></td>
                      <td><input value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} /></td>
                      <td>
                        <select value={formData.active} onChange={e => setFormData({ ...formData, active: Number(e.target.value) })}>
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn-save-inline" onClick={handleSaveEdit}>บันทึก</button>
                        <button className="btn-cancel-inline" onClick={() => setEditUserId(null)}>ยกเลิก</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.room_number}</td>
                      <td>{user.phone}</td>
                      <td>{user.passcode}</td>
                      <td>{user.fullname}</td>
                      <td>{user.note || '-'}</td>
                      <td className={user.active ? 'status-active' : 'status-inactive'}>
                        {user.active ? 'Active' : 'Inactive'}
                      </td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(user.user_id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;