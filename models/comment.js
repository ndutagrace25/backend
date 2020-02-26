'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    date: DataTypes.DATE
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Comment.belongsTo(models.Post, {
      foreignKey: 'post_id',
      as: 'comment'
    });
  };
  return Comment;
};