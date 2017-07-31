'use strict';
var bcrypt = require('bcrypt');
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username : DataTypes.STRING,
    password : DataTypes.STRING,
    accessKey: DataTypes.STRING,
    secretKey: DataTypes.STRING
  }, {
    classMethods: {

      generateHash : function () {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync("B4c0/\/", salt);
        return hash;
      },
      compareHash : function (attempt) {
        return bcrypt.compareSync("B4c0/\/", User.generateHash(attempt));
      },
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate: function(user, options){
        user.accessKey = 'thisIsAnAccessKey';
        user.secretKey = 'thisIsASecretKey';
        user.password = User.generateHash();
      }
    }

  });
  return User;
};