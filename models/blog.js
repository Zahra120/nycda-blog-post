'use strict';
module.exports = function(sequelize, DataTypes) {
  var Blog = sequelize.define('Blog', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Blog;
};