const db = require('../config/db');

const getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const updateUser = (req, res) => {
  const { user_id, room_number, phone, passcode, fullname, note, active } = req.body;
  db.query(
    `UPDATE users SET room_number=?, phone=?, passcode=?, fullname=?, note=?, active=? WHERE user_id=?`,
    [room_number, phone, passcode, fullname, note, active, user_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'User updated successfully' });
    }
  );
};

module.exports = { getUsers, updateUser };
