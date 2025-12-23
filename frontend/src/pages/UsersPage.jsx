import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersPage.css';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    room_number: '',
    phone: '',
    passcode: '',
    fullname: '',
    note: '',
    active: 1
  });

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3000/api/users', { withCredentials: true });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUserId(user.user_id);
    setFormData(user);
  };

  const handleSave = async () => {
    await axios.put('http://localhost:3000/api/users', formData, { withCredentials: true });
    setEditUserId(null);
    fetchUsers();
  };

  const handleAddUser = async () => {
    if(!newUser.phone || !newUser.room_number || !newUser.passcode) return alert("กรอกข้อมูลให้ครบ");
    await axios.post('http://localhost:3000/api/users', newUser, { withCredentials: true });
    setNewUser({ room_number:'', phone:'', passcode:'', fullname:'', note:'', active:1 });
    setShowAddForm(false);
    fetchUsers();
  };

  return (
    <div className="users-card">
      <div className="users-header">
        <h2>จัดการผู้ใช้</h2>
        <button className="btn-add" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-user-form">
          <input placeholder="Room Number" value={newUser.room_number} onChange={e => setNewUser({...newUser, room_number:e.target.value})} />
          <input placeholder="Phone" value={newUser.phone} onChange={e => setNewUser({...newUser, phone:e.target.value})} />
          <input placeholder="Passcode" value={newUser.passcode} onChange={e => setNewUser({...newUser, passcode:e.target.value})} />
          <input placeholder="Full Name" value={newUser.fullname} onChange={e => setNewUser({...newUser, fullname:e.target.value})} />
          <input placeholder="Note" value={newUser.note} onChange={e => setNewUser({...newUser, note:e.target.value})} />
          <select value={newUser.active} onChange={e => setNewUser({...newUser, active:e.target.value})}>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
          <button className="btn-save" onClick={handleAddUser}>Save</button>
        </div>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Room</th>
            <th>Phone</th>
            <th>Passcode</th>
            <th>Full Name</th>
            <th>Note</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{editUserId === user.user_id ? <input value={formData.room_number} onChange={e => setFormData({...formData, room_number:e.target.value})}/> : user.room_number}</td>
              <td>{editUserId === user.user_id ? <input value={formData.phone} onChange={e => setFormData({...formData, phone:e.target.value})}/> : user.phone}</td>
              <td>{editUserId === user.user_id ? <input value={formData.passcode} onChange={e => setFormData({...formData, passcode:e.target.value})}/> : user.passcode}</td>
              <td>{editUserId === user.user_id ? <input value={formData.fullname} onChange={e => setFormData({...formData, fullname:e.target.value})}/> : user.fullname}</td>
              <td>{editUserId === user.user_id ? <input value={formData.note} onChange={e => setFormData({...formData, note:e.target.value})}/> : user.note}</td>
              <td>{editUserId === user.user_id ? 
                <select value={formData.active} onChange={e => setFormData({...formData, active:e.target.value})}>
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
                : user.active ? 'Active' : 'Inactive'
              }</td>
              <td>
                {editUserId === user.user_id ? 
                  <button className="btn-save" onClick={handleSave}>Save</button> : 
                  <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;
