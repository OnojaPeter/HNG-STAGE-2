const User = require('./userModel');
const Organisation = require('./orgModel');
const UserOrganisation = require('./userOrgModel');
const Sequelize = require('sequelize');
const sequelize = require('../database');

User.belongsToMany(Organisation, { through: UserOrganisation, foreignKey: 'userId' });
Organisation.belongsToMany(User, { through: UserOrganisation, foreignKey: 'orgId' });

module.exports = { sequelize, User, Organisation, UserOrganisation };
