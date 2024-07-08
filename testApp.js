require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const orgRoutes = require('./routes/orgRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(bodyParser.json());
app.use('/api', userRoutes); 
app.use('/api', orgRoutes);
app.use('/auth', authRoutes);

module.exports = app;
