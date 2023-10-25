'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [{
      id: 1,
      name: 'Personality'
    },
    {
      id: 2,
      name: 'Movies & TV Shows'
    },
    {
      id: 3,
      name: 'Animes & Mangas'
    },
    {
      id: 4,
      name: 'Music'
    },
    {
      id: 5,
      name: 'Books'
    },
    {
      id: 6,
      name: 'Video Games'
    },
    {
      id: 7,
      name: 'Food & Drinks'
    },
    {
      id: 8,
      name: 'Animals'
    },
    {
      id: 9,
      name: 'Science & Tech'
    },
    {
      id: 10,
      name: 'Education & Career'
    },
    {
      id: 11,
      name: 'Beauty'
    },
    {
      id: 12,
      name: 'Fantasy'
    },
    {
      id: 13,
      name: 'Other'
    }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
