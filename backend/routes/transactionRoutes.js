// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { getTransactions } = require('../controllers/transactionController');
const { isAdminLoggedIn } = require('../middlewares/authMiddleware');

router.get('/', isAdminLoggedIn, getTransactions);

module.exports = router;