// backend/routes/depositRoutes.js
const express = require('express');
const router = express.Router();
const { getAvailableLockers, confirmDeposit } = require('../controllers/depositController');

// ไม่ต้อง login เพราะลูกบ้านใช้
router.post('/available', getAvailableLockers);
router.post('/confirm', confirmDeposit);

module.exports = router;