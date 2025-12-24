// backend/controllers/lockerController.js
const db = require('../config/db');

const getLockers = (req, res) => {
  const query = `
    SELECT 
      l.locker_id,
      l.status,
      l.phone_owner,
      l.deposit_time,
      l.update_time,
      u.room_number,
      u.fullname
    FROM lockers l
    LEFT JOIN users u ON l.phone_owner = u.phone
    ORDER BY l.locker_id ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching lockers:', err);
      return res.status(500).json({ message: 'ไม่สามารถดึงข้อมูล Locker ได้' });
    }
    res.json(results);
  });
};


const openLocker = (req, res) => {
  const { locker_id } = req.body;

  // เพิ่มการล้าง phone_owner และ deposit_time
  db.query(
    `UPDATE lockers 
     SET status = 0, 
         phone_owner = NULL, 
         deposit_time = NULL, 
         update_time = NOW() 
     WHERE locker_id = ?`,
    [locker_id],
    (err, results) => {
      if (err) {
        console.error('Error opening locker:', err);
        return res.status(500).json({ message: 'ไม่สามารถเปิดตู้ได้' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'ไม่พบตู้ Locker ที่ระบุ' });
      }

      res.json({ message: `เปิดตู้ Locker ${locker_id} สำเร็จ` });
    }
  );
};

module.exports = { getLockers, openLocker };