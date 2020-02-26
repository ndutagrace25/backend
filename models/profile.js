'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    user_id: DataTypes.TINYINT,
    handle: DataTypes.STRING,
    company: DataTypes.STRING,
    website: DataTypes.STRING,
    location: DataTypes.STRING,
    status: DataTypes.STRING,
    skill_id: DataTypes.TINYINT,
    bio: DataTypes.STRING,
    experience: DataTypes.STRING,
    githubusername: DataTypes.STRING,
    date: DataTypes.DATE
  }, {});
  Profile.associate = function(models) {
    // associations can be defined here
    Profile.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      as: 'user'
    });
    Profile.hasMany(models.Skill, {
      foreignKey: 'skill_id',
      as: 'skill'
    });
  };
  return Profile;
};