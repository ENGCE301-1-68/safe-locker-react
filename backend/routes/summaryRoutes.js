// backend/routes/summaryRoutes.js
const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/summaryController');
const { isAdminLoggedIn } = require('../middlewares/authMiddleware');

router.get('/', isAdminLoggedIn, getSummary);

module.exports = router;