// backend/controllers/adminController.js
const db = require('../config/db');

const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'กรุณากรอก username และ password' });
  }

  db.query(
    'SELECT admin_id FROM admins WHERE username = ? AND password = ? AND active = 1',
    [username, password],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: 'Username หรือ Password ไม่ถูกต้อง' });
      }

      // สร้าง session
      req.session.admin = { id: results[0].admin_id, username };
      res.json({ message: 'Login successful' });
    }
  );
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
};

module.exports = { login, logout };