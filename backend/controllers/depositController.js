// backend/controllers/depositController.js
const db = require('../config/db');

// API ใหม่: ตรวจสอบผู้ใช้ + ดึงข้อมูล + ตู้ที่ใช้งานอยู่ทั้งหมด + ตู้ว่าง
const checkUserAndLockers = (req, res) => {
  const { phone, passcode } = req.body;

  if (!phone || !passcode) {
    return res.status(400).json({ message: 'กรุณากรอกเบอร์โทรศัพท์และรหัสผ่าน' });
  }

  // ตรวจสอบผู้ใช้
  db.query(
    `SELECT user_id, fullname, room_number 
     FROM users 
     WHERE phone = ? AND passcode = ? AND active = 1`,
    [phone.trim(), passcode.trim()],
    (err, userResults) => {
      if (err || userResults.length === 0) {
        return res.status(401).json({ message: 'เบอร์โทรศัพท์หรือรหัสผ่านไม่ถูกต้อง' });
      }

      const user = userResults[0];

      // ดึงตู้ที่ผู้ใช้นี้กำลังใช้งานอยู่ทั้งหมด (หลายตู้ได้)
      db.query(
        `SELECT locker_id, deposit_time 
         FROM lockers 
         WHERE phone_owner = ? AND status = 1 
         ORDER BY locker_id ASC`,
        [phone.trim()],
        (err, currentResults) => {
          if (err) {
            console.error('Error fetching current lockers:', err);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลตู้ที่ใช้งาน' });
          }

          const currentLockers = currentResults; // ส่ง array ทั้งหมด

          // ดึงตู้ว่างทั้งหมด
          db.query(
            'SELECT locker_id FROM lockers WHERE status = 0 ORDER BY locker_id ASC',
            (err, availableResults) => {
              if (err) {
                console.error('Error fetching available lockers:', err);
                return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลตู้ว่าง' });
              }

              const availableLockers = availableResults.map(row => row.locker_id);

              // ส่งกลับโดยไม่มี phone เพื่อความเป็นส่วนตัว
              res.json({
                user: {
                  fullname: user.fullname || '-',
                  room_number: user.room_number || '-'
                  // ไม่ส่ง phone กลับไป
                },
                current_lockers: currentLockers,
                available_lockers: availableLockers
              });
            }
          );
        }
      );
    }
  );
};

// API เดิม: ดึงเฉพาะตู้ว่าง (ถ้ายังใช้ในที่อื่น)
const getAvailableLockers = (req, res) => {
  const { phone, passcode } = req.body;

  if (!phone || !passcode) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  db.query(
    'SELECT user_id FROM users WHERE phone = ? AND passcode = ?',
    [phone.trim(), passcode.trim()],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: 'เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง' });
      }

      db.query(
        'SELECT locker_id FROM lockers WHERE status = 0 ORDER BY locker_id ASC',
        (err, lockers) => {
          if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
          res.json({ availableLockers: lockers.map(l => l.locker_id) });
        }
      );
    }
  );
};

// API ยืนยันฝากของ
const confirmDeposit = (req, res) => {
  const { phone, passcode, locker_id } = req.body;

  if (!phone || !passcode || !locker_id) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบ' });
  }

  db.query(
    'SELECT user_id FROM users WHERE phone = ? AND passcode = ?',
    [phone.trim(), passcode.trim()],
    (err, userResults) => {
      if (err || userResults.length === 0) {
        return res.status(401).json({ message: 'ข้อมูลไม่ถูกต้อง' });
      }

      const user_id = userResults[0].user_id;

      db.query(
        'SELECT status FROM lockers WHERE locker_id = ? AND status = 0',
        [locker_id],
        (err, lockerResults) => {
          if (err || lockerResults.length === 0) {
            return res.status(400).json({ message: 'ตู้นี้ถูกใช้งานแล้ว' });
          }

          db.query(
            `UPDATE lockers SET status = 1, phone_owner = ?, deposit_time = NOW(), update_time = NOW() WHERE locker_id = ?`,
            [phone.trim(), locker_id],
            (err) => {
              if (err) {
                console.error('Deposit error:', err);
                return res.status(500).json({ message: 'ไม่สามารถฝากได้' });
              }

              // บันทึก transaction
              db.query(
                `INSERT INTO transactions (locker_id, user_id, phone, action, detail, timestamp)
                 VALUES (?, ?, ?, 'deposit', 'ฝากของ', NOW())`,
                [locker_id, user_id, phone.trim()],
                (transErr) => {
                  if (transErr) console.error('Transaction log error:', transErr);
                }
              );

              res.json({ message: `ฝากของสำเร็จ ตู้ ${locker_id}` });
            }
          );
        }
      );
    }
  );
};

module.exports = { getAvailableLockers, confirmDeposit, checkUserAndLockers };