// backend/controllers/userController.js
const db = require('../config/db');

const getUsers = (req, res) => {
  db.query(
    'SELECT * FROM users',  // ไม่ต้อง ORDER BY เพราะ frontend จะจัดการเรียงเอง
    (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
      }
      res.json(results);
    }
  );
};

const updateUser = (req, res) => {
  const { user_id, room_number, phone, passcode, fullname, note, active } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'ไม่พบ ID ผู้ใช้' });
  }

  db.query(
    `UPDATE users SET room_number=?, phone=?, passcode=?, fullname=?, note=?, active=? WHERE user_id=?`,
    [room_number || '', phone || '', passcode || '', fullname || '', note || '', active || 0, user_id],
    (err, results) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ message: 'ไม่สามารถแก้ไขผู้ใช้ได้' });
      }
      res.json({ message: 'แก้ไขผู้ใช้สำเร็จ' });
    }
  );
};

const addUser = (req, res) => {
  let { room_number, phone, passcode, fullname, note, active } = req.body;

  room_number = (room_number || '').trim();
  phone = (phone || '').trim();
  passcode = (passcode || '').trim();
  fullname = (fullname || '').trim();
  note = (note || '').trim();
  active = (active == 1 || active === '1') ? 1 : 0;

  if (!room_number || !phone || !passcode || !fullname) {
    return res.status(400).json({
      message: 'กรุณากรอกข้อมูลให้ครบ: ห้อง, เบอร์โทรศัพท์, รหัสผ่าน, ชื่อ-นามสกุล'
    });
  }

  // ดึง user_id สูงสุดปัจจุบันเพื่อคำนวณ ID ใหม่
  db.query('SELECT MAX(user_id) AS maxId FROM users', (err, rows) => {
    if (err) {
      console.error('Error getting max ID:', err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการคำนวณ ID' });
    }

    const maxId = rows[0].maxId || 0;
    const newId = maxId + 1;  // ID ใหม่ต่อเนื่อง เช่น 4, 5, 6...

    // ใส่ user_id เองใน INSERT
    db.query(
      `INSERT INTO users (user_id, room_number, phone, passcode, fullname, note, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [newId, room_number, phone, passcode, fullname, note, active],
      (err, results) => {
        if (err) {
          console.error('INSERT Error:', err);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'ข้อมูลซ้ำ (เช่น เบอร์โทรหรือ ID)' });
          }
          return res.status(500).json({ message: 'ไม่สามารถเพิ่มผู้ใช้ได้' });
        }

        res.json({ 
          message: 'เพิ่มผู้ใช้สำเร็จ',
          newUserId: newId  // ส่ง ID ใหม่กลับไป (ไม่จำเป็นแต่ดีสำหรับ debug)
        });
      }
    );
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ไม่พบ ID ผู้ใช้' });
  }

  db.query(
    'DELETE FROM users WHERE user_id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Delete error:', err);
        return res.status(500).json({ message: 'ไม่สามารถลบผู้ใช้ได้' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'ไม่พบผู้ใช้ที่ต้องการลบ' });
      }
      res.json({ message: 'ลบผู้ใช้สำเร็จ' });
    }
  );
};




module.exports = { getUsers, updateUser, addUser, deleteUser };