const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const UserOrganisation = sequelize.define('UserOrganisation', {
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'userId'
    }
  },
  orgId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Organisations',
      key: 'orgId'
    }
  }
});

module.exports = UserOrganisation;
