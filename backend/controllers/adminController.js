const db = require('../config/db');
const bcrypt = require('bcryptjs');

const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = 'admin123'; // ควรเก็บ hashed ในจริง

const login = (req, res) => {
  const { id, password } = req.body;
  if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
    req.session.admin = true;
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
};

module.exports = { login, logout };
