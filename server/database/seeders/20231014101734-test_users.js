'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      id: 1001,
      username: 'OxygenOnline',
      // MYpassword1
      password: '$2a$10$t/7DfEhCtZRghKeBI52rXOyGOC7uUUC6jsQyE2zVnFpk/UdHWoQNC',
      email: 'oxygenonline@gmail.com',
      salt: '$2a$10$t/7DfEhCtZRghKeBI52rXO',
      joiningDate: Sequelize.fn('NOW')
    },
    {
      id: 1002,
      username: 'habuma',
      // 666userPASS
      password: '$2a$10$OEC.W9dMuQufkQRTzmGWw.P4XrFOep.SusUmsO5Ph6kcxk.kzcrGS',
      email: 'habuma@gmail.com',
      salt: '$2a$10$OEC.W9dMuQufkQRTzmGWw.',
      joiningDate: Sequelize.fn('NOW')
    },
    {
      id: 1003,
      username: 'new_user123',
      // securePassword123
      password: '$2a$10$Wp6RQOdXpJCIy4IDMDPe8ujurpgCoxmu0CK1Y6v2H2Fpc3UNzH30i',
      email: 'anewemail@gmail.com',
      salt: '$2a$10$Wp6RQOdXpJCIy4IDMDPe8u',
      joiningDate: Sequelize.fn('NOW')
    },
    {
      id: 1004,
      username: 'blobblob001',
      // Testing123
      password: '$2a$10$BWSznG0S4IRKHgjFjK30OuD5XUzd9NMmeCHSaE9O43fwGWMKUbjAm',
      email: 'blobblob001@gmail.com',
      salt: '$2a$10$BWSznG0S4IRKHgjFjK30Ou',
      joiningDate: Sequelize.fn('NOW')
    }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
