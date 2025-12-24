const db = require('../config/db');

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
              if (err) return res.status(500).json({ message: 'ไม่สามารถฝากได้' });
              res.json({ message: `ฝากของสำเร็จ ตู้ ${locker_id}` });
            }
          );
        }
      );
    }
  );
};

module.exports = { getAvailableLockers, confirmDeposit };