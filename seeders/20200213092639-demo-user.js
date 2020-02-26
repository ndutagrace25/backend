'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('skills', [{
      skill_name: 'Javascript',
    }, {
      skill_name: 'Node Js',
    }, {
      skill_name: 'React Js',
    }, {
      skill_name: 'HTML5',
    }, {
      skill_name: 'CSS3',
    }, {
      skill_name: 'React Native',
    }, {
      skill_name: 'Bootstrap',
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