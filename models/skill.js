'use strict';
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    skill_name: DataTypes.STRING
  }, {});
  Skill.associate = function (models) {

  };
  return Skill;
};