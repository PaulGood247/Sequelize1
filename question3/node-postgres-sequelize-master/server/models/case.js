'use strict';
module.exports = function(sequelize, DataTypes) {
  var Case = sequelize.define('Case', {
    judge_id: DataTypes.INTEGER,
    courtroom_id: DataTypes.INTEGER,
    claimant_id: DataTypes.INTEGER,
    respondent_id: DataTypes.INTEGER,
    start_date: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    result: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //Case.belongsTo(models.Judge);
        //Case.belongsTo(models.Courtroom);
        //Case.belongsTo(models.Participant);
      }
    }
  });
  return Case;
};