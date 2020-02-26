'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    // associations can be defined here
    Like.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Like.belongsTo(models.Post, {
      foreignKey: 'post_id',
      as: 'post'
    });
  };
  return Like;
};