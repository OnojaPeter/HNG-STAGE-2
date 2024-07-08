const express = require('express');
const router = express.Router();
const { User, Organisation } = require('../models/modelRelationship');
const {authenticateToken} = require('../middleware/auth');

router.get('/users/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  try {
    const user = await User.findOne({
      where: { userId },
      include: {
        model: Organisation,
        through: { attributes: [] }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
