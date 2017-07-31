'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require('../config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// // judges
// app.get('/judges', function (req, res) {
//   db.Judges.find(function(err, result) {
//     res.send(result);
//   });
// });

// // courtrooms
// app.get('/courtrooms', function (req, res) {
//   db.Courtrooms.find(function(err, result) {
//     res.send(result);
//   });
// });


// // participants
// app.get('/participants', function (req, res) {
//   db.Participants.find(function(err, result) {
//     res.send(result);
//   });
// });