const bcrypt = require('bcrypt');
'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: DataTypes.STRING,
    passward: {
    type: DataTypes.VIRTUAL,
    set: function(passward){
      this.setDataValue('passwordDigest', bcrypt.hashSync(passward, 10));
      }
   },

    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    username: DataTypes.STRING,
    passwordResetToken: DataTypes.STRING,
    passwordDigest: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
