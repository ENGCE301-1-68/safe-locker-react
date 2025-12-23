const db = require('../config/db');

const getLockers = (req, res) => {
  db.query('SELECT * FROM lockers', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

const openLocker = (req, res) => {
  const { locker_id } = req.body;
  db.query(
    `UPDATE lockers SET status=1, update_time=NOW() WHERE locker_id=?`,
    [locker_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json({ message: `Locker ${locker_id} opened` });
    }
  );
};

module.exports = { getLockers, openLocker };
