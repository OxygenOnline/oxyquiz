'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [{
      id: 1,
      name: "Personality"
    },
    {
      id: 2,
      name: "Movies, TV Shows & Animes"
    },
    {
      id: 3,
      name: "Books"
    },
    {
      id: 4,
      name: "Video Games"
    },
    {
      id: 5,
      name: "Food & Drinks"
    },
    {
      id: 6,
      name: "Animals"
    },
    {
      id: 7,
      name: "Tech & Education"
    },
    {
      id: 8,
      name: "Beauty"
    },
    {
      id: 9,
      name: "Fantasy"
    },
    {
      id: 10,
      name: "Other"
    }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
