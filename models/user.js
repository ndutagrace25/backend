'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Profile, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
      as: 'user'
    });
    User.hasMany(models.Post, {
      foreignKey: 'user_id',
      as: 'user_post'
    });
    User.hasMany(models.Like, {
      foreignKey: 'user_id',
      as: 'user_like'
    })
    User.hasMany(models.Comment, {
      foreignKey: 'user_id',
      as: 'user_comment'
    })
  };
  return User;
};