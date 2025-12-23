const express = require('express');
const router = express.Router();
const { getUsers, updateUser } = require('../controllers/userController');
const { isAdminLoggedIn } = require('../middlewares/authMiddleware');

router.get('/', isAdminLoggedIn, getUsers);
router.put('/', isAdminLoggedIn, updateUser);

module.exports = router;
