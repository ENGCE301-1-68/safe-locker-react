// backend/routes/lockerRoutes.js
const express = require('express');
const router = express.Router();
const { getLockers, openLocker } = require('../controllers/lockerController');
const { isAdminLoggedIn } = require('../middlewares/authMiddleware');

router.get('/', isAdminLoggedIn, getLockers);
router.put('/open', isAdminLoggedIn, openLocker);

module.exports = router;
