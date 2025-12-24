// backend/controllers/summaryController.js
const db = require('../config/db');

const getSummary = (req, res) => {
  // ใช้ Promise.all เพื่อ query พร้อมกันให้เร็ว
  const usersQuery = 'SELECT COUNT(*) AS total, SUM(active = 1) AS active, SUM(active = 0) AS inactive FROM users';
  const lockersQuery = 'SELECT COUNT(*) AS total, SUM(status = 0) AS available, SUM(status = 1) AS used FROM lockers';

  Promise.all([
    new Promise((resolve, reject) => {
      db.query(usersQuery, (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(lockersQuery, (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    })
  ])
  .then(([users, lockers]) => {
    res.json({
      totalUsers: users.total || 0,
      activeUsers: users.active || 0,
      inactiveUsers: users.inactive || 0,
      totalLockers: lockers.total || 0,
      availableLockers: lockers.available || 0,
      usedLockers: lockers.used || 0
    });
  })
  .catch(err => {
    console.error('Summary error:', err);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลสรุปได้' });
  });
};

module.exports = { getSummary };