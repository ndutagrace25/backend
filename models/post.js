'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    user_id: DataTypes.TINYINT,
    text: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    like_id: DataTypes.TINYINT,
    comment_id: DataTypes.TINYINT,
    date: DataTypes.DATE
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Post.belongsTo(models.Like, {
      foreignKey: 'like_id',
      as: 'like'
    });
    Post.hasMany(models.Comment, {
      foreignKey: 'post_id',
      as: 'comment'
    });
    Post.hasMany(models.Like, {
      foreignKey: 'post_id',
      as: 'post'
    });
  };
  return Post;
};