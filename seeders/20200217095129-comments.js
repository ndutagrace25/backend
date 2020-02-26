'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('comments', [{
      user_id: 1,
      text: 'This is a test comment',
      name: 'Gracie',
      avatar: '//www.gravatar.com/avatar/a34dbce8ed62a6ffaed4144eeac07c2c?s=200&r=pg&d=mm'
    }, ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};