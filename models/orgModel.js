const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Organisation = sequelize.define('Organisation', {
  orgId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'name is required'
      }
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Organisation;
