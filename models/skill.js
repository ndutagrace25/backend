'use strict';
module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    skill_name: DataTypes.STRING
  }, {});
  Skill.associate = function (models) {
    // Skill.belongsTo(models.Profile, {
    //   foreignKey: 'skill_id',
    //   as: 'skill'
    // });
  };
  return Skill;
};