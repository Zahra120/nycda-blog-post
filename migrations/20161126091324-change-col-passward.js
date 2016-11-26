'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     queryInterface.renameColumn('Users', 'passward', 'passwordDigest');
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: function (queryInterface, Sequelize) {
     queryInterface.renameColumn('Users', 'passwordDigest', 'passward');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
