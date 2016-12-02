'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn('BlogPosts', 'title', {
      type: Sequelize.STRING,
      allowNull: false
    });
    queryInterface.changeColumn('BlogPosts', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
    queryInterface.changeColumn('BlogPosts', 'content', {
      type: Sequelize.STRING,
      allowNull: false
    });
    queryInterface.changeColumn('Comments', 'content', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
