const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // console.log('Authorization Header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        // console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // console.log('Token verification failed', err);
            return res.status(403).json({ message: 'Token verification failed', error: err.message });
        }
        req.user = user;
        next();
    });
  };
module.exports = {authenticateToken};
  