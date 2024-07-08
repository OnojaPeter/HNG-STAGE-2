const express = require('express');
const router = express.Router();
const { Organisation, UserOrganisation, User } = require('../models/modelRelationship');
const {authenticateToken} = require('../middleware/auth');

router.get('/organisations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const organisations = await Organisation.findAll({
      include: {
        model: User,
        where: { userId: userId },
        through: { attributes: [] }
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/organisations/:orgId', authenticateToken, async (req, res) => {
  const { orgId } = req.params;
  try {
    const userId = req.user.userId;
    const organisation = await Organisation.findOne({
      where: { orgId },
      include: {
        model: User,
        where: { userId: userId },
        through: { attributes: [] }
      }
    });
    if (!organisation) {
      return res.status(404).json({ message: 'Organisation not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: organisation
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/organisations', authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newOrg = await Organisation.create({
      name,
      description
    });

    await UserOrganisation.create({
      userId: req.user.userId,
      orgId: newOrg.orgId
    });

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: newOrg
    });
  } catch (error) {
    res.status(400).json({ "status": 'Bad request', "message": "Client error", "statusCode": "400" });
  }
});

router.post('/organisations/:orgId/users', authenticateToken, async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const organisation = await Organisation.findByPk(orgId);

    if (!user || !organisation) {
      return res.status(404).json({ message: 'User or Organisation not found' });
    }

    await UserOrganisation.create({
      userId,
      orgId
    });

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
