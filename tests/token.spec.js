const jwt = require('jsonwebtoken');
const  generateToken  = require('../utils/generateToken');
require('dotenv').config();

describe('Token Generation', () => {
  it('should generate a token with correct user details and expiration', () => {
    const user = { id: 1, email: 'test@example.com' };
    const token = generateToken(user);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    expect(decoded.id).toBe(user.id);
    expect(decoded.email).toBe(user.email);
    expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});
