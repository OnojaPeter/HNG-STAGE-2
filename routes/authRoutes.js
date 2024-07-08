const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { User, Organisation, UserOrganisation } = require('../models/modelRelationship');

router.post('/login', async (req,res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const successResponse = {
      'status': "success", 
      "message": "Login successful",
      "data": {
        "accessToken": `${token}`,
        "user": {
          "userId": user.userId,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "email": user.email,
          "phone": user.phone,
        },
      }
    }

    res.status(200).json(successResponse);
  } catch (error) {
    res.status(401).json({ "status": 'Bad request', "message": "Authentication failed", "statusCode": "401" });
  }

})

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    try {
      const user = await User.create({ firstName, lastName, email, password, phone });
      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '2h' });

      const organisationName = `${firstName}'s organisation`;

      const newOrg = await Organisation.create({
        name: organisationName,
        description: 'Default description',
        userId: user.userId
      });

      const newUserOrg = await UserOrganisation.create({
        userId: user.userId,
        orgId: newOrg.orgId
      });
  
  
      const successResponse = {
        'status': "success", 
        "message": "Registration successful",
        "data": {
          "accessToken": `${token}`,
          "user": {
            "userId": user.userId,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "phone": user.phone,
          },
          "organisation": {
            "name": organisationName
          }
        }
      }
      res.status(201).json(successResponse);
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(422).json({ errors });
      }
      res.status(400).json({ "status": 'Bad request', "message": "Registration unsuccessful", "statusCode": "400" });
    }
  });

module.exports = router;