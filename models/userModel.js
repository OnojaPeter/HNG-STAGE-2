require('dotenv').config();

const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },

    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'First name is required',
          },
          notEmpty: {
            msg: 'First name is required'
          }
        }
    },

    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Last name is required',
          },
          notEmpty: {
            msg: 'Last name is required'
          }
        }
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: 'Email address already in use'
        },
        validate: {
          notNull:{
            msg: 'Email address is required'
          },
          isEmail: {
            msg: 'Must be a valid email address'
          },
          notEmpty: {
            msg: 'Email address is required'
          }
        }
    },
    
    phone: {
        type: Sequelize.STRING,
        allowNull: true,
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Password is required',
          },
          notEmpty: {
            msg: 'Password is required'
          },
          len: {
            args: [8, 100],
            msg: 'Password must be at least 8 characters long'
          }
        }
    }
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
  },
});

module.exports = User;
