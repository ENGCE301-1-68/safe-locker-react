// server.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const lockerRoutes = require('./routes/lockerRoutes');
const summaryRoutes = require('./routes/summaryRoutes');
const depositRoutes = require('./routes/depositRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'safe-locker-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 3 * 60 * 1000, // 30 นาที
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lockers', lockerRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/deposit', depositRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

