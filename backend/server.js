const express = require('express');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const lockerRoutes = require('./routes/lockerRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // frontend port
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lockers', lockerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
