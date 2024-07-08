require('dotenv').config();
const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const path = require('path');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const orgRoutes = require('./routes/orgRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.use('/api', userRoutes);
app.use('/api', orgRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
