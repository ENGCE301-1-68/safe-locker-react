// frontend/src/pages/UsersPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  const [filteredUsers, setFilteredUsers] = useState([]); // สำหรับแสดงหลังค้นหา
  const [searchTerm, setSearchTerm] = useState(''); // ค่าที่พิมพ์ในช่องค้นหา
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/users', {
        withCredentials: true
      });
      setUsers(res.data);
      setFilteredUsers(res.data); // แสดงทั้งหมดตอนโหลดครั้งแรก
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ค้นหาแบบ real-time ทุกครั้งที่ searchTerm เปลี่ยน
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = users.filter(user =>
        (user.room_number?.toString().toLowerCase().includes(lowerSearch)) ||
        (user.phone?.toLowerCase().includes(lowerSearch)) ||
        (user.fullname?.toLowerCase().includes(lowerSearch)) ||
        (user.note?.toLowerCase().includes(lowerSearch)) ||
        (user.passcode?.toLowerCase().includes(lowerSearch))
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
      active: user.active
    });
    setShowAddForm(false);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        'http://localhost:3000/api/users',
        { ...formData, user_id: editUserId },
        { withCredentials: true }
      );
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
      await axios.post(
        'http://localhost:3000/api/users',
        formData,
        { withCredentials: true }
      );
      alert('เพิ่มผู้ใช้สำเร็จ!');
      setFormData(emptyForm);
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      const msg = error.response?.data?.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ';
      alert('ไม่สามารถเพิ่มผู้ใช้ได้: ' + msg);
    }
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/users/${user_id}`, {
        withCredentials: true
      });
      alert('ลบผู้ใช้สำเร็จ');
      fetchUsers();
    } catch (error) {
      alert('ไม่สามารถลบผู้ใช้ได้');
    }
  };

  return (
    <div className="users-page">

      {/* ===== HEADER ===== */}
      <div className="users-header">
        <h2>จัดการข้อมูลผู้ใช้</h2>
        <button
          className="btn-add"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditUserId(null);
            setFormData(emptyForm);
          }}
        >
          + เพิ่มผู้ใช้
        </button>
      </div>

      {/* ===== SEARCH BOX ===== */}
      <div className="users-search">
        <input
          type="text"
          placeholder="ค้นหา (ห้อง, เบอร์โทร, ชื่อ, โน๊ต...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <span className="search-info">
            พบ {filteredUsers.length} รายการ
          </span>
        )}
      </div>


      {/* ===== ADD FORM ===== */}
      {showAddForm && (
        <div className="user-form-card">
          <h3>เพิ่มผู้ใช้ใหม่</h3>
          <div className="form-grid">
            <input placeholder="Room Number" value={formData.room_number} onChange={e => setFormData({ ...formData, room_number: e.target.value })} />
            <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            <input placeholder="Passcode" value={formData.passcode} onChange={e => setFormData({ ...formData, passcode: e.target.value })} />
            <input placeholder="Full Name" value={formData.fullname} onChange={e => setFormData({ ...formData, fullname: e.target.value })} />
            <input placeholder="Note" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} />
            <select value={formData.active} onChange={e => setFormData({ ...formData, active: e.target.value })}>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn-save" onClick={handleAddUser}>Save</button>
            <button className="btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ===== TABLE ===== */}
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
            {filteredUsers.map(user => (
              <tr key={user.user_id}>
                {editUserId === user.user_id ? (
                  <>
                    <td><input value={formData.room_number} onChange={e => setFormData({ ...formData, room_number: e.target.value })} /></td>
                    <td><input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></td>
                    <td><input value={formData.passcode} onChange={e => setFormData({ ...formData, passcode: e.target.value })} /></td>
                    <td><input value={formData.fullname} onChange={e => setFormData({ ...formData, fullname: e.target.value })} /></td>
                    <td><input value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} /></td>
                    <td>
                      <select value={formData.active} onChange={e => setFormData({ ...formData, active: e.target.value })}>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </td>
                    <td><button className="btn-save" onClick={handleSaveEdit}>Save</button></td>
                  </>
                ) : (
                  <>
                    <td>{user.room_number}</td>
                    <td>{user.phone}</td>
                    <td>{user.passcode}</td>
                    <td>{user.fullname}</td>
                    <td>{user.note}</td>
                    <td className={user.active ? 'active' : 'inactive'}>
                      {user.active ? 'Active' : 'Inactive'}
                    </td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(user.user_id)} style={{ marginLeft: '8px' }}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ข้อความไม่พบผลลัพธ์ */}
      {filteredUsers.length === 0 && searchTerm && (
        <div className="users-no-results">
          ไม่พบข้อมูลที่ตรงกับ "{searchTerm}"
        </div>
      )}

    </div>
  );
}

export default UsersPage;