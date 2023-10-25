'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [{
      id: 1,
      name: 'Personality',
      pathName: 'personality'
    },
    {
      id: 2,
      name: 'Movies & TV Shows',
      pathName: 'movies-and-tv-shows'
    },
    {
      id: 3,
      name: 'Animes & Mangas',
      pathName: 'animes-and-mangas'
    },
    {
      id: 4,
      name: 'Music',
      pathName: 'music'
    },
    {
      id: 5,
      name: 'Books',
      pathName: 'books'
    },
    {
      id: 6,
      name: 'Video Games',
      pathName: 'video-games'
    },
    {
      id: 7,
      name: 'Food & Drinks',
      pathName: 'food-and-drinks'
    },
    {
      id: 8,
      name: 'Animals',
      pathName: 'animals'
    },
    {
      id: 9,
      name: 'Science & Tech',
      pathName: 'science-and-tech'
    },
    {
      id: 10,
      name: 'Education & Career',
      pathName: 'education-and-career'
    },
    {
      id: 11,
      name: 'Beauty',
      pathName: 'beauty'
    },
    {
      id: 12,
      name: 'Fantasy',
      pathName: 'fantasy'
    },
    {
      id: 13,
      name: 'Other',
      pathName: 'other'
    }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
