// backend/controllers/transactionController.js
const db = require('../config/db');

const getTransactions = (req, res) => {
  // ดึงประวัติทั้งหมด เรียงล่าสุดก่อน
  const query = `
    SELECT 
      t.trans_id,
      t.locker_id,
      t.user_id,
      t.phone,
      t.action,
      t.detail,
      t.timestamp,
      u.fullname,
      u.room_number
    FROM transaction t
    LEFT JOIN users u ON t.user_id = u.user_id
    ORDER BY t.timestamp DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Transaction error:', err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงประวัติ' });
    }
    res.json(results);
  });
};

module.exports = { getTransactions };