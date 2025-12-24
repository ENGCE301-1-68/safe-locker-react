// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, updateUser, addUser, deleteUser } = require('../controllers/userController');
const { isAdminLoggedIn } = require('../middlewares/authMiddleware');

router.get('/', isAdminLoggedIn, getUsers);
router.post('/', isAdminLoggedIn, addUser);
router.put('/', isAdminLoggedIn, updateUser);
router.delete('/:id', isAdminLoggedIn, deleteUser);

module.exports = router;